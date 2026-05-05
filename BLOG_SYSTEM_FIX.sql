-- ========================================
-- FULL BLOG SYSTEM FIX - PRODUCTION READY
-- ========================================

-- GATE 1 — DATABASE VALIDATION (MANDATORY)
-- =======================================
-- Check if table "articles" exists and create if not

-- Create table if not exists
create table if not exists articles (
    id uuid primary key default gen_random_uuid(),
    title text,
    excerpt text,
    content text,
    featured_image_url text,
    slug text unique,
    created_at timestamp default now()
);

-- GATE 2 — COLUMN VALIDATION (AUTO FIX)
-- ======================================
-- Ensure ALL columns exist

alter table articles add column if not exists id uuid primary key default gen_random_uuid();
alter table articles add column if not exists title text;
alter table articles add column if not exists excerpt text;
alter table articles add column if not exists content text;
alter table articles add column if not exists featured_image_url text;
alter table articles add column if not exists slug text unique;
alter table articles add column if not exists created_at timestamp default now();

-- GATE 3 — RLS SECURITY (CRITICAL)
-- =================================
-- Enable RLS
alter table articles enable row level security;

-- Drop existing policies if exist
drop policy if exists "public read articles" on articles;
drop policy if exists "auth write articles" on articles;
drop policy if exists "Enable read access for all users" on articles;
drop policy if exists "Enable insert for authenticated users" on articles;
drop policy if exists "Enable update for users based on id" on articles;
drop policy if exists "Enable delete for users based on id" on articles;

-- Create policies
-- PUBLIC READ (SAFE)
create policy "public read articles"
on articles for select
using (true);

-- AUTHENTICATED WRITE ONLY
create policy "auth write articles"
on articles for all
using (auth.role() = 'authenticated');

-- GATE 4 — INDEX FOR PERFORMANCE
-- ===============================
create index if not exists articles_created_at_idx on articles(created_at desc);
create index if not exists articles_slug_idx on articles(slug);

-- GATE 7 — DATA SEED (IF EMPTY)
-- ================================
-- Insert sample article only if table is empty
insert into articles (title, excerpt, content, slug)
select 
    'Welcome to JADTRA Blog',
    'This is your first article.',
    '<p>This article was created automatically to test the blog system.</p>',
    'welcome-to-jadtra'
where not exists (select 1 from articles limit 1);

-- Verification queries
select 'Table exists check' as status, count(*) as article_count from articles;
select 'Columns check' as status, column_name, data_type from information_schema.columns where table_name = 'articles' order by ordinal_position;
select 'RLS policies check' as status, schemaname, tablename, policyname, permissive, roles, cmd, qual from pg_policies where tablename = 'articles';
