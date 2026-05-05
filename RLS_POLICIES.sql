-- ========================================
-- SUPABASE RLS POLICIES CONFIGURATION
-- ========================================
-- Run this AFTER creating database schema

-- Enable RLS on all tables
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_calculator_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE web_vitals ENABLE ROW LEVEL SECURITY;

-- 1. ARTICLES POLICIES
-- Public can read published articles
CREATE POLICY "Published articles are viewable by everyone" ON articles
    FOR SELECT USING (status = 'published');

-- Authenticated users can read all articles
CREATE POLICY "Authenticated users can view all articles" ON articles
    FOR SELECT USING (auth.role() = 'authenticated');

-- Authenticated users can insert articles
CREATE POLICY "Authenticated users can create articles" ON articles
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Article authors can update their own articles
CREATE POLICY "Authors can update their own articles" ON articles
    FOR UPDATE USING (auth.uid() = author_id);

-- Article authors can delete their own articles
CREATE POLICY "Authors can delete their own articles" ON articles
    FOR DELETE USING (auth.uid() = author_id);

-- 2. CONTACT_SUBMISSIONS POLICIES
-- Anyone can insert contact submissions
CREATE POLICY "Anyone can submit contact form" ON contact_submissions
    FOR INSERT WITH CHECK (true);

-- Authenticated users can read all contact submissions
CREATE POLICY "Authenticated users can view contact submissions" ON contact_submissions
    FOR SELECT USING (auth.role() = 'authenticated');

-- Authenticated users can update contact submissions
CREATE POLICY "Authenticated users can update contact submissions" ON contact_submissions
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Authenticated users can delete contact submissions
CREATE POLICY "Authenticated users can delete contact submissions" ON contact_submissions
    FOR DELETE USING (auth.role() = 'authenticated');

-- 3. TAX_CALCULATOR_HISTORY POLICIES
-- Users can read their own calculations
CREATE POLICY "Users can view their own tax calculations" ON tax_calculator_history
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own calculations
CREATE POLICY "Users can create their own tax calculations" ON tax_calculator_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own calculations
CREATE POLICY "Users can update their own tax calculations" ON tax_calculator_history
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own calculations
CREATE POLICY "Users can delete their own tax calculations" ON tax_calculator_history
    FOR DELETE USING (auth.uid() = user_id);

-- 4. SITE_CONTENT POLICIES
-- Anyone can read site content
CREATE POLICY "Site content is viewable by everyone" ON site_content
    FOR SELECT USING (true);

-- Authenticated users can update site content
CREATE POLICY "Authenticated users can update site content" ON site_content
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Authenticated users can insert site content
CREATE POLICY "Authenticated users can create site content" ON site_content
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Authenticated users can delete site content
CREATE POLICY "Authenticated users can delete site content" ON site_content
    FOR DELETE USING (auth.role() = 'authenticated');

-- 5. WEB_VITALS POLICIES
-- Anyone can insert web vitals (for analytics)
CREATE POLICY "Anyone can submit web vitals" ON web_vitals
    FOR INSERT WITH CHECK (true);

-- Authenticated users can read web vitals
CREATE POLICY "Authenticated users can view web vitals" ON web_vitals
    FOR SELECT USING (auth.role() = 'authenticated');

-- Authenticated users can delete web vitals
CREATE POLICY "Authenticated users can delete web vitals" ON web_vitals
    FOR DELETE USING (auth.role() = 'authenticated');

-- 6. STORAGE POLICIES (Run via Supabase Dashboard UI)
-- For article-images bucket:
-- Policy: "Public read access for article images"
-- SELECT: true
-- INSERT: authenticated users only
-- UPDATE: authenticated users only
-- DELETE: authenticated users only

-- 7. TEST DATA INSERTIONS (for testing)
INSERT INTO articles (title, slug, content, excerpt, status, author_id) VALUES
('Welcome to JADTRA Consulting', 'welcome-to-jadtra-consulting', 
'<p>This is the first article for JADTRA Consulting. We provide exceptional tax consulting services.</p>',
'Welcome article introducing JADTRA Consulting services', 'published', 'a9042f24-10b8-4251-a87e-67ae51ff126a')
ON CONFLICT (slug) DO NOTHING;

-- 8. VERIFICATION QUERIES (Run these to test)
-- Test RLS policies:
-- SELECT * FROM articles; -- Should show published articles only
-- SELECT * FROM site_content; -- Should show all site content
-- SELECT * FROM contact_submissions; -- Should show nothing (no data yet)

-- Check if policies exist:
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
