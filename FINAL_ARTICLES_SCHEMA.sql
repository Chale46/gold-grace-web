-- ========================================
-- FINAL ARTICLES SCHEMA - COMPLETE FIX
-- ========================================

-- PHASE 1 — FINALIZE DATABASE
-- =============================

-- Add ALL missing columns to articles table
alter table articles add column if not exists status text default 'draft';
alter table articles add column if not exists published_at timestamp;
alter table articles add column if not exists tags text[];
alter table articles add column if not exists meta_title text;
alter table articles add column if not exists meta_description text;
alter table articles add column if not exists updated_at timestamp default now();
alter table articles add column if not exists view_count integer default 0;
alter table articles add column if not exists author_id uuid;
alter table articles add column if not exists author text;

-- Add proper constraints
do $$
begin
  if not exists (
    select 1 from pg_constraint 
    where conname = 'articles_status_check'
  ) then
    alter table articles add constraint articles_status_check 
      check (status in ('draft', 'published', 'archived'));
  end if;
end $$;

-- Update existing records with safe defaults
update articles set 
  status = coalesce(status, 'draft'),
  published_at = case 
    when status = 'published' and published_at is null 
    then created_at 
    else published_at 
  end,
  tags = coalesce(tags, '{}'),
  meta_title = coalesce(meta_title, title),
  meta_description = coalesce(meta_description, left(content, 160)),
  updated_at = coalesce(updated_at, created_at),
  view_count = coalesce(view_count, 0)
where status is null or published_at is null or tags is null or meta_title is null or meta_description is null or updated_at is null or view_count is null;

-- Create indexes for performance
create index if not exists idx_articles_status on articles(status);
create index if not exists idx_articles_published_at on articles(published_at desc);
create index if not exists idx_articles_tags on articles using gin(tags);
create index if not exists idx_articles_author_id on articles(author_id);
create index if not exists idx_articles_view_count on articles(view_count desc);

-- Final verification
select 
    column_name,
    data_type,
    is_nullable,
    column_default
from information_schema.columns 
where table_name = 'articles' 
order by ordinal_position;

-- Sample data test
select 'Final Schema Test' as test_type, count(*) as article_count from articles;
