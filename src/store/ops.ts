import { computed, reactive } from "vue";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export type RouteRate = {
  id: string;
  origin: string;
  destination: string;
  itemType: string;
  flatPrice: number;
  maxVolumeM3: number;
  eta: string;
  vehicle: string;
  note: string;
};

export type DriverRecord = {
  id: string;
  name: string;
  phone: string;
  status: string;
  primaryVehicle: string;
  activeTrips: number;
  route: string;
  isTracking: boolean;
  lastSeenAt: string | null;
  lastLatitude: number | null;
  lastLongitude: number | null;
  lastAccuracy: number | null;
  password?: string;
};

export type ShipmentRecord = {
  trackingNumber: string;
  customer: string;
  item: string;
  destination: string;
  status: string;
  driverId: string;
  driverName: string;
  vehicle: string;
  eta: string;
  currentLocation: string;
  currentLocationLabel: string;
  mapNote: string;
  isTracking: boolean;
  lastSeenAt: string | null;
  lastLatitude: number | null;
  lastLongitude: number | null;
};

type SiteSettings = {
  heroTitle: string;
  subheadline: string;
  whatsapp: string;
  primaryCta: string;
  heroImage1: string;
  heroImage2: string;
  heroImage3: string;
  whyPackagingImage: string;
  whyDeliveryImage: string;
  testimonialImage1: string;
  testimonialImage2: string;
  testimonialImage3: string;
  historyImage: string;
};

type DriverRow = {
  id: string;
  name: string;
  phone: string | null;
  status: string | null;
  primary_vehicle: string | null;
  active_trips: number | null;
  route: string | null;
  is_tracking: boolean | null;
  last_seen_at: string | null;
  last_latitude: number | null;
  last_longitude: number | null;
  last_accuracy: number | null;
};

type ShipmentRow = {
  tracking_number: string;
  customer: string;
  item: string;
  destination: string;
  status: string;
  driver_id: string | null;
  driver: string | null;
  vehicle: string | null;
  eta: string | null;
  current_location_label: string | null;
  map_note: string | null;
};

const defaultSiteSettings: SiteSettings = {
  heroTitle: "Ekspedisi Furniture Jepara ke Seluruh Indonesia",
  subheadline: "Cek ongkir cepat, booking rapi, tracking realtime.",
  whatsapp: "6281234567890",
  primaryCta: "Cek Ongkir",
  heroImage1: "/images/hero-main.svg",
  heroImage2: "/images/hero-route.svg",
  heroImage3: "/images/hero-tracking.svg",
  whyPackagingImage: "/images/why-packaging.svg",
  whyDeliveryImage: "/images/why-delivery.svg",
  testimonialImage1: "/images/testimonial-1.svg",
  testimonialImage2: "/images/testimonial-2.svg",
  testimonialImage3: "/images/testimonial-3.svg",
  historyImage: "/images/history-hero.svg"
};

const state = reactive({
  initialized: false,
  loading: false,
  source: isSupabaseConfigured ? "supabase" : "unconfigured",
  siteSettings: { ...defaultSiteSettings } as SiteSettings,
  routeRates: [] as RouteRate[],
  drivers: [] as DriverRecord[],
  shipments: [] as ShipmentRecord[]
});

function compactText(value: string | null | undefined, fallback = "-") {
  const normalized = value?.trim();
  return normalized ? normalized : fallback;
}

function formatDriverLocation(driver?: Partial<DriverRecord> | null, fallback?: string | null) {
  if (driver?.lastLatitude != null && driver.lastLongitude != null) {
    return `Lat ${driver.lastLatitude.toFixed(5)}, Lng ${driver.lastLongitude.toFixed(5)}`;
  }

  return fallback?.trim() || "Menunggu update lokasi driver";
}

function mapDriverRow(driver: DriverRow): DriverRecord {
  return {
    id: String(driver.id),
    name: driver.name,
    phone: driver.phone ?? "-",
    status: driver.status ?? "Standby",
    primaryVehicle: driver.primary_vehicle ?? "-",
    activeTrips: driver.active_trips ?? 0,
    route: driver.route ?? "-",
    isTracking: driver.is_tracking ?? false,
    lastSeenAt: driver.last_seen_at,
    lastLatitude: driver.last_latitude,
    lastLongitude: driver.last_longitude,
    lastAccuracy: driver.last_accuracy
  };
}

