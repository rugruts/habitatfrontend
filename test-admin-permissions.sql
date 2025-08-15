-- Test admin permissions for admin@habitat.com
-- Run this in Supabase SQL Editor while logged in as admin@habitat.com

-- Check if can_access_admin function exists
SELECT EXISTS (
    SELECT 1 FROM pg_proc 
    WHERE proname = 'can_access_admin'
) as function_exists;

-- Check current user info
SELECT 
    auth.uid() as user_id,
    auth.email() as user_email,
    auth.role() as user_role;

-- Test the can_access_admin function if it exists
SELECT can_access_admin() as is_admin;

-- Check if user exists in auth.users
SELECT 
    id,
    email,
    raw_user_meta_data,
    raw_app_meta_data
FROM auth.users 
WHERE email = 'admin@habitat.com';

-- Test booking permissions directly
SELECT 
    'Can select bookings' as test,
    COUNT(*) as booking_count
FROM bookings;

-- Test if we can update a booking (dry run)
SELECT 
    id,
    customer_name,
    status
FROM bookings 
LIMIT 1;
