-- Clean up invalid blob URLs from properties table
-- This removes blob URLs that are no longer valid and causing the ERR_FILE_NOT_FOUND errors

-- Remove blob URLs from properties.images JSONB array
UPDATE properties 
SET images = (
  SELECT jsonb_agg(img)
  FROM jsonb_array_elements_text(images) AS img
  WHERE img NOT LIKE 'blob:%'
)
WHERE images::text LIKE '%blob:%';

-- Alternative: If you want to completely clear all images and start fresh
-- UPDATE properties SET images = '[]'::jsonb WHERE images::text LIKE '%blob:%';

-- Check what properties still have blob URLs (should be empty after cleanup)
SELECT id, name, images 
FROM properties 
WHERE images::text LIKE '%blob:%';
