-- =====================================================
-- Habitat Lobby - Complete Database Setup
-- Run this entire script in your Supabase SQL Editor
-- =====================================================

-- 1. Create admin_users table (required for other tables)
-- =====================================================
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_active ON admin_users(is_active);

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can view all admin users" ON admin_users
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert admin users" ON admin_users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can update admin users" ON admin_users
  FOR UPDATE USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_admin_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_admin_users_updated_at();

-- Insert default admin user
INSERT INTO admin_users (email, name, role) 
VALUES 
  ('admin@habitat.com', 'Admin User', 'admin'),
  ('info@habitatlobby.com', 'Info User', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON admin_users TO authenticated;
GRANT ALL ON admin_users TO service_role;

-- 2. Fix foreign key constraints for scheduled_emails
-- =====================================================
-- Delete orphaned records first
DELETE FROM scheduled_emails 
WHERE automation_id NOT IN (SELECT id FROM email_automations);

DELETE FROM scheduled_emails 
WHERE booking_id NOT IN (SELECT id FROM bookings);

-- Add CASCADE to foreign key constraints
ALTER TABLE scheduled_emails 
DROP CONSTRAINT IF EXISTS scheduled_emails_automation_id_fkey;

ALTER TABLE scheduled_emails 
ADD CONSTRAINT scheduled_emails_automation_id_fkey 
FOREIGN KEY (automation_id) REFERENCES email_automations(id) ON DELETE CASCADE;

ALTER TABLE scheduled_emails 
DROP CONSTRAINT IF EXISTS scheduled_emails_booking_id_fkey;

ALTER TABLE scheduled_emails 
ADD CONSTRAINT scheduled_emails_booking_id_fkey 
FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE;

-- 3. Create cash_on_arrival_bookings table
-- =====================================================
CREATE TABLE IF NOT EXISTS cash_on_arrival_bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'EUR',
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
  payment_instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_cash_on_arrival_booking_id ON cash_on_arrival_bookings(booking_id);
CREATE INDEX IF NOT EXISTS idx_cash_on_arrival_status ON cash_on_arrival_bookings(status);

-- Enable Row Level Security
ALTER TABLE cash_on_arrival_bookings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own cash on arrival bookings" ON cash_on_arrival_bookings
  FOR SELECT USING (
    booking_id IN (
      SELECT id FROM bookings 
      WHERE customer_email = auth.jwt() ->> 'email'
    )
  );

CREATE POLICY "Admins can manage all cash on arrival bookings" ON cash_on_arrival_bookings
  FOR ALL USING (
    auth.jwt() ->> 'email' IN (
      SELECT email FROM admin_users WHERE is_active = true
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_cash_on_arrival_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_cash_on_arrival_updated_at
  BEFORE UPDATE ON cash_on_arrival_bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_cash_on_arrival_updated_at();

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON cash_on_arrival_bookings TO authenticated;
GRANT ALL ON cash_on_arrival_bookings TO service_role;

-- 4. Fix availability check function
-- =====================================================
CREATE OR REPLACE FUNCTION check_property_availability(
  check_in_date DATE,
  check_out_date DATE,
  property_uuid UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  conflicting_bookings INTEGER;
BEGIN
  -- Check for conflicting bookings
  SELECT COUNT(*)
  INTO conflicting_bookings
  FROM bookings
  WHERE property_id = property_uuid
    AND status IN ('confirmed', 'paid', 'pending')
    AND (
      (check_in <= check_in_date AND check_out > check_in_date) OR
      (check_in < check_out_date AND check_out >= check_out_date) OR
      (check_in >= check_in_date AND check_out <= check_out_date)
    );

  -- Return true if no conflicting bookings found
  RETURN conflicting_bookings = 0;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION check_property_availability(DATE, DATE, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION check_property_availability(DATE, DATE, UUID) TO service_role;

-- =====================================================
-- Setup Complete!
-- Your database is now ready for Habitat Lobby
-- =====================================================
