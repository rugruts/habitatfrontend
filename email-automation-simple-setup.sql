-- ===================================================================
-- SIMPLE EMAIL AUTOMATION SETUP
-- Basic version without ON CONFLICT clauses
-- ===================================================================

-- First, ensure the email_automations table has the required columns
ALTER TABLE email_automations
ADD COLUMN IF NOT EXISTS total_triggered INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_triggered_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS conditions JSONB DEFAULT '{}';

-- Ensure scheduled_emails table exists
CREATE TABLE IF NOT EXISTS scheduled_emails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  automation_id UUID REFERENCES email_automations(id),
  booking_id UUID REFERENCES bookings(id),
  guest_email TEXT NOT NULL,
  guest_name TEXT,
  scheduled_for TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'sent', 'failed', 'cancelled')),
  sent_at TIMESTAMPTZ,
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure automation_logs table exists for monitoring
CREATE TABLE IF NOT EXISTS automation_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  run_time TIMESTAMPTZ DEFAULT NOW(),
  execution_duration_ms INTEGER,
  emails_processed INTEGER DEFAULT 0,
  check_ins_triggered INTEGER DEFAULT 0,
  check_outs_triggered INTEGER DEFAULT 0,
  system_health TEXT DEFAULT 'unknown',
  error_message TEXT,
  results JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default email templates
INSERT INTO email_templates (
  name,
  subject,
  content,
  template_type,
  is_active,
  variables,
  created_at,
  updated_at
) VALUES

