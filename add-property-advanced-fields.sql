-- Add advanced fields to properties table
-- This migration adds support for detailed descriptions, location coordinates, and nearby facilities

-- Add new columns to properties table
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS detailed_description TEXT,
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8),
ADD COLUMN IF NOT EXISTS nearby_facilities JSONB DEFAULT '[]';

-- Create nearby_facilities table for better structure
CREATE TABLE IF NOT EXISTS nearby_facilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    distance INTEGER,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    icon VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_nearby_facilities_property_id ON nearby_facilities(property_id);
CREATE INDEX IF NOT EXISTS idx_properties_location ON properties(latitude, longitude);

-- Add some sample nearby facilities for existing properties
INSERT INTO nearby_facilities (property_id, name, type, distance, latitude, longitude, icon)
SELECT 
    p.id,
    'Central Square',
    'landmark',
    500,
    39.5553,
    21.7674,
    'landmark'
FROM properties p
WHERE p.city = 'Trikala'
ON CONFLICT DO NOTHING;

-- Update existing properties with default coordinates if they don't have them
UPDATE properties 
SET 
    latitude = 39.5553,
    longitude = 21.7674
WHERE latitude IS NULL OR longitude IS NULL;

-- Add constraint to ensure coordinates are within valid ranges
ALTER TABLE properties 
ADD CONSTRAINT check_latitude CHECK (latitude >= -90 AND latitude <= 90),
ADD CONSTRAINT check_longitude CHECK (longitude >= -180 AND longitude <= 180);

-- Add comment to document the new fields
COMMENT ON COLUMN properties.detailed_description IS 'Rich text description with formatting support';
COMMENT ON COLUMN properties.latitude IS 'Property latitude coordinate';
COMMENT ON COLUMN properties.longitude IS 'Property longitude coordinate';
COMMENT ON COLUMN properties.nearby_facilities IS 'JSON array of nearby facilities and points of interest';
