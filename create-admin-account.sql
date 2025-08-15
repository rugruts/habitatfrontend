-- 🔐 Habitat Lobby - Admin Account Creation Script
-- This script creates the admin account for habitatl@protonmail.com
-- Password: Habitat123!

-- First, ensure auth schema exists and is properly configured
-- This should be run in your Supabase SQL Editor

-- First, check if the user already exists
DO $$
DECLARE
    admin_user_id uuid;
BEGIN
    -- Check if user already exists
    SELECT id INTO admin_user_id FROM auth.users WHERE email = 'habitatl@protonmail.com';

    -- If user doesn't exist, create it
    IF admin_user_id IS NULL THEN
        -- Generate a new UUID for the user
        admin_user_id := gen_random_uuid();

        -- Create the admin user account
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
            admin_user_id,
            'authenticated',
            'authenticated',
            'habitatl@protonmail.com',
            crypt('Habitat123!', gen_salt('bf')), -- Bcrypt hash of the password
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
            '{"role": "admin", "name": "Habitat Admin"}',
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

        RAISE NOTICE 'Admin user created successfully with ID: %', admin_user_id;
    ELSE
        RAISE NOTICE 'Admin user already exists with ID: %', admin_user_id;
    END IF;
END $$;

-- Create identity record for the user (if it doesn't exist)
DO $$
DECLARE
    admin_user_id uuid;
    identity_exists boolean := false;
BEGIN
    -- Get the user ID
    SELECT id INTO admin_user_id FROM auth.users WHERE email = 'habitatl@protonmail.com';

    -- Check if identity already exists
    SELECT EXISTS(
        SELECT 1 FROM auth.identities
        WHERE user_id = admin_user_id AND provider = 'email'
    ) INTO identity_exists;

    -- Create identity if it doesn't exist
    IF admin_user_id IS NOT NULL AND NOT identity_exists THEN
        INSERT INTO auth.identities (
            provider_id,
            user_id,
            identity_data,
            provider,
            last_sign_in_at,
            created_at,
            updated_at
        ) VALUES (
            admin_user_id::text,
            admin_user_id,
            jsonb_build_object(
                'sub', admin_user_id::text,
                'email', 'habitatl@protonmail.com',
                'email_verified', true,
                'phone_verified', false
            ),
            'email',
            NOW(),
            NOW(),
            NOW()
        );

        RAISE NOTICE 'Identity created for admin user';
    ELSE
        RAISE NOTICE 'Identity already exists for admin user';
    END IF;
END $$;

-- Verify the account was created
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  raw_user_meta_data
FROM auth.users 
WHERE email = 'habitatl@protonmail.com';

-- 🎯 IMPORTANT NOTES:
-- 1. Run this script in your Supabase SQL Editor
-- 2. The password is: Habitat123!
-- 3. Only this email can access the admin panel
-- 4. The account is automatically confirmed and ready to use
-- 5. If you need to reset the password later, use Supabase Auth UI

-- 🔒 Security Features:
-- - Password is properly hashed with bcrypt
-- - Email is pre-confirmed (no verification needed)
-- - Account has admin metadata
-- - Only this specific email can access admin routes
