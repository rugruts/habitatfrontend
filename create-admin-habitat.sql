-- Create Admin Account: admin@habitat.com
-- Password: admin123
-- Run this script in Supabase SQL Editor

-- First, check if the user already exists and delete if needed
DELETE FROM auth.users WHERE email = 'admin@habitat.com';

-- Create the admin user in auth.users table
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
  'admin@habitat.com',
  crypt('admin123', gen_salt('bf')), -- Properly hashed password
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
  '{"full_name": "Admin User", "role": "admin"}',
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
);

-- Get the user ID for the admin user we just created
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    -- Get the admin user ID
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = 'admin@habitat.com';
    
    -- Insert into admin_users table if it exists
    INSERT INTO public.admin_users (
        id,
        email,
        full_name,
        role,
        is_active,
        created_at,
        updated_at
    ) VALUES (
        admin_user_id,
        'admin@habitat.com',
        'Admin User',
        'super_admin',
        true,
        NOW(),
        NOW()
    ) ON CONFLICT (email) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role,
        is_active = EXCLUDED.is_active,
        updated_at = NOW();
        
    RAISE NOTICE 'Admin user created successfully with ID: %', admin_user_id;
END $$;

-- Verify the admin user was created
SELECT 
    id,
    email,
    email_confirmed_at,
    created_at,
    raw_user_meta_data->>'role' as role
FROM auth.users 
WHERE email = 'admin@habitat.com';

-- Also check admin_users table if it exists
SELECT 
    id,
    email,
    full_name,
    role,
    is_active,
    created_at
FROM public.admin_users 
WHERE email = 'admin@habitat.com';

-- Success message
SELECT 'Admin account created successfully!' as message,
       'Email: admin@habitat.com' as email,
       'Password: admin123' as password,
       'Role: super_admin' as role;
