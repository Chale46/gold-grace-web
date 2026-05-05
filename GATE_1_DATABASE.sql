-- ========================================
-- GATE 1: DATABASE FOUNDATION
-- ========================================
-- Execute in Supabase SQL Editor

-- 1. Create site_content table
CREATE TABLE IF NOT EXISTS site_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Ensure articles table exists (simplified version)
CREATE TABLE IF NOT EXISTS articles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT,
    content TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable RLS
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies

-- Public read for site_content
CREATE POLICY IF NOT EXISTS "public read content" 
ON site_content FOR SELECT USING (true);

-- Authenticated write for site_content
CREATE POLICY IF NOT EXISTS "auth write content" 
ON site_content FOR ALL USING (auth.role() = 'authenticated');

-- Public read for articles
CREATE POLICY IF NOT EXISTS "public read articles" 
ON articles FOR SELECT USING (true);

-- Authenticated write for articles
CREATE POLICY IF NOT EXISTS "auth write articles" 
ON articles FOR ALL USING (auth.role() = 'authenticated');

-- 5. Test data insertion
INSERT INTO site_content (key, value) VALUES
('header_html', '<h1>Welcome to JADTRA Consulting</h1>'),
('homepage_content', '<p>We provide exceptional tax consulting services.</p>'),
('footer_html', '<p>&copy; 2024 JADTRA Consulting. All rights reserved.</p>'),
('site_title', 'JADTRA Consulting - Tax Services')
ON CONFLICT (key) DO NOTHING;

-- 6. Verification queries
SELECT 'site_content' as table_name, count(*) as record_count FROM site_content;
SELECT 'articles' as table_name, count(*) as record_count FROM articles;

-- 7. Check RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
