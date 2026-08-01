-- Profiles and photos schema for shareable art portfolios.
-- profiles.id mirrors auth.users.id 1:1 so ownership checks never need a join.
-- Every profile and photo is publicly readable (the product is a shareable
-- portfolio); only the owner can write their own rows.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique check (username ~ '^[a-z0-9_-]{3,30}$'),
  name text not null default '',
  bio text not null default '',
  avatar_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  storage_path text not null,
  caption text not null default '',
  position integer not null default 0,
  created_at timestamptz not null default now()
);

-- profile_id is referenced directly in RLS policies below and isn't the PK,
-- so it needs its own index.
create index if not exists photos_profile_id_idx on public.photos (profile_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.photos enable row level security;

-- RLS policies only filter rows; the base privilege grant below is what
-- actually lets anon/authenticated touch these tables at all.
grant select on public.profiles to anon, authenticated;
grant insert, update on public.profiles to authenticated;
grant select on public.photos to anon, authenticated;
grant insert, update, delete on public.photos to authenticated;

-- profiles: select is public, writes are owner-only, no delete policy (denied
-- by default) since account/profile deletion is out of scope for v1.
create policy "profiles_select_anon" on public.profiles
  for select to anon using (true);

create policy "profiles_select_authenticated" on public.profiles
  for select to authenticated using (true);

create policy "profiles_insert_authenticated" on public.profiles
  for insert to authenticated with check ((select auth.uid()) = id);

create policy "profiles_update_authenticated" on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- photos: select is public, writes are owner-only via the parent profile.
create policy "photos_select_anon" on public.photos
  for select to anon using (true);

create policy "photos_select_authenticated" on public.photos
  for select to authenticated using (true);

create policy "photos_insert_authenticated" on public.photos
  for insert to authenticated with check ((select auth.uid()) = profile_id);

create policy "photos_update_authenticated" on public.photos
  for update to authenticated
  using ((select auth.uid()) = profile_id)
  with check ((select auth.uid()) = profile_id);

create policy "photos_delete_authenticated" on public.photos
  for delete to authenticated using ((select auth.uid()) = profile_id);
