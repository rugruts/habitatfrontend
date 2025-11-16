-- Check Automation Consistency
-- This script will help identify and fix automation-related issues

-- Check if the specific automation ID exists
SELECT 
  'Specific automation check' as check_type,
  CASE 
    WHEN EXISTS (SELECT 1 FROM email_automations WHERE id = '74814493-9f5b-4369-aff9-d7cbcb407388') 
    THEN 'EXISTS' 
    ELSE 'MISSING' 
  END as status,
  '74814493-9f5b-4369-aff9-d7cbcb407388' as automation_id;

-- Show all automation IDs for comparison
SELECT 
  'All automation IDs' as info,
  id,
  name,
  created_at
FROM email_automations 
ORDER BY created_at DESC;

-- Check for any scheduled emails with this specific automation_id
SELECT 
  'Scheduled emails with problematic automation_id' as info,
  id,
  automation_id,
  booking_id,
  guest_email,
  scheduled_for,
  status
FROM scheduled_emails 
WHERE automation_id = '74814493-9f5b-4369-aff9-d7cbcb407388';

-- Check for any scheduled emails with non-existent automation_ids
SELECT 
  'All orphaned scheduled emails' as info,
  se.id,
  se.automation_id,
  se.booking_id,
  se.guest_email,
  se.scheduled_for,
  se.status
FROM scheduled_emails se
LEFT JOIN email_automations ea ON se.automation_id = ea.id
WHERE ea.id IS NULL;

-- Check if there are any automations being created with this specific ID
-- This might indicate a UUID generation issue
SELECT 
  'Recent automations (last 10)' as info,
  id,
  name,
  trigger_type,
  created_at
FROM email_automations 
ORDER BY created_at DESC 
LIMIT 10;

-- Check for any duplicate automation IDs (shouldn't happen with UUIDs)
SELECT 
  'Duplicate automation IDs check' as info,
  id,
  COUNT(*) as count
FROM email_automations 
GROUP BY id 
HAVING COUNT(*) > 1;

-- Check the automation creation function if it exists
SELECT 
  'Automation creation function check' as info,
  routine_name,
  routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name LIKE '%automation%';

-- Show the current state of both tables
SELECT 
  'Table summary' as info,
  'email_automations' as table_name,
  COUNT(*) as record_count
FROM email_automations
UNION ALL
SELECT 
  'Table summary' as info,
  'scheduled_emails' as table_name,
  COUNT(*) as record_count
FROM scheduled_emails;



