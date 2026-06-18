-- Run this once in the Supabase SQL Editor for the Vadi Masala project.
-- It creates the shared product catalog and product image bucket used by admin saves.

begin;

create table if not exists public.products (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create or replace function public.set_products_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row
execute function public.set_products_updated_at();

alter table public.products enable row level security;

drop policy if exists "Public can read products" on public.products;
create policy "Public can read products"
on public.products
for select
to anon, authenticated
using (true);

drop policy if exists "Vadi admin can insert products" on public.products;
create policy "Vadi admin can insert products"
on public.products
for insert
to authenticated
with check (lower(coalesce(auth.jwt() ->> 'email', '')) = 'masalavadi@gmail.com');

drop policy if exists "Vadi admin can update products" on public.products;
create policy "Vadi admin can update products"
on public.products
for update
to authenticated
using (lower(coalesce(auth.jwt() ->> 'email', '')) = 'masalavadi@gmail.com')
with check (lower(coalesce(auth.jwt() ->> 'email', '')) = 'masalavadi@gmail.com');

drop policy if exists "Vadi admin can delete products" on public.products;
create policy "Vadi admin can delete products"
on public.products
for delete
to authenticated
using (lower(coalesce(auth.jwt() ->> 'email', '')) = 'masalavadi@gmail.com');

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read product images" on storage.objects;
create policy "Public can read product images"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'product-images');

drop policy if exists "Vadi admin can upload product images" on storage.objects;
create policy "Vadi admin can upload product images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'product-images'
  and lower(coalesce(auth.jwt() ->> 'email', '')) = 'masalavadi@gmail.com'
);

drop policy if exists "Vadi admin can update product images" on storage.objects;
create policy "Vadi admin can update product images"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'product-images'
  and lower(coalesce(auth.jwt() ->> 'email', '')) = 'masalavadi@gmail.com'
)
with check (
  bucket_id = 'product-images'
  and lower(coalesce(auth.jwt() ->> 'email', '')) = 'masalavadi@gmail.com'
);

drop policy if exists "Vadi admin can delete product images" on storage.objects;
create policy "Vadi admin can delete product images"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'product-images'
  and lower(coalesce(auth.jwt() ->> 'email', '')) = 'masalavadi@gmail.com'
);

commit;
