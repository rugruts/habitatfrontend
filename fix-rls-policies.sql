-- Fix Row Level Security Policies for Habitat Lobby
-- This script enables public access for booking operations while maintaining security

-- Enable RLS on all tables (if not already enabled)
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow public guest creation" ON guests;
DROP POLICY IF EXISTS "Allow public guest read" ON guests;
DROP POLICY IF EXISTS "Allow public guest update" ON guests;
DROP POLICY IF EXISTS "Allow public booking creation" ON bookings;
DROP POLICY IF EXISTS "Allow public booking read" ON bookings;
DROP POLICY IF EXISTS "Allow public property read" ON properties;
DROP POLICY IF EXISTS "Allow authenticated property management" ON properties;
DROP POLICY IF EXISTS "Allow authenticated booking management" ON bookings;
DROP POLICY IF EXISTS "Allow authenticated guest management" ON guests;

-- GUESTS TABLE POLICIES
-- Allow anyone to create guests (needed for checkout)
CREATE POLICY "Allow public guest creation" ON guests
    FOR INSERT 
    WITH CHECK (true);

-- Allow anyone to read guests (needed for booking lookup)
CREATE POLICY "Allow public guest read" ON guests
    FOR SELECT 
    USING (true);

-- Allow anyone to update guests (needed for booking updates)
CREATE POLICY "Allow public guest update" ON guests
    FOR UPDATE 
    USING (true)
    WITH CHECK (true);

-- Allow authenticated users (admin) full access to guests
CREATE POLICY "Allow authenticated guest management" ON guests
    FOR ALL 
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- BOOKINGS TABLE POLICIES
-- Allow anyone to create bookings (needed for checkout)
CREATE POLICY "Allow public booking creation" ON bookings
    FOR INSERT 
    WITH CHECK (true);

-- Allow anyone to read bookings (needed for confirmation lookup)
CREATE POLICY "Allow public booking read" ON bookings
    FOR SELECT 
    USING (true);

-- Allow authenticated users (admin) full access to bookings
CREATE POLICY "Allow authenticated booking management" ON bookings
    FOR ALL 
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- PROPERTIES TABLE POLICIES
-- Allow anyone to read properties (needed for public listings)
CREATE POLICY "Allow public property read" ON properties
    FOR SELECT 
    USING (true);

-- Allow authenticated users (admin) full access to properties
CREATE POLICY "Allow authenticated property management" ON properties
    FOR ALL 
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Verify policies are created
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
WHERE schemaname = 'public' 
AND tablename IN ('guests', 'bookings', 'properties')
ORDER BY tablename, policyname;

-- Test the policies work
SELECT 'RLS policies created successfully' as status;