-- 1. Stripe Booking Confirmation
(
  'booking_confirmation_stripe',
  'Booking Confirmed - {{property_name}} | Habitat Lobby',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmation</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #2D5A27; color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { padding: 30px 20px; background: #ffffff; }
    .booking-details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 5px 0; border-bottom: 1px solid #eee; }
    .detail-row:last-child { border-bottom: none; }
    .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; border-radius: 0 0 8px 8px; }
    .button { background: #D4A574; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
    .highlight { background: #e8f5e8; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #2D5A27; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Booking Confirmed!</h1>
      <p>Payment processed successfully</p>
    </div>

    <div class="content">
      <p>Dear {{customer_name}},</p>

      <p>Thank you for your booking! Your payment has been processed and your reservation is confirmed.</p>

      <div class="booking-details">
        <h3 style="margin-top: 0; color: #2D5A27;">Booking Reference: {{booking_id}}</h3>
        <div class="detail-row">
          <span><strong>Property:</strong></span>
          <span>{{property_name}}</span>
        </div>
        <div class="detail-row">
          <span><strong>Check-in:</strong></span>
          <span>{{check_in_formatted}} (15:00)</span>
        </div>
        <div class="detail-row">
          <span><strong>Check-out:</strong></span>
          <span>{{check_out_formatted}} (11:00)</span>
        </div>
        <div class="detail-row">
          <span><strong>Guests:</strong></span>
          <span>{{guests}}</span>
        </div>
        <div class="detail-row">
          <span><strong>Total Paid:</strong></span>
          <span><strong>{{currency_symbol}}{{total_amount}}</strong></span>
        </div>
      </div>

      <div class="highlight">
        <h3 style="margin-top: 0;">📋 What''s Next?</h3>
        <ul style="margin-bottom: 0;">
          <li>Check-in instructions will be sent 48 hours before arrival</li>
          <li>Free cancellation up to 48 hours before check-in</li>
          <li>Our local team is available 24/7 for assistance</li>
          <li>Please bring the same ID document used during booking</li>
        </ul>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="{{booking_url}}" class="button">
          View Booking Details
        </a>
      </div>

      <p>We look forward to hosting you in beautiful Trikala!</p>

      <p>Best regards,<br>
      <strong>The Habitat Lobby Team</strong></p>
    </div>

    <div class="footer">
      <p><strong>Habitat Lobby</strong> | Trikala, Greece</p>
      <p>For support, contact us at <a href="mailto:{{business_email}}">{{business_email}}</a> or call {{business_phone}}</p>
    </div>
  </div>
</body>
</html>',
  'booking_confirmation',
  true,
  ARRAY['customer_name', 'property_name', 'booking_id', 'check_in_formatted', 'check_out_formatted', 'guests', 'total_amount', 'currency_symbol', 'booking_url', 'business_email', 'business_phone'],
  NOW(),
  NOW()
),

-- 2. Pre-arrival Instructions (48h before check-in)
(
  'pre_arrival_instructions',
  'Check-in Instructions - {{property_name}} Tomorrow!',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pre-Arrival Instructions</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #2D5A27; color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { padding: 30px 20px; background: #ffffff; }
    .info-box { background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #1976d2; }
    .warning-box { background: #fff3e0; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f57c00; }
    .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 5px 0; border-bottom: 1px solid #eee; }
    .detail-row:last-child { border-bottom: none; }
    .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; border-radius: 0 0 8px 8px; }
    .code { background: #f5f5f5; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 18px; font-weight: bold; text-align: center; color: #2D5A27; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🏠 Almost Here!</h1>
      <p>Your check-in is tomorrow - here''s everything you need to know</p>
    </div>

    <div class="content">
      <p>Dear {{customer_name}},</p>

      <p>We''re excited to welcome you to <strong>{{property_name}}</strong> tomorrow! Here are your check-in instructions.</p>

      <div class="info-box">
        <h3 style="margin-top: 0; color: #1976d2;">📍 Check-in Details</h3>
        <div class="detail-row">
          <span><strong>Date:</strong></span>
          <span>{{check_in_formatted}}</span>
        </div>
        <div class="detail-row">
          <span><strong>Time:</strong></span>
          <span>15:00 (3:00 PM)</span>
        </div>
        <div class="detail-row">
          <span><strong>Address:</strong></span>
          <span>{{property_address}}</span>
        </div>
        <div class="detail-row">
          <span><strong>Access Code:</strong></span>
          <div class="code">HBTLBY2024</div>
        </div>
      </div>

      <div class="warning-box">
        <h3 style="margin-top: 0; color: #f57c00;">⚠️ Important Reminders</h3>
        <ul style="margin-bottom: 0;">
          <li><strong>Bring Valid ID:</strong> Same document used during booking</li>
          <li><strong>Quiet Hours:</strong> 22:00 - 08:00 (respect neighbors)</li>
          <li><strong>No Smoking:</strong> Strictly prohibited inside</li>
          <li><strong>WiFi Password:</strong> HabitatLobby2024</li>
        </ul>
      </div>

      <h3>📞 Emergency Contact</h3>
      <p>If you have any issues during check-in or your stay:</p>
      <ul>
        <li><strong>Call:</strong> {{business_phone}}</li>
        <li><strong>Email:</strong> {{business_email}}</li>
        <li><strong>WhatsApp:</strong> Available 24/7</li>
      </ul>

      <h3>🗺️ Getting There</h3>
      <p>The property is located in the heart of Trikala. Free parking is available on the street.</p>

      <p>Can''t wait to host you!</p>

      <p>Best regards,<br>
      <strong>The Habitat Lobby Team</strong></p>
    </div>

    <div class="footer">
      <p><strong>Habitat Lobby</strong> | Trikala, Greece</p>
      <p>Booking Reference: {{booking_id}}</p>
    </div>
  </div>
</body>
</html>',
  'pre_arrival',
  true,
  ARRAY['customer_name', 'property_name', 'check_in_formatted', 'property_address', 'booking_id', 'business_phone', 'business_email'],
  NOW(),
  NOW()
),

-- 3. Post-stay Thank You & Review Request
(
  'post_stay_review_request',
  'Thank you for staying with us! How was your experience?',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You & Review Request</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #2D5A27 0%, #4a7c59 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { padding: 30px 20px; background: #ffffff; }
    .review-box { background: #f0f8f0; padding: 25px; border-radius: 8px; margin: 20px 0; text-align: center; border-left: 4px solid #2D5A27; }
    .stars { font-size: 24px; margin: 10px 0; }
    .button { background: #D4A574; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 15px 10px; font-weight: bold; }
    .button.secondary { background: #6c757d; }
    .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; border-radius: 0 0 8px 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🙏 Thank You!</h1>
      <p>We hope you had a wonderful stay at {{property_name}}</p>
    </div>

    <div class="content">
      <p>Dear {{customer_name}},</p>

      <p>Thank you for choosing Habitat Lobby for your stay in Trikala! We hope you had a memorable and comfortable experience.</p>

      <div class="review-box">
        <h3 style="margin-top: 0; color: #2D5A27;">⭐ Share Your Experience</h3>
        <p>Your feedback helps us improve and helps future guests discover our properties.</p>
        <div class="stars">⭐⭐⭐⭐⭐</div>
        <p>How would you rate your stay?</p>

        <div style="margin: 20px 0;">
          <a href="{{review_url}}" class="button">
            Leave a Review
          </a>
        </div>
      </div>

      <h3>🔄 Book Your Next Stay</h3>
      <p>Planning another trip to Greece? We''d love to host you again!</p>
      <ul>
        <li>🎁 <strong>Returning Guest Discount:</strong> 10% off your next booking</li>
        <li>🏡 <strong>More Properties:</strong> Explore our growing collection</li>
        <li>📞 <strong>Direct Booking:</strong> Call us for special rates</li>
      </ul>

      <div style="text-align: center; margin: 30px 0;">
        <a href="{{property_url}}" class="button">
          Book Again
        </a>
        <a href="{{contact_url}}" class="button secondary">
          Contact Us
        </a>
      </div>

      <p>Thank you again for choosing Habitat Lobby. We look forward to welcoming you back soon!</p>

      <p>Best regards,<br>
      <strong>The Habitat Lobby Team</strong></p>
    </div>

    <div class="footer">
      <p><strong>Habitat Lobby</strong> | Trikala, Greece</p>
      <p>Your recent booking: {{booking_id}}</p>
      <p>For support: <a href="mailto:{{business_email}}">{{business_email}}</a> | {{business_phone}}</p>
    </div>
  </div>
</body>
</html>',
  'post_stay',
  true,
  ARRAY['customer_name', 'property_name', 'review_url', 'property_url', 'contact_url', 'booking_id', 'business_email', 'business_phone'],
  NOW(),
  NOW()
);

-- Insert default email automations
INSERT INTO email_automations (
  name,
  template_id,
  trigger_type,
  trigger_delay_hours,
  is_active,
  conditions,
  created_at,
  updated_at
) VALUES

-- 1. Immediate booking confirmation for Stripe payments
(
  'Stripe Booking Confirmation',
  (SELECT id FROM email_templates WHERE name = 'booking_confirmation_stripe' LIMIT 1),
  'booking_created',
  0,
  true,
  '{"booking_status": ["confirmed", "pending"]}',
  NOW(),
  NOW()
),

-- 2. Pre-arrival instructions 48 hours before check-in
(
  'Pre-Arrival Instructions (48h)',
  (SELECT id FROM email_templates WHERE name = 'pre_arrival_instructions' LIMIT 1),
  'check_in_approaching',
  48,
  true,
  '{"booking_status": ["confirmed"]}',
  NOW(),
  NOW()
),

-- 3. Post-stay review request 24 hours after check-out
(
  'Post-Stay Review Request',
  (SELECT id FROM email_templates WHERE name = 'post_stay_review_request' LIMIT 1),
  'check_out_completed',
  24,
  true,
  '{"booking_status": ["completed", "checked_out"]}',
  NOW(),
  NOW()
);

-- Create system settings for email automation
INSERT INTO system_settings (key, value, description, category, created_at, updated_at)
VALUES
('email_automation_enabled', 'true', 'Enable/disable email automation system', 'email', NOW(), NOW()),
('email_from_address', 'admin@habitatlobby.com', 'Default from email address', 'email', NOW(), NOW()),
('email_from_name', 'Habitat Lobby', 'Default from name', 'email', NOW(), NOW()),
('email_reply_to', 'admin@habitatlobby.com', 'Reply-to email address', 'email', NOW(), NOW()),
('check_in_time', '15:00', 'Standard check-in time', 'booking', NOW(), NOW()),
('check_out_time', '11:00', 'Standard check-out time', 'booking', NOW(), NOW()),
('cancellation_policy_hours', '48', 'Free cancellation period in hours', 'booking', NOW(), NOW()),
('sepa_payment_deadline_hours', '72', 'SEPA payment deadline in hours', 'payment', NOW(), NOW()),
('cash_payment_location', 'At the property during check-in', 'Default cash payment location', 'payment', NOW(), NOW());

COMMIT;

-- ===================================================================
-- VERIFICATION QUERIES
-- ===================================================================

-- Check that templates were created
SELECT name, template_type, is_active FROM email_templates ORDER BY created_at DESC;

-- Check that automations were created
SELECT name, trigger_type, trigger_delay_hours, is_active FROM email_automations ORDER BY created_at DESC;

-- Check system settings
SELECT key, value, description FROM system_settings WHERE category IN ('email', 'booking', 'payment') ORDER BY category, key;

-- ===================================================================
-- SUCCESS MESSAGE
-- ===================================================================

SELECT
  '✅ Simple email automation setup completed successfully!' as status,
  NOW() as setup_time;