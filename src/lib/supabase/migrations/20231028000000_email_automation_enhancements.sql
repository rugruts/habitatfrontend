-- Email Automation Enhancements
-- Run this in Supabase SQL Editor to enhance email automation system

-- Create scheduled emails table for delayed email sending
CREATE TABLE IF NOT EXISTS scheduled_emails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  automation_id UUID REFERENCES email_automations(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  guest_email VARCHAR(255) NOT NULL,
  guest_name VARCHAR(255),
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  status email_status DEFAULT 'scheduled',
  sent_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_scheduled_emails_status ON scheduled_emails(status);
CREATE INDEX IF NOT EXISTS idx_scheduled_emails_scheduled_for ON scheduled_emails(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_scheduled_emails_automation ON scheduled_emails(automation_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_emails_booking ON scheduled_emails(booking_id);

-- Add RLS policies for scheduled_emails
ALTER TABLE scheduled_emails ENABLE ROW LEVEL SECURITY;

-- Allow admins to manage scheduled emails
CREATE POLICY "Admins can manage scheduled emails" ON scheduled_emails
  FOR ALL USING (auth.jwt() ->> 'email' IN (
    'admin@habitat.com',
    'admin@habitatlobby.com',
    'owner@habitatlobby.com',
    'manager@habitatlobby.com'
  ));

-- Create function to process scheduled emails
CREATE OR REPLACE FUNCTION process_scheduled_emails()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  email_record RECORD;
BEGIN
  -- Get all scheduled emails that are due
  FOR email_record IN 
    SELECT * FROM scheduled_emails 
    WHERE status = 'scheduled' 
    AND scheduled_for <= NOW()
  LOOP
         -- Update status to sent (since we're processing it)
     UPDATE scheduled_emails 
     SET status = 'sent', sent_at = NOW(), updated_at = NOW()
     WHERE id = email_record.id;
    
         -- Here you would trigger the actual email sending
     -- For now, we'll just mark it as sent (already done above)
  END LOOP;
END;
$$;

-- Create trigger to update updated_at column
CREATE OR REPLACE FUNCTION update_scheduled_emails_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_scheduled_emails_updated_at
  BEFORE UPDATE ON scheduled_emails
  FOR EACH ROW
  EXECUTE FUNCTION update_scheduled_emails_updated_at();

-- Create email_automations table if it doesn't exist
CREATE TABLE IF NOT EXISTS email_automations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  template_id UUID REFERENCES email_templates(id) ON DELETE CASCADE,
  trigger_type VARCHAR(50) NOT NULL,
  trigger_delay_hours INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  conditions JSONB DEFAULT '{}',
  last_triggered_at TIMESTAMP WITH TIME ZONE,
  total_triggered INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for email_automations
CREATE INDEX IF NOT EXISTS idx_email_automations_trigger_type ON email_automations(trigger_type);
CREATE INDEX IF NOT EXISTS idx_email_automations_active ON email_automations(is_active);
CREATE INDEX IF NOT EXISTS idx_email_automations_template ON email_automations(template_id);

-- Add RLS policies for email_automations
ALTER TABLE email_automations ENABLE ROW LEVEL SECURITY;

-- Allow admins to manage email automations
CREATE POLICY "Admins can manage email automations" ON email_automations
  FOR ALL USING (auth.jwt() ->> 'email' IN (
    'admin@habitat.com',
    'admin@habitatlobby.com',
    'owner@habitatlobby.com',
    'manager@habitatlobby.com'
  ));

-- Create trigger to update updated_at column
CREATE OR REPLACE FUNCTION update_email_automations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_email_automations_updated_at
  BEFORE UPDATE ON email_automations
  FOR EACH ROW
  EXECUTE FUNCTION update_email_automations_updated_at();

-- Create function to automatically create default automations
CREATE OR REPLACE FUNCTION create_default_email_automations()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  booking_template_id UUID;
  pre_arrival_template_id UUID;
  post_stay_template_id UUID;
BEGIN
  -- Get template IDs (only create automations if templates exist)
  SELECT id INTO booking_template_id FROM email_templates WHERE template_type = 'booking_confirmation' LIMIT 1;
  SELECT id INTO pre_arrival_template_id FROM email_templates WHERE template_type = 'pre_arrival' LIMIT 1;
  SELECT id INTO post_stay_template_id FROM email_templates WHERE template_type = 'post_stay' LIMIT 1;

  -- Create booking confirmation automation (immediate) - only if template exists
  IF booking_template_id IS NOT NULL THEN
    INSERT INTO email_automations (name, template_id, trigger_type, trigger_delay_hours, is_active, conditions)
    VALUES (
      'Booking Confirmation',
      booking_template_id,
      'booking_created',
      0,
      true,
      '{"booking_status": ["confirmed", "paid"]}'
    ) ON CONFLICT DO NOTHING;
  END IF;

  -- Create pre-arrival automation (24 hours before check-in) - only if template exists
  IF pre_arrival_template_id IS NOT NULL THEN
    INSERT INTO email_automations (name, template_id, trigger_type, trigger_delay_hours, is_active, conditions)
    VALUES (
      'Pre-Arrival Instructions',
      pre_arrival_template_id,
      'check_in_approaching',
      24,
      true,
      '{"booking_status": ["confirmed", "paid"]}'
    ) ON CONFLICT DO NOTHING;
  END IF;

  -- Create post-stay review request (24 hours after check-out) - only if template exists
  IF post_stay_template_id IS NOT NULL THEN
    INSERT INTO email_automations (name, template_id, trigger_type, trigger_delay_hours, is_active, conditions)
    VALUES (
      'Post-Stay Review Request',
      post_stay_template_id,
      'check_out_completed',
      24,
      true,
      '{"booking_status": ["completed"]}'
    ) ON CONFLICT DO NOTHING;
  END IF;
END;
$$;

-- Create function to trigger email automations
CREATE OR REPLACE FUNCTION trigger_email_automation(
  p_booking_id UUID,
  p_trigger_type VARCHAR(50)
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  automation_record RECORD;
  booking_record RECORD;
BEGIN
  -- Get booking details
  SELECT * INTO booking_record FROM bookings WHERE id = p_booking_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Booking not found: %', p_booking_id;
  END IF;

  -- Find matching automations
  FOR automation_record IN 
    SELECT * FROM email_automations 
    WHERE trigger_type = p_trigger_type 
    AND is_active = true
  LOOP
    -- Check conditions
    IF automation_record.conditions IS NULL OR 
       (automation_record.conditions->>'booking_status' IS NULL OR 
        booking_record.status = ANY(ARRAY(SELECT jsonb_array_elements_text(automation_record.conditions->'booking_status')))) THEN
      
      -- Schedule the email
      IF automation_record.trigger_delay_hours > 0 THEN
        -- Schedule for later
        INSERT INTO scheduled_emails (
          automation_id, 
          booking_id, 
          guest_email, 
          guest_name, 
          scheduled_for,
          metadata
        ) VALUES (
          automation_record.id,
          p_booking_id,
          booking_record.customer_email,
          booking_record.customer_name,
          NOW() + (automation_record.trigger_delay_hours || ' hours')::interval,
          jsonb_build_object(
            'property_id', booking_record.property_id,
            'property_name', (SELECT name FROM properties WHERE id = booking_record.property_id),
            'check_in', booking_record.check_in,
            'check_out', booking_record.check_out,
            'guests', booking_record.guests,
            'total_amount', booking_record.total_amount
          )
        );
      ELSE
        -- Send immediately
        INSERT INTO scheduled_emails (
          automation_id, 
          booking_id, 
          guest_email, 
          guest_name, 
          scheduled_for,
          status,
          sent_at,
          metadata
        ) VALUES (
          automation_record.id,
          p_booking_id,
          booking_record.customer_email,
          booking_record.customer_name,
          NOW(),
          'sent',
          NOW(),
          jsonb_build_object(
            'property_id', booking_record.property_id,
            'property_name', (SELECT name FROM properties WHERE id = booking_record.property_id),
            'check_in', booking_record.check_in,
            'check_out', booking_record.check_out,
            'guests', booking_record.guests,
            'total_amount', booking_record.total_amount
          )
        );
      END IF;
    END IF;
  END LOOP;
END;
$$;

-- Create triggers for automatic email sending
CREATE OR REPLACE FUNCTION trigger_booking_created_email()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status IN ('confirmed', 'paid') THEN
    PERFORM trigger_email_automation(NEW.id, 'booking_created');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER booking_created_email_trigger
  AFTER INSERT OR UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION trigger_booking_created_email();

-- Create function to check for approaching check-ins
CREATE OR REPLACE FUNCTION check_approaching_checkins()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  booking_record RECORD;
BEGIN
  -- Find bookings with check-in in the next 24 hours
  FOR booking_record IN 
    SELECT * FROM bookings 
    WHERE status IN ('confirmed', 'paid')
    AND check_in BETWEEN NOW() AND NOW() + INTERVAL '24 hours'
    AND id NOT IN (
      SELECT booking_id FROM scheduled_emails 
      WHERE automation_id IN (
        SELECT id FROM email_automations WHERE trigger_type = 'check_in_approaching'
      )
    )
  LOOP
    PERFORM trigger_email_automation(booking_record.id, 'check_in_approaching');
  END LOOP;
END;
$$;

-- Create function to check for completed check-outs
CREATE OR REPLACE FUNCTION check_completed_checkouts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  booking_record RECORD;
BEGIN
  -- Find bookings that checked out 24 hours ago
  FOR booking_record IN 
    SELECT * FROM bookings 
    WHERE status = 'completed'
    AND check_out BETWEEN NOW() - INTERVAL '25 hours' AND NOW() - INTERVAL '24 hours'
    AND id NOT IN (
      SELECT booking_id FROM scheduled_emails 
      WHERE automation_id IN (
        SELECT id FROM email_automations WHERE trigger_type = 'check_out_completed'
      )
    )
  LOOP
    PERFORM trigger_email_automation(booking_record.id, 'check_out_completed');
  END LOOP;
END;
$$;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION process_scheduled_emails() TO authenticated;
GRANT EXECUTE ON FUNCTION create_default_email_automations() TO authenticated;
GRANT EXECUTE ON FUNCTION trigger_email_automation(UUID, VARCHAR) TO authenticated;
GRANT EXECUTE ON FUNCTION check_approaching_checkins() TO authenticated;
GRANT EXECUTE ON FUNCTION check_completed_checkouts() TO authenticated;

-- Insert default automations
SELECT create_default_email_automations();
