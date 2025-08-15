-- 🔐 Step-by-Step Admin Account Creation
-- Run each section separately in Supabase SQL Editor

-- STEP 1: Check if admin user already exists
SELECT 
  id, 
  email, 
  email_confirmed_at, 
  created_at 
FROM auth.users 
WHERE email = 'habitatl@protonmail.com';

-- If the above returns no results, proceed to STEP 2
-- If it returns a user, skip to STEP 4 to verify

-- STEP 2: Create the admin user (only run if STEP 1 returned no results)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  confirmation_sent_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000'::uuid,
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'habitatl@protonmail.com',
  crypt('Habitat123!', gen_salt('bf')),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"role":"admin","name":"Habitat Admin"}',
  now(),
  now(),
  '',
  ''
);

-- STEP 3: Create the identity record
INSERT INTO auth.identities (
  provider_id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
)
SELECT
  u.id::text,
  u.id,
  jsonb_build_object(
    'sub', u.id::text,
    'email', u.email,
    'email_verified', true,
    'phone_verified', false
  ),
  'email',
  now(),
  now(),
  now()
FROM auth.users u
WHERE u.email = 'habitatl@protonmail.com'
AND NOT EXISTS (
  SELECT 1 FROM auth.identities i
  WHERE i.user_id = u.id AND i.provider = 'email'
);

-- STEP 4: Verify the account was created successfully
SELECT 
  u.id,
  u.email,
  u.email_confirmed_at,
  u.created_at,
  u.raw_user_meta_data,
  i.provider,
  i.created_at as identity_created
FROM auth.users u
LEFT JOIN auth.identities i ON u.id = i.user_id
WHERE u.email = 'habitatl@protonmail.com';

-- 🎯 SUCCESS! Your admin account is ready
-- 
-- Login Credentials:
-- Email: habitatl@protonmail.com
-- Password: Habitat123!
-- 
-- Access URL: /admin/login
--
-- 📝 Notes:
-- - The account is pre-confirmed (no email verification needed)
-- - Password is securely hashed with bcrypt
-- - Only this email can access the admin panel
-- - Session will persist across browser restarts
