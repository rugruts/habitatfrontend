-- 🔐 FINAL Admin Account Creation - ULTRA SIMPLE
-- Copy and paste each section one by one in Supabase SQL Editor

-- 1️⃣ CHECK: See if admin already exists
SELECT email, created_at FROM auth.users WHERE email = 'habitatl@protonmail.com';

-- 2️⃣ CREATE USER: Only run if step 1 shows no results
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data
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
  '{"provider":"email","providers":["email"]}',
  '{"role":"admin"}'
);

-- 3️⃣ CREATE IDENTITY: Run after step 2
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
  ('{"sub":"' || u.id || '","email":"' || u.email || '","email_verified":true}')::jsonb,
  'email',
  now(),
  now()
FROM auth.users u 
WHERE u.email = 'habitatl@protonmail.com';

-- 4️⃣ VERIFY: Check everything worked
SELECT 
  u.email,
  u.email_confirmed_at IS NOT NULL as email_confirmed,
  i.provider,
  'SUCCESS' as status
FROM auth.users u
JOIN auth.identities i ON u.id = i.user_id
WHERE u.email = 'habitatl@protonmail.com';

-- ✅ DONE! 
-- Login at: /admin/login
-- Email: habitatl@protonmail.com  
-- Password: Habitat123!