function mapShipmentRow(shipment: ShipmentRow, driverMap: Map<string, DriverRecord>): ShipmentRecord {
  const driver = shipment.driver_id ? driverMap.get(String(shipment.driver_id)) : undefined;
  const vehicle = shipment.vehicle ?? driver?.primaryVehicle ?? "-";
  const currentLocation = driver?.lastLatitude != null && driver.lastLongitude != null
    ? formatDriverLocation(driver, shipment.current_location_label)
    : shipment.current_location_label?.trim() || "Driver belum mengirim lokasi";

  return {
    trackingNumber: shipment.tracking_number,
    customer: shipment.customer,
    item: shipment.item,
    destination: shipment.destination,
    status: shipment.status,
    driverId: shipment.driver_id ? String(shipment.driver_id) : driver?.id ?? "",
    driverName: driver?.name ?? shipment.driver ?? "Belum ditentukan",
    vehicle,
    eta: shipment.eta ?? "-",
    currentLocation,
    currentLocationLabel: shipment.current_location_label?.trim() || currentLocation,
    mapNote: driver?.lastLatitude != null && driver.lastLongitude != null
      ? "Posisi live diambil dari aplikasi driver."
      : (shipment.map_note ?? "Menunggu titik lokasi pertama dari aplikasi driver."),
    isTracking: driver?.isTracking ?? false,
    lastSeenAt: driver?.lastSeenAt ?? null,
    lastLatitude: driver?.lastLatitude ?? null,
    lastLongitude: driver?.lastLongitude ?? null
  };
}

function applySiteSettings(row: Record<string, unknown> | null) {
  if (!row) return;

  state.siteSettings = {
    heroTitle: (row.hero_title as string | null) ?? defaultSiteSettings.heroTitle,
    subheadline: (row.subheadline as string | null) ?? defaultSiteSettings.subheadline,
    whatsapp: (row.whatsapp as string | null) ?? defaultSiteSettings.whatsapp,
    primaryCta: (row.primary_cta as string | null) ?? defaultSiteSettings.primaryCta,
    heroImage1: (row.hero_image_1 as string | null) ?? defaultSiteSettings.heroImage1,
    heroImage2: (row.hero_image_2 as string | null) ?? defaultSiteSettings.heroImage2,
    heroImage3: (row.hero_image_3 as string | null) ?? defaultSiteSettings.heroImage3,
    whyPackagingImage: (row.why_packaging_image as string | null) ?? defaultSiteSettings.whyPackagingImage,
    whyDeliveryImage: (row.why_delivery_image as string | null) ?? defaultSiteSettings.whyDeliveryImage,
    testimonialImage1: (row.testimonial_image_1 as string | null) ?? defaultSiteSettings.testimonialImage1,
    testimonialImage2: (row.testimonial_image_2 as string | null) ?? defaultSiteSettings.testimonialImage2,
    testimonialImage3: (row.testimonial_image_3 as string | null) ?? defaultSiteSettings.testimonialImage3,
    historyImage: (row.history_image as string | null) ?? defaultSiteSettings.historyImage
  };
}

function applyRouteRates(rows: Record<string, unknown>[] | null) {
  if (!rows?.length) return;

  state.routeRates = rows.map((route) => ({
    id: String(route.id),
    origin: String(route.origin),
    destination: String(route.destination),
    itemType: String(route.item_type),
    flatPrice: Number(route.flat_price ?? 0),
    maxVolumeM3: Number(route.max_volume_m3 ?? 0),
    eta: String(route.eta ?? "-"),
    vehicle: String(route.vehicle ?? "-"),
    note: String(route.note ?? "")
  }));
}

async function loadPublicData() {
  if (!isSupabaseConfigured || !supabase) return false;

  const [settingsRes, routesRes] = await Promise.all([
    supabase.from("site_settings").select("*").limit(1).maybeSingle(),
    supabase.from("route_rates").select("*").order("destination")
  ]);

  applySiteSettings(settingsRes.data as Record<string, unknown> | null);
  applyRouteRates(routesRes.data as Record<string, unknown>[] | null);
  state.source = "supabase";
  return true;
}

