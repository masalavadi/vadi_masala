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

create table if not exists public.orders (
  id text primary key,
  account_id text,
  email text,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
before update on public.orders
for each row
execute function public.set_products_updated_at();

alter table public.orders enable row level security;

drop policy if exists "Customers can read their own orders" on public.orders;
create policy "Customers can read their own orders"
on public.orders
for select
to authenticated
using (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));

drop policy if exists "Vadi admin can read orders" on public.orders;
create policy "Vadi admin can read orders"
on public.orders
for select
to authenticated
using (lower(coalesce(auth.jwt() ->> 'email', '')) = 'masalavadi@gmail.com');

drop policy if exists "Vadi admin can update orders" on public.orders;
create policy "Vadi admin can update orders"
on public.orders
for update
to authenticated
using (lower(coalesce(auth.jwt() ->> 'email', '')) = 'masalavadi@gmail.com')
with check (lower(coalesce(auth.jwt() ->> 'email', '')) = 'masalavadi@gmail.com');

drop policy if exists "Vadi admin can insert orders" on public.orders;
create policy "Vadi admin can insert orders"
on public.orders
for insert
to authenticated
with check (lower(coalesce(auth.jwt() ->> 'email', '')) = 'masalavadi@gmail.com');

drop policy if exists "Vadi admin can delete orders" on public.orders;
create policy "Vadi admin can delete orders"
on public.orders
for delete
to authenticated
using (lower(coalesce(auth.jwt() ->> 'email', '')) = 'masalavadi@gmail.com');

grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;
grant select, insert, update, delete on public.orders to authenticated;

create or replace function public.place_order(order_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  item jsonb;
  product_row public.products%rowtype;
  product_id text;
  requested_qty integer;
  available_qty integer;
  new_stock integer;
  updated_products jsonb := '[]'::jsonb;
  order_id text := order_payload ->> 'id';
  user_email text := lower(coalesce(auth.jwt() ->> 'email', ''));
  order_email text := lower(coalesce(order_payload ->> 'email', ''));
begin
  if auth.uid() is null then
    raise exception 'LOGIN_REQUIRED';
  end if;

  if order_id is null or length(trim(order_id)) = 0 then
    raise exception 'ORDER_ID_REQUIRED';
  end if;

  if exists (select 1 from public.orders where id = order_id) then
    raise exception 'ORDER_ALREADY_EXISTS:%', order_id;
  end if;

  if order_email = '' or order_email <> user_email then
    raise exception 'ORDER_EMAIL_MISMATCH';
  end if;

  if jsonb_typeof(order_payload -> 'items') is distinct from 'array' or jsonb_array_length(order_payload -> 'items') = 0 then
    raise exception 'ORDER_ITEMS_REQUIRED';
  end if;

  for item in
    select element from jsonb_array_elements(order_payload -> 'items') as items(element)
  loop
    product_id := item ->> 'id';

    begin
      requested_qty := (item ->> 'qty')::integer;
    exception when others then
      raise exception 'INVALID_QUANTITY:%', coalesce(product_id, '');
    end;

    if product_id is null or length(trim(product_id)) = 0 or requested_qty < 1 then
      raise exception 'INVALID_ORDER_ITEM';
    end if;

    select *
      into product_row
      from public.products
      where id = product_id
      for update;

    if not found then
      raise exception 'PRODUCT_NOT_FOUND:%', product_id;
    end if;

    begin
      available_qty := coalesce((product_row.data ->> 'stock')::integer, 0);
    exception when others then
      available_qty := 0;
    end;

    if requested_qty > available_qty then
      raise exception 'OUT_OF_STOCK:%:%', product_id, available_qty;
    end if;

    new_stock := available_qty - requested_qty;

    update public.products
      set data = jsonb_set(product_row.data, '{stock}', to_jsonb(new_stock), true),
          updated_at = now()
      where id = product_id
      returning * into product_row;

    updated_products := updated_products || jsonb_build_array(product_row.data);
  end loop;

  insert into public.orders (id, account_id, email, data)
  values (
    order_id,
    order_payload ->> 'accountId',
    order_email,
    order_payload
  );

  return jsonb_build_object(
    'order', order_payload,
    'products', updated_products
  );
end;
$$;

revoke all on function public.place_order(jsonb) from public;
grant execute on function public.place_order(jsonb) to authenticated;

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
