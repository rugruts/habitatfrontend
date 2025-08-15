-- Habitat Lobby Admin Dashboard - Seed Data
-- Run this AFTER supabase-admin-schema.sql to populate with sample data

-- Insert sample guests
INSERT INTO guests (
    first_name, last_name, email, phone, nationality, 
    total_bookings, total_spent, last_stay_date, id_verified, marketing_consent
) VALUES
('Maria', 'Papadopoulos', 'maria.p@email.com', '+30 694 123 4567', 'Greek', 3, 450.00, '2024-07-15', true, true),
('John', 'Smith', 'john.smith@email.com', '+44 7700 900123', 'British', 1, 180.00, '2024-08-01', true, false),
('Sophie', 'Dubois', 'sophie.dubois@email.com', '+33 6 12 34 56 78', 'French', 2, 320.00, '2024-06-20', false, true),
('Hans', 'Mueller', 'hans.mueller@email.com', '+49 151 12345678', 'German', 1, 240.00, '2024-05-10', true, true),
('Elena', 'Rossi', 'elena.rossi@email.com', '+39 320 123 4567', 'Italian', 4, 680.00, '2024-08-05', true, true);

-- Insert sample email templates
INSERT INTO email_templates (
    name, subject, content, template_type, variables, is_active, language
) VALUES
(
    'Booking Confirmation',
    'Your booking at {{property_name}} is confirmed!',
    'Dear {{guest_name}},

Thank you for booking with Habitat Lobby! Your reservation is confirmed.

Booking Details:
- Property: {{property_name}}
- Check-in: {{check_in_date}} at {{check_in_time}}
- Check-out: {{check_out_date}} at {{check_out_time}}
- Guests: {{guests_count}}
- Total: {{total_amount}} {{currency}}

We''ll send you pre-arrival instructions 48 hours before your check-in.

Best regards,
The Habitat Lobby Team',
    'booking_confirmation',
    ARRAY['guest_name', 'property_name', 'check_in_date', 'check_in_time', 'check_out_date', 'check_out_time', 'guests_count', 'total_amount', 'currency'],
    true,
    'en'
),
(
    'Pre-Arrival Instructions',
    'Your stay at {{property_name}} starts tomorrow!',
    'Dear {{guest_name}},

Your stay at {{property_name}} begins tomorrow! Here are your check-in instructions:

Check-in Details:
- Time: {{check_in_time}} onwards
- Address: {{property_address}}
- Contact: {{host_phone}}

Important: Please upload your ID document if you haven''t already.

Access Instructions:
[Detailed access instructions would go here]

Looking forward to hosting you!

Best regards,
Stefanos & The Habitat Lobby Team',
    'pre_arrival',
    ARRAY['guest_name', 'property_name', 'check_in_time', 'property_address', 'host_phone'],
    true,
    'en'
),
(
    'ID Verification Reminder',
    'ID Document Required for Your Stay',
    'Dear {{guest_name}},

We need your ID document for your upcoming stay at {{property_name}}.

Please upload a clear photo of your passport or ID card through our secure portal:
[Upload link would go here]

This is required by Greek law and helps us ensure a safe environment for all guests.

If you have any questions, please don''t hesitate to contact us.

Best regards,
The Habitat Lobby Team',
    'id_reminder',
    ARRAY['guest_name', 'property_name'],
    true,
    'en'
),
(
    'Post-Stay Thank You',
    'Thank you for staying with us!',
    'Dear {{guest_name}},

Thank you for choosing Habitat Lobby for your stay in Trikala!

We hope you enjoyed your time at {{property_name}} and had a wonderful experience exploring our beautiful city.

We would love to hear about your stay. If you have a moment, please consider leaving us a review:
- Google: [Google review link]
- Airbnb: [Airbnb review link]

We look forward to welcoming you back to Trikala soon!

Best regards,
Stefanos & The Habitat Lobby Team',
    'post_stay',
    ARRAY['guest_name', 'property_name'],
    true,
    'en'
);

