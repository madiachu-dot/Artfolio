-- Public storage bucket for avatars and gallery photos.
-- Public bucket (not signed URLs) since portfolios are meant to be shared;
-- ownership for writes is enforced by the {user_id}/... folder convention.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-photos',
  'portfolio-photos',
  true,
  10485760, -- 10 MiB
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do nothing;

create policy "portfolio_photos_select_anon" on storage.objects
  for select to anon using (bucket_id = 'portfolio-photos');

create policy "portfolio_photos_select_authenticated" on storage.objects
  for select to authenticated using (bucket_id = 'portfolio-photos');

create policy "portfolio_photos_insert_authenticated" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'portfolio-photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "portfolio_photos_update_authenticated" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'portfolio-photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  )
  with check (
    bucket_id = 'portfolio-photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "portfolio_photos_delete_authenticated" on storage.objects
  for delete to authenticated using (
    bucket_id = 'portfolio-photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
