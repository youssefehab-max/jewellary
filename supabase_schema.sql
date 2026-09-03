-- Glamour Jewellery — Supabase schema
-- Run this in the Supabase SQL editor.

-- ---------------------------------------------------------------------------
-- Products
-- ---------------------------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  price numeric(12, 2) not null check (price >= 0),
  compare_at_price numeric(12, 2),
  category text not null,
  tags text[] default '{}',
  in_stock boolean not null default true,
  gold_colors text[] default '{}',
  sizes text[] default '{}',
  images text[] default '{}',
  material text,
  weight text,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_idx on public.products (category);
create index if not exists products_in_stock_idx on public.products (in_stock);

-- ---------------------------------------------------------------------------
-- Orders
-- ---------------------------------------------------------------------------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  shipping_address text not null,
  city text not null,
  governorate text,
  postal_code text,
  items jsonb not null default '[]'::jsonb,
  subtotal numeric(12, 2) not null check (subtotal >= 0),
  total numeric(12, 2) not null check (total >= 0),
  currency text not null default 'EGP',
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'failed', 'cancelled', 'shipped', 'delivered')),
  paymob_order_id text,
  paymob_transaction_id text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_status_idx on public.orders (status);
create index if not exists orders_created_at_idx on public.orders (created_at desc);

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
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
  for each row execute function public.set_updated_at();

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- Public: SELECT (read)
-- Authenticated admin: INSERT / UPDATE / DELETE (write)
-- ---------------------------------------------------------------------------
alter table public.products enable row level security;
alter table public.orders enable row level security;

-- Products policies
drop policy if exists "Public can read products" on public.products;
create policy "Public can read products"
  on public.products
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Authenticated admin can insert products" on public.products;
create policy "Authenticated admin can insert products"
  on public.products
  for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated admin can update products" on public.products;
create policy "Authenticated admin can update products"
  on public.products
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated admin can delete products" on public.products;
create policy "Authenticated admin can delete products"
  on public.products
  for delete
  to authenticated
  using (true);

-- Orders policies
drop policy if exists "Public can read orders" on public.orders;
create policy "Public can read orders"
  on public.orders
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Authenticated admin can insert orders" on public.orders;
create policy "Authenticated admin can insert orders"
  on public.orders
  for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated admin can update orders" on public.orders;
create policy "Authenticated admin can update orders"
  on public.orders
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated admin can delete orders" on public.orders;
create policy "Authenticated admin can delete orders"
  on public.orders
  for delete
  to authenticated
  using (true);

-- Allow anonymous order creation at checkout (customers are not logged in).
-- Tighten this later with a secure Edge Function if needed.
drop policy if exists "Anyone can create orders" on public.orders;
create policy "Anyone can create orders"
  on public.orders
  for insert
  to anon
  with check (true);
