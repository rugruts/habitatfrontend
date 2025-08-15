-- Create ID Verification Tokens Table for Habitat Lobby
-- This table stores secure tokens for ID verification links

-- Create the id_verification_tokens table
CREATE TABLE IF NOT EXISTS id_verification_tokens (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_id_verification_tokens_guest_id ON id_verification_tokens(guest_id);
CREATE INDEX IF NOT EXISTS idx_id_verification_tokens_token ON id_verification_tokens(token);
CREATE INDEX IF NOT EXISTS idx_id_verification_tokens_expires_at ON id_verification_tokens(expires_at);

-- Enable RLS (Row Level Security)
ALTER TABLE id_verification_tokens ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "ID verification tokens are viewable by authenticated users" ON id_verification_tokens
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow ID verification token creation" ON id_verification_tokens
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow ID verification token updates" ON id_verification_tokens
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Function to clean up expired tokens
CREATE OR REPLACE FUNCTION cleanup_expired_id_verification_tokens()
RETURNS void AS $$
BEGIN
    DELETE FROM id_verification_tokens 
    WHERE expires_at < NOW() - INTERVAL '1 day';
END;
$$ LANGUAGE plpgsql;

-- Verify the table was created
SELECT 
    'ID verification tokens table created successfully' as status,
    COUNT(*) as existing_tokens_count
FROM id_verification_tokens;

-- Show the table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'id_verification_tokens' 
ORDER BY ordinal_position;
