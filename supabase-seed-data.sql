-- Seed data for Habitat Lobby
-- Run this after the schema to populate with initial property data

-- Insert properties based on existing apartment data
INSERT INTO properties (
    name,
    slug,
    description,
    short_description,
    price_per_night,
    max_guests,
    bedrooms,
    bathrooms,
    size_sqm,
    amenities,
    images,
    location,
    active,
    featured,
    min_nights,
    max_nights
) VALUES
(
    'Test Apartment',
    'test-apartment',
    'This is a test apartment specifically created for payment testing. Book for just €1 per night to verify the Stripe payment integration is working correctly. Perfect for testing the complete booking flow from availability checking to payment processing.',
    'Test apartment for payment verification - €1 per night!',
    1.00,
    2,
    1,
    1,
    45,
    ARRAY['Test Environment', 'Stripe Integration', 'WiFi', 'Air Conditioning'],
    ARRAY[
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
    ],
    '{
        "address": "Test Location, Trikala",
        "city": "Trikala",
        "country": "Greece",
        "coordinates": {
            "lat": 39.5555,
            "lng": 21.7665
        }
    }',
    true,
    true,
    1,
    7
),
(
    'River Loft',
    'river-loft',
    'A stunning riverside apartment with panoramic views of the Litheos River. This modern loft features floor-to-ceiling windows, contemporary furnishings, and a private balcony overlooking the water. Perfect for couples seeking a romantic getaway or solo travelers wanting to experience the tranquil beauty of Trikala.',
    'Stunning riverside loft with panoramic river views and modern amenities',
    85.00,
    2,
    1,
    1,
    45,
    ARRAY['River View', 'WiFi', 'Kitchen', 'Air Conditioning', 'Balcony'],
    ARRAY[
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
    ],
    '{
        "address": "Litheos Riverfront, Trikala",
        "city": "Trikala",
        "country": "Greece",
        "coordinates": {
            "lat": 39.5551,
            "lng": 21.7664
        }
    }',
    true,
    true,
    2,
    14
),
(
    'Garden Studio',
    'apartment-1',
    'A charming ground-floor studio apartment surrounded by lush gardens. This cozy space features a comfortable living area, fully equipped kitchenette, and direct access to a private garden terrace. Ideal for nature lovers and those seeking a peaceful retreat in the heart of Trikala.',
    'Cozy garden studio with private terrace and peaceful surroundings',
    65.00,
    2,
    1,
    1,
    35,
    ARRAY['Garden View', 'WiFi', 'Kitchen', 'Air Conditioning', 'Parking'],
    ARRAY[
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
    ],
    '{
        "address": "Garden District, Trikala",
        "city": "Trikala",
        "country": "Greece",
        "coordinates": {
            "lat": 39.5545,
            "lng": 21.7658
        }
    }',
    true,
    false,
    2,
    14
),
(
    'City Center Apartment',
    'apartment-2',
    'A modern apartment located in the vibrant heart of Trikala. This spacious unit offers easy access to local restaurants, shops, and cultural attractions. Features include a comfortable bedroom, full bathroom, and a well-appointed living area with city views.',
    'Modern city center apartment with easy access to local attractions',
    75.00,
    3,
    1,
    1,
    50,
    ARRAY['City View', 'WiFi', 'Kitchen', 'Air Conditioning', 'Central Location'],
    ARRAY[
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
    ],
    '{
        "address": "Central Square, Trikala",
        "city": "Trikala",
        "country": "Greece",
        "coordinates": {
            "lat": 39.5558,
            "lng": 21.7671
        }
    }',
    true,
    false,
    2,
    14
),
(
    'Historic Quarter Loft',
    'apartment-3',
    'A beautifully restored loft in Trikala''s historic quarter. This unique space combines traditional Greek architecture with modern amenities. Features exposed stone walls, high ceilings, and authentic period details while providing all contemporary comforts.',
    'Restored historic loft combining traditional architecture with modern comfort',
    95.00,
    4,
    2,
    1,
    65,
    ARRAY['Historic Building', 'WiFi', 'Kitchen', 'Air Conditioning', 'Unique Architecture'],
    ARRAY[
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
    ],
    '{
        "address": "Historic Quarter, Trikala",
        "city": "Trikala",
        "country": "Greece",
        "coordinates": {
            "lat": 39.5552,
            "lng": 21.7669
        }
    }',
    true,
    true,
    2,
    14
);

-- Insert some sample availability overrides (blocked dates for maintenance, etc.)
INSERT INTO availability_overrides (property_id, date, available, reason) 
SELECT 
    p.id,
    '2025-08-15'::date,
    false,
    'Maintenance scheduled'
FROM properties p WHERE p.slug = 'river-loft';

INSERT INTO availability_overrides (property_id, date, available, reason) 
SELECT 
    p.id,
    '2025-08-16'::date,
    false,
    'Maintenance scheduled'
FROM properties p WHERE p.slug = 'river-loft';

-- Insert some sample bookings for testing
INSERT INTO bookings (
    property_id,
    check_in,
    check_out,
    guests,
    nights,
    customer_name,
    customer_email,
    customer_phone,
    total_amount,
    currency,
    status,
    booking_source
) 
SELECT 
    p.id,
    '2025-08-20'::date,
    '2025-08-23'::date,
    2,
    3,
    'John Doe',
    'john.doe@example.com',
    '+30 123 456 7890',
    255.00,
    'EUR',
    'confirmed',
    'website'
FROM properties p WHERE p.slug = 'river-loft';

INSERT INTO bookings (
    property_id,
    check_in,
    check_out,
    guests,
    nights,
    customer_name,
    customer_email,
    customer_phone,
    total_amount,
    currency,
    status,
    booking_source
) 
SELECT 
    p.id,
    '2025-08-25'::date,
    '2025-08-28'::date,
    2,
    3,
    'Maria Papadopoulos',
    'maria.p@example.com',
    '+30 987 654 3210',
    195.00,
    'EUR',
    'confirmed',
    'website'
FROM properties p WHERE p.slug = 'apartment-1';

-- Insert line items for the sample bookings
INSERT INTO booking_line_items (booking_id, description, amount, quantity, type)
SELECT 
    b.id,
    '3 nights x €85',
    255.00,
    1,
    'accommodation'
FROM bookings b 
JOIN properties p ON b.property_id = p.id 
WHERE p.slug = 'river-loft' AND b.customer_email = 'john.doe@example.com';

INSERT INTO booking_line_items (booking_id, description, amount, quantity, type)
SELECT 
    b.id,
    'Cleaning fee',
    30.00,
    1,
    'cleaning'
FROM bookings b 
JOIN properties p ON b.property_id = p.id 
WHERE p.slug = 'river-loft' AND b.customer_email = 'john.doe@example.com';

INSERT INTO booking_line_items (booking_id, description, amount, quantity, type)
SELECT 
    b.id,
    '3 nights x €65',
    195.00,
    1,
    'accommodation'
FROM bookings b 
JOIN properties p ON b.property_id = p.id 
WHERE p.slug = 'apartment-1' AND b.customer_email = 'maria.p@example.com';

INSERT INTO booking_line_items (booking_id, description, amount, quantity, type)
SELECT 
    b.id,
    'Cleaning fee',
    30.00,
    1,
    'cleaning'
FROM bookings b 
JOIN properties p ON b.property_id = p.id 
WHERE p.slug = 'apartment-1' AND b.customer_email = 'maria.p@example.com';
