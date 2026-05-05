-- ========================================
-- CMS STRUCTURE FIX
-- ========================================
-- Execute in Supabase SQL Editor

-- 1. Ensure correct structure for site_content
-- Clear existing data and insert with correct keys
DELETE FROM site_content;

-- 2. Insert with correct structure
INSERT INTO site_content (key, value) VALUES
('header_html', '<h1>Welcome to JADTRA Consulting</h1><p>Your trusted tax consulting partner</p>'),
('homepage_content', '<p>We provide exceptional tax consulting and business advisory services.</p><p>With over 15 years of experience, we help businesses navigate complex tax regulations and achieve sustainable growth.</p>'),
('footer_html', '<p>&copy; 2024 JADTRA Consulting. All rights reserved.</p><p>KKP Hakim Muhamad dan Rekan</p>'),
('site_title', 'JADTRA Consulting - Tax Services & Business Advisory');

-- 3. Verify structure
SELECT 
    key,
    LEFT(value, 50) as preview,
    LENGTH(value) as content_length,
    created_at,
    updated_at
FROM site_content 
ORDER BY key;

-- 4. Test RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'site_content'
ORDER BY policyname;
