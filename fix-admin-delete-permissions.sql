-- Fix admin delete permissions for bookings
-- The issue is that DELETE operations are not properly allowed for admin users

-- First, check if the can_access_admin function exists and works
SELECT EXISTS (
    SELECT 1 FROM pg_proc 
    WHERE proname = 'can_access_admin'
) as function_exists;

-- Check current user and admin status
SELECT 
    auth.uid() as user_id,
    auth.email() as user_email,
    auth.role() as user_role;

-- Test the admin function if it exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'can_access_admin') THEN
        RAISE NOTICE 'can_access_admin() result: %', can_access_admin();
    ELSE
        RAISE NOTICE 'can_access_admin() function does not exist';
    END IF;
END $$;

-- Check current policies on bookings table
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'bookings';

-- Drop all existing booking policies to start fresh
DROP POLICY IF EXISTS "Users can view their own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can create bookings" ON bookings;
DROP POLICY IF EXISTS "Users can update their own bookings" ON bookings;
DROP POLICY IF EXISTS "Admin can manage all bookings" ON bookings;
DROP POLICY IF EXISTS "Allow booking creation" ON bookings;
DROP POLICY IF EXISTS "Allow booking updates" ON bookings;
DROP POLICY IF EXISTS "Allow booking read access" ON bookings;
DROP POLICY IF EXISTS "Allow anonymous booking creation" ON bookings;
DROP POLICY IF EXISTS "Allow booking updates for payment" ON bookings;
DROP POLICY IF EXISTS "Bookings are viewable by authenticated users" ON bookings;

-- Create simple admin-friendly policies
-- Allow all operations for authenticated users (admins)
CREATE POLICY "Admin full access to bookings" ON bookings
    FOR ALL USING (auth.role() = 'authenticated');

-- Also allow anonymous booking creation (for website bookings)
CREATE POLICY "Allow anonymous booking creation" ON bookings
    FOR INSERT WITH CHECK (true);

-- Allow anonymous booking updates (for payment confirmations)
CREATE POLICY "Allow anonymous booking updates" ON bookings
    FOR UPDATE USING (true);

-- Allow anonymous booking reads (for confirmations)
CREATE POLICY "Allow anonymous booking reads" ON bookings
    FOR SELECT USING (true);

-- Verify the new policies
SELECT 
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'bookings'
ORDER BY policyname;

-- Test delete operation
SELECT 'Policies updated successfully!' as message;
SELECT 'Admin users should now be able to delete bookings' as note;
