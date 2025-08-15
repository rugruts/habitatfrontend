-- MIGRATE STATIC APARTMENTS DATA TO DATABASE
-- Run this in Supabase SQL Editor to add the 2 apartments to the properties table

-- First, let's check if properties already exist
SELECT COUNT(*) as existing_properties FROM properties;

-- Insert the 2 apartments from the static data
INSERT INTO properties (
    name, 
    description, 
    city, 
    country, 
    address, 
    max_guests, 
    bedrooms, 
    bathrooms, 
    base_price, 
    currency, 
    amenities, 
    active
) VALUES 
-- Apartment 1 (River Loft)
(
    'River Loft Apartment',
    'Beautiful modern apartment overlooking the Lithaios River in the heart of Trikala. Perfect for couples and small families with stunning river views and modern amenities.',
    'Trikala',
    'Greece',
    'Alexandrias 69, Trikala 42100, Greece',
    4,
    2,
    1,
    9500, -- €95 per night (from static data: pricePerNight: 95)
    'EUR',
    '{"wifi", "ac", "kitchen", "balcony"}', -- From static amenities
    true
),
-- Apartment 2 (Garden Suite)  
(
    'Garden Suite',
    'Spacious suite with private garden, perfect for families. Quiet location with easy access to Trikala center and all major attractions.',
    'Trikala',
    'Greece',
    'Karditsis 23, Trikala 42100, Greece',
    6,
    3,
    2,
    12000, -- €120 per night (from static data: pricePerNight: 120)
    'EUR',
    '{"wifi", "ac", "kitchen", "elevator", "balcony"}', -- From static amenities
    true
)
ON CONFLICT DO NOTHING; -- Prevent duplicates if already exists

-- Verify the data was inserted
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
SELECT COUNT(*) as total_properties FROM properties WHERE active = true;

-- Show the amenities in a readable format
SELECT 
    name,
    amenities,
    array_length(string_to_array(trim(both '{}' from amenities::text), ','), 1) as amenity_count
FROM properties;
