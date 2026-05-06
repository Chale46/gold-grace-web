-- ========================================
-- SUPABASE STORAGE BUCKET SETUP
-- ========================================

-- Create article-images storage bucket
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'article-images',
  'article-images',
  true,
  52428800, -- 50MB limit
  Array['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
on conflict (id) do nothing;

-- Enable RLS on storage.objects
alter table storage.objects enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Public Access article-images" on storage.objects;
drop policy if exists "Authenticated Upload article-images" on storage.objects;
drop policy if exists "Authenticated Update article-images" on storage.objects;

-- Create RLS policies for article-images bucket
-- Public read access
create policy "Public Access article-images"
on storage.objects
for select
using (bucket_id = 'article-images');

-- Authenticated upload access
create policy "Authenticated Upload article-images"
on storage.objects
for insert
with check (
  bucket_id = 'article-images' 
  and auth.role() = 'authenticated'
);

-- Authenticated update access
create policy "Authenticated Update article-images"
on storage.objects
for update
using (
  bucket_id = 'article-images' 
  and auth.role() = 'authenticated'
);

-- Authenticated delete access
create policy "Authenticated Delete article-images"
on storage.objects
for delete
using (
  bucket_id = 'article-images' 
  and auth.role() = 'authenticated'
);

-- Verification
select 'Storage bucket setup completed' as status, count(*) as bucket_count 
from storage.buckets 
where id = 'article-images';
