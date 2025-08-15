-- Create Guest Records from Existing Bookings
-- This script will create guest records for all existing bookings that don't have corresponding guests

-- First, let's see what bookings exist
SELECT 
    customer_name,
    customer_email,
    customer_phone,
    COUNT(*) as booking_count,
    SUM(total_amount) as total_spent_cents,
    MIN(created_at) as first_booking,
    MAX(created_at) as last_booking
FROM bookings 
GROUP BY customer_name, customer_email, customer_phone
ORDER BY booking_count DESC;

-- Check which booking customers don't have guest records yet
SELECT DISTINCT
    b.customer_name,
    b.customer_email,
    b.customer_phone
FROM bookings b
LEFT JOIN guests g ON b.customer_email = g.email
WHERE g.email IS NULL;

-- Create guest records for all booking customers who don't have guest records yet
INSERT INTO guests (
    first_name,
    last_name,
    email,
    phone,
    total_bookings,
    total_spent,
    vip_status,
    id_verified,
    last_stay_date,
    created_at,
    updated_at
)
SELECT
    -- Split customer_name into first_name and last_name
    CASE
        WHEN position(' ' in b.customer_name) > 0
        THEN substring(b.customer_name from 1 for position(' ' in b.customer_name) - 1)
        ELSE b.customer_name
    END as first_name,

    CASE
        WHEN position(' ' in b.customer_name) > 0
        THEN substring(b.customer_name from position(' ' in b.customer_name) + 1)
        ELSE ''
    END as last_name,

    b.customer_email as email,
    b.customer_phone as phone,
    COUNT(*) as total_bookings,
    SUM(b.total_amount) as total_spent,

    -- Set VIP status for customers with more than 2 bookings or spent more than €1000
    CASE
        WHEN COUNT(*) > 2 OR SUM(b.total_amount) > 100000 THEN true
        ELSE false
    END as vip_status,

    false as id_verified, -- Default to false, will be updated when ID is verified
    MAX(b.check_out) as last_stay_date,
    MIN(b.created_at) as created_at,
    NOW() as updated_at

FROM bookings b
LEFT JOIN guests g ON b.customer_email = g.email
WHERE g.email IS NULL
GROUP BY b.customer_name, b.customer_email, b.customer_phone
ON CONFLICT (email) DO NOTHING;

-- Update existing guests with correct booking counts and spending
UPDATE guests
SET
    total_bookings = booking_stats.booking_count,
    total_spent = booking_stats.total_spent,
    last_stay_date = booking_stats.last_checkout,
    vip_status = CASE
        WHEN booking_stats.booking_count > 2 OR booking_stats.total_spent > 100000 THEN true
        ELSE false
    END,
    updated_at = NOW()
FROM (
    SELECT
        b.customer_email,
        COUNT(*) as booking_count,
        SUM(b.total_amount) as total_spent,
        MAX(b.check_out) as last_checkout
    FROM bookings b
    GROUP BY b.customer_email
) booking_stats
WHERE guests.email = booking_stats.customer_email;

-- Verify the results
SELECT 
    'Guests created/updated from bookings' as status,
    COUNT(*) as total_guests
FROM guests;

-- Show the guests with their booking statistics
SELECT 
    g.first_name,
    g.last_name,
    g.email,
    g.phone,
    g.total_bookings,
    g.total_spent / 100.0 as total_spent_euros,
    g.vip_status,
    g.id_verified,
    g.last_stay_date,
    g.created_at
FROM guests g
ORDER BY g.total_spent DESC, g.total_bookings DESC;

-- Show booking customers vs guests comparison
SELECT 
    'Booking customers' as type,
    COUNT(DISTINCT customer_email) as count
FROM bookings
UNION ALL
SELECT 
    'Guest records' as type,
    COUNT(*) as count
FROM guests;
