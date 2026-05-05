-- ========================================
-- CREATE USER WITH SPECIFIC UID
-- ========================================
-- Run this in Supabase SQL Editor to create user with UID: 972f3585-93b2-4308-b26e-df3ed5a55543

-- First, delete any existing user with this email or UID
DELETE FROM auth.users WHERE id = '972f3585-93b2-4308-b26e-df3ed5a55543';
DELETE FROM auth.users WHERE email = 'jadtraconsulting@gmail.com';

-- Create user with specific UID
INSERT INTO auth.users (
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at
) VALUES (
    '972f3585-93b2-4308-b26e-df3ed5a55543',
    'authenticated',
    'authenticated',
    'jadtraconsulting@gmail.com',
    crypt('Jadtra123!!', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW()
);

-- Verify user was created
SELECT 
    id,
    email,
    email_confirmed_at,
    created_at
FROM auth.users 
WHERE id = '972f3585-93b2-4308-b26e-df3ed5a55543';

-- Test login credentials (this will show if password hash is correct)
-- You can test this in the browser after running the SQL
