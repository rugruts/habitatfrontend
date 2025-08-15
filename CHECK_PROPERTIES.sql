-- CHECK PROPERTIES IN DATABASE
-- Run this in Supabase SQL Editor to see what properties exist

-- Check if properties table exists and what data is in it
SELECT 
    id,
    name,
    city,
    max_guests,
    base_price / 100 as price_euros,
    amenities,
    active,
    created_at
FROM properties 
ORDER BY created_at DESC;

-- Check total count
SELECT COUNT(*) as total_properties FROM properties;

-- Check active properties only
SELECT COUNT(*) as active_properties FROM properties WHERE active = true;

-- Check the structure of the properties table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'properties' 
ORDER BY ordinal_position;
