-- ===================================================================
-- TEST EMAIL AUTOMATION SETUP
-- Quick verification script to test the email automation system
-- ===================================================================

-- Check if tables exist and have correct structure
SELECT
  schemaname,
  tablename,
  tableowner
FROM pg_tables
WHERE tablename IN ('email_templates', 'email_automations', 'scheduled_emails', 'automation_logs', 'system_settings')
  AND schemaname = 'public';

-- Check email_templates table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'email_templates'
ORDER BY ordinal_position;

-- Check email_automations table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'email_automations'
ORDER BY ordinal_position;

-- Check if scheduled_emails table exists
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'scheduled_emails'
ORDER BY ordinal_position;

-- Check if automation_logs table exists
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'automation_logs'
ORDER BY ordinal_position;

-- Check if system_settings table exists
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'system_settings'
ORDER BY ordinal_position;

-- Test inserting a simple template (this will fail if structure is wrong)
INSERT INTO email_templates (
  name,
  subject,
  content,
  template_type,
  is_active,
  variables,
  created_at,
  updated_at
) VALUES (
  'test_template',
  'Test Subject - {{customer_name}}',
  '<p>Hello {{customer_name}}, this is a test.</p>',
  'custom',
  true,
  ARRAY['customer_name'],
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;

-- Test inserting a simple automation
INSERT INTO email_automations (
  name,
  template_id,
  trigger_type,
  trigger_delay_hours,
  is_active,
  conditions,
  created_at,
  updated_at
) VALUES (
  'Test Automation',
  (SELECT id FROM email_templates WHERE name = 'test_template' LIMIT 1),
  'booking_created',
  0,
  true,
  '{"booking_status": ["confirmed"]}',
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;

-- Test inserting system settings
INSERT INTO system_settings (key, value, description, category, created_at, updated_at)
VALUES
('test_setting', 'test_value', 'Test setting', 'test', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Verify data was inserted
SELECT 'Templates count:' as info, COUNT(*) as count FROM email_templates;
SELECT 'Automations count:' as info, COUNT(*) as count FROM email_automations;
SELECT 'System settings count:' as info, COUNT(*) as count FROM system_settings;

-- Show recent templates
SELECT name, template_type, is_active, created_at
FROM email_templates
ORDER BY created_at DESC
LIMIT 5;

-- Show recent automations
SELECT name, trigger_type, trigger_delay_hours, is_active, created_at
FROM email_automations
ORDER BY created_at DESC
LIMIT 5;

-- Show system settings
SELECT key, value, description, category
FROM system_settings
ORDER BY category, key;

-- Clean up test data
DELETE FROM email_automations WHERE name = 'Test Automation';
DELETE FROM email_templates WHERE name = 'test_template';
DELETE FROM system_settings WHERE key = 'test_setting';

COMMIT;

-- ===================================================================
-- SUCCESS MESSAGE
-- ===================================================================

SELECT
  '✅ Email automation setup test completed successfully!' as status,
  NOW() as test_time;