async function loadAdminData() {
  if (!isSupabaseConfigured || !supabase) return false;

  const [settingsRes, routesRes, driversRes, shipmentsRes] = await Promise.all([
    supabase.from("site_settings").select("*").limit(1).maybeSingle(),
    supabase.from("route_rates").select("*").order("destination"),
    supabase.from("drivers").select("*").order("name"),
    supabase.from("shipments").select("*").order("tracking_number", { ascending: false })
  ]);

  applySiteSettings(settingsRes.data as Record<string, unknown> | null);
  applyRouteRates(routesRes.data as Record<string, unknown>[] | null);

  const driverRows = (driversRes.data ?? []) as DriverRow[];
  state.drivers = driverRows.map(mapDriverRow);
  const driverMap = new Map(state.drivers.map((driver) => [driver.id, driver]));

  const shipmentRows = (shipmentsRes.data ?? []) as ShipmentRow[];
  state.shipments = shipmentRows.map((shipment) => mapShipmentRow(shipment, driverMap));
  state.source = "supabase";
  return true;
}

export async function fetchPublicTrackingByCode(trackingNumber: string): Promise<ShipmentRecord | null> {
  if (!isSupabaseConfigured || !supabase) return null;

  const normalizedTracking = trackingNumber.trim();
  if (!normalizedTracking) return null;

  const shipmentRes = await supabase
    .from("shipments")
    .select("*")
    .eq("tracking_number", normalizedTracking)
    .maybeSingle();

  if (!shipmentRes.data) {
    return null;
  }

  const shipmentRow = shipmentRes.data as ShipmentRow;
  let driverMap = new Map<string, DriverRecord>();

  if (shipmentRow.driver_id) {
    const driverRes = await supabase
      .from("drivers")
      .select("id, name, phone, status, primary_vehicle, active_trips, route, is_tracking, last_seen_at, last_latitude, last_longitude, last_accuracy")
      .eq("id", shipmentRow.driver_id)
      .maybeSingle();

    if (driverRes.data) {
      const driver = mapDriverRow(driverRes.data as DriverRow);
      driverMap = new Map([[driver.id, driver]]);
    }
  }

  return mapShipmentRow(shipmentRow, driverMap);
}

export async function initializePublicStore(force = false) {
  if (state.initialized && !force) return;
  state.loading = true;

  if (isSupabaseConfigured && supabase) {
    try {
      await loadPublicData();
    } catch {
      state.source = "supabase-error";
    }
  }

  state.loading = false;
  state.initialized = true;
}

export async function initializeOpsStore(force = false) {
  if (state.initialized && !force) return;
  state.loading = true;

  if (isSupabaseConfigured && supabase) {
    try {
      await loadAdminData();
    } catch {
      state.source = "supabase-error";
    }
  }

  state.loading = false;
  state.initialized = true;
}

export async function refreshPublicStore() {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    await loadPublicData();
  } catch {
    state.source = "supabase-error";
  }
}

export async function refreshOpsStore() {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    await loadAdminData();
  } catch {
    state.source = "supabase-error";
  }
}

async function upsertRouteRateRemote(route: RouteRate) {
  if (!supabase || !isSupabaseConfigured) return;
  await supabase.from("route_rates").upsert({
    id: route.id,
    origin: route.origin,
    destination: route.destination,
    item_type: route.itemType,
    flat_price: route.flatPrice,
    max_volume_m3: route.maxVolumeM3,
    eta: route.eta,
    vehicle: route.vehicle,
    note: route.note
  });
}

async function deleteRouteRateRemote(id: string) {
  if (!supabase || !isSupabaseConfigured) return;
  await supabase.from("route_rates").delete().eq("id", id);
}

async function upsertDriverRemote(driver: DriverRecord) {
  if (!supabase || !isSupabaseConfigured) return;

  const payload: Record<string, unknown> = {
    id: compactText(driver.id, driver.id),
    name: compactText(driver.name, "Driver Baru"),
    phone: compactText(driver.phone, "-"),
    status: compactText(driver.status, "Standby"),
    primary_vehicle: compactText(driver.primaryVehicle, "-"),
    active_trips: Math.max(0, driver.activeTrips),
    route: compactText(driver.route, "-"),
    is_tracking: driver.isTracking,
    last_seen_at: driver.lastSeenAt,
    last_latitude: driver.lastLatitude,
    last_longitude: driver.lastLongitude,
    last_accuracy: driver.lastAccuracy
  };

  if (driver.password?.trim()) {
    payload.password_input = driver.password.trim();
  }

  await supabase.from("drivers").upsert(payload);
}

