-- QUICK FIX: Create Storage Buckets (Simple Version)
-- Copy and paste this into your Supabase SQL Editor and run it

-- Create the essential storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('property-images', 'property-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('documents', 'documents', false, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
ON CONFLICT (id) DO NOTHING;

-- That's it! The buckets are created.
-- Supabase will handle the basic permissions automatically for public buckets.
