-- UPDATE DEFAULT VALUES for existing properties
-- Run this AFTER adding the columns with SIMPLE_ADD_COLUMNS.sql

-- Update slug for properties that don't have one
UPDATE properties 
SET slug = LOWER(REPLACE(REPLACE(name, ' ', '-'), '--', '-')) 
WHERE slug IS NULL OR slug = '';

-- Update size for properties that don't have one
UPDATE properties 
SET size_sqm = 50 
WHERE size_sqm IS NULL;

-- Update cleaning fee for properties that don't have one
UPDATE properties 
SET cleaning_fee = 2500 
WHERE cleaning_fee IS NULL OR cleaning_fee = 0;

-- Update security deposit for properties that don't have one
UPDATE properties 
SET security_deposit = 10000 
WHERE security_deposit IS NULL OR security_deposit = 0;

-- Update min nights for properties that don't have one
UPDATE properties 
SET min_nights = 2 
WHERE min_nights IS NULL OR min_nights = 0;

-- Update max nights for properties that don't have one
UPDATE properties 
SET max_nights = 30 
WHERE max_nights IS NULL OR max_nights = 0;

-- Update check-in time for properties that don't have one
UPDATE properties 
SET check_in_time = '15:00' 
WHERE check_in_time IS NULL OR check_in_time = '';

-- Update check-out time for properties that don't have one
UPDATE properties 
SET check_out_time = '11:00' 
WHERE check_out_time IS NULL OR check_out_time = '';

-- Update about_space for properties that don't have one
UPDATE properties 
SET about_space = 'This thoughtfully designed space captures the essence of modern living. Floor-to-ceiling windows frame beautiful views, while carefully curated furnishings create a sense of calm sophistication.' 
WHERE about_space IS NULL OR about_space = '';

-- Update the_space for properties that don't have one
UPDATE properties 
SET the_space = 'The apartment features a comfortable living area, fully equipped kitchen, and modern amenities to ensure a pleasant stay.' 
WHERE the_space IS NULL OR the_space = '';

-- Update location_neighborhood for properties that don't have one
UPDATE properties 
SET location_neighborhood = 'Located in a vibrant neighborhood with easy access to local attractions, restaurants, and public transportation.' 
WHERE location_neighborhood IS NULL OR location_neighborhood = '';

-- Update house_rules for properties that don't have one
UPDATE properties 
SET house_rules = 'Essential House Rules:

• No smoking inside the property
• Maximum 4 guests
• Check-in after 15:00
• Check-out before 11:00
• Quiet hours: 22:00 - 08:00
• Please treat the space with respect' 
WHERE house_rules IS NULL OR house_rules = '';

-- Verify the updates
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
  CASE WHEN about_space IS NOT NULL THEN 'Set' ELSE 'NULL' END as about_space_status,
  CASE WHEN the_space IS NOT NULL THEN 'Set' ELSE 'NULL' END as the_space_status,
  CASE WHEN location_neighborhood IS NOT NULL THEN 'Set' ELSE 'NULL' END as location_status,
  CASE WHEN house_rules IS NOT NULL THEN 'Set' ELSE 'NULL' END as rules_status
FROM properties 
LIMIT 5;
