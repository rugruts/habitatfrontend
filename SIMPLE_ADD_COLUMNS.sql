-- SIMPLE VERSION: Add missing columns to properties table
-- Run this first if you get any errors with the main script

-- Add missing columns one by one
ALTER TABLE properties ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS size_sqm INTEGER;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS cleaning_fee INTEGER DEFAULT 0;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS security_deposit INTEGER DEFAULT 0;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS min_nights INTEGER DEFAULT 1;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS max_nights INTEGER DEFAULT 30;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS check_in_time TEXT DEFAULT '15:00';
ALTER TABLE properties ADD COLUMN IF NOT EXISTS check_out_time TEXT DEFAULT '11:00';
ALTER TABLE properties ADD COLUMN IF NOT EXISTS about_space TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS the_space TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS location_neighborhood TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS house_rules TEXT;

-- Verify columns were added
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'properties' 
AND column_name IN ('slug', 'size_sqm', 'cleaning_fee', 'security_deposit', 'min_nights', 'max_nights', 'check_in_time', 'check_out_time', 'about_space', 'the_space', 'location_neighborhood', 'house_rules')
ORDER BY column_name;
