-- RATE RULES AND BLACKOUT DATES SCHEMA
-- Run this in Supabase SQL Editor to add rate management tables

-- Create rate_rules table
CREATE TABLE IF NOT EXISTS rate_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    rule_type VARCHAR(50) NOT NULL, -- 'seasonal', 'weekly', 'monthly', 'occupancy', 'advance_booking'
    start_date DATE,
    end_date DATE,
    days_of_week INTEGER[], -- Array of 0-6 (Sunday-Saturday)
    min_nights INTEGER DEFAULT 1,
    max_nights INTEGER DEFAULT 30,
    min_advance_days INTEGER DEFAULT 0,
    max_advance_days INTEGER DEFAULT 365,
    price_adjustment_type VARCHAR(20) NOT NULL, -- 'percentage' or 'fixed_amount'
    price_adjustment DECIMAL(10,2) NOT NULL, -- Percentage (e.g., 20.00 for 20%) or fixed amount in euros
    active BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 1, -- Lower number = higher priority
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blackout_dates table
CREATE TABLE IF NOT EXISTS blackout_dates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_date_range CHECK (end_date >= start_date)
);

-- Create availability_overrides table for custom pricing on specific dates
CREATE TABLE IF NOT EXISTS availability_overrides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    available BOOLEAN DEFAULT true,
    custom_price INTEGER, -- Price in cents, NULL means use calculated price
    min_nights INTEGER DEFAULT 1,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(property_id, date)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_rate_rules_property_id ON rate_rules(property_id);
CREATE INDEX IF NOT EXISTS idx_rate_rules_dates ON rate_rules(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_rate_rules_active ON rate_rules(active);
CREATE INDEX IF NOT EXISTS idx_rate_rules_priority ON rate_rules(priority);

CREATE INDEX IF NOT EXISTS idx_blackout_dates_property_id ON blackout_dates(property_id);
CREATE INDEX IF NOT EXISTS idx_blackout_dates_range ON blackout_dates(start_date, end_date);

CREATE INDEX IF NOT EXISTS idx_availability_overrides_property_date ON availability_overrides(property_id, date);
CREATE INDEX IF NOT EXISTS idx_availability_overrides_available ON availability_overrides(available);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
DROP TRIGGER IF EXISTS update_rate_rules_updated_at ON rate_rules;
CREATE TRIGGER update_rate_rules_updated_at
    BEFORE UPDATE ON rate_rules
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_blackout_dates_updated_at ON blackout_dates;
CREATE TRIGGER update_blackout_dates_updated_at
    BEFORE UPDATE ON blackout_dates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_availability_overrides_updated_at ON availability_overrides;
CREATE TRIGGER update_availability_overrides_updated_at
    BEFORE UPDATE ON availability_overrides
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample rate rules for testing
INSERT INTO rate_rules (property_id, name, rule_type, start_date, end_date, price_adjustment_type, price_adjustment, priority)
SELECT 
    p.id,
    'Summer Season Premium',
    'seasonal',
    '2024-06-01',
    '2024-08-31',
    'percentage',
    25.00, -- 25% increase
    1
FROM properties p
WHERE p.city = 'Trikala'
LIMIT 1;

INSERT INTO rate_rules (property_id, name, rule_type, days_of_week, price_adjustment_type, price_adjustment, priority)
SELECT 
    p.id,
    'Weekend Premium',
    'weekly',
    ARRAY[5, 6], -- Friday, Saturday
    'percentage',
    15.00, -- 15% increase
    2
FROM properties p
WHERE p.city = 'Trikala'
LIMIT 1;

-- Insert sample blackout dates
INSERT INTO blackout_dates (property_id, start_date, end_date, reason)
SELECT 
    p.id,
    '2024-12-24',
    '2024-12-26',
    'Christmas Holiday - Property Maintenance'
FROM properties p
WHERE p.city = 'Trikala'
LIMIT 1;

-- Verify the data
SELECT 'Rate Rules' as table_name, COUNT(*) as count FROM rate_rules
UNION ALL
SELECT 'Blackout Dates' as table_name, COUNT(*) as count FROM blackout_dates
UNION ALL
SELECT 'Availability Overrides' as table_name, COUNT(*) as count FROM availability_overrides;
