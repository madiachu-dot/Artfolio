-- Streams profile and photo changes to the live admin dashboard.
-- Row contents are already public (profiles_select_anon / photos_select_anon),
-- so broadcasting changes over Realtime doesn't expose anything new.

alter publication supabase_realtime add table public.profiles;
alter publication supabase_realtime add table public.photos;
