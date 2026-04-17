-- JeparaKirim Supabase seed
-- Jalankan setelah supabase/schema.sql

insert into public.site_settings (
  id,
  hero_title,
  subheadline,
  whatsapp,
  primary_cta,
  hero_image_1,
  hero_image_2,
  hero_image_3,
  why_packaging_image,
  why_delivery_image,
  testimonial_image_1,
  testimonial_image_2,
  testimonial_image_3,
  history_image
)
values (
  1,
  'Ekspedisi Furniture Jepara ke Seluruh Indonesia',
  'Cek ongkir cepat, booking rapi, tracking realtime.',
  '6281234567890',
  'Cek Ongkir',
  '/images/hero-main.svg',
  '/images/hero-route.svg',
  '/images/hero-tracking.svg',
  '/images/why-packaging.svg',
  '/images/why-delivery.svg',
  '/images/testimonial-1.svg',
  '/images/testimonial-2.svg',
  '/images/testimonial-3.svg',
  '/images/history-hero.svg'
)
on conflict (id) do update
set
  hero_title = excluded.hero_title,
  subheadline = excluded.subheadline,
  whatsapp = excluded.whatsapp,
  primary_cta = excluded.primary_cta,
  hero_image_1 = excluded.hero_image_1,
  hero_image_2 = excluded.hero_image_2,
  hero_image_3 = excluded.hero_image_3,
  why_packaging_image = excluded.why_packaging_image,
  why_delivery_image = excluded.why_delivery_image,
  testimonial_image_1 = excluded.testimonial_image_1,
  testimonial_image_2 = excluded.testimonial_image_2,
  testimonial_image_3 = excluded.testimonial_image_3,
  history_image = excluded.history_image;

insert into public.route_rates (id, origin, destination, item_type, flat_price, max_volume_m3, eta, vehicle, note)
values
  ('route-1', 'Jepara', 'Bandung', 'Sofa', 2500000, 6.00, '2-4 hari', 'CDD Box', 'Tarif flat satu kali keberangkatan untuk sofa volume menengah.'),
  ('route-2', 'Jepara', 'Jakarta', 'Lemari', 2750000, 7.00, '2-3 hari', 'CDD Box', 'Cocok untuk lemari bongkar pasang.'),
  ('route-3', 'Jepara', 'Surabaya', 'Kursi', 1400000, 5.00, '1-2 hari', 'Pickup Box', 'Tarif retail untuk kursi dan item compact.'),
  ('route-4', 'Jepara', 'Bandung', 'Dipan', 2350000, 6.00, '2-4 hari', 'CDD Box', 'Tarif flat untuk dipan standard.')
on conflict (id) do update
set
  origin = excluded.origin,
  destination = excluded.destination,
  item_type = excluded.item_type,
  flat_price = excluded.flat_price,
  max_volume_m3 = excluded.max_volume_m3,
  eta = excluded.eta,
  vehicle = excluded.vehicle,
  note = excluded.note;

insert into public.drivers (id, name, phone, status, primary_vehicle, active_trips, route)
values
  ('driver-1', 'Agus Santoso', '0812-9090-1101', 'On Duty', 'Box Besar', 2, 'Bandung - Jakarta'),
  ('driver-2', 'Deni Prabowo', '0813-7722-3301', 'On Duty', 'Tronton', 1, 'Jakarta - Cirebon'),
  ('driver-3', 'Rudi Hartono', '0812-4488-0023', 'Standby', 'Pickup Box', 1, 'Bali - Surabaya')
on conflict (id) do update
set
  name = excluded.name,
  phone = excluded.phone,
  status = excluded.status,
  primary_vehicle = excluded.primary_vehicle,
  active_trips = excluded.active_trips,
  route = excluded.route;

insert into public.shipments (
  tracking_number,
  customer,
  item,
  destination,
  status,
  driver,
  vehicle,
  eta,
  current_location,
  map_link,
  map_note
)
values
  ('JKR-240417-102', 'Toko Kayu Lestari', 'Sofa', 'Jepara -> Bandung', 'Dalam Perjalanan', 'Agus Santoso', 'CDD Box', '18 Apr 2026', 'Tol Kalikangkung KM 389', 'https://maps.google.com', 'Kendaraan bergerak menuju rest area sebelum lanjut ke Cikampek.'),
  ('JKR-240417-088', 'Interior Prima', 'Lemari', 'Jepara -> Jakarta', 'Menuju Kota Tujuan', 'Deni Prabowo', 'Tronton', '18 Apr 2026', 'Cirebon Timur', 'https://maps.google.com', 'Armada sudah keluar dari Semarang dan bergerak stabil.'),
  ('JKR-240416-051', 'Bali Living Space', 'Kursi', 'Jepara -> Denpasar', 'Pickup Dijadwalkan', 'Rudi Hartono', 'Pickup Box', '20 Apr 2026', 'Workshop Jepara', 'https://maps.google.com', 'Menunggu jadwal loading sore hari.')
on conflict (tracking_number) do update
set
  customer = excluded.customer,
  item = excluded.item,
  destination = excluded.destination,
  status = excluded.status,
  driver = excluded.driver,
  vehicle = excluded.vehicle,
  eta = excluded.eta,
  current_location = excluded.current_location,
  map_link = excluded.map_link,
  map_note = excluded.map_note;
