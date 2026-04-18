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
  mapLink: string;
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
  current_location: string | null;
  current_location_label: string | null;
  map_link: string | null;
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

function formatDriverLocation(driver?: Partial<DriverRecord> | null, fallback?: string | null) {
  if (driver?.lastLatitude != null && driver.lastLongitude != null) {
    return `Lat ${driver.lastLatitude.toFixed(5)}, Lng ${driver.lastLongitude.toFixed(5)}`;
  }

  return fallback?.trim() || "Menunggu update lokasi driver";
}

function buildMapLink(latitude?: number | null, longitude?: number | null, fallback?: string | null) {
  if (latitude != null && longitude != null) {
    return `https://www.google.com/maps?q=${latitude},${longitude}`;
  }

  return fallback?.trim() || "https://maps.google.com";
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
  const currentLocation = formatDriverLocation(driver, shipment.current_location_label ?? shipment.current_location);

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
    currentLocationLabel: shipment.current_location_label?.trim() || shipment.current_location?.trim() || currentLocation,
    mapLink: buildMapLink(driver?.lastLatitude, driver?.lastLongitude, shipment.map_link),
    mapNote: shipment.map_note ?? "Tracking live mengikuti posisi terakhir driver.",
    isTracking: driver?.isTracking ?? false,
    lastSeenAt: driver?.lastSeenAt ?? null,
    lastLatitude: driver?.lastLatitude ?? null,
    lastLongitude: driver?.lastLongitude ?? null
  };
}

async function loadRemoteData() {
  if (!isSupabaseConfigured || !supabase) return false;

  const [settingsRes, routesRes, driversRes, shipmentsRes] = await Promise.all([
    supabase.from("site_settings").select("*").limit(1).maybeSingle(),
    supabase.from("route_rates").select("*").order("destination"),
    supabase.from("drivers").select("*").order("name"),
    supabase.from("shipments").select("*").order("tracking_number", { ascending: false })
  ]);

  if (settingsRes.data) {
    state.siteSettings = {
      heroTitle: settingsRes.data.hero_title ?? defaultSiteSettings.heroTitle,
      subheadline: settingsRes.data.subheadline ?? defaultSiteSettings.subheadline,
      whatsapp: settingsRes.data.whatsapp ?? defaultSiteSettings.whatsapp,
      primaryCta: settingsRes.data.primary_cta ?? defaultSiteSettings.primaryCta,
      heroImage1: settingsRes.data.hero_image_1 ?? defaultSiteSettings.heroImage1,
      heroImage2: settingsRes.data.hero_image_2 ?? defaultSiteSettings.heroImage2,
      heroImage3: settingsRes.data.hero_image_3 ?? defaultSiteSettings.heroImage3,
      whyPackagingImage: settingsRes.data.why_packaging_image ?? defaultSiteSettings.whyPackagingImage,
      whyDeliveryImage: settingsRes.data.why_delivery_image ?? defaultSiteSettings.whyDeliveryImage,
      testimonialImage1: settingsRes.data.testimonial_image_1 ?? defaultSiteSettings.testimonialImage1,
      testimonialImage2: settingsRes.data.testimonial_image_2 ?? defaultSiteSettings.testimonialImage2,
      testimonialImage3: settingsRes.data.testimonial_image_3 ?? defaultSiteSettings.testimonialImage3,
      historyImage: settingsRes.data.history_image ?? defaultSiteSettings.historyImage
    };
  }

  if (routesRes.data?.length) {
    state.routeRates = routesRes.data.map((route) => ({
      id: String(route.id),
      origin: route.origin,
      destination: route.destination,
      itemType: route.item_type,
      flatPrice: route.flat_price,
      maxVolumeM3: route.max_volume_m3,
      eta: route.eta,
      vehicle: route.vehicle,
      note: route.note ?? ""
    }));
  }

  const driverRows = (driversRes.data ?? []) as DriverRow[];
  state.drivers = driverRows.map(mapDriverRow);
  const driverMap = new Map(state.drivers.map((driver) => [driver.id, driver]));

  const shipmentRows = (shipmentsRes.data ?? []) as ShipmentRow[];
  state.shipments = shipmentRows.map((shipment) => mapShipmentRow(shipment, driverMap));
  state.source = "supabase";
  return true;
}

export async function initializeOpsStore(force = false) {
  if (state.initialized && !force) return;
  state.loading = true;

  if (isSupabaseConfigured && supabase) {
    try {
      await loadRemoteData();
    } catch {
      state.source = "supabase-error";
    }
  }

  state.loading = false;
  state.initialized = true;
}

export async function refreshOpsStore() {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    await loadRemoteData();
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
    id: driver.id,
    name: driver.name,
    phone: driver.phone,
    status: driver.status,
    primary_vehicle: driver.primaryVehicle,
    active_trips: driver.activeTrips,
    route: driver.route,
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
    tracking_number: shipment.trackingNumber,
    customer: shipment.customer,
    item: shipment.item,
    destination: shipment.destination,
    status: shipment.status,
    driver_id: shipment.driverId,
    driver: shipment.driverName,
    vehicle: shipment.vehicle,
    eta: shipment.eta,
    current_location: shipment.currentLocation,
    current_location_label: shipment.currentLocationLabel,
    map_link: shipment.mapLink,
    map_note: shipment.mapNote
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
