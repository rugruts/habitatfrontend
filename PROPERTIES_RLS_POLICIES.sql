-- PROPERTIES TABLE RLS POLICIES
-- Copy and paste this into your Supabase SQL Editor and run it

-- Enable RLS on properties table (if not already enabled)
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- 1. Public can view active properties (for the website)
CREATE POLICY "Public can view active properties" ON properties
  FOR SELECT USING (active = true);

-- 2. Authenticated users can view all properties (for admin)
CREATE POLICY "Authenticated can view all properties" ON properties
  FOR SELECT USING (auth.role() = 'authenticated');

-- 3. Authenticated users can insert properties (for admin)
CREATE POLICY "Authenticated can insert properties" ON properties
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 4. Authenticated users can update properties (for admin)
CREATE POLICY "Authenticated can update properties" ON properties
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- 5. Authenticated users can delete properties (for admin)
CREATE POLICY "Authenticated can delete properties" ON properties
  FOR DELETE USING (auth.role() = 'authenticated');
