-- Settings Management Schema
-- Run this in Supabase SQL Editor to create settings tables

-- Create settings category enum
CREATE TYPE setting_category AS ENUM (
  'business',
  'api',
  'notifications',
  'automation',
  'security'
);

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category setting_category NOT NULL,
  key VARCHAR(255) NOT NULL,
  value TEXT,
  encrypted BOOLEAN DEFAULT false,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Unique constraint for category + key
  UNIQUE(category, key)
);

-- Create settings_history table for audit trail
CREATE TABLE IF NOT EXISTS settings_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_id UUID REFERENCES settings(id) ON DELETE CASCADE,
  old_value TEXT,
  new_value TEXT,
  changed_by UUID, -- Could reference auth.users if needed
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  change_reason TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_settings_category ON settings(category);
CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);
CREATE INDEX IF NOT EXISTS idx_settings_history_setting ON settings_history(setting_id);
CREATE INDEX IF NOT EXISTS idx_settings_history_changed_at ON settings_history(changed_at);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW
  EXECUTE FUNCTION update_settings_updated_at();

-- Create function to log setting changes
CREATE OR REPLACE FUNCTION log_setting_change()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.value IS DISTINCT FROM NEW.value THEN
    INSERT INTO settings_history (setting_id, old_value, new_value, change_reason)
    VALUES (NEW.id, OLD.value, NEW.value, 'Updated via admin panel');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_log_setting_change
  AFTER UPDATE ON settings
  FOR EACH ROW
  EXECUTE FUNCTION log_setting_change();

-- Enable RLS (Row Level Security)
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow all operations for authenticated users)
CREATE POLICY "Allow all operations for authenticated users" ON settings
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON settings_history
  FOR ALL USING (auth.role() = 'authenticated');

-- Grant permissions
GRANT ALL ON settings TO authenticated;
GRANT ALL ON settings_history TO authenticated;
GRANT USAGE ON SEQUENCE settings_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE settings_history_id_seq TO authenticated;

-- Insert default settings
INSERT INTO settings (category, key, value, description) VALUES
-- Business Settings
('business', 'business_name', 'Habitat Lobby', 'Business name displayed on invoices and communications'),
('business', 'business_address', 'Trikala, Greece', 'Business address for legal documents'),
('business', 'business_phone', '+30 123 456 7890', 'Primary business phone number'),
('business', 'business_email', 'info@habitatlobby.com', 'Primary business email address'),
('business', 'business_website', 'https://habitatlobby.com', 'Business website URL'),
('business', 'tax_id', 'GR123456789', 'Tax identification number'),
('business', 'currency', 'EUR', 'Default currency for pricing'),
('business', 'timezone', 'Europe/Athens', 'Business timezone'),
('business', 'language', 'en', 'Default language'),

-- API Settings (values should be set via environment variables in production)
('api', 'stripe_publishable_key', '', 'Stripe publishable key for payment processing'),
('api', 'stripe_secret_key', '', 'Stripe secret key (encrypted)'),
('api', 'stripe_webhook_secret', '', 'Stripe webhook secret (encrypted)'),
('api', 'postmark_api_key', '', 'Postmark API key for email sending (encrypted)'),
('api', 'elorus_api_key', '', 'Elorus API key for invoicing (encrypted)'),
('api', 'google_analytics_id', '', 'Google Analytics tracking ID'),
('api', 'facebook_pixel_id', '', 'Facebook Pixel ID for tracking'),

-- Notification Settings
('notifications', 'email_notifications', 'true', 'Enable email notifications'),
('notifications', 'booking_notifications', 'true', 'Send notifications for new bookings'),
('notifications', 'payment_notifications', 'true', 'Send notifications for payments'),
('notifications', 'review_notifications', 'true', 'Send notifications for new reviews'),
('notifications', 'maintenance_notifications', 'true', 'Send maintenance notifications'),
('notifications', 'notification_email', 'admin@habitatlobby.com', 'Email address for admin notifications'),

-- Automation Settings
('automation', 'auto_confirm_bookings', 'true', 'Automatically confirm bookings after payment'),
('automation', 'auto_send_confirmations', 'true', 'Automatically send booking confirmations'),
('automation', 'auto_send_pre_arrival', 'true', 'Automatically send pre-arrival information'),
('automation', 'auto_send_id_reminders', 'false', 'Automatically send ID verification reminders'),
('automation', 'auto_send_post_stay', 'true', 'Automatically send post-stay thank you emails'),
('automation', 'auto_generate_invoices', 'true', 'Automatically generate invoices'),
('automation', 'auto_sync_calendars', 'true', 'Automatically sync external calendars'),
('automation', 'auto_delete_old_documents', 'false', 'Automatically delete old documents'),

-- Security Settings
('security', 'session_timeout', '3600', 'Session timeout in seconds'),
('security', 'require_2fa', 'false', 'Require two-factor authentication'),
('security', 'password_expiry_days', '90', 'Password expiry in days'),
('security', 'max_login_attempts', '5', 'Maximum login attempts before lockout'),
('security', 'document_retention_days', '2555', 'Document retention period in days (7 years)');

-- Create function to get settings by category
CREATE OR REPLACE FUNCTION get_settings_by_category(p_category setting_category)
RETURNS TABLE (
  key VARCHAR(255),
  value TEXT,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT s.key, s.value, s.description, s.updated_at
  FROM settings s
  WHERE s.category = p_category
  ORDER BY s.key;
END;
$$ LANGUAGE plpgsql;

-- Create function to update setting
CREATE OR REPLACE FUNCTION update_setting(
  p_category setting_category,
  p_key VARCHAR(255),
  p_value TEXT
) RETURNS BOOLEAN AS $$
BEGIN
  UPDATE settings 
  SET value = p_value, updated_at = NOW()
  WHERE category = p_category AND key = p_key;
  
  IF NOT FOUND THEN
    INSERT INTO settings (category, key, value)
    VALUES (p_category, p_key, p_value);
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;
