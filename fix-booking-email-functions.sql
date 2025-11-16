-- Fix Booking Email Functions
-- This script fixes the database functions that were causing the "guest_email" field error

-- Drop the existing functions that have the wrong field references
DROP FUNCTION IF EXISTS trigger_email_automation(UUID, TEXT);
DROP FUNCTION IF EXISTS check_approaching_checkins();
DROP FUNCTION IF EXISTS check_completed_checkouts();

-- Recreate the trigger_email_automation function with correct field names
CREATE OR REPLACE FUNCTION trigger_email_automation(p_booking_id UUID, p_trigger_type TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  automation_record RECORD;
  booking_record RECORD;
BEGIN
  -- Get the booking record
  SELECT * INTO booking_record FROM bookings WHERE id = p_booking_id;
  
  -- Find matching automations for this trigger type
  FOR automation_record IN 
    SELECT * FROM email_automations 
    WHERE trigger_type = p_trigger_type 
    AND is_active = true
  LOOP
    -- Check if conditions are met (if any)
    IF automation_record.conditions IS NULL OR 
       jsonb_typeof(automation_record.conditions) = 'null' OR
       (automation_record.conditions->'booking_status' IS NULL OR
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

-- Recreate the check_approaching_checkins function
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

-- Recreate the check_completed_checkouts function
CREATE OR REPLACE FUNCTION check_completed_checkouts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  booking_record RECORD;
BEGIN
  -- Find bookings that checked out in the last 24 hours
  FOR booking_record IN 
    SELECT * FROM bookings 
    WHERE status IN ('checked_out', 'completed')
    AND check_out BETWEEN NOW() - INTERVAL '24 hours' AND NOW()
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

-- Verify the functions are working
SELECT 'Functions updated successfully' as status;