async function deleteDriverRemote(id: string) {
  if (!supabase || !isSupabaseConfigured) return;
  await supabase.from("drivers").delete().eq("id", id);
}

async function insertShipmentRemote(shipment: ShipmentRecord) {
  if (!supabase || !isSupabaseConfigured) return;
  await supabase.from("shipments").insert({
    tracking_number: compactText(shipment.trackingNumber, shipment.trackingNumber),
    customer: compactText(shipment.customer, "-"),
    item: compactText(shipment.item, "-"),
    destination: compactText(shipment.destination, "-"),
    status: compactText(shipment.status, "Pickup Dijadwalkan"),
    driver_id: shipment.driverId || null,
    driver: compactText(shipment.driverName, "Belum ditentukan"),
    vehicle: compactText(shipment.vehicle, "-"),
    eta: compactText(shipment.eta, "-"),
    current_location_label: compactText(shipment.currentLocationLabel, "Menunggu pickup driver"),
    map_note: compactText(shipment.mapNote, "Menunggu titik lokasi pertama dari aplikasi driver.")
  });
}

async function upsertSiteSettingsRemote(settings: SiteSettings) {
  if (!supabase || !isSupabaseConfigured) return;
  await supabase.from("site_settings").upsert({
    id: 1,
    hero_title: settings.heroTitle,
    subheadline: settings.subheadline,
    whatsapp: settings.whatsapp,
    primary_cta: settings.primaryCta,
    hero_image_1: settings.heroImage1,
    hero_image_2: settings.heroImage2,
    hero_image_3: settings.heroImage3,
    why_packaging_image: settings.whyPackagingImage,
    why_delivery_image: settings.whyDeliveryImage,
    testimonial_image_1: settings.testimonialImage1,
    testimonial_image_2: settings.testimonialImage2,
    testimonial_image_3: settings.testimonialImage3,
    history_image: settings.historyImage
  });
}

export function useOpsStore() {
  const shipmentCount = computed(() => state.shipments.length);
  const activeDriverCount = computed(() => state.drivers.filter((driver) => driver.status === "On Duty" || driver.isTracking).length);

  async function saveRouteRate(route: RouteRate) {
    const index = state.routeRates.findIndex((entry) => entry.id === route.id);
    if (index >= 0) state.routeRates[index] = route;
    else state.routeRates.unshift(route);
    await upsertRouteRateRemote(route);
  }

  async function deleteRouteRate(id: string) {
    state.routeRates = state.routeRates.filter((entry) => entry.id !== id) as typeof state.routeRates;
    await deleteRouteRateRemote(id);
  }

  async function saveDriver(driver: DriverRecord) {
    const sanitizedDriver = { ...driver, password: driver.password?.trim() || undefined };
    const index = state.drivers.findIndex((entry) => entry.id === sanitizedDriver.id);
    if (index >= 0) state.drivers[index] = sanitizedDriver;
    else state.drivers.unshift(sanitizedDriver);
    await upsertDriverRemote(sanitizedDriver);
    await refreshOpsStore();
  }

  async function deleteDriver(id: string) {
    state.drivers = state.drivers.filter((entry) => entry.id !== id) as typeof state.drivers;
    await deleteDriverRemote(id);
    await refreshOpsStore();
  }

  async function saveShipment(shipment: ShipmentRecord) {
    state.shipments.unshift(shipment);
    await insertShipmentRemote(shipment);
    await refreshOpsStore();
  }

  async function saveSiteSettings(settings: SiteSettings) {
    state.siteSettings = { ...settings };
    await upsertSiteSettingsRemote(settings);
  }

  return {
    state,
    shipmentCount,
    activeDriverCount,
    saveRouteRate,
    deleteRouteRate,
    saveDriver,
    deleteDriver,
    saveShipment,
    saveSiteSettings
  };
}
