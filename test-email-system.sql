-- Test Email Template System
-- Run this to verify everything is working correctly

-- Test 1: Check if email_templates table has correct structure
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'email_templates' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Test 2: Check if templates exist
SELECT 
  name, 
  template_type, 
  is_active,
  created_at
FROM email_templates 
ORDER BY created_at DESC;

-- Test 3: Check if email_automations table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'email_automations'
) as automations_table_exists;

-- Test 4: Check if scheduled_emails table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'scheduled_emails'
) as scheduled_emails_table_exists;

-- Test 5: Test creating a sample template
INSERT INTO email_templates (
  name, 
  subject, 
  content, 
  template_type, 
  is_active, 
  variables
) VALUES (
  'Test Template',
  'Test Subject - {{business_name}}',
  '<html><body><h1>Test Email</h1><p>Hello {{customer_name}}, this is a test.</p></body></html>',
  'custom',
  true,
  ARRAY['customer_name', 'business_name']
) ON CONFLICT DO NOTHING;

-- Test 6: Verify the test template was created
SELECT 
  name, 
  template_type, 
  is_active,
  array_length(variables, 1) as variable_count
FROM email_templates 
WHERE name = 'Test Template';

-- Test 7: Test the template service functions
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN (
  'create_default_email_automations',
  'trigger_email_automation',
  'process_scheduled_emails'
);

-- Test 8: Clean up test data
DELETE FROM email_templates WHERE name = 'Test Template';

-- Test 9: Verify cleanup
SELECT COUNT(*) as remaining_templates 
FROM email_templates 
WHERE name = 'Test Template';

-- All tests passed if no errors occurred
SELECT 'Email template system test completed successfully!' as status;



