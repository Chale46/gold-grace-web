-- ========================================
-- GOLD GRACE WEB - DATABASE SCHEMA
-- ========================================
-- Run this in Supabase SQL Editor

-- 1. ARTICLES TABLE
CREATE TABLE IF NOT EXISTS articles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT,
    excerpt TEXT,
    featured_image TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    is_featured BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    author_id UUID REFERENCES auth.users(id),
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CONTACT_SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS contact_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'completed', 'spam')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TAX_CALCULATOR_HISTORY TABLE
CREATE TABLE IF NOT EXISTS tax_calculator_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    income_amount DECIMAL(15,2) NOT NULL,
    tax_year INTEGER NOT NULL,
    tax_calculation DECIMAL(15,2) NOT NULL,
    calculation_data JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SITE_CONTENT TABLE
CREATE TABLE IF NOT EXISTS site_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT NOT NULL UNIQUE,
    content TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. WEB_VITALS TABLE
CREATE TABLE IF NOT EXISTS web_vitals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    value DECIMAL(10,4) NOT NULL,
    delta DECIMAL(10,4),
    url TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    user_agent TEXT,
    device TEXT,
    connection TEXT,
    memory BIGINT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. INCREMENT VIEW COUNT FUNCTION
CREATE OR REPLACE FUNCTION increment_view_count(article_uuid UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE articles 
    SET view_count = view_count + 1 
    WHERE id = article_uuid;
END;
$$ LANGUAGE plpgsql;

-- 7. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_contact_status ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_tax_calc_user ON tax_calculator_history(user_id);
CREATE INDEX IF NOT EXISTS idx_site_content_key ON site_content(key);
CREATE INDEX IF NOT EXISTS idx_web_vitals_url ON web_vitals(url);
CREATE INDEX IF NOT EXISTS idx_web_vitals_name ON web_vitals(name);

-- 8. SAMPLE DATA (Optional - for testing)
INSERT INTO site_content (key, content) VALUES
('header', '<h1>Welcome to JADTRA Consulting</h1>'),
('body', '<p>We provide exceptional tax consulting services.</p>'),
('footer', '<p>&copy; 2024 JADTRA Consulting. All rights reserved.</p>')
ON CONFLICT (key) DO NOTHING;

-- 9. STORAGE BUCKETS (Run via Supabase Dashboard UI)
-- Create these buckets in Supabase Dashboard > Storage:
-- - article-images
-- - uploads
