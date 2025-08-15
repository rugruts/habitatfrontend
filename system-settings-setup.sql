-- System Settings Setup for Habitat Lobby
-- Run this in Supabase SQL Editor to set up default system settings

-- Clear existing settings (optional)
-- DELETE FROM system_settings;

-- Insert default business settings
INSERT INTO system_settings (category, key, value, description) VALUES
('business', 'business_name', 'Habitat Lobby', 'Company or business name'),
('business', 'business_address', 'Alexandrias 69, Trikala, Greece', 'Physical business address'),
('business', 'business_phone', '+30 243 123 4567', 'Primary contact phone number'),
('business', 'business_email', 'info@habitatlobby.com', 'Primary contact email address'),
('business', 'business_website', 'https://habitatlobby.com', 'Company website URL'),
('business', 'tax_id', 'GR123456789', 'Tax identification number'),
('business', 'currency', 'EUR', 'Default currency for transactions'),
('business', 'timezone', 'Europe/Athens', 'Business timezone'),
('business', 'language', 'en', 'Default language for communications');

-- Insert default integration settings (empty by default for security)
INSERT INTO system_settings (category, key, value, description) VALUES
('integrations', 'stripe_publishable_key', '', 'Stripe publishable API key'),
('integrations', 'stripe_secret_key', '', 'Stripe secret API key'),
('integrations', 'stripe_webhook_secret', '', 'Stripe webhook endpoint secret'),
('integrations', 'postmark_api_key', '', 'Postmark email service API key'),
('integrations', 'elorus_api_key', '', 'Elorus invoicing service API key'),
('integrations', 'google_analytics_id', '', 'Google Analytics tracking ID'),
('integrations', 'facebook_pixel_id', '', 'Facebook Pixel tracking ID');

-- Insert default notification settings
INSERT INTO system_settings (category, key, value, description) VALUES
('notifications', 'email_notifications', 'true', 'Enable email notifications'),
('notifications', 'booking_notifications', 'true', 'Enable booking notifications'),
('notifications', 'payment_notifications', 'true', 'Enable payment notifications'),
('notifications', 'review_notifications', 'true', 'Enable review notifications'),
('notifications', 'maintenance_notifications', 'false', 'Enable maintenance notifications'),
('notifications', 'notification_email', 'stefanos@habitatlobby.com', 'Email address for notifications');

-- Insert default automation settings
INSERT INTO system_settings (category, key, value, description) VALUES
('automation', 'auto_confirm_bookings', 'false', 'Automatically confirm new bookings'),
('automation', 'auto_send_confirmations', 'true', 'Send booking confirmation emails'),
('automation', 'auto_send_pre_arrival', 'true', 'Send pre-arrival instructions'),
('automation', 'auto_send_id_reminders', 'true', 'Send ID verification reminders'),
('automation', 'auto_send_post_stay', 'true', 'Send post-stay follow-up emails'),
('automation', 'auto_generate_invoices', 'true', 'Automatically generate invoices'),
('automation', 'auto_sync_calendars', 'true', 'Sync with external calendars'),
('automation', 'auto_delete_old_documents', 'true', 'Delete expired documents');

-- Insert default security settings
INSERT INTO system_settings (category, key, value, description) VALUES
('security', 'session_timeout', '480', 'Session timeout in minutes'),
('security', 'require_2fa', 'false', 'Require two-factor authentication'),
('security', 'password_expiry_days', '90', 'Password expiry period in days'),
('security', 'max_login_attempts', '5', 'Maximum login attempts before lockout'),
('security', 'document_retention_days', '30', 'Document retention period in days'),
('security', 'backup_frequency', 'daily', 'Backup frequency schedule');

-- Insert additional operational settings
INSERT INTO system_settings (category, key, value, description) VALUES
('operations', 'default_check_in_time', '15:00', 'Default check-in time'),
('operations', 'default_check_out_time', '11:00', 'Default check-out time'),
('operations', 'min_nights', '2', 'Minimum nights for bookings'),
('operations', 'max_nights', '30', 'Maximum nights for bookings'),
('operations', 'booking_buffer_hours', '2', 'Hours between bookings for cleaning'),
('operations', 'cancellation_policy', 'moderate', 'Default cancellation policy'),
('operations', 'id_verification_required', 'true', 'Require ID verification for all bookings'),
('operations', 'auto_assign_access_codes', 'true', 'Automatically generate access codes');

-- Insert email template settings
INSERT INTO system_settings (category, key, value, description) VALUES
('email', 'from_name', 'Habitat Lobby', 'Default sender name for emails'),
('email', 'from_email', 'noreply@habitatlobby.com', 'Default sender email address'),
('email', 'reply_to_email', 'info@habitatlobby.com', 'Reply-to email address'),
('email', 'email_footer', 'Best regards,\nHabitat Lobby Team\n\n© 2024 Habitat Lobby. All rights reserved.', 'Default email footer'),
('email', 'send_booking_confirmations', 'true', 'Send booking confirmation emails'),
('email', 'send_payment_confirmations', 'true', 'Send payment confirmation emails'),
('email', 'send_checkin_instructions', 'true', 'Send check-in instruction emails'),
('email', 'send_id_reminders', 'true', 'Send ID verification reminder emails');

-- Insert calendar sync settings
INSERT INTO system_settings (category, key, value, description) VALUES
('calendar', 'airbnb_sync_enabled', 'false', 'Enable Airbnb calendar sync'),
('calendar', 'booking_com_sync_enabled', 'false', 'Enable Booking.com calendar sync'),
('calendar', 'vrbo_sync_enabled', 'false', 'Enable VRBO calendar sync'),
('calendar', 'sync_frequency_minutes', '60', 'Calendar sync frequency in minutes'),
('calendar', 'sync_buffer_days', '1', 'Buffer days around bookings for sync'),
('calendar', 'auto_block_maintenance', 'true', 'Automatically block dates for maintenance');

-- Insert payment settings
INSERT INTO system_settings (category, key, value, description) VALUES
('payments', 'payment_processor', 'stripe', 'Primary payment processor'),
('payments', 'collect_payment_at', 'booking', 'When to collect payment (booking/checkin)'),
('payments', 'payment_currency', 'EUR', 'Payment currency'),
('payments', 'tax_rate', '0.24', 'Default tax rate (24% for Greece)'),
('payments', 'cleaning_fee', '50.00', 'Default cleaning fee in euros'),
('payments', 'security_deposit', '200.00', 'Default security deposit in euros'),
('payments', 'refund_processing_days', '7', 'Days to process refunds');

-- Insert property management settings
INSERT INTO system_settings (category, key, value, description) VALUES
('properties', 'default_max_guests', '4', 'Default maximum guests per property'),
('properties', 'default_bedrooms', '2', 'Default number of bedrooms'),
('properties', 'default_bathrooms', '1', 'Default number of bathrooms'),
('properties', 'require_property_images', 'true', 'Require at least one image per property'),
('properties', 'max_images_per_property', '20', 'Maximum images per property'),
('properties', 'image_max_size_mb', '5', 'Maximum image size in MB');

-- Verify settings were created
SELECT 
    category,
    COUNT(*) as setting_count
FROM system_settings
GROUP BY category
ORDER BY category;

-- Show all settings
SELECT 
    category,
    key,
    value,
    description,
    created_at
FROM system_settings
ORDER BY category, key;
