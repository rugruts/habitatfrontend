-- CORRECTED PROPERTIES DATA FOR TRIKALA
-- This matches the actual database schema (no slug column)
-- Run this in your Supabase SQL Editor

-- Insert sample properties for Habitat Lobby in Trikala
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
(
    'Appartment 1 - with View',
    'Beautiful modern apartment overlooking the Lithaios River in the heart of Trikala. Perfect for couples and small families.',
    'Trikala',
    'Greece',
    'Alexandrias 69, Trikala 42100, Greece',
    4,
    2,
    1,
    9500, -- €95 per night
    'EUR',
    '{"WiFi", "Air Conditioning", "Kitchen", "River View", "Balcony", "Parking"}',
    true
),
(
    'Central Studio',
    'Cozy studio apartment in the center of Trikala, walking distance to all attractions and restaurants.',
    'Trikala',
    'Greece',
    'Asklipiou 15, Trikala 42100, Greece',
    2,
    1,
    1,
    7500, -- €75 per night
    'EUR',
    '{"WiFi", "Air Conditioning", "Kitchenette", "City Center", "Balcony"}',
    true
),
(
    'Garden Suite',
    'Spacious suite with private garden, perfect for families. Quiet location with easy access to Trikala center.',
    'Trikala',
    'Greece',
    'Karditsis 23, Trikala 42100, Greece',
    6,
    3,
    2,
    12000, -- €120 per night
    'EUR',
    '{"WiFi", "Air Conditioning", "Full Kitchen", "Private Garden", "Parking", "BBQ", "Family Friendly"}',
    true
);

-- Verify the data was inserted
SELECT 
    id,
    name, 
    city, 
    max_guests, 
    base_price / 100 as price_euros,
    active 
FROM properties 
WHERE city = 'Trikala' 
ORDER BY name;

-- Check total count
SELECT COUNT(*) as total_properties FROM properties WHERE active = true;
