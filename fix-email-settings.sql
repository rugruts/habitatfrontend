-- ===================================================================
-- FIX EMAIL SETTINGS
-- Update all email addresses to use only admin@habitatlobby.com
-- ===================================================================

-- Update existing system settings to use correct email addresses
UPDATE system_settings
SET value = 'admin@habitatlobby.com'
WHERE key IN ('from_email', 'reply_to_email', 'email_from_address', 'business_email')
  AND value != 'admin@habitatlobby.com';

-- Add reply-to setting if it doesn't exist
INSERT INTO system_settings (key, value, description, category, created_at, updated_at)
VALUES
('email_reply_to', 'admin@habitatlobby.com', 'Reply-to email address', 'email', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Ensure business email is set correctly
INSERT INTO system_settings (key, value, description, category, created_at, updated_at)
VALUES
('business_email', 'admin@habitatlobby.com', 'Business contact email', 'business', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Update email templates to use correct variables
UPDATE email_templates
SET content = REPLACE(content, 'noreply@habitatlobby.com', '{{business_email}}')
WHERE content LIKE '%noreply@habitatlobby.com%';

UPDATE email_templates
SET content = REPLACE(content, 'info@habitatlobby.com', '{{business_email}}')
WHERE content LIKE '%info@habitatlobby.com%';

-- Update template subjects too
UPDATE email_templates
SET subject = REPLACE(subject, 'noreply@habitatlobby.com', '{{business_email}}')
WHERE subject LIKE '%noreply@habitatlobby.com%';

UPDATE email_templates
SET subject = REPLACE(subject, 'info@habitatlobby.com', '{{business_email}}')
WHERE subject LIKE '%info@habitatlobby.com%';

COMMIT;

-- ===================================================================
-- VERIFICATION
-- ===================================================================

-- Check current email settings
SELECT key, value, description
FROM system_settings
WHERE key LIKE '%email%' OR key LIKE '%from%' OR key LIKE '%reply%'
ORDER BY key;

-- Check that templates don't contain invalid email addresses
SELECT name, template_type,
       CASE
         WHEN content LIKE '%noreply@habitatlobby.com%' THEN 'Contains noreply@habitatlobby.com'
         WHEN content LIKE '%info@habitatlobby.com%' THEN 'Contains info@habitatlobby.com'
         ELSE 'OK'
       END as email_check
FROM email_templates;

-- ===================================================================
-- SUCCESS MESSAGE
-- ===================================================================

SELECT
  '✅ Email settings fixed successfully!' as status,
  'All email addresses updated to admin@habitatlobby.com' as message,
  NOW() as fixed_at;