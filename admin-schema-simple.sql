-- SIMPLIFIED ADMIN SYSTEM DATABASE SCHEMA
-- This version uses simple data types to avoid enum and reference issues
-- Run this in Supabase SQL Editor

-- ============================================================================
-- 1. EMAIL TEMPLATES SYSTEM (SIMPLIFIED)
-- ============================================================================

-- Create email templates table with simple types
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

-- Create email logs table with simple types
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID,
  recipient_email VARCHAR(255) NOT NULL,
  recipient_name VARCHAR(255),
  subject VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'sent',
  booking_id UUID,
  guest_id UUID,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 2. CALENDAR SYNC SYSTEM (SIMPLIFIED)
-- ============================================================================

-- Create calendar_syncs table
CREATE TABLE IF NOT EXISTS calendar_syncs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  property_id UUID,
  platform VARCHAR(50) NOT NULL DEFAULT 'custom',
  sync_type VARCHAR(20) NOT NULL DEFAULT 'import',
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
  calendar_sync_id UUID,
  sync_type VARCHAR(20) NOT NULL DEFAULT 'import',
  status VARCHAR(20) NOT NULL DEFAULT 'success',
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
  calendar_sync_id UUID,
  external_id VARCHAR(255),
  property_id UUID,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  guest_name VARCHAR(255),
  guest_email VARCHAR(255),
  guest_count INTEGER DEFAULT 1,
  status VARCHAR(50) DEFAULT 'confirmed',
  platform VARCHAR(50) NOT NULL DEFAULT 'custom',
  raw_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 3. RATE RULES & DYNAMIC PRICING SYSTEM (SIMPLIFIED)
-- ============================================================================

-- Create rate_rules table
CREATE TABLE IF NOT EXISTS rate_rules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  property_id UUID,
  rule_type VARCHAR(50) NOT NULL DEFAULT 'custom',
  start_date DATE,
  end_date DATE,
  days_of_week INTEGER[],
  price_modifier DECIMAL(10,2) NOT NULL,
  modifier_type VARCHAR(20) NOT NULL DEFAULT 'percentage',
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
  property_id UUID,
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
  property_id UUID,
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

-- ============================================================================
-- 4. SETTINGS MANAGEMENT SYSTEM (SIMPLIFIED)
-- ============================================================================

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category VARCHAR(50) NOT NULL,
  key VARCHAR(255) NOT NULL,
  value TEXT,
  encrypted BOOLEAN DEFAULT false,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(category, key)
);

-- Create settings_history table
CREATE TABLE IF NOT EXISTS settings_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_id UUID,
  old_value TEXT,
  new_value TEXT,
  changed_by UUID,
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  change_reason TEXT
);

-- ============================================================================
-- 5. INDEXES FOR PERFORMANCE (AFTER TABLE CREATION)
-- ============================================================================

-- Create indexes only after verifying columns exist
DO $$ BEGIN
    -- Email Templates Indexes (check column exists first)
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'email_templates' AND column_name = 'type') THEN
        CREATE INDEX IF NOT EXISTS idx_email_templates_type ON email_templates(type);
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'email_templates' AND column_name = 'is_active') THEN
        CREATE INDEX IF NOT EXISTS idx_email_templates_active ON email_templates(is_active);
    END IF;

    -- Email Logs Indexes
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'email_logs' AND column_name = 'recipient_email') THEN
        CREATE INDEX IF NOT EXISTS idx_email_logs_recipient ON email_logs(recipient_email);
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'email_logs' AND column_name = 'status') THEN
        CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
    END IF;
END $$;

DO $$ BEGIN
    -- Calendar Sync Indexes (check columns exist)
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'calendar_syncs' AND column_name = 'property_id') THEN
        CREATE INDEX IF NOT EXISTS idx_calendar_syncs_property ON calendar_syncs(property_id);
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'calendar_syncs' AND column_name = 'is_active') THEN
        CREATE INDEX IF NOT EXISTS idx_calendar_syncs_active ON calendar_syncs(is_active);
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'external_bookings' AND column_name = 'property_id') THEN
        CREATE INDEX IF NOT EXISTS idx_external_bookings_property ON external_bookings(property_id);
    END IF;

    -- Rate Rules Indexes (check columns exist)
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'rate_rules' AND column_name = 'property_id') THEN
        CREATE INDEX IF NOT EXISTS idx_rate_rules_property ON rate_rules(property_id);
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'rate_rules' AND column_name = 'is_active') THEN
        CREATE INDEX IF NOT EXISTS idx_rate_rules_active ON rate_rules(is_active);
    END IF;

    -- Settings Indexes (check columns exist)
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'settings' AND column_name = 'category') THEN
        CREATE INDEX IF NOT EXISTS idx_settings_category ON settings(category);
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'settings' AND column_name = 'key') THEN
        CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);
    END IF;
