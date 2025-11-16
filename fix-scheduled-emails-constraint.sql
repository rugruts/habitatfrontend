-- Fix Scheduled Emails Foreign Key Constraint Issue
-- This script will clean up orphaned scheduled emails and fix the constraint

-- First, let's see what's causing the issue
SELECT '=== DIAGNOSTIC INFORMATION ===' as info;

-- Check if email_automations table exists and has data
SELECT 
  'email_automations' as table_name,
  COUNT(*) as record_count
FROM email_automations;

-- Check if scheduled_emails table exists and has data
SELECT 
  'scheduled_emails' as table_name,
  COUNT(*) as record_count
FROM scheduled_emails;

-- Find orphaned scheduled emails (automation_id doesn't exist in email_automations)
SELECT 
  'Orphaned scheduled emails' as issue,
  COUNT(*) as count
FROM scheduled_emails se
LEFT JOIN email_automations ea ON se.automation_id = ea.id
WHERE ea.id IS NULL;

-- Show the specific orphaned records
SELECT 
  se.id,
  se.automation_id,
  se.booking_id,
  se.guest_email,
  se.scheduled_for,
  se.status
FROM scheduled_emails se
LEFT JOIN email_automations ea ON se.automation_id = ea.id
WHERE ea.id IS NULL;

-- Fix 1: Delete orphaned scheduled emails
DELETE FROM scheduled_emails 
WHERE automation_id IN (
  SELECT se.automation_id
  FROM scheduled_emails se
  LEFT JOIN email_automations ea ON se.automation_id = ea.id
  WHERE ea.id IS NULL
);

-- Fix 2: Update the foreign key constraint to CASCADE DELETE
-- This will automatically delete scheduled emails when their automation is deleted
ALTER TABLE scheduled_emails 
DROP CONSTRAINT IF EXISTS scheduled_emails_automation_id_fkey;

ALTER TABLE scheduled_emails 
ADD CONSTRAINT scheduled_emails_automation_id_fkey 
FOREIGN KEY (automation_id) 
REFERENCES email_automations(id) 
ON DELETE CASCADE;

-- Fix 3: Also add CASCADE for booking_id if it exists
ALTER TABLE scheduled_emails 
DROP CONSTRAINT IF EXISTS scheduled_emails_booking_id_fkey;

ALTER TABLE scheduled_emails 
ADD CONSTRAINT scheduled_emails_booking_id_fkey 
FOREIGN KEY (booking_id) 
REFERENCES bookings(id) 
ON DELETE CASCADE;

-- Verify the fix worked
SELECT '=== VERIFICATION ===' as info;

-- Check remaining scheduled emails
SELECT 
  'Remaining scheduled emails' as status,
  COUNT(*) as count
FROM scheduled_emails;

-- Check for any remaining orphaned records
SELECT 
  'Remaining orphaned records' as status,
  COUNT(*) as count
FROM scheduled_emails se
LEFT JOIN email_automations ea ON se.automation_id = ea.id
WHERE ea.id IS NULL;

-- Show the constraints
SELECT 
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name,
  rc.delete_rule
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
JOIN information_schema.referential_constraints AS rc
  ON tc.constraint_name = rc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name = 'scheduled_emails';

SELECT 'Foreign key constraint fix completed!' as status;



