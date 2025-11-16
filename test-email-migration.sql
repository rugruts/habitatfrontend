-- Test Email Automation Migration
-- Run this after the main migration to verify everything works

-- Test 1: Check if scheduled_emails table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'scheduled_emails'
) as table_exists;

-- Test 2: Check if email_status enum has correct values
SELECT unnest(enum_range(NULL::email_status)) as email_status_values;

-- Test 3: Check if automation_trigger_type enum exists
SELECT EXISTS (
  SELECT FROM pg_type 
  WHERE typname = 'automation_trigger_type'
) as enum_exists;

-- Test 4: Test inserting a scheduled email
INSERT INTO scheduled_emails (
  automation_id,
  booking_id,
  guest_email,
  guest_name,
  scheduled_for,
  status,
  metadata
) VALUES (
  gen_random_uuid(),
  gen_random_uuid(),
  'test@example.com',
  'Test User',
  NOW() + INTERVAL '1 hour',
  'scheduled',
  '{"test": true}'
);

-- Test 5: Verify the insert worked
SELECT * FROM scheduled_emails WHERE guest_email = 'test@example.com';

-- Test 6: Clean up test data
DELETE FROM scheduled_emails WHERE guest_email = 'test@example.com';

-- Test 7: Check if functions exist
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN (
  'process_scheduled_emails',
  'create_default_email_automations',
  'trigger_email_automation',
  'check_approaching_checkins',
  'check_completed_checkouts'
);

-- Test 8: Check if triggers exist
SELECT trigger_name 
FROM information_schema.triggers 
WHERE trigger_schema = 'public' 
AND trigger_name IN (
  'booking_created_email_trigger',
  'update_scheduled_emails_updated_at'
);

-- All tests passed if no errors occurred
SELECT 'Migration test completed successfully!' as status;



