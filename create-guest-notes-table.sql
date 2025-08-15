-- Create Guest Notes Table for Habitat Lobby
-- This table stores notes and preferences for each guest

-- Create the guest_notes table
CREATE TABLE IF NOT EXISTS guest_notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
    note TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'general' CHECK (type IN ('general', 'preference', 'issue', 'compliment')),
    created_by TEXT NOT NULL DEFAULT 'Admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_guest_notes_guest_id ON guest_notes(guest_id);
CREATE INDEX IF NOT EXISTS idx_guest_notes_created_at ON guest_notes(created_at);
CREATE INDEX IF NOT EXISTS idx_guest_notes_type ON guest_notes(type);

-- Enable RLS (Row Level Security)
ALTER TABLE guest_notes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Guest notes are viewable by authenticated users" ON guest_notes
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow guest note creation" ON guest_notes
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow guest note updates" ON guest_notes
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow guest note deletion" ON guest_notes
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_guest_notes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_guest_notes_updated_at
    BEFORE UPDATE ON guest_notes
    FOR EACH ROW
    EXECUTE FUNCTION update_guest_notes_updated_at();

-- Verify the table was created
SELECT 
    'Guest notes table created successfully' as status,
    COUNT(*) as existing_notes_count
FROM guest_notes;

-- Show the table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'guest_notes' 
ORDER BY ordinal_position;
