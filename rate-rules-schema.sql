-- Rate Rules & Dynamic Pricing Schema
-- Run this in Supabase SQL Editor to create rate rules tables

-- Create modifier type enum
CREATE TYPE modifier_type AS ENUM (
  'percentage',
  'fixed_amount',
  'absolute_price'
);

-- Create rule type enum
CREATE TYPE rule_type AS ENUM (
  'seasonal',
  'weekend',
  'holiday',
  'minimum_stay',
  'advance_booking',
  'last_minute',
  'custom'
);

-- Create rate_rules table
CREATE TABLE IF NOT EXISTS rate_rules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  rule_type rule_type NOT NULL,
  start_date DATE,
  end_date DATE,
  days_of_week INTEGER[], -- Array of day numbers (0=Sunday, 1=Monday, etc.)
  price_modifier DECIMAL(10,2) NOT NULL,
  modifier_type modifier_type NOT NULL DEFAULT 'percentage',
  min_nights INTEGER,
  max_nights INTEGER,
  advance_booking_days INTEGER, -- For advance booking rules
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 0, -- Higher priority rules apply first
  conditions JSONB DEFAULT '{}', -- Additional conditions
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
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure no overlapping blackout dates for same property
  CONSTRAINT no_overlap_blackout EXCLUDE USING gist (
    property_id WITH =,
    daterange(start_date, end_date, '[]') WITH &&
  ) WHERE (is_active = true)
);

-- Create seasonal_rates table (for complex seasonal pricing)
CREATE TABLE IF NOT EXISTS seasonal_rates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  base_price INTEGER NOT NULL, -- Price in cents
  weekend_multiplier DECIMAL(3,2) DEFAULT 1.0,
  min_nights INTEGER DEFAULT 1,
  max_nights INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pricing_cache table (for performance)
CREATE TABLE IF NOT EXISTS pricing_cache (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  nights INTEGER NOT NULL,
  base_price INTEGER NOT NULL, -- Price in cents
  total_price INTEGER NOT NULL, -- Price in cents after all rules
  applied_rules JSONB DEFAULT '[]', -- Array of applied rule IDs and details
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 hour'),
  
  -- Unique constraint for caching
  UNIQUE(property_id, check_in_date, check_out_date)
);

-- Create indexes for better performance
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

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_rate_rules_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_rate_rules_updated_at
  BEFORE UPDATE ON rate_rules
  FOR EACH ROW
  EXECUTE FUNCTION update_rate_rules_updated_at();

CREATE TRIGGER trigger_blackout_dates_updated_at
  BEFORE UPDATE ON blackout_dates
  FOR EACH ROW
  EXECUTE FUNCTION update_rate_rules_updated_at();

CREATE TRIGGER trigger_seasonal_rates_updated_at
  BEFORE UPDATE ON seasonal_rates
  FOR EACH ROW
  EXECUTE FUNCTION update_rate_rules_updated_at();

-- Create function to clean expired pricing cache
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

-- Create function to calculate dynamic pricing
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
  -- Calculate number of nights
  v_nights := p_check_out - p_check_in;
  
  -- Get base price from property
  SELECT properties.base_price INTO v_base_price
  FROM properties 
  WHERE id = p_property_id;
  
  IF v_base_price IS NULL THEN
    RAISE EXCEPTION 'Property not found or no base price set';
  END IF;
  
  v_total_price := v_base_price * v_nights;
  
  -- Apply rate rules in priority order
  FOR rule_record IN 
    SELECT * FROM rate_rules 
    WHERE property_id = p_property_id 
      AND is_active = true
      AND (start_date IS NULL OR start_date <= p_check_in)
      AND (end_date IS NULL OR end_date >= p_check_out)
    ORDER BY priority DESC, created_at ASC
  LOOP
    -- Check if rule applies to these dates
    IF rule_record.rule_type = 'weekend' THEN
      -- Check if any nights fall on weekend
      IF EXISTS (
        SELECT 1 FROM generate_series(p_check_in, p_check_out - 1, '1 day'::interval) AS date_series
        WHERE EXTRACT(DOW FROM date_series) IN (0, 6) -- Sunday = 0, Saturday = 6
      ) THEN
        -- Apply weekend rule
        IF rule_record.modifier_type = 'percentage' THEN
          modifier_amount := v_total_price * (rule_record.price_modifier / 100);
        ELSIF rule_record.modifier_type = 'fixed_amount' THEN
          modifier_amount := rule_record.price_modifier * 100; -- Convert to cents
        ELSE -- absolute_price
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
    
    -- Add more rule type checks here (seasonal, holiday, etc.)
  END LOOP;
  
  -- Ensure minimum price
  IF v_total_price < v_base_price * v_nights * 0.5 THEN
    v_total_price := ROUND(v_base_price * v_nights * 0.5);
  END IF;
  
  RETURN QUERY SELECT v_base_price, v_total_price::INTEGER, v_applied_rules;
END;
$$ LANGUAGE plpgsql;

-- Enable RLS (Row Level Security)
ALTER TABLE rate_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE blackout_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE seasonal_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_cache ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow all operations for authenticated users)
CREATE POLICY "Allow all operations for authenticated users" ON rate_rules
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON blackout_dates
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON seasonal_rates
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON pricing_cache
  FOR ALL USING (auth.role() = 'authenticated');

-- Grant permissions
GRANT ALL ON rate_rules TO authenticated;
GRANT ALL ON blackout_dates TO authenticated;
GRANT ALL ON seasonal_rates TO authenticated;
GRANT ALL ON pricing_cache TO authenticated;
GRANT USAGE ON SEQUENCE rate_rules_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE blackout_dates_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE seasonal_rates_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE pricing_cache_id_seq TO authenticated;

-- Insert sample rate rules
INSERT INTO rate_rules (name, description, property_id, rule_type, price_modifier, modifier_type, is_active) VALUES
(
  'Weekend Premium',
  'Higher rates for Friday and Saturday nights',
  (SELECT id FROM properties LIMIT 1),
  'weekend',
  25.0,
  'percentage',
  true
),
(
  'Summer Season',
  'Higher rates during summer months',
  (SELECT id FROM properties LIMIT 1),
  'seasonal',
  30.0,
  'percentage',
  true
);

-- Insert sample blackout dates
INSERT INTO blackout_dates (property_id, start_date, end_date, reason, description, is_active) VALUES
(
  (SELECT id FROM properties LIMIT 1),
  '2024-12-24',
  '2024-12-26',
  'Christmas Holiday',
  'Property unavailable during Christmas',
  true
),
(
  (SELECT id FROM properties LIMIT 1),
  '2024-12-31',
  '2025-01-02',
  'New Year Holiday',
  'Property unavailable during New Year',
  true
);
