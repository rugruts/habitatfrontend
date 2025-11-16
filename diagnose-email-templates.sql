-- Diagnose Email Templates Table
-- Run this to check what's happening with the email templates

-- Check if the table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'email_templates'
) as table_exists;

-- Check table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'email_templates' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check if there are any templates
SELECT COUNT(*) as template_count FROM email_templates;

-- Show all templates if any exist
SELECT 
  id,
  name,
  template_type,
  is_active,
  created_at
FROM email_templates 
ORDER BY created_at DESC;

-- Check for any recent errors in the logs (if available)
-- This is just a placeholder - actual log checking depends on your setup
SELECT 'No logs available in this context' as log_info;

-- Test inserting a simple template
INSERT INTO email_templates (
  name, 
  subject, 
  content, 
  template_type, 
  is_active, 
  variables
) VALUES (
  'Test Diagnostic Template',
  'Test Subject',
  '<html><body><h1>Test</h1></body></html>',
  'custom',
  true,
  ARRAY['test']
) ON CONFLICT DO NOTHING;

-- Verify the test template was created
SELECT 
  name, 
  template_type, 
  is_active,
  array_length(variables, 1) as variable_count
FROM email_templates 
WHERE name = 'Test Diagnostic Template';

-- Clean up test template
DELETE FROM email_templates WHERE name = 'Test Diagnostic Template';

-- Final status
SELECT 'Diagnostic complete' as status;



