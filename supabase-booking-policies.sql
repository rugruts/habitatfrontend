-- Update RLS policies to allow anonymous booking creation
-- This allows users to create bookings without authentication

-- Drop existing policies
DROP POLICY IF EXISTS "Users can create bookings" ON bookings;
DROP POLICY IF EXISTS "Allow booking creation" ON bookings;

-- Create new policy that allows anonymous booking creation
CREATE POLICY "Allow anonymous booking creation" ON bookings
    FOR INSERT WITH CHECK (true);

-- Allow anonymous users to update bookings (for payment confirmation)
DROP POLICY IF EXISTS "Users can update their own bookings" ON bookings;
DROP POLICY IF EXISTS "Allow booking updates" ON bookings;

CREATE POLICY "Allow booking updates for payment" ON bookings
    FOR UPDATE USING (true);

-- Ensure booking line items can be created
DROP POLICY IF EXISTS "Allow booking line item creation" ON booking_line_items;

CREATE POLICY "Allow booking line item creation" ON booking_line_items
    FOR INSERT WITH CHECK (true);

-- Allow reading of bookings for confirmation
DROP POLICY IF EXISTS "Users can view their own bookings" ON bookings;

CREATE POLICY "Allow booking read access" ON bookings
    FOR SELECT USING (true);

-- Allow reading of booking line items
DROP POLICY IF EXISTS "Users can view their booking line items" ON booking_line_items;

CREATE POLICY "Allow booking line item read access" ON booking_line_items
    FOR SELECT USING (true);

-- Ensure properties are readable by everyone
DROP POLICY IF EXISTS "Properties are viewable by everyone" ON properties;

CREATE POLICY "Properties are viewable by everyone" ON properties
    FOR SELECT USING (active = true);

-- Allow email log creation for booking confirmations
DROP POLICY IF EXISTS "Allow email log creation" ON email_logs;

CREATE POLICY "Allow email log creation" ON email_logs
    FOR INSERT WITH CHECK (true);

-- Allow reading email logs for admin
CREATE POLICY "Admin can read email logs" ON email_logs
    FOR SELECT USING (true);

-- Add missing payment_intent_id column to bookings table
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_intent_id TEXT;

-- Refresh the schema
NOTIFY pgrst, 'reload schema';
