-- The admin dashboard's live photo-count decrement needs the deleted row's
-- profile_id, but Postgres only includes primary key columns in the "old"
-- record for DELETE events by default. photos.id is the primary key and
-- profile_id isn't, so it was missing from delete payloads. Full replica
-- identity includes every column, fixing the live count.
-- (Safe to broadcast in full: photos rows are already public via
-- photos_select_anon.)

alter table public.photos replica identity full;
