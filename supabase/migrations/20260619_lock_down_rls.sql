-- ============================================================================
-- Lock down RLS policies — replace wide-open MVP policies with proper access
-- ============================================================================
-- Public (anon): READ products/badges/product_badges, INSERT orders/order_items
-- Admins (in admins table): full CRUD on everything
-- Stripe webhook: uses service role key, bypasses RLS entirely
-- ============================================================================

-- Helper: reusable admin check
-- (Postgres inlines this; it's just for readability)
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.admins where user_id = auth.uid()
  );
$$;

-- ─── PRODUCTS ───────────────────────────────────────────────────────────────

-- Drop all existing policies
do $$
declare
  pol record;
begin
  for pol in
    select policyname from pg_policies where tablename = 'products' and schemaname = 'public'
  loop
    execute format('drop policy %I on public.products', pol.policyname);
  end loop;
end $$;

alter table public.products enable row level security;

create policy "Public can read products"
  on public.products for select
  using (true);

create policy "Admins can insert products"
  on public.products for insert
  with check (public.is_admin());

create policy "Admins can update products"
  on public.products for update
  using (public.is_admin());

create policy "Admins can delete products"
  on public.products for delete
  using (public.is_admin());

-- ─── BADGES ─────────────────────────────────────────────────────────────────

do $$
declare
  pol record;
begin
  for pol in
    select policyname from pg_policies where tablename = 'badges' and schemaname = 'public'
  loop
    execute format('drop policy %I on public.badges', pol.policyname);
  end loop;
end $$;

alter table public.badges enable row level security;

create policy "Public can read badges"
  on public.badges for select
  using (true);

create policy "Admins can insert badges"
  on public.badges for insert
  with check (public.is_admin());

create policy "Admins can update badges"
  on public.badges for update
  using (public.is_admin());

create policy "Admins can delete badges"
  on public.badges for delete
  using (public.is_admin());

-- ─── PRODUCT_BADGES ────────────────────────────────────────────────────────

do $$
declare
  pol record;
begin
  for pol in
    select policyname from pg_policies where tablename = 'product_badges' and schemaname = 'public'
  loop
    execute format('drop policy %I on public.product_badges', pol.policyname);
  end loop;
end $$;

alter table public.product_badges enable row level security;

create policy "Public can read product_badges"
  on public.product_badges for select
  using (true);

create policy "Admins can insert product_badges"
  on public.product_badges for insert
  with check (public.is_admin());

create policy "Admins can update product_badges"
  on public.product_badges for update
  using (public.is_admin());

create policy "Admins can delete product_badges"
  on public.product_badges for delete
  using (public.is_admin());

-- ─── ORDERS ─────────────────────────────────────────────────────────────────

do $$
declare
  pol record;
begin
  for pol in
    select policyname from pg_policies where tablename = 'orders' and schemaname = 'public'
  loop
    execute format('drop policy %I on public.orders', pol.policyname);
  end loop;
end $$;

alter table public.orders enable row level security;

create policy "Anyone can insert orders"
  on public.orders for insert
  with check (true);

create policy "Admins can read all orders"
  on public.orders for select
  using (public.is_admin());

create policy "Admins can update orders"
  on public.orders for update
  using (public.is_admin());

-- No public select — customers use a server-side API route (built separately)
-- No public update/delete

-- ─── ORDER_ITEMS ────────────────────────────────────────────────────────────

do $$
declare
  pol record;
begin
  for pol in
    select policyname from pg_policies where tablename = 'order_items' and schemaname = 'public'
  loop
    execute format('drop policy %I on public.order_items', pol.policyname);
  end loop;
end $$;

alter table public.order_items enable row level security;

create policy "Anyone can insert order_items"
  on public.order_items for insert
  with check (true);

create policy "Admins can read all order_items"
  on public.order_items for select
  using (public.is_admin());

create policy "Admins can update order_items"
  on public.order_items for update
  using (public.is_admin());

-- No public select/update/delete
