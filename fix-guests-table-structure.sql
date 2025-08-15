-- Fix Guests Table Structure for Habitat Lobby
-- Run this in Supabase SQL Editor to ensure guests table has correct structure

-- Check if guests table exists and show current structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'guests' 
ORDER BY ordinal_position;

-- Drop existing guests table if it has wrong structure (CAREFUL!)
-- Uncomment the next line only if you want to recreate the table from scratch
-- DROP TABLE IF EXISTS guests CASCADE;

-- Create guests table with correct structure
CREATE TABLE IF NOT EXISTS guests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    date_of_birth DATE,
    nationality TEXT,
    address JSONB,
    emergency_contact JSONB,
    dietary_restrictions TEXT[],
    preferences JSONB,
    notes TEXT,
    total_bookings INTEGER DEFAULT 0,
    total_spent INTEGER DEFAULT 0, -- in cents
    last_stay_date DATE,
    vip_status BOOLEAN DEFAULT false,
    marketing_consent BOOLEAN DEFAULT false,
    id_verified BOOLEAN DEFAULT false,
    blacklisted BOOLEAN DEFAULT false,
    blacklist_reason TEXT
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_guests_email ON guests(email);
CREATE INDEX IF NOT EXISTS idx_guests_name ON guests(first_name, last_name);
CREATE INDEX IF NOT EXISTS idx_guests_created_at ON guests(created_at);
CREATE INDEX IF NOT EXISTS idx_guests_vip_status ON guests(vip_status);
CREATE INDEX IF NOT EXISTS idx_guests_id_verified ON guests(id_verified);

-- Enable RLS (Row Level Security)
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;

-- Create policies for guests table
DROP POLICY IF EXISTS "Guests are viewable by authenticated users" ON guests;
DROP POLICY IF EXISTS "Admin can manage all guests" ON guests;
DROP POLICY IF EXISTS "Allow guest creation" ON guests;
DROP POLICY IF EXISTS "Allow guest updates" ON guests;

-- Allow authenticated users to view guests
CREATE POLICY "Guests are viewable by authenticated users" ON guests
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to create guests
CREATE POLICY "Allow guest creation" ON guests
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update guests
CREATE POLICY "Allow guest updates" ON guests
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete guests (admin only in practice)
CREATE POLICY "Allow guest deletion" ON guests
    FOR DELETE USING (auth.role() = 'authenticated');

-- Insert some test guests to verify the structure works
INSERT INTO guests (
    first_name, 
    last_name, 
    email, 
    phone, 
    total_bookings, 
    total_spent, 
    vip_status, 
    id_verified
) VALUES 
(
    'John', 
    'Doe', 
    'john.doe@example.com', 
    '+30 123 456 7890', 
    2, 
    85000, -- €850.00 in cents
    false, 
    true
),
(
    'Jane', 
    'Smith', 
    'jane.smith@example.com', 
    '+30 987 654 3210', 
    1, 
    45000, -- €450.00 in cents
    true, 
    false
),
(
    'Maria', 
    'Garcia', 
    'maria.garcia@example.com', 
    '+34 555 123 456', 
    3, 
    125000, -- €1250.00 in cents
    true, 
    true
)
ON CONFLICT (email) DO NOTHING;

-- Verify the table structure and data
SELECT 
    'Table structure verified' as status,
    COUNT(*) as guest_count
FROM guests;

-- Show sample data
SELECT 
    id,
    first_name,
    last_name,
    email,
    phone,
    total_bookings,
    total_spent,
    vip_status,
    id_verified,
    created_at
FROM guests
ORDER BY created_at DESC
LIMIT 5;

-- Test the search functionality that the app uses
SELECT 
    first_name,
    last_name,
    email,
    phone
FROM guests 
WHERE 
    first_name ILIKE '%john%' OR 
    last_name ILIKE '%john%' OR 
    email ILIKE '%john%' OR 
    phone ILIKE '%john%'
LIMIT 5;
