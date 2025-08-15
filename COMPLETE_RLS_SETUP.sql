-- COMPLETE RLS SETUP FOR HABITAT LOBBY
-- This sets up all Row Level Security policies for the entire system
-- Copy and paste this into your Supabase SQL Editor and run it

-- =====================================================
-- PROPERTIES TABLE POLICIES
-- =====================================================

-- Enable RLS on properties table
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Public can view active properties" ON properties;
DROP POLICY IF EXISTS "Authenticated can view all properties" ON properties;
DROP POLICY IF EXISTS "Authenticated can insert properties" ON properties;
DROP POLICY IF EXISTS "Authenticated can update properties" ON properties;
DROP POLICY IF EXISTS "Authenticated can delete properties" ON properties;

-- Create new policies
CREATE POLICY "Public can view active properties" ON properties
  FOR SELECT USING (active = true);

CREATE POLICY "Authenticated can view all properties" ON properties
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can insert properties" ON properties
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can update properties" ON properties
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can delete properties" ON properties
  FOR DELETE USING (auth.role() = 'authenticated');

-- =====================================================
-- BOOKINGS TABLE POLICIES
-- =====================================================

-- Enable RLS on bookings table
ALTER TABLE IF EXISTS bookings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Authenticated can manage bookings" ON bookings;

-- Create booking policies (admin only for now)
CREATE POLICY "Authenticated can manage bookings" ON bookings
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- =====================================================
-- GUESTS TABLE POLICIES (if exists)
-- =====================================================

-- Enable RLS on guests table if it exists
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'guests') THEN
    ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
    
    -- Drop existing policies
    DROP POLICY IF EXISTS "Authenticated can manage guests" ON guests;
    
    -- Create guest policies
    CREATE POLICY "Authenticated can manage guests" ON guests
      FOR ALL USING (auth.role() = 'authenticated')
      WITH CHECK (auth.role() = 'authenticated');
  END IF;
END $$;

-- =====================================================
-- PAYMENTS TABLE POLICIES (if exists)
-- =====================================================

-- Enable RLS on payments table if it exists
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'payments') THEN
    ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
    
    -- Drop existing policies
    DROP POLICY IF EXISTS "Authenticated can manage payments" ON payments;
    
    -- Create payment policies
    CREATE POLICY "Authenticated can manage payments" ON payments
      FOR ALL USING (auth.role() = 'authenticated')
      WITH CHECK (auth.role() = 'authenticated');
  END IF;
END $$;

-- =====================================================
-- STORAGE POLICIES (already handled separately)
-- =====================================================

-- Note: Storage policies are handled in the Supabase Dashboard
-- for property-images and documents buckets

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Check which tables have RLS enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND rowsecurity = true;

-- Check policies on properties table
SELECT policyname, cmd, roles, qual, with_check 
FROM pg_policies 
WHERE tablename = 'properties';

-- Success message
SELECT 'RLS policies setup complete! You can now update properties.' as status;
