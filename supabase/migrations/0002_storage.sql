-- ============================================================================
-- Elvora.my — Supabase Storage setup
--
-- Run AFTER 0001_init.sql, in the Supabase SQL editor.
-- Idempotent: safe to run more than once.
--
-- Creates a public-read bucket for product photos and locks writing to the
-- service role only.
--
-- Why public *read*: product photos are on public product pages, indexed by
-- Google and served to every visitor. Making them private would require signed
-- URLs that expire, which breaks search indexing and caching for no benefit —
-- the images are not secret.
--
-- Why no public *write*: an upload policy for `anon` would let anyone with the
-- public key fill the bucket, host arbitrary content on the shop's domain, and
-- burn through your egress allowance. Uploads go through the admin server
-- action, which uses the service_role key and verifies each file's bytes before
-- storing it.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Bucket
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  -- Public read: these are shop photos.
  true,
  -- 8 MB, matching MAX_IMAGE_BYTES in src/lib/images/rules.ts. Enforced here as
  -- well so a bug in the application cannot upload a 2 GB file.
  8388608,
  -- SVG is deliberately absent: it can carry script and would be served from
  -- the shop's own domain. GIF is absent because the app only accepts the four
  -- formats it can guarantee to render.
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- ---------------------------------------------------------------------------
-- Access policies
--
-- Supabase Storage policies live on storage.objects. The service_role bypasses
-- these entirely, which is what the admin upload action uses.
-- ---------------------------------------------------------------------------

alter table storage.objects enable row level security;

-- Reading a product photo: anyone.
drop policy if exists "product images are publicly readable" on storage.objects;
create policy "product images are publicly readable"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'product-images');

-- Writing: no policy for anon or authenticated, deliberately. Absence of a
-- permissive policy means only service_role can insert, update or delete.

-- Explicitly remove any older permissive write policies if a previous attempt
-- created them, so re-running this file converges to the safe state.
drop policy if exists "product images are publicly writable" on storage.objects;
drop policy if exists "product images are publicly insertable" on storage.objects;

-- ---------------------------------------------------------------------------
-- Verification (run after applying)
-- ---------------------------------------------------------------------------
--   select id, public, file_size_limit, allowed_mime_types
--     from storage.buckets where id = 'product-images';
--   -- expect: public = true, file_size_limit = 8388608, four mime types
--
--   select policyname, cmd, roles
--     from pg_policies
--    where schemaname = 'storage' and tablename = 'objects';
--   -- expect exactly one policy, cmd = SELECT, roles = {anon,authenticated}
--
-- Then prove it from outside:
--   npm run db:verify
