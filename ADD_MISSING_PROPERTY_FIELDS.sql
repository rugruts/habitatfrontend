-- ADD MISSING PROPERTY FIELDS
-- Run this in your Supabase SQL Editor to add missing columns

-- Add missing columns to properties table
ALTER TABLE properties
ADD COLUMN IF NOT EXISTS slug TEXT,
ADD COLUMN IF NOT EXISTS size_sqm INTEGER,
ADD COLUMN IF NOT EXISTS cleaning_fee INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS security_deposit INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS min_nights INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS max_nights INTEGER DEFAULT 30,
ADD COLUMN IF NOT EXISTS check_in_time TEXT DEFAULT '15:00',
ADD COLUMN IF NOT EXISTS check_out_time TEXT DEFAULT '11:00',
ADD COLUMN IF NOT EXISTS about_space TEXT,
ADD COLUMN IF NOT EXISTS the_space TEXT,
ADD COLUMN IF NOT EXISTS location_neighborhood TEXT,
ADD COLUMN IF NOT EXISTS house_rules TEXT;

-- Update existing properties with default values where NULL
UPDATE properties SET slug = LOWER(REPLACE(name, ' ', '-')) WHERE slug IS NULL;
UPDATE properties SET size_sqm = 50 WHERE size_sqm IS NULL;
UPDATE properties SET cleaning_fee = 2500 WHERE cleaning_fee IS NULL OR cleaning_fee = 0;
UPDATE properties SET security_deposit = 10000 WHERE security_deposit IS NULL OR security_deposit = 0;
UPDATE properties SET min_nights = 2 WHERE min_nights IS NULL OR min_nights = 0;
UPDATE properties SET max_nights = 30 WHERE max_nights IS NULL OR max_nights = 0;
UPDATE properties SET check_in_time = '15:00' WHERE check_in_time IS NULL;
UPDATE properties SET check_out_time = '11:00' WHERE check_out_time IS NULL;
UPDATE properties SET about_space = 'This thoughtfully designed space captures the essence of modern living. Floor-to-ceiling windows frame beautiful views, while carefully curated furnishings create a sense of calm sophistication.' WHERE about_space IS NULL;
UPDATE properties SET the_space = 'The apartment features a comfortable living area, fully equipped kitchen, and modern amenities to ensure a pleasant stay.' WHERE the_space IS NULL;
UPDATE properties SET location_neighborhood = 'Located in a vibrant neighborhood with easy access to local attractions, restaurants, and public transportation.' WHERE location_neighborhood IS NULL;
UPDATE properties SET house_rules = 'No smoking • No parties or events • Check-in after 15:00 • Check-out before 11:00 • Quiet hours 22:00-08:00' WHERE house_rules IS NULL;

-- Verify the changes
SELECT
  id,
  name,
  slug,
  size_sqm,
  cleaning_fee,
  security_deposit,
  min_nights,
  max_nights,
  check_in_time,
  check_out_time,
  LENGTH(about_space) as about_space_length,
  LENGTH(the_space) as the_space_length,
  LENGTH(location_neighborhood) as location_neighborhood_length,
  LENGTH(house_rules) as house_rules_length
FROM properties
LIMIT 5;
