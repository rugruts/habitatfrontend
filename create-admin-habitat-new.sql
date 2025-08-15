-- Create Admin Account: admin@habitat.com
-- Password: admin123
-- Run this in Supabase SQL Editor

-- First, check if the user already exists and delete if needed
DELETE FROM auth.users WHERE email = 'admin@habitat.com';
DELETE FROM auth.identities WHERE provider_id IN (
  SELECT id::text FROM auth.users WHERE email = 'admin@habitat.com'
);

-- Create the admin user in auth.users table
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
  'admin@habitat.com',
  crypt('admin123', gen_salt('bf')),
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
WHERE u.email = 'admin@habitat.com';

-- Verify the admin user was created
SELECT 
    id,
    email,
    email_confirmed_at,
    created_at,
    raw_user_meta_data->>'role' as role,
    'Admin account created successfully!' as status
FROM auth.users 
WHERE email = 'admin@habitat.com';

-- Success message
SELECT 'ADMIN ACCOUNT CREATED!' as message,
       'Email: admin@habitat.com' as email,
       'Password: admin123' as password,
       'Login URL: /admin' as login_url;
