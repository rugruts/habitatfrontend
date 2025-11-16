-- Create storage bucket for property images
-- This script sets up a public storage bucket for property images with proper RLS policies

-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'property-images',
  'property-images',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Create RLS policy for public read access
CREATE POLICY "Public read access for property images" ON storage.objects
FOR SELECT USING (bucket_id = 'property-images');

-- Create RLS policy for authenticated users to upload images
CREATE POLICY "Authenticated users can upload property images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'property-images' 
  AND auth.role() = 'authenticated'
);

-- Create RLS policy for authenticated users to update their uploaded images
CREATE POLICY "Authenticated users can update property images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'property-images' 
  AND auth.role() = 'authenticated'
);

-- Create RLS policy for authenticated users to delete their uploaded images
CREATE POLICY "Authenticated users can delete property images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'property-images' 
  AND auth.role() = 'authenticated'
);

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
