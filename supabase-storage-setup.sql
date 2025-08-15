-- Habitat Lobby - Supabase Storage Setup
-- Run this to set up storage buckets and policies

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('id-documents', 'id-documents', false, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('property-images', 'property-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('invoices', 'invoices', false, 5242880, ARRAY['application/pdf']),
  ('documents', 'documents', false, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
ON CONFLICT (id) DO NOTHING;

-- Storage policies for id-documents bucket (private)
CREATE POLICY "Admin can upload ID documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'id-documents' AND 
    auth.role() = 'authenticated' AND
    is_admin_user()
  );

CREATE POLICY "Admin can view ID documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'id-documents' AND 
    auth.role() = 'authenticated' AND
    is_admin_user()
  );

CREATE POLICY "Admin can update ID documents" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'id-documents' AND 
    auth.role() = 'authenticated' AND
    is_admin_user()
  );

CREATE POLICY "Admin can delete ID documents" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'id-documents' AND 
    auth.role() = 'authenticated' AND
    is_admin_user()
  );

-- Storage policies for property-images bucket (public)
CREATE POLICY "Anyone can view property images" ON storage.objects
  FOR SELECT USING (bucket_id = 'property-images');

CREATE POLICY "Admin can upload property images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'property-images' AND 
    auth.role() = 'authenticated' AND
    is_admin_user()
  );

CREATE POLICY "Admin can update property images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'property-images' AND 
    auth.role() = 'authenticated' AND
    is_admin_user()
  );

CREATE POLICY "Admin can delete property images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'property-images' AND 
    auth.role() = 'authenticated' AND
    is_admin_user()
  );

-- Storage policies for invoices bucket (private)
CREATE POLICY "Admin can upload invoices" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'invoices' AND 
    auth.role() = 'authenticated' AND
    is_admin_user()
  );

CREATE POLICY "Admin can view invoices" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'invoices' AND 
    auth.role() = 'authenticated' AND
    is_admin_user()
  );

CREATE POLICY "Admin can update invoices" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'invoices' AND 
    auth.role() = 'authenticated' AND
    is_admin_user()
  );

CREATE POLICY "Admin can delete invoices" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'invoices' AND 
    auth.role() = 'authenticated' AND
    is_admin_user()
  );

-- Storage policies for general documents bucket (private)
CREATE POLICY "Admin can upload documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'documents' AND 
    auth.role() = 'authenticated' AND
    is_admin_user()
  );

CREATE POLICY "Admin can view documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'documents' AND 
    auth.role() = 'authenticated' AND
    is_admin_user()
  );

CREATE POLICY "Admin can update documents" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'documents' AND 
    auth.role() = 'authenticated' AND
    is_admin_user()
  );

CREATE POLICY "Admin can delete documents" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'documents' AND 
    auth.role() = 'authenticated' AND
    is_admin_user()
  );

-- Function to clean up expired files
CREATE OR REPLACE FUNCTION cleanup_expired_storage_files()
RETURNS void AS $$
DECLARE
  expired_doc RECORD;
BEGIN
  -- Get expired ID documents from database
  FOR expired_doc IN 
    SELECT document_front_url, document_back_url 
    FROM id_documents 
    WHERE auto_delete_at < NOW()
  LOOP
    -- Delete front document
    IF expired_doc.document_front_url IS NOT NULL THEN
      DELETE FROM storage.objects 
      WHERE bucket_id = 'id-documents' 
      AND name = expired_doc.document_front_url;
    END IF;
    
    -- Delete back document if exists
    IF expired_doc.document_back_url IS NOT NULL THEN
      DELETE FROM storage.objects 
      WHERE bucket_id = 'id-documents' 
      AND name = expired_doc.document_back_url;
    END IF;
  END LOOP;
  
  -- Delete the database records
  DELETE FROM id_documents WHERE auto_delete_at < NOW();
  
  -- Log cleanup activity
  INSERT INTO audit_logs (
    action,
    resource_type,
    metadata
  ) VALUES (
    'CLEANUP',
    'storage_files',
    jsonb_build_object(
      'cleanup_type', 'expired_documents',
      'timestamp', NOW()
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get file size statistics
CREATE OR REPLACE FUNCTION get_storage_stats()
RETURNS TABLE (
  bucket_name TEXT,
  file_count BIGINT,
  total_size_bytes BIGINT,
  total_size_mb NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    bucket_id as bucket_name,
    COUNT(*) as file_count,
    SUM(metadata->>'size')::BIGINT as total_size_bytes,
    ROUND((SUM(metadata->>'size')::BIGINT / 1024.0 / 1024.0)::NUMERIC, 2) as total_size_mb
  FROM storage.objects
  GROUP BY bucket_id
  ORDER BY bucket_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to validate file uploads
CREATE OR REPLACE FUNCTION validate_file_upload()
RETURNS TRIGGER AS $$
BEGIN
  -- Check file size limits per bucket
  IF NEW.bucket_id = 'id-documents' AND (NEW.metadata->>'size')::BIGINT > 5242880 THEN
    RAISE EXCEPTION 'File too large for ID documents bucket (max 5MB)';
  END IF;
  
  IF NEW.bucket_id = 'property-images' AND (NEW.metadata->>'size')::BIGINT > 10485760 THEN
    RAISE EXCEPTION 'File too large for property images bucket (max 10MB)';
  END IF;
  
  IF NEW.bucket_id = 'invoices' AND (NEW.metadata->>'size')::BIGINT > 5242880 THEN
    RAISE EXCEPTION 'File too large for invoices bucket (max 5MB)';
  END IF;
  
  -- Check MIME types
  IF NEW.bucket_id = 'id-documents' AND NEW.metadata->>'mimetype' NOT IN ('image/jpeg', 'image/png', 'image/webp') THEN
    RAISE EXCEPTION 'Invalid file type for ID documents';
  END IF;
  
  IF NEW.bucket_id = 'property-images' AND NEW.metadata->>'mimetype' NOT IN ('image/jpeg', 'image/png', 'image/webp') THEN
    RAISE EXCEPTION 'Invalid file type for property images';
  END IF;
  
  IF NEW.bucket_id = 'invoices' AND NEW.metadata->>'mimetype' != 'application/pdf' THEN
    RAISE EXCEPTION 'Invalid file type for invoices (PDF only)';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for file validation
CREATE TRIGGER validate_file_upload_trigger
  BEFORE INSERT ON storage.objects
  FOR EACH ROW EXECUTE FUNCTION validate_file_upload();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT ALL ON storage.objects TO authenticated;
GRANT ALL ON storage.buckets TO authenticated;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_storage_objects_bucket_id ON storage.objects(bucket_id);
CREATE INDEX IF NOT EXISTS idx_storage_objects_name ON storage.objects(name);
CREATE INDEX IF NOT EXISTS idx_storage_objects_created_at ON storage.objects(created_at);

-- Enable RLS on storage.objects (if not already enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create a view for file statistics (admin only)
CREATE OR REPLACE VIEW storage_statistics AS
SELECT 
  bucket_id,
  COUNT(*) as file_count,
  SUM((metadata->>'size')::BIGINT) as total_size_bytes,
  ROUND((SUM((metadata->>'size')::BIGINT) / 1024.0 / 1024.0)::NUMERIC, 2) as total_size_mb,
  AVG((metadata->>'size')::BIGINT) as avg_file_size_bytes,
  MIN(created_at) as oldest_file,
  MAX(created_at) as newest_file
FROM storage.objects
GROUP BY bucket_id;

-- Grant access to the view for admins
GRANT SELECT ON storage_statistics TO authenticated;
