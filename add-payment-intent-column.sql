-- Add missing payment_intent_id column to bookings table
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_intent_id TEXT;

-- Refresh the schema
NOTIFY pgrst, 'reload schema';
