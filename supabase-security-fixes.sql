-- Run this once in the Supabase SQL Editor for the existing Vadi Masala project.
-- It remediates the current database and storage linter warnings.

begin;

create or replace function public.set_products_updated_at()
returns trigger
language plpgsql
set search_path = pg_catalog
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop policy if exists "Public can read product images" on storage.objects;
drop policy if exists "Vadi admin can list product images" on storage.objects;
create policy "Vadi admin can list product images"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'product-images'
  and lower(coalesce(auth.jwt() ->> 'email', '')) = 'masalavadi@gmail.com'
);

commit;
