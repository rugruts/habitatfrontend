-- Email Templates System Schema
-- Run this in Supabase SQL Editor to create email template tables

-- Create email template types enum
CREATE TYPE email_template_type AS ENUM (
  'booking_confirmation',
  'pre_arrival',
  'post_stay',
  'payment_confirmation',
  'cancellation',
  'custom'
);

-- Create email templates table
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  type email_template_type NOT NULL,
  is_active BOOLEAN DEFAULT true,
  variables TEXT[] DEFAULT '{}', -- Array of variable names used in template
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create email logs table
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID REFERENCES email_templates(id) ON DELETE SET NULL,
  recipient_email VARCHAR(255) NOT NULL,
  recipient_name VARCHAR(255),
  subject VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  status email_status DEFAULT 'sent',
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  guest_id UUID REFERENCES guests(id) ON DELETE SET NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_email_templates_type ON email_templates(type);
CREATE INDEX IF NOT EXISTS idx_email_templates_active ON email_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_email_logs_recipient ON email_logs(recipient_email);
CREATE INDEX IF NOT EXISTS idx_email_logs_booking ON email_logs(booking_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON email_logs(sent_at);

-- Create updated_at trigger for email_templates
CREATE OR REPLACE FUNCTION update_email_template_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  NEW.last_modified = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_email_templates_updated_at
  BEFORE UPDATE ON email_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_email_template_updated_at();

-- Insert default email templates
INSERT INTO email_templates (name, subject, content, type, variables) VALUES
(
  'Booking Confirmation',
  'Your booking at {{property_name}} is confirmed! 🏠',
  'Dear {{guest_name}},

Thank you for choosing Habitat Lobby! We''re excited to confirm your booking.

📋 BOOKING DETAILS:
• Property: {{property_name}}
• Check-in: {{check_in_date}} at 3:00 PM
• Check-out: {{check_out_date}} at 11:00 AM
• Guests: {{guests_count}}
• Booking ID: {{booking_id}}
• Total Amount: €{{total_amount}}

📍 PROPERTY ADDRESS:
{{property_address}}

📞 CONTACT INFORMATION:
If you have any questions, please contact us:
• Phone: {{host_phone}}
• Email: info@habitatlobby.com

We look forward to hosting you!

Best regards,
{{host_name}}
Habitat Lobby Team',
  'booking_confirmation',
  ARRAY['guest_name', 'property_name', 'check_in_date', 'check_out_date', 'guests_count', 'booking_id', 'total_amount', 'property_address', 'host_phone', 'host_name']
),
(
  'Pre-Arrival Information',
  'Your stay at {{property_name}} is tomorrow! 🗝️',
  'Dear {{guest_name}},

Your stay at {{property_name}} begins tomorrow! Here''s everything you need to know:

🗝️ CHECK-IN INFORMATION:
• Time: 3:00 PM onwards
• Address: {{property_address}}
• Contact: {{host_phone}}

🏠 PROPERTY DETAILS:
• WiFi Password: Will be provided upon arrival
• Parking: Available on-site
• Emergency Contact: {{host_phone}}

📋 IMPORTANT REMINDERS:
• Please bring a valid ID for check-in
• Check-out time is 11:00 AM
• No smoking inside the property
• Quiet hours: 10:00 PM - 8:00 AM

If you have any questions or need assistance, don''t hesitate to contact us.

Safe travels!

{{host_name}}
Habitat Lobby Team',
  'pre_arrival',
  ARRAY['guest_name', 'property_name', 'property_address', 'host_phone', 'host_name']
),
(
  'Post-Stay Thank You',
  'Thank you for staying with us! 🌟',
  'Dear {{guest_name}},

Thank you for choosing Habitat Lobby for your recent stay at {{property_name}}!

We hope you had a wonderful experience and that our property met all your expectations.

🌟 WE''D LOVE YOUR FEEDBACK:
Your opinion matters to us! If you have a moment, we''d appreciate if you could share your experience.

🏠 FUTURE STAYS:
We''d be delighted to welcome you back anytime. As a returning guest, you''ll enjoy priority booking and special offers.

📞 STAY IN TOUCH:
• Website: https://habitatlobby.com
• Email: info@habitatlobby.com
• Phone: {{host_phone}}

Thank you again for choosing us!

Warm regards,
{{host_name}}
Habitat Lobby Team',
  'post_stay',
  ARRAY['guest_name', 'property_name', 'host_phone', 'host_name']
);

-- Enable RLS (Row Level Security)
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow all operations for authenticated users)
CREATE POLICY "Allow all operations for authenticated users" ON email_templates
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON email_logs
  FOR ALL USING (auth.role() = 'authenticated');

-- Grant permissions
GRANT ALL ON email_templates TO authenticated;
GRANT ALL ON email_logs TO authenticated;
GRANT USAGE ON SEQUENCE email_templates_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE email_logs_id_seq TO authenticated;