END $$;

-- ============================================================================
-- 6. SIMPLE CONSTRAINTS (AFTER TABLE VERIFICATION)
-- ============================================================================

DO $$ BEGIN
    -- Simple unique constraints for overlap prevention
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'external_bookings') THEN
        CREATE UNIQUE INDEX IF NOT EXISTS idx_external_bookings_no_overlap
        ON external_bookings (property_id, start_date, end_date)
        WHERE (status != 'cancelled');
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'blackout_dates') THEN
        CREATE UNIQUE INDEX IF NOT EXISTS idx_blackout_dates_no_overlap
        ON blackout_dates (property_id, start_date, end_date)
        WHERE (is_active = true);
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'pricing_cache') THEN
        CREATE UNIQUE INDEX IF NOT EXISTS idx_pricing_cache_unique
        ON pricing_cache (property_id, check_in_date, check_out_date);
    END IF;
END $$;

-- ============================================================================
-- 7. AVAILABILITY FUNCTIONS (INCLUDING BLACKOUT DATES)
-- ============================================================================

-- Enhanced availability check function that includes blackout dates
CREATE OR REPLACE FUNCTION check_property_availability(
  property_uuid UUID,
  check_in_date DATE,
  check_out_date DATE
) RETURNS BOOLEAN AS $$
DECLARE
  booking_conflict INTEGER;
  blackout_conflict INTEGER;
  external_booking_conflict INTEGER;
BEGIN
  -- Check for confirmed booking conflicts
  SELECT COUNT(*) INTO booking_conflict
  FROM bookings
  WHERE property_id = property_uuid
  AND status = 'confirmed'
  AND (
    (check_in_date >= check_in AND check_in_date < check_out)
    OR (check_out_date > check_in AND check_out_date <= check_out)
    OR (check_in_date <= check_in AND check_out_date >= check_out)
  );

  -- Check for active blackout dates
  SELECT COUNT(*) INTO blackout_conflict
  FROM blackout_dates
  WHERE property_id = property_uuid
  AND is_active = true
  AND (
    (check_in_date >= start_date AND check_in_date <= end_date)
    OR (check_out_date > start_date AND check_out_date <= end_date)
    OR (check_in_date <= start_date AND check_out_date >= end_date)
  );

  -- Check for external booking conflicts (from calendar sync)
  SELECT COUNT(*) INTO external_booking_conflict
  FROM external_bookings
  WHERE property_id = property_uuid
  AND status != 'cancelled'
  AND (
    (check_in_date >= start_date AND check_in_date < end_date)
    OR (check_out_date > start_date AND check_out_date <= end_date)
    OR (check_in_date <= start_date AND check_out_date >= end_date)
  );

  RETURN (booking_conflict = 0 AND blackout_conflict = 0 AND external_booking_conflict = 0);
END;
$$ LANGUAGE plpgsql;

