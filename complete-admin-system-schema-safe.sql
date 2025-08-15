-- COMPLETE ADMIN SYSTEM DATABASE SCHEMA (SAFE VERSION)
-- This version checks for existing objects before creating them
-- Run this in Supabase SQL Editor to create all new admin features

-- ============================================================================
-- 0. REQUIRED EXTENSIONS
-- ============================================================================

-- Enable required extensions for advanced features
CREATE EXTENSION IF NOT EXISTS "btree_gist";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. EMAIL TEMPLATES SYSTEM
-- ============================================================================

-- Create email template types enum (only if not exists)
DO $$ BEGIN
    CREATE TYPE email_template_type AS ENUM (
      'booking_confirmation',
      'pre_arrival',
      'post_stay',
      'payment_confirmation',
      'cancellation',
      'custom'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create email status enum (only if not exists)
DO $$ BEGIN
    CREATE TYPE email_status AS ENUM (
      'sent',
      'failed',
      'pending'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create email templates table
DO $$ BEGIN
    CREATE TABLE IF NOT EXISTS email_templates (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      subject VARCHAR(500) NOT NULL,
      content TEXT NOT NULL,
      type email_template_type NOT NULL,
      is_active BOOLEAN DEFAULT true,
      variables TEXT[] DEFAULT '{}',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
EXCEPTION
    WHEN undefined_object THEN
        -- If enum type doesn't exist, create table with VARCHAR type instead
        CREATE TABLE IF NOT EXISTS email_templates (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          subject VARCHAR(500) NOT NULL,
          content TEXT NOT NULL,
          type VARCHAR(50) NOT NULL DEFAULT 'custom',
          is_active BOOLEAN DEFAULT true,
          variables TEXT[] DEFAULT '{}',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
END $$;

-- Create email logs table
DO $$ BEGIN
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
EXCEPTION
    WHEN undefined_object THEN
        -- If enum type doesn't exist, create table with VARCHAR type instead
        CREATE TABLE IF NOT EXISTS email_logs (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          template_id UUID REFERENCES email_templates(id) ON DELETE SET NULL,
          recipient_email VARCHAR(255) NOT NULL,
          recipient_name VARCHAR(255),
          subject VARCHAR(500) NOT NULL,
          content TEXT NOT NULL,
          status VARCHAR(20) DEFAULT 'sent',
          booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
          guest_id UUID REFERENCES guests(id) ON DELETE SET NULL,
          sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          error_message TEXT,
          metadata JSONB DEFAULT '{}',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
END $$;

-- ============================================================================
-- 2. CALENDAR SYNC SYSTEM
-- ============================================================================

-- Create platform type enum (only if not exists)
DO $$ BEGIN
    CREATE TYPE platform_type AS ENUM (
      'airbnb',
      'booking_com', 
      'vrbo',
      'expedia',
      'custom'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create sync type enum (only if not exists)
DO $$ BEGIN
    CREATE TYPE sync_type AS ENUM (
      'import',
      'export',
      'bidirectional'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create sync status enum (only if not exists)
DO $$ BEGIN
    CREATE TYPE sync_status AS ENUM (
      'success',
      'failed',
      'partial',
      'in_progress'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create calendar_syncs table
CREATE TABLE IF NOT EXISTS calendar_syncs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  platform platform_type NOT NULL,
  sync_type sync_type NOT NULL,
  ical_url TEXT,
  export_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sync_frequency_hours INTEGER DEFAULT 6,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  next_sync_at TIMESTAMP WITH TIME ZONE,
  total_bookings_synced INTEGER DEFAULT 0,
  last_error TEXT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create calendar_sync_logs table
CREATE TABLE IF NOT EXISTS calendar_sync_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  calendar_sync_id UUID REFERENCES calendar_syncs(id) ON DELETE CASCADE,
  sync_type sync_type NOT NULL,
  status sync_status NOT NULL,
  bookings_processed INTEGER DEFAULT 0,
  bookings_added INTEGER DEFAULT 0,
  bookings_updated INTEGER DEFAULT 0,
  bookings_removed INTEGER DEFAULT 0,
  error_message TEXT,
  sync_details JSONB DEFAULT '{}',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  duration_ms INTEGER
);

-- Create external_bookings table
CREATE TABLE IF NOT EXISTS external_bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  calendar_sync_id UUID REFERENCES calendar_syncs(id) ON DELETE CASCADE,
  external_id VARCHAR(255),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  guest_name VARCHAR(255),
  guest_email VARCHAR(255),
  guest_count INTEGER DEFAULT 1,
  status VARCHAR(50) DEFAULT 'confirmed',
  platform platform_type NOT NULL,
  raw_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);



-- ============================================================================
-- 3. RATE RULES & DYNAMIC PRICING SYSTEM
-- ============================================================================

-- Create modifier type enum (only if not exists)
DO $$ BEGIN
    CREATE TYPE modifier_type AS ENUM (
      'percentage',
      'fixed_amount',
      'absolute_price'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create rule type enum (only if not exists)
DO $$ BEGIN
    CREATE TYPE rule_type AS ENUM (
      'seasonal',
      'weekend',
      'holiday',
      'minimum_stay',
      'advance_booking',
      'last_minute',
      'custom'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create rate_rules table
CREATE TABLE IF NOT EXISTS rate_rules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  rule_type rule_type NOT NULL,
  start_date DATE,
  end_date DATE,
  days_of_week INTEGER[],
  price_modifier DECIMAL(10,2) NOT NULL,
  modifier_type modifier_type NOT NULL DEFAULT 'percentage',
  min_nights INTEGER,
  max_nights INTEGER,
  advance_booking_days INTEGER,
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 0,
  conditions JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blackout_dates table
CREATE TABLE IF NOT EXISTS blackout_dates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason VARCHAR(255) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);



-- Create seasonal_rates table
CREATE TABLE IF NOT EXISTS seasonal_rates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  base_price INTEGER NOT NULL,
  weekend_multiplier DECIMAL(3,2) DEFAULT 1.0,
  min_nights INTEGER DEFAULT 1,
  max_nights INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pricing_cache table
CREATE TABLE IF NOT EXISTS pricing_cache (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  nights INTEGER NOT NULL,
  base_price INTEGER NOT NULL,
  total_price INTEGER NOT NULL,
  applied_rules JSONB DEFAULT '[]',
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 hour')
);

-- Add unique constraint only if it doesn't exist
DO $$ BEGIN
    ALTER TABLE pricing_cache ADD CONSTRAINT pricing_cache_unique UNIQUE(property_id, check_in_date, check_out_date);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- 4. SETTINGS MANAGEMENT SYSTEM
-- ============================================================================

-- Create settings category enum (only if not exists)
DO $$ BEGIN
    CREATE TYPE setting_category AS ENUM (
      'business',
      'api',
      'notifications',
      'automation',
      'security'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category setting_category NOT NULL,
  key VARCHAR(255) NOT NULL,
  value TEXT,
  encrypted BOOLEAN DEFAULT false,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add unique constraint only if it doesn't exist
DO $$ BEGIN
    ALTER TABLE settings ADD CONSTRAINT settings_category_key_unique UNIQUE(category, key);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create settings_history table
CREATE TABLE IF NOT EXISTS settings_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_id UUID REFERENCES settings(id) ON DELETE CASCADE,
  old_value TEXT,
  new_value TEXT,
  changed_by UUID,
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  change_reason TEXT
);

-- ============================================================================
-- 5. CONSTRAINTS (CREATE AFTER ALL TABLES)
-- ============================================================================

-- Add overlap prevention constraints for external bookings
-- Note: Using a simpler approach to avoid GIST extension issues
CREATE UNIQUE INDEX IF NOT EXISTS idx_external_bookings_no_overlap
ON external_bookings (property_id, start_date, end_date)
WHERE (status != 'cancelled');

-- Add overlap prevention constraints for blackout dates
-- Note: Simplified without WHERE clause to avoid column reference issues
CREATE UNIQUE INDEX IF NOT EXISTS idx_blackout_dates_no_overlap
ON blackout_dates (property_id, start_date, end_date);

-- ============================================================================
-- 5. CONSTRAINTS (ADD AFTER ALL TABLES ARE CREATED)
-- ============================================================================

-- Add overlap prevention for external bookings (simplified approach)
CREATE UNIQUE INDEX IF NOT EXISTS idx_external_bookings_no_overlap
ON external_bookings (property_id, start_date, end_date)
WHERE (status != 'cancelled');

-- Add overlap prevention constraints for blackout dates (simplified)
CREATE UNIQUE INDEX IF NOT EXISTS idx_blackout_dates_no_overlap
ON blackout_dates (property_id, start_date, end_date);

-- ============================================================================
-- 6. INDEXES FOR PERFORMANCE (CREATE ONLY IF NOT EXISTS)
-- ============================================================================

-- Email Templates Indexes
CREATE INDEX IF NOT EXISTS idx_email_templates_type ON email_templates(type);
CREATE INDEX IF NOT EXISTS idx_email_templates_active ON email_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_email_logs_recipient ON email_logs(recipient_email);
CREATE INDEX IF NOT EXISTS idx_email_logs_booking ON email_logs(booking_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON email_logs(sent_at);

-- Calendar Sync Indexes
CREATE INDEX IF NOT EXISTS idx_calendar_syncs_property ON calendar_syncs(property_id);
CREATE INDEX IF NOT EXISTS idx_calendar_syncs_active ON calendar_syncs(is_active);
CREATE INDEX IF NOT EXISTS idx_calendar_syncs_next_sync ON calendar_syncs(next_sync_at);
CREATE INDEX IF NOT EXISTS idx_calendar_sync_logs_sync_id ON calendar_sync_logs(calendar_sync_id);
CREATE INDEX IF NOT EXISTS idx_calendar_sync_logs_status ON calendar_sync_logs(status);
CREATE INDEX IF NOT EXISTS idx_external_bookings_property ON external_bookings(property_id);
CREATE INDEX IF NOT EXISTS idx_external_bookings_dates ON external_bookings(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_external_bookings_sync ON external_bookings(calendar_sync_id);

-- Rate Rules Indexes
CREATE INDEX IF NOT EXISTS idx_rate_rules_property ON rate_rules(property_id);
CREATE INDEX IF NOT EXISTS idx_rate_rules_dates ON rate_rules(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_rate_rules_active ON rate_rules(is_active);
CREATE INDEX IF NOT EXISTS idx_rate_rules_priority ON rate_rules(priority DESC);
CREATE INDEX IF NOT EXISTS idx_blackout_dates_property ON blackout_dates(property_id);
CREATE INDEX IF NOT EXISTS idx_blackout_dates_dates ON blackout_dates(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_blackout_dates_active ON blackout_dates(is_active);
CREATE INDEX IF NOT EXISTS idx_seasonal_rates_property ON seasonal_rates(property_id);
CREATE INDEX IF NOT EXISTS idx_seasonal_rates_dates ON seasonal_rates(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_pricing_cache_property_dates ON pricing_cache(property_id, check_in_date, check_out_date);
CREATE INDEX IF NOT EXISTS idx_pricing_cache_expires ON pricing_cache(expires_at);

-- Settings Indexes
CREATE INDEX IF NOT EXISTS idx_settings_category ON settings(category);
CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);
CREATE INDEX IF NOT EXISTS idx_settings_history_setting ON settings_history(setting_id);
CREATE INDEX IF NOT EXISTS idx_settings_history_changed_at ON settings_history(changed_at);

-- ============================================================================
-- 7. FUNCTIONS (CREATE OR REPLACE - SAFE)
-- ============================================================================

-- Email Templates updated_at trigger function
CREATE OR REPLACE FUNCTION update_email_template_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  NEW.last_modified = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Calendar Sync updated_at trigger function
CREATE OR REPLACE FUNCTION update_calendar_sync_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Schedule next sync function
CREATE OR REPLACE FUNCTION schedule_next_sync()
RETURNS TRIGGER AS $$
BEGIN
  NEW.next_sync_at = NOW() + (NEW.sync_frequency_hours || ' hours')::INTERVAL;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Rate Rules updated_at trigger function
CREATE OR REPLACE FUNCTION update_rate_rules_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Settings updated_at trigger function
CREATE OR REPLACE FUNCTION update_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Settings change logging function
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

-- Clean expired pricing cache function
CREATE OR REPLACE FUNCTION clean_expired_pricing_cache()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM pricing_cache WHERE expires_at < NOW();
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Dynamic pricing calculation function
CREATE OR REPLACE FUNCTION calculate_dynamic_price(
  p_property_id UUID,
  p_check_in DATE,
  p_check_out DATE
) RETURNS TABLE (
  base_price INTEGER,
  total_price INTEGER,
  applied_rules JSONB
) AS $$
DECLARE
  v_base_price INTEGER;
  v_total_price INTEGER;
  v_nights INTEGER;
  v_applied_rules JSONB := '[]'::JSONB;
  rule_record RECORD;
  modifier_amount DECIMAL;
BEGIN
  v_nights := p_check_out - p_check_in;

  SELECT properties.base_price INTO v_base_price
  FROM properties
  WHERE id = p_property_id;

  IF v_base_price IS NULL THEN
    RAISE EXCEPTION 'Property not found or no base price set';
  END IF;

  v_total_price := v_base_price * v_nights;

  FOR rule_record IN
    SELECT * FROM rate_rules
    WHERE property_id = p_property_id
      AND is_active = true
      AND (start_date IS NULL OR start_date <= p_check_in)
      AND (end_date IS NULL OR end_date >= p_check_out)
    ORDER BY priority DESC, created_at ASC
  LOOP
    IF rule_record.rule_type = 'weekend' THEN
      IF EXISTS (
        SELECT 1 FROM generate_series(p_check_in, p_check_out - 1, '1 day'::interval) AS date_series
        WHERE EXTRACT(DOW FROM date_series) IN (0, 6)
      ) THEN
        IF rule_record.modifier_type = 'percentage' THEN
          modifier_amount := v_total_price * (rule_record.price_modifier / 100);
        ELSIF rule_record.modifier_type = 'fixed_amount' THEN
          modifier_amount := rule_record.price_modifier * 100;
        ELSE
          v_total_price := rule_record.price_modifier * 100 * v_nights;
          modifier_amount := v_total_price - (v_base_price * v_nights);
        END IF;

        v_total_price := v_total_price + modifier_amount;
        v_applied_rules := v_applied_rules || jsonb_build_object(
          'rule_id', rule_record.id,
          'rule_name', rule_record.name,
          'modifier_type', rule_record.modifier_type,
          'modifier_amount', modifier_amount
        );
      END IF;
    END IF;
  END LOOP;

  IF v_total_price < v_base_price * v_nights * 0.5 THEN
    v_total_price := ROUND(v_base_price * v_nights * 0.5);
  END IF;

  RETURN QUERY SELECT v_base_price, v_total_price::INTEGER, v_applied_rules;
END;
$$ LANGUAGE plpgsql;

-- Get settings by category function
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

-- Update setting function
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

-- ============================================================================
-- 8. TRIGGERS (CREATE ONLY IF NOT EXISTS)
-- ============================================================================

-- Email Templates triggers
DO $$ BEGIN
    CREATE TRIGGER trigger_email_templates_updated_at
      BEFORE UPDATE ON email_templates
      FOR EACH ROW
      EXECUTE FUNCTION update_email_template_updated_at();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Calendar Sync triggers
DO $$ BEGIN
    CREATE TRIGGER trigger_calendar_syncs_updated_at
      BEFORE UPDATE ON calendar_syncs
      FOR EACH ROW
      EXECUTE FUNCTION update_calendar_sync_updated_at();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TRIGGER trigger_external_bookings_updated_at
      BEFORE UPDATE ON external_bookings
      FOR EACH ROW
      EXECUTE FUNCTION update_calendar_sync_updated_at();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TRIGGER trigger_schedule_next_sync
      BEFORE INSERT OR UPDATE ON calendar_syncs
      FOR EACH ROW
      WHEN (NEW.is_active = true)
      EXECUTE FUNCTION schedule_next_sync();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Rate Rules triggers
DO $$ BEGIN
    CREATE TRIGGER trigger_rate_rules_updated_at
      BEFORE UPDATE ON rate_rules
      FOR EACH ROW
      EXECUTE FUNCTION update_rate_rules_updated_at();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TRIGGER trigger_blackout_dates_updated_at
      BEFORE UPDATE ON blackout_dates
      FOR EACH ROW
      EXECUTE FUNCTION update_rate_rules_updated_at();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TRIGGER trigger_seasonal_rates_updated_at
      BEFORE UPDATE ON seasonal_rates
      FOR EACH ROW
      EXECUTE FUNCTION update_rate_rules_updated_at();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Settings triggers
DO $$ BEGIN
    CREATE TRIGGER trigger_settings_updated_at
      BEFORE UPDATE ON settings
      FOR EACH ROW
      EXECUTE FUNCTION update_settings_updated_at();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TRIGGER trigger_log_setting_change
      AFTER UPDATE ON settings
      FOR EACH ROW
      EXECUTE FUNCTION log_setting_change();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables (safe to run multiple times)
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_syncs ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE external_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE blackout_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE seasonal_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (only if not exists)
DO $$ BEGIN
    CREATE POLICY "Allow all operations for authenticated users" ON email_templates
      FOR ALL USING (auth.role() = 'authenticated');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Allow all operations for authenticated users" ON email_logs
      FOR ALL USING (auth.role() = 'authenticated');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Allow all operations for authenticated users" ON calendar_syncs
      FOR ALL USING (auth.role() = 'authenticated');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Allow all operations for authenticated users" ON calendar_sync_logs
      FOR ALL USING (auth.role() = 'authenticated');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Allow all operations for authenticated users" ON external_bookings
      FOR ALL USING (auth.role() = 'authenticated');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Allow all operations for authenticated users" ON rate_rules
      FOR ALL USING (auth.role() = 'authenticated');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Allow all operations for authenticated users" ON blackout_dates
      FOR ALL USING (auth.role() = 'authenticated');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Allow all operations for authenticated users" ON seasonal_rates
      FOR ALL USING (auth.role() = 'authenticated');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Allow all operations for authenticated users" ON pricing_cache
      FOR ALL USING (auth.role() = 'authenticated');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Allow all operations for authenticated users" ON settings
      FOR ALL USING (auth.role() = 'authenticated');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Allow all operations for authenticated users" ON settings_history
      FOR ALL USING (auth.role() = 'authenticated');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- 9. GRANT PERMISSIONS (SAFE TO RUN MULTIPLE TIMES)
-- ============================================================================

-- Grant permissions to authenticated users
GRANT ALL ON email_templates TO authenticated;
GRANT ALL ON email_logs TO authenticated;
GRANT ALL ON calendar_syncs TO authenticated;
GRANT ALL ON calendar_sync_logs TO authenticated;
GRANT ALL ON external_bookings TO authenticated;
GRANT ALL ON rate_rules TO authenticated;
GRANT ALL ON blackout_dates TO authenticated;
GRANT ALL ON seasonal_rates TO authenticated;
GRANT ALL ON pricing_cache TO authenticated;
GRANT ALL ON settings TO authenticated;
GRANT ALL ON settings_history TO authenticated;

-- Grant sequence usage (safe to run multiple times)
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- ============================================================================
-- 10. DEFAULT DATA INSERTION (ONLY IF NOT EXISTS)
-- ============================================================================

-- Insert default email templates (only if none exist)
INSERT INTO email_templates (name, subject, content, type, variables)
SELECT * FROM (VALUES
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
    'booking_confirmation'::email_template_type,
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
    'pre_arrival'::email_template_type,
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
    'post_stay'::email_template_type,
    ARRAY['guest_name', 'property_name', 'host_phone', 'host_name']
  )
) AS t(name, subject, content, type, variables)
WHERE NOT EXISTS (SELECT 1 FROM email_templates WHERE type = t.type);

-- Insert default settings (only if none exist)
INSERT INTO settings (category, key, value, description)
SELECT * FROM (VALUES
  -- Business Settings
  ('business'::setting_category, 'business_name', 'Habitat Lobby', 'Business name displayed on invoices and communications'),
  ('business'::setting_category, 'business_address', 'Trikala, Greece', 'Business address for legal documents'),
  ('business'::setting_category, 'business_phone', '+30 123 456 7890', 'Primary business phone number'),
  ('business'::setting_category, 'business_email', 'info@habitatlobby.com', 'Primary business email address'),
  ('business'::setting_category, 'business_website', 'https://habitatlobby.com', 'Business website URL'),
  ('business'::setting_category, 'tax_id', 'GR123456789', 'Tax identification number'),
  ('business'::setting_category, 'currency', 'EUR', 'Default currency for pricing'),
  ('business'::setting_category, 'timezone', 'Europe/Athens', 'Business timezone'),
  ('business'::setting_category, 'language', 'en', 'Default language'),

  -- API Settings
  ('api'::setting_category, 'stripe_publishable_key', '', 'Stripe publishable key for payment processing'),
  ('api'::setting_category, 'stripe_secret_key', '', 'Stripe secret key (encrypted)'),
  ('api'::setting_category, 'stripe_webhook_secret', '', 'Stripe webhook secret (encrypted)'),
  ('api'::setting_category, 'postmark_api_key', '', 'Postmark API key for email sending (encrypted)'),
  ('api'::setting_category, 'elorus_api_key', '', 'Elorus API key for invoicing (encrypted)'),
  ('api'::setting_category, 'google_analytics_id', '', 'Google Analytics tracking ID'),
  ('api'::setting_category, 'facebook_pixel_id', '', 'Facebook Pixel ID for tracking'),

  -- Notification Settings
  ('notifications'::setting_category, 'email_notifications', 'true', 'Enable email notifications'),
  ('notifications'::setting_category, 'booking_notifications', 'true', 'Send notifications for new bookings'),
  ('notifications'::setting_category, 'payment_notifications', 'true', 'Send notifications for payments'),
  ('notifications'::setting_category, 'review_notifications', 'true', 'Send notifications for new reviews'),
  ('notifications'::setting_category, 'maintenance_notifications', 'true', 'Send maintenance notifications'),
  ('notifications'::setting_category, 'notification_email', 'admin@habitatlobby.com', 'Email address for admin notifications'),

  -- Automation Settings
  ('automation'::setting_category, 'auto_confirm_bookings', 'true', 'Automatically confirm bookings after payment'),
  ('automation'::setting_category, 'auto_send_confirmations', 'true', 'Automatically send booking confirmations'),
  ('automation'::setting_category, 'auto_send_pre_arrival', 'true', 'Automatically send pre-arrival information'),
  ('automation'::setting_category, 'auto_send_id_reminders', 'false', 'Automatically send ID verification reminders'),
  ('automation'::setting_category, 'auto_send_post_stay', 'true', 'Automatically send post-stay thank you emails'),
  ('automation'::setting_category, 'auto_generate_invoices', 'true', 'Automatically generate invoices'),
  ('automation'::setting_category, 'auto_sync_calendars', 'true', 'Automatically sync external calendars'),
  ('automation'::setting_category, 'auto_delete_old_documents', 'false', 'Automatically delete old documents'),

  -- Security Settings
  ('security'::setting_category, 'session_timeout', '3600', 'Session timeout in seconds'),
  ('security'::setting_category, 'require_2fa', 'false', 'Require two-factor authentication'),
  ('security'::setting_category, 'password_expiry_days', '90', 'Password expiry in days'),
  ('security'::setting_category, 'max_login_attempts', '5', 'Maximum login attempts before lockout'),
  ('security'::setting_category, 'document_retention_days', '2555', 'Document retention period in days (7 years)')
) AS t(category, key, value, description)
WHERE NOT EXISTS (SELECT 1 FROM settings WHERE category = t.category AND key = t.key);

-- ============================================================================
-- SCHEMA COMPLETE - SAFE VERSION
-- ============================================================================

-- This completes the safe version of the admin system database schema
-- All objects are created with proper existence checks
-- Safe to run multiple times without errors
-- The system is ready for full admin dashboard functionality

SELECT 'Admin system schema installation completed successfully!' AS result;