-- Insert email automations
INSERT INTO email_automations (
    name, template_id, trigger_type, trigger_delay_hours, is_active
) VALUES
(
    'Send Booking Confirmation',
    (SELECT id FROM email_templates WHERE template_type = 'booking_confirmation' LIMIT 1),
    'booking_created',
    0,
    true
),
(
    'Pre-Arrival Instructions',
    (SELECT id FROM email_templates WHERE template_type = 'pre_arrival' LIMIT 1),
    'check_in_approaching',
    48,
    true
),
(
    'ID Verification Reminder',
    (SELECT id FROM email_templates WHERE template_type = 'id_reminder' LIMIT 1),
    'id_missing',
    72,
    true
),
(
    'Post-Stay Thank You',
    (SELECT id FROM email_templates WHERE template_type = 'post_stay' LIMIT 1),
    'check_out_completed',
    24,
    true
);

-- Insert sample calendar syncs
INSERT INTO calendar_syncs (
    name, property_id, platform, sync_type, ical_url, is_active, sync_frequency_hours, last_sync_at, total_bookings_synced
) VALUES
(
    'Airbnb - River Loft',
    (SELECT id FROM properties WHERE slug = 'river-loft-apartment' LIMIT 1),
    'airbnb',
    'import',
    'https://calendar.airbnb.com/calendar/ical/12345.ics',
    true,
    6,
    NOW() - INTERVAL '2 hours',
    15
),
(
    'Booking.com - Garden Suite',
    (SELECT id FROM properties WHERE slug = 'garden-suite' LIMIT 1),
    'booking_com',
    'import',
    'https://admin.booking.com/hotel/hoteladmin/ical.html?ses=67890',
    true,
    12,
    NOW() - INTERVAL '4 hours',
    8
),
(
    'Export - All Properties',
    NULL,
    'custom',
    'export',
    NULL,
    true,
    1,
    NOW() - INTERVAL '30 minutes',
    23
);

-- Insert sample sync logs
INSERT INTO sync_logs (
    calendar_sync_id, sync_type, status, started_at, completed_at, duration_ms,
    bookings_processed, bookings_added, bookings_updated, bookings_removed
) VALUES
(
    (SELECT id FROM calendar_syncs WHERE name = 'Airbnb - River Loft' LIMIT 1),
    'import',
    'success',
    NOW() - INTERVAL '2 hours',
    NOW() - INTERVAL '2 hours' + INTERVAL '15 seconds',
    15000,
    3, 1, 2, 0
),
(
    (SELECT id FROM calendar_syncs WHERE name = 'Booking.com - Garden Suite' LIMIT 1),
    'import',
    'failed',
    NOW() - INTERVAL '4 hours',
    NOW() - INTERVAL '4 hours' + INTERVAL '5 seconds',
    5000,
    0, 0, 0, 0
);

-- Insert system settings
INSERT INTO system_settings (category, key, value, description) VALUES
('business', 'company_name', '"Habitat Lobby"', 'Business name'),
('business', 'company_address', '"Alexandrias 69, Trikala, Greece"', 'Business address'),
('business', 'company_phone', '"+30 243 123 4567"', 'Business phone number'),
('business', 'company_email', '"info@habitatlobby.com"', 'Business email'),
('business', 'tax_id', '"GR123456789"', 'Tax identification number'),
('business', 'currency', '"EUR"', 'Default currency'),
('business', 'timezone', '"Europe/Athens"', 'Business timezone'),

('payment', 'stripe_publishable_key', '"pk_test_..."', 'Stripe publishable key'),
('payment', 'stripe_webhook_secret', '"whsec_..."', 'Stripe webhook secret'),
('payment', 'auto_capture', 'true', 'Automatically capture payments'),

('email', 'postmark_api_key', '""', 'Postmark API key for sending emails'),
('email', 'from_email', '"noreply@habitatlobby.com"', 'Default from email address'),
('email', 'from_name', '"Habitat Lobby"', 'Default from name'),

