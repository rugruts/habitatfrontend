-- 🔐 Minimal Admin Account Creation - GUARANTEED TO WORK
-- Run this in Supabase SQL Editor

-- STEP 1: Check if user exists
SELECT email FROM auth.users WHERE email = 'habitatl@protonmail.com';

-- STEP 2: Create user (only if STEP 1 returned no results)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000'::uuid,
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'habitatl@protonmail.com',
  crypt('Habitat123!', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"role":"admin"}',
  now(),
  now()
);

-- STEP 3: Create identity (run after STEP 2)
INSERT INTO auth.identities (
  provider_id,
  user_id,
  identity_data,
  provider,
  created_at,
  updated_at
)
SELECT
  u.id::text,
  u.id,
  jsonb_build_object(
    'sub', u.id::text,
    'email', u.email,
    'email_verified', true
  ),
  'email',
  now(),
  now()
FROM auth.users u
WHERE u.email = 'habitatl@protonmail.com';

-- STEP 4: Verify everything worked
SELECT 
  u.email,
  u.email_confirmed_at,
  i.provider
FROM auth.users u
JOIN auth.identities i ON u.id = i.user_id
WHERE u.email = 'habitatl@protonmail.com';

-- 🎯 DONE! Login with:
-- Email: habitatl@protonmail.com
-- Password: Habitat123!
