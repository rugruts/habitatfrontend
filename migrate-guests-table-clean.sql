-- Migrate Guests Table Structure for Habitat Lobby
-- This script ONLY handles schema migration - no test data insertion

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

-- Set NOT NULL constraints for required fields (only if they have data)
DO $$
BEGIN
    -- Only set NOT NULL if we have data or if columns are empty
    IF (SELECT COUNT(*) FROM guests WHERE first_name IS NULL) = 0 THEN
        ALTER TABLE guests ALTER COLUMN first_name SET NOT NULL;
    END IF;
    
    IF (SELECT COUNT(*) FROM guests WHERE last_name IS NULL) = 0 THEN
        ALTER TABLE guests ALTER COLUMN last_name SET NOT NULL;
    END IF;
    
    IF (SELECT COUNT(*) FROM guests WHERE email IS NULL) = 0 THEN
        ALTER TABLE guests ALTER COLUMN email SET NOT NULL;
    END IF;
END $$;

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

-- Verify the migration
SELECT 
    'Migration completed successfully' as status,
    COUNT(*) as existing_guest_count
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

-- Show existing data (if any)
SELECT 
    COUNT(*) as total_guests,
    COUNT(CASE WHEN first_name IS NOT NULL THEN 1 END) as guests_with_first_name,
    COUNT(CASE WHEN email IS NOT NULL THEN 1 END) as guests_with_email
FROM guests;