-- Update setting function
CREATE OR REPLACE FUNCTION update_setting(
  p_category VARCHAR(50),
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
-- 8. ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS on all tables
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

-- Create simple RLS policies
DO $$ BEGIN
    CREATE POLICY "Allow all for authenticated users" ON email_templates FOR ALL USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Allow all for authenticated users" ON email_logs FOR ALL USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Allow all for authenticated users" ON calendar_syncs FOR ALL USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Allow all for authenticated users" ON calendar_sync_logs FOR ALL USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Allow all for authenticated users" ON external_bookings FOR ALL USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Allow all for authenticated users" ON rate_rules FOR ALL USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Allow all for authenticated users" ON blackout_dates FOR ALL USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Allow all for authenticated users" ON seasonal_rates FOR ALL USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Allow all for authenticated users" ON pricing_cache FOR ALL USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Allow all for authenticated users" ON settings FOR ALL USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Allow all for authenticated users" ON settings_history FOR ALL USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ============================================================================
-- 9. GRANT PERMISSIONS
-- ============================================================================

-- Grant all permissions to authenticated users
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- ============================================================================
-- 10. DEFAULT DATA
-- ============================================================================

-- Insert default email templates (handle existing table structure)
DO $$ BEGIN
    -- Check if template_type column exists (from existing schema)
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'email_templates' AND column_name = 'template_type') THEN
        INSERT INTO email_templates (name, subject, content, template_type, variables)
        SELECT * FROM (VALUES
          (
            'Booking Confirmation',
            'Your booking at {{property_name}} is confirmed! 🏠',
            'Dear {{guest_name}},

Thank you for choosing Habitat Lobby! We are excited to confirm your booking.

📋 BOOKING DETAILS:
• Property: {{property_name}}
• Check-in: {{check_in_date}} at 3:00 PM
• Check-out: {{check_out_date}} at 11:00 AM
• Guests: {{guests_count}}
• Booking ID: {{booking_id}}
• Total Amount: €{{total_amount}}

We look forward to hosting you!

Best regards,
Habitat Lobby Team',
            'booking_confirmation',
            ARRAY['guest_name', 'property_name', 'check_in_date', 'check_out_date', 'guests_count', 'booking_id', 'total_amount']
          ),
          (
            'Pre-Arrival Information',
            'Your stay at {{property_name}} is tomorrow! 🗝️',
            'Dear {{guest_name}},

Your stay at {{property_name}} begins tomorrow! Here is everything you need to know:

🗝️ CHECK-IN INFORMATION:
• Time: 3:00 PM onwards
• Address: {{property_address}}

We look forward to welcoming you!

Best regards,
Habitat Lobby Team',
            'pre_arrival',
            ARRAY['guest_name', 'property_name', 'property_address']
          )
        ) AS t(name, subject, content, template_type, variables)
        WHERE NOT EXISTS (SELECT 1 FROM email_templates WHERE template_type = t.template_type);
    -- Check if type column exists (from new schema)
    ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'email_templates' AND column_name = 'type') THEN
        INSERT INTO email_templates (name, subject, content, type, variables)
        SELECT * FROM (VALUES
          (
            'Booking Confirmation',
            'Your booking at {{property_name}} is confirmed! 🏠',
            'Dear {{guest_name}},

Thank you for choosing Habitat Lobby! We are excited to confirm your booking.

We look forward to hosting you!

Best regards,
Habitat Lobby Team',
            'booking_confirmation',
            ARRAY['guest_name', 'property_name']
          )
        ) AS t(name, subject, content, type, variables)
        WHERE NOT EXISTS (SELECT 1 FROM email_templates WHERE type = t.type);
    ELSE
        -- Insert minimal data if no type column exists
        INSERT INTO email_templates (name, subject, content)
        SELECT * FROM (VALUES
          (
            'Booking Confirmation',
            'Your booking at {{property_name}} is confirmed! 🏠',
            'Dear {{guest_name}}, Thank you for choosing Habitat Lobby!'
          )
        ) AS t(name, subject, content)
        WHERE NOT EXISTS (SELECT 1 FROM email_templates WHERE name = t.name);
    END IF;
END $$;

-- Insert default settings (only if table exists)
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'settings') THEN
        INSERT INTO settings (category, key, value, description)
        SELECT * FROM (VALUES
          ('business', 'business_name', 'Habitat Lobby', 'Business name'),
          ('business', 'business_email', 'info@habitatlobby.com', 'Business email'),
          ('business', 'currency', 'EUR', 'Default currency'),
          ('business', 'timezone', 'Europe/Athens', 'Business timezone'),
          ('notifications', 'email_notifications', 'true', 'Enable email notifications'),
          ('notifications', 'booking_notifications', 'true', 'Send booking notifications'),
          ('automation', 'auto_confirm_bookings', 'true', 'Auto confirm bookings'),
          ('automation', 'auto_send_confirmations', 'true', 'Auto send confirmations'),
          ('security', 'session_timeout', '3600', 'Session timeout in seconds')
        ) AS t(category, key, value, description)
        WHERE NOT EXISTS (SELECT 1 FROM settings WHERE category = t.category AND key = t.key);
    END IF;
END $$;

-- ============================================================================
-- SCHEMA COMPLETE
-- ============================================================================

SELECT 'Simplified admin system schema installation completed successfully!' AS result;
