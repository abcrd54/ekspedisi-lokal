-- JeparaKirim Supabase schema
-- Jalankan file ini di Supabase SQL Editor.

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'admin',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.site_settings (
  id integer primary key default 1,
  hero_title text not null,
  subheadline text not null,
  whatsapp text not null,
  primary_cta text not null,
  hero_image_1 text,
  hero_image_2 text,
  hero_image_3 text,
  why_packaging_image text,
  why_delivery_image text,
  testimonial_image_1 text,
  testimonial_image_2 text,
  testimonial_image_3 text,
  history_image text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint site_settings_single_row check (id = 1)
);

alter table public.site_settings add column if not exists hero_image_1 text;
alter table public.site_settings add column if not exists hero_image_2 text;
alter table public.site_settings add column if not exists hero_image_3 text;
alter table public.site_settings add column if not exists why_packaging_image text;
alter table public.site_settings add column if not exists why_delivery_image text;
alter table public.site_settings add column if not exists testimonial_image_1 text;
alter table public.site_settings add column if not exists testimonial_image_2 text;
alter table public.site_settings add column if not exists testimonial_image_3 text;
alter table public.site_settings add column if not exists history_image text;

create table if not exists public.route_rates (
  id text primary key,
  origin text not null,
  destination text not null,
  item_type text not null,
  flat_price bigint not null check (flat_price >= 0),
  max_volume_m3 numeric(10,2) not null check (max_volume_m3 > 0),
  eta text not null,
  vehicle text not null,
  note text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.drivers (
  id text primary key,
  name text not null,
  phone text not null,
  status text not null default 'Standby',
  primary_vehicle text not null,
  active_trips integer not null default 0 check (active_trips >= 0),
  route text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.shipments (
  tracking_number text primary key,
  customer text not null,
  item text not null,
  destination text not null,
  status text not null,
  driver text not null,
  vehicle text not null,
  eta text not null,
  current_location text not null,
  map_link text not null,
  map_note text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_route_rates_destination on public.route_rates(destination);
create index if not exists idx_route_rates_item_type on public.route_rates(item_type);
create index if not exists idx_drivers_status on public.drivers(status);
create index if not exists idx_shipments_status on public.shipments(status);
create index if not exists idx_shipments_driver on public.shipments(driver);
create index if not exists idx_shipments_customer on public.shipments(customer);

drop trigger if exists set_admin_profiles_updated_at on public.admin_profiles;
create trigger set_admin_profiles_updated_at
before update on public.admin_profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_site_settings_updated_at on public.site_settings;
create trigger set_site_settings_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

drop trigger if exists set_route_rates_updated_at on public.route_rates;
create trigger set_route_rates_updated_at
before update on public.route_rates
for each row execute function public.set_updated_at();

drop trigger if exists set_drivers_updated_at on public.drivers;
create trigger set_drivers_updated_at
before update on public.drivers
for each row execute function public.set_updated_at();

drop trigger if exists set_shipments_updated_at on public.shipments;
create trigger set_shipments_updated_at
before update on public.shipments
for each row execute function public.set_updated_at();

alter table public.admin_profiles enable row level security;
alter table public.site_settings enable row level security;
alter table public.route_rates enable row level security;
alter table public.drivers enable row level security;
alter table public.shipments enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.admin_profiles ap
    where ap.id = auth.uid()
      and ap.role = 'admin'
  );
$$;

drop policy if exists "admin_profiles_self_select" on public.admin_profiles;
create policy "admin_profiles_self_select"
on public.admin_profiles
for select
to authenticated
using (id = auth.uid());

drop policy if exists "admin_profiles_self_update" on public.admin_profiles;
create policy "admin_profiles_self_update"
on public.admin_profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "site_settings_admin_all" on public.site_settings;
create policy "site_settings_admin_all"
on public.site_settings
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "route_rates_public_read" on public.route_rates;
create policy "route_rates_public_read"
on public.route_rates
for select
to anon, authenticated
using (true);

drop policy if exists "route_rates_admin_write" on public.route_rates;
create policy "route_rates_admin_write"
on public.route_rates
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "drivers_admin_all" on public.drivers;
create policy "drivers_admin_all"
on public.drivers
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "shipments_public_read" on public.shipments;
create policy "shipments_public_read"
on public.shipments
for select
to anon, authenticated
using (true);

drop policy if exists "shipments_admin_write" on public.shipments;
create policy "shipments_admin_write"
on public.shipments
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Setelah membuat user admin di Supabase Auth,
-- jalankan insert berikut dengan UUID user Anda:
--
-- insert into public.admin_profiles (id, full_name, role)
-- values ('UUID_USER_ADMIN', 'Nama Admin', 'admin')
-- on conflict (id) do update set role = excluded.role, full_name = excluded.full_name;
