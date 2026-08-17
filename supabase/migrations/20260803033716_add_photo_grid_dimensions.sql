-- Lets artists resize individual photos within their portfolio grid.
-- width/height are grid-cell spans (not pixels) so the CSS grid layout
-- stays intact regardless of screen size. RLS is unaffected: the existing
-- photos_update_authenticated policy already covers all columns on the row.

alter table public.photos
  add column if not exists width integer not null default 1
  check (width between 1 and 3);

alter table public.photos
  add column if not exists height integer not null default 1
  check (height between 1 and 3);
