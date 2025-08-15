-- Update guests table to include ID information as text fields
-- This replaces the file upload system with manual text entry

-- Add new columns to guests table for ID information
ALTER TABLE guests 
ADD COLUMN IF NOT EXISTS full_name_on_id TEXT,
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS nationality TEXT,
ADD COLUMN IF NOT EXISTS id_passport_number TEXT,
ADD COLUMN IF NOT EXISTS issuing_country TEXT,
ADD COLUMN IF NOT EXISTS issuing_authority TEXT,
ADD COLUMN IF NOT EXISTS id_collected_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS special_requests TEXT;

-- Update bookings table to include ID verification status
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS id_verification_status VARCHAR(50) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS id_verified_at TIMESTAMP WITH TIME ZONE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_guests_nationality ON guests(nationality);
CREATE INDEX IF NOT EXISTS idx_bookings_id_verification ON bookings(id_verification_status);

-- Drop the id_documents table since we're moving to text-based collection
DROP TABLE IF EXISTS id_documents CASCADE;

-- Drop email templates related tables since we're removing that system
DROP TABLE IF EXISTS email_automations CASCADE;
DROP TABLE IF EXISTS email_logs CASCADE;
DROP TABLE IF EXISTS email_templates CASCADE;

-- Update the guests table comment
COMMENT ON TABLE guests IS 'Guest information including manually collected ID details for check-in verification';
COMMENT ON COLUMN guests.full_name_on_id IS 'Full name exactly as it appears on the ID document';
COMMENT ON COLUMN guests.date_of_birth IS 'Date of birth from ID document';
COMMENT ON COLUMN guests.nationality IS 'Nationality/citizenship';
COMMENT ON COLUMN guests.id_passport_number IS 'ID card or passport number';
COMMENT ON COLUMN guests.issuing_country IS 'Country that issued the ID document';
COMMENT ON COLUMN guests.issuing_authority IS 'Authority that issued the ID document';
COMMENT ON COLUMN guests.id_collected_at IS 'When the ID information was collected';
COMMENT ON COLUMN guests.special_requests IS 'Any special requests from the guest';
