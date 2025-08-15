-- ADD IMAGES COLUMN TO PROPERTIES TABLE
-- Run this in Supabase SQL Editor to add image support

-- Add images column to properties table
ALTER TABLE properties
ADD COLUMN IF NOT EXISTS images TEXT DEFAULT '[]';

-- Update existing properties with sample images (optional)
UPDATE properties
SET images = CASE
    WHEN name LIKE '%River Loft%' OR name LIKE '%Appartment 1%' THEN
        '["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800", "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800", "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800"]'
    WHEN name LIKE '%Garden Suite%' OR name LIKE '%Central Studio%' THEN
        '["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800", "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800", "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800"]'
    ELSE
        '["https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800"]'
END
WHERE images IS NULL OR images = '[]' OR COALESCE(images, '') = '';

-- Create index for better performance when querying images (only if images contain valid JSON)
-- CREATE INDEX IF NOT EXISTS idx_properties_images ON properties USING GIN ((images::jsonb));

-- Verify the update
SELECT
    name,
    images,
    CASE
        WHEN images IS NOT NULL AND images != '' AND images != '[]' THEN
            (SELECT COUNT(*) FROM json_array_elements_text(images::json))
        ELSE 0
    END as image_count
FROM properties
WHERE active = true;

-- Show sample of what the images column looks like
SELECT 
    'Sample images data:' as info,
    images
FROM properties 
LIMIT 1;
