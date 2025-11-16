-- Test Automation System
-- Run this to check if automations are working correctly

-- Check if email_automations table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'email_automations'
) as automations_table_exists;

-- Check table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'email_automations' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check if there are any automations
SELECT COUNT(*) as automation_count FROM email_automations;

-- Show all automations if any exist
SELECT 
  id,
  name,
  template_id,
  trigger_type,
  trigger_delay_hours,
  is_active,
  created_at
FROM email_automations 
ORDER BY created_at DESC;

-- Test creating a simple automation (only if templates exist)
INSERT INTO email_automations (
  name, 
  template_id, 
  trigger_type, 
  trigger_delay_hours, 
  is_active, 
  conditions
) 
SELECT 
  'Test Automation',
  id,
  'booking_created',
  0,
  true,
  '{"booking_status": ["confirmed"]}'
FROM email_templates 
WHERE template_type = 'booking_confirmation' 
LIMIT 1
ON CONFLICT DO NOTHING;

-- Verify the test automation was created
SELECT 
  name, 
  trigger_type, 
  trigger_delay_hours,
  is_active
FROM email_automations 
WHERE name = 'Test Automation';

-- Clean up test automation
DELETE FROM email_automations WHERE name = 'Test Automation';

-- Final status
SELECT 'Automation system test completed!' as status;