('automation', 'auto_confirm_bookings', 'false', 'Automatically confirm bookings after payment'),
('automation', 'auto_send_confirmations', 'true', 'Send booking confirmation emails'),
('automation', 'auto_send_pre_arrival', 'true', 'Send pre-arrival instructions'),
('automation', 'auto_send_id_reminders', 'true', 'Send ID verification reminders'),
('automation', 'auto_send_post_stay', 'true', 'Send post-stay thank you emails'),
('automation', 'auto_generate_invoices', 'true', 'Automatically generate invoices'),
('automation', 'auto_sync_calendars', 'true', 'Automatically sync calendars'),
('automation', 'auto_delete_old_documents', 'true', 'Automatically delete expired documents'),

('security', 'session_timeout_minutes', '480', 'Session timeout in minutes'),
('security', 'max_login_attempts', '5', 'Maximum login attempts before lockout'),
('security', 'password_expiry_days', '90', 'Password expiry in days'),
('security', 'document_retention_days', '30', 'Document retention period in days'),
('security', 'require_2fa', 'false', 'Require two-factor authentication'),

('notifications', 'email_notifications', 'true', 'Enable email notifications'),
('notifications', 'booking_notifications', 'true', 'Send booking notifications'),
('notifications', 'payment_notifications', 'true', 'Send payment notifications'),
('notifications', 'notification_email', '"stefanos@habitatlobby.com"', 'Email for notifications');

-- Insert sample email logs (recent activity)
INSERT INTO email_logs (
    template_id, recipient_email, recipient_name, subject, content, status, sent_at, delivered_at
) VALUES
(
    (SELECT id FROM email_templates WHERE template_type = 'booking_confirmation' LIMIT 1),
    'maria.p@email.com',
    'Maria Papadopoulos',
    'Your booking at River Loft Apartment is confirmed!',
    'Dear Maria, Thank you for booking with Habitat Lobby!...',
    'sent',
    NOW() - INTERVAL '2 hours',
    NOW() - INTERVAL '2 hours' + INTERVAL '30 seconds'
),
(
    (SELECT id FROM email_templates WHERE template_type = 'pre_arrival' LIMIT 1),
    'john.smith@email.com',
    'John Smith',
    'Your stay at Garden Suite starts tomorrow!',
    'Dear John, Your stay at Garden Suite begins tomorrow!...',
    'sent',
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day' + INTERVAL '45 seconds'
),
(
    (SELECT id FROM email_templates WHERE template_type = 'id_reminder' LIMIT 1),
    'sophie.dubois@email.com',
    'Sophie Dubois',
    'ID Document Required for Your Stay',
    'Dear Sophie, We need your ID document for your upcoming stay...',
    'failed',
    NOW() - INTERVAL '3 hours',
    NULL
);

-- Update guest statistics based on existing data
UPDATE guests SET 
    total_bookings = (
        SELECT COUNT(*) FROM bookings 
        WHERE customer_email = guests.email
    ),
    total_spent = (
        SELECT COALESCE(SUM(total_amount), 0) FROM bookings 
        WHERE customer_email = guests.email AND status IN ('confirmed', 'completed')
    ),
    last_stay_date = (
        SELECT MAX(check_out) FROM bookings 
        WHERE customer_email = guests.email AND status IN ('confirmed', 'completed')
    );

-- Create some sample payments for existing bookings
INSERT INTO payments (
    booking_id, stripe_payment_intent_id, amount, currency, status, 
    payment_method, processed_at, receipt_url
)
SELECT 
    id,
    'pi_' || substr(md5(random()::text), 1, 24),
    total_amount,
    currency,
    CASE 
        WHEN status = 'confirmed' THEN 'succeeded'::payment_status
        WHEN status = 'pending' THEN 'processing'::payment_status
        ELSE 'pending'::payment_status
    END,
    'card'::payment_method,
    CASE WHEN status = 'confirmed' THEN created_at + INTERVAL '5 minutes' ELSE NULL END,
    CASE WHEN status = 'confirmed' THEN 'https://pay.stripe.com/receipts/' || substr(md5(random()::text), 1, 32) ELSE NULL END
FROM bookings
WHERE payment_intent_id IS NOT NULL
LIMIT 10;
