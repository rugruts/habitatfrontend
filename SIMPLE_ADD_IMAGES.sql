-- SIMPLE IMAGE COLUMN ADDITION
-- Run this in Supabase SQL Editor to add image support

-- Add images column to properties table
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS images TEXT DEFAULT '[]';

-- Update River Loft / Apartment 1 with sample images
UPDATE properties
SET images = '["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800", "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800", "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800"]'
WHERE (name LIKE '%River Loft%' OR name LIKE '%Appartment 1%')
AND (images IS NULL OR TRIM(images) = '' OR TRIM(images) = '[]');

-- Update Garden Suite / Central Studio with sample images
UPDATE properties
SET images = '["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800", "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800", "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800"]'
WHERE (name LIKE '%Garden Suite%' OR name LIKE '%Central Studio%')
AND (images IS NULL OR TRIM(images) = '' OR TRIM(images) = '[]');

-- Verify the update
SELECT
    name,
    images,
    CASE
        WHEN images IS NOT NULL AND TRIM(images) != '' AND TRIM(images) != '[]' THEN
            'Has Images'
        ELSE
            'No Images'
    END as status
FROM properties
ORDER BY name;

-- Show count of properties with images
SELECT
    COUNT(*) as total_properties,
    COUNT(CASE WHEN images IS NOT NULL AND TRIM(images) != '' AND TRIM(images) != '[]' THEN 1 END) as properties_with_images
FROM properties;
