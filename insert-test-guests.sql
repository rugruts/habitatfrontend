-- Insert Test Guest Data for Habitat Lobby
-- Run this ONLY if you want to add sample guests for testing

-- Check current guest count
SELECT COUNT(*) as current_guest_count FROM guests;

-- Insert test guests (only if they don't already exist)
INSERT INTO guests (
    first_name, 
    last_name, 
    email, 
    phone, 
    total_bookings, 
    total_spent, 
    vip_status, 
    id_verified,
    nationality,
    created_at,
    updated_at
) VALUES 
(
    'John', 
    'Doe', 
    'john.doe@example.com', 
    '+30 123 456 7890', 
    2, 
    85000, -- €850.00 in cents
    false, 
    true,
    'Greek',
    NOW() - INTERVAL '30 days',
    NOW()
),
(
    'Jane', 
    'Smith', 
    'jane.smith@example.com', 
    '+30 987 654 3210', 
    1, 
    45000, -- €450.00 in cents
    true, 
    false,
    'British',
    NOW() - INTERVAL '15 days',
    NOW()
),
(
    'Maria', 
    'Garcia', 
    'maria.garcia@example.com', 
    '+34 555 123 456', 
    3, 
    125000, -- €1250.00 in cents
    true, 
    true,
    'Spanish',
    NOW() - INTERVAL '45 days',
    NOW()
),
(
    'Andreas', 
    'Müller', 
    'andreas.mueller@example.com', 
    '+49 123 456 789', 
    1, 
    32000, -- €320.00 in cents
    false, 
    true,
    'German',
    NOW() - INTERVAL '7 days',
    NOW()
),
(
    'Sophie', 
    'Dubois', 
    'sophie.dubois@example.com', 
    '+33 987 654 321', 
    4, 
    180000, -- €1800.00 in cents
    true, 
    true,
    'French',
    NOW() - INTERVAL '60 days',
    NOW()
)
ON CONFLICT (email) DO NOTHING;

-- Show results
SELECT 
    'Test guests inserted' as status,
    COUNT(*) as total_guests
FROM guests;

-- Show the test guests
SELECT 
    first_name,
    last_name,
    email,
    phone,
    total_bookings,
    total_spent / 100.0 as total_spent_euros,
    vip_status,
    id_verified,
    nationality,
    created_at
FROM guests
ORDER BY created_at DESC;
