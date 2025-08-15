-- 🔐 Simple Admin Account Creation for Habitat Lobby
-- Alternative method using Supabase Auth functions
-- Run this in Supabase SQL Editor

-- Method 1: Using Supabase's auth.users table directly (simpler approach)
-- This creates the user with a hashed password

-- First, let's check if the user exists
SELECT 
  id, 
  email, 
  email_confirmed_at, 
  created_at 
FROM auth.users 
WHERE email = 'habitatl@protonmail.com';

-- If the above query returns no results, run the following INSERT:

INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  confirmation_sent_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  email_change_sent_at,
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
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"role":"admin","name":"Habitat Admin"}',
  now(),
  now(),
  '',
  '',
  '',
  now(),
  ''
);

-- Create the corresponding identity
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
  format('{"sub":"%s","email":"%s","email_verified":true,"phone_verified":false}', u.id, u.email)::jsonb,
  'email',
  now(),
  now(),
  now()
FROM auth.users u
WHERE u.email = 'habitatl@protonmail.com'
AND NOT EXISTS (
  SELECT 1 FROM auth.identities
  WHERE user_id = u.id AND provider = 'email'
);

-- Verify the account was created successfully
SELECT 
  u.id,
  u.email,
  u.email_confirmed_at,
  u.created_at,
  u.raw_user_meta_data,
  i.provider
FROM auth.users u
LEFT JOIN auth.identities i ON u.id = i.user_id
WHERE u.email = 'habitatl@protonmail.com';

-- 🎯 CREDENTIALS:
-- Email: habitatl@protonmail.com
-- Password: Habitat123!

-- 📝 NOTES:
-- 1. The password is automatically hashed with bcrypt
-- 2. Email is pre-confirmed (no verification needed)
-- 3. User has admin metadata
-- 4. Identity record is created for email provider
-- 5. Account is ready to use immediately

-- 🔍 TROUBLESHOOTING:
-- If you get errors, try running each section separately:
-- 1. First run the SELECT to check if user exists
-- 2. Then run the INSERT for users table
-- 3. Then run the INSERT for identities table
-- 4. Finally run the verification SELECT
