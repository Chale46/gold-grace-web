-- ========================================
-- FULL DATABASE SCHEMA AUDIT - ARTICLES TABLE
-- ========================================

-- STEP 1 — DEFINE REQUIRED FINAL SCHEMA
-- ======================================
-- Required columns for articles table:
-- id uuid primary key
-- title text
-- excerpt text
-- content text
-- featured_image_url text
-- slug text
-- is_featured boolean default false
-- meta_title text
-- meta_description text
-- created_at timestamp default now()
-- published_at timestamp

-- STEP 2 — AUTO DETECT MISSING COLUMNS
-- =====================================
-- Check existing columns
-- select column_name from information_schema.columns where table_name = 'articles';

-- STEP 3 — GENERATE FIX (SINGLE EXECUTION)
-- =========================================

-- Create table if not exists
create table if not exists articles (
    id uuid primary key default gen_random_uuid(),
    title text,
    excerpt text,
    content text,
    featured_image_url text,
    slug text,
    is_featured boolean default false,
    meta_title text,
    meta_description text,
    created_at timestamp default now(),
    published_at timestamp
);

-- Add all missing columns (idempotent)
alter table articles add column if not exists id uuid primary key default gen_random_uuid();
alter table articles add column if not exists title text;
alter table articles add column if not exists excerpt text;
alter table articles add column if not exists content text;
alter table articles add column if not exists featured_image_url text;
alter table articles add column if not exists slug text;
alter table articles add column if not exists is_featured boolean default false;
alter table articles add column if not exists meta_title text;
alter table articles add column if not exists meta_description text;
alter table articles add column if not exists created_at timestamp default now();
alter table articles add column if not exists published_at timestamp;

-- Add unique constraint for slug
alter table articles add constraint if not exists articles_slug_unique unique (slug);

-- STEP 4 — DEFAULT DATA SAFETY
-- =============================

-- Set safe defaults for existing null values
update articles set is_featured = false where is_featured is null;
update articles set created_at = now() where created_at is null;
update articles set title = 'Untitled Article' where title is null or title = '';
update articles set slug = coalesce(slug, 'article-' || substr(id::text, 1, 8)) where slug is null or slug = '';
update articles set excerpt = coalesce(excerpt, left(content, 150) || '...') where (excerpt is null or excerpt = '') and content is not null;

-- STEP 5 — OPTIONAL INDEX (PERFORMANCE)
-- ======================================

-- Create indexes for better query performance
create index if not exists idx_articles_slug on articles(slug);
create index if not exists idx_articles_created_at on articles(created_at desc);
create index if not exists idx_articles_published_at on articles(published_at desc);
create index if not exists idx_articles_is_featured on articles(is_featured) where is_featured = true;

-- STEP 6 — VALIDATION
-- ====================

-- Verify table structure
select 
    column_name,
    data_type,
    is_nullable,
    column_default
from information_schema.columns 
where table_name = 'articles' 
order by ordinal_position;

-- Test insert
select 'Validation: Sample query structure' as status;
select 
    id,
    title,
    excerpt,
    content,
    featured_image_url,
    slug,
    is_featured,
    meta_title,
    meta_description,
    created_at,
    published_at
from articles 
limit 1;

-- RLS Policies (ensure security)
alter table articles enable row level security;

drop policy if exists "public read articles" on articles;
drop policy if exists "authenticated write articles" on articles;

-- Public read access
create policy "public read articles"
on articles for select
using (true);

-- Authenticated write access
create policy "authenticated write articles"
on articles for all
using (auth.role() = 'authenticated');

-- Final verification
select 'SCHEMA AUDIT COMPLETED' as status, count(*) as total_articles from articles;
