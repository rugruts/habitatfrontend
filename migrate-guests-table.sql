-- Migrate Guests Table Structure for Habitat Lobby
-- This script safely migrates the existing guests table to the correct structure

-- First, let's see what the current table structure looks like
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'guests' 
ORDER BY ordinal_position;

-- Check if we have any existing data
SELECT COUNT(*) as existing_guest_count FROM guests;

-- Add missing columns if they don't exist
DO $$ 
BEGIN
    -- Add first_name column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'guests' AND column_name = 'first_name') THEN
        ALTER TABLE guests ADD COLUMN first_name TEXT;
    END IF;
    
    -- Add last_name column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'guests' AND column_name = 'last_name') THEN
        ALTER TABLE guests ADD COLUMN last_name TEXT;
    END IF;
    
    -- Add other missing columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'guests' AND column_name = 'date_of_birth') THEN
        ALTER TABLE guests ADD COLUMN date_of_birth DATE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'guests' AND column_name = 'nationality') THEN
        ALTER TABLE guests ADD COLUMN nationality TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'guests' AND column_name = 'address') THEN
        ALTER TABLE guests ADD COLUMN address JSONB;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'guests' AND column_name = 'emergency_contact') THEN
        ALTER TABLE guests ADD COLUMN emergency_contact JSONB;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'guests' AND column_name = 'dietary_restrictions') THEN
        ALTER TABLE guests ADD COLUMN dietary_restrictions TEXT[];
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'guests' AND column_name = 'preferences') THEN
        ALTER TABLE guests ADD COLUMN preferences JSONB;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'guests' AND column_name = 'total_bookings') THEN
        ALTER TABLE guests ADD COLUMN total_bookings INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'guests' AND column_name = 'total_spent') THEN
        ALTER TABLE guests ADD COLUMN total_spent INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'guests' AND column_name = 'last_stay_date') THEN
        ALTER TABLE guests ADD COLUMN last_stay_date DATE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'guests' AND column_name = 'vip_status') THEN
        ALTER TABLE guests ADD COLUMN vip_status BOOLEAN DEFAULT false;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'guests' AND column_name = 'marketing_consent') THEN
        ALTER TABLE guests ADD COLUMN marketing_consent BOOLEAN DEFAULT false;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'guests' AND column_name = 'id_verified') THEN
        ALTER TABLE guests ADD COLUMN id_verified BOOLEAN DEFAULT false;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'guests' AND column_name = 'blacklisted') THEN
        ALTER TABLE guests ADD COLUMN blacklisted BOOLEAN DEFAULT false;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'guests' AND column_name = 'blacklist_reason') THEN
        ALTER TABLE guests ADD COLUMN blacklist_reason TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'guests' AND column_name = 'created_at') THEN
        ALTER TABLE guests ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'guests' AND column_name = 'updated_at') THEN
        ALTER TABLE guests ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- If there's an existing 'name' column, split it into first_name and last_name
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'guests' AND column_name = 'name') THEN
        -- Update first_name and last_name from existing name column
        UPDATE guests 
        SET 
            first_name = CASE 
                WHEN position(' ' in name) > 0 
                THEN substring(name from 1 for position(' ' in name) - 1)
                ELSE name
            END,
            last_name = CASE 
                WHEN position(' ' in name) > 0 
                THEN substring(name from position(' ' in name) + 1)
                ELSE ''
            END
        WHERE name IS NOT NULL AND (first_name IS NULL OR last_name IS NULL);
        
        -- Drop the old name column after migration
        ALTER TABLE guests DROP COLUMN IF EXISTS name;
    END IF;
END $$;

-- Set NOT NULL constraints for required fields
ALTER TABLE guests ALTER COLUMN first_name SET NOT NULL;
ALTER TABLE guests ALTER COLUMN last_name SET NOT NULL;
ALTER TABLE guests ALTER COLUMN email SET NOT NULL;

-- Add unique constraint on email if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'guests_email_key') THEN
        ALTER TABLE guests ADD CONSTRAINT guests_email_key UNIQUE (email);
    END IF;
END $$;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_guests_email ON guests(email);
CREATE INDEX IF NOT EXISTS idx_guests_name ON guests(first_name, last_name);
CREATE INDEX IF NOT EXISTS idx_guests_created_at ON guests(created_at);
CREATE INDEX IF NOT EXISTS idx_guests_vip_status ON guests(vip_status);
CREATE INDEX IF NOT EXISTS idx_guests_id_verified ON guests(id_verified);

-- Enable RLS (Row Level Security)
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Guests are viewable by authenticated users" ON guests;
DROP POLICY IF EXISTS "Admin can manage all guests" ON guests;
DROP POLICY IF EXISTS "Allow guest creation" ON guests;
DROP POLICY IF EXISTS "Allow guest updates" ON guests;
DROP POLICY IF EXISTS "Allow guest deletion" ON guests;

-- Create new policies
CREATE POLICY "Guests are viewable by authenticated users" ON guests
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow guest creation" ON guests
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow guest updates" ON guests
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow guest deletion" ON guests
    FOR DELETE USING (auth.role() = 'authenticated');

-- Insert test data if table is empty
INSERT INTO guests (
    first_name, 
    last_name, 
    email, 
    phone, 
    total_bookings, 
    total_spent, 
    vip_status, 
    id_verified
) 
SELECT 'John', 'Doe', 'john.doe@example.com', '+30 123 456 7890', 2, 85000, false, true
WHERE NOT EXISTS (SELECT 1 FROM guests WHERE email = 'john.doe@example.com')
UNION ALL
SELECT 'Jane', 'Smith', 'jane.smith@example.com', '+30 987 654 3210', 1, 45000, true, false
WHERE NOT EXISTS (SELECT 1 FROM guests WHERE email = 'jane.smith@example.com')
UNION ALL
SELECT 'Maria', 'Garcia', 'maria.garcia@example.com', '+34 555 123 456', 3, 125000, true, true
WHERE NOT EXISTS (SELECT 1 FROM guests WHERE email = 'maria.garcia@example.com');

-- Verify the migration
SELECT 
    'Migration completed successfully' as status,
    COUNT(*) as guest_count
FROM guests;

-- Show the new table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'guests' 
ORDER BY ordinal_position;

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
