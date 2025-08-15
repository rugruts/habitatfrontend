-- Habitat Lobby - Create Admin User Script
-- Run this in your Supabase SQL Editor to create the admin account

-- First, update the admin function to include info@habitatlobby.com
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN auth.email() IN (
    'HabitatLobby@protonmail.com',
    'info@habitatlobby.com',
    'admin@habitatlobby.com'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the admin user account
-- Note: This creates a user in the auth.users table directly
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  invited_at,
  confirmation_token,
  confirmation_sent_at,
  recovery_token,
  recovery_sent_at,
  email_change_token_new,
  email_change,
  email_change_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  phone,
  phone_confirmed_at,
  phone_change,
  phone_change_token,
  phone_change_sent_at,
  email_change_token_current,
  email_change_confirm_status,
  banned_until,
  reauthentication_token,
  reauthentication_sent_at,
  is_sso_user,
  deleted_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'info@habitatlobby.com',
  crypt('HabitatAdmin2024!', gen_salt('bf')), -- Password: HabitatAdmin2024!
  NOW(),
  NOW(),
  '',
  NOW(),
  '',
  NULL,
  '',
  '',
  NULL,
  NULL,
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Admin User"}',
  false,
  NOW(),
  NOW(),
  NULL,
  NULL,
  '',
  '',
  NULL,
  '',
  0,
  NULL,
  '',
  NULL,
  false,
  NULL
) ON CONFLICT (email) DO NOTHING;

-- Create a corresponding profile in the public schema (if you have a profiles table)
-- Uncomment and modify this if you have a profiles table
/*
INSERT INTO public.profiles (
  id,
  email,
  full_name,
  role,
  created_at,
  updated_at
) 
SELECT 
  id,
  email,
  'Admin User',
  'admin',
  NOW(),
  NOW()
FROM auth.users 
WHERE email = 'info@habitatlobby.com'
ON CONFLICT (id) DO NOTHING;
*/

-- Verify the admin user was created and can access admin functions
SELECT 
  email,
  email_confirmed_at IS NOT NULL as email_confirmed,
  created_at
FROM auth.users 
WHERE email = 'info@habitatlobby.com';

-- Test the admin function
SELECT 
  'info@habitatlobby.com' as test_email,
  'info@habitatlobby.com' = ANY(ARRAY[
    'HabitatLobby@protonmail.com',
    'info@habitatlobby.com', 
    'admin@habitatlobby.com'
  ]) as is_in_admin_list;
