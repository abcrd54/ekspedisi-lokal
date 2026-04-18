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
  vehicleId: string;
  vehicle: string;
  note: string;
};

export type VehicleRecord = {
  id: string;
  name: string;
  plateNumber: string;
  vehicleType: string;
  capacityM3: number;
  status: string;
};

export type DriverRecord = {
  id: string;
  name: string;
  phone: string;
  status: string;
  activeTrips: number;
  route: string;
  isTracking: boolean;
  lastSeenAt: string | null;
  lastLatitude: number | null;
  lastLongitude: number | null;
  lastAccuracy: number | null;
  password?: string;
};

export type ShipmentItemInput = {
  itemName: string;
  quantity: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  volumeM3: number;
  note: string;
};

export type ShipmentRecord = {
  trackingNumber: string;
  customer: string;
  item: string;
  destination: string;
  status: string;
  driverId: string;
  driverName: string;
  vehicleId: string;
  vehicle: string;
  eta: string;
  shipDate: string;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  routeId: string;
  currentLocation: string;
  currentLocationLabel: string;
  mapNote: string;
  isTracking: boolean;
  lastSeenAt: string | null;
  lastLatitude: number | null;
  lastLongitude: number | null;
  items: ShipmentItemInput[];
};

type SiteSettings = {
  siteName: string;
  siteTagline: string;
  heroTitle: string;
  subheadline: string;
  contactLocation: string;
  whatsapp: string;
  whatsappCtaLabel: string;
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
  active_trips: number | null;
  route: string | null;
  is_tracking: boolean | null;
  last_seen_at: string | null;
  last_latitude: number | null;
  last_longitude: number | null;
  last_accuracy: number | null;
};

type VehicleRow = {
  id: string;
  name: string;
  plate_number: string | null;
  vehicle_type: string | null;
  capacity_m3: number | null;
  status: string | null;
};

type RouteRateRow = {
  id: string;
  origin: string;
  destination: string;
  item_type: string;
  flat_price: number;
  max_volume_m3: number;
  eta: string;
  vehicle_id: string | null;
  vehicle: string | null;
  vehicle_name: string | null;
  note: string | null;
};

type ShipmentRow = {
  tracking_number: string;
  customer: string;
  item: string;
  destination: string;
  status: string;
  driver_id: string | null;
  driver: string | null;
  vehicle_id: string | null;
  vehicle: string | null;
  eta: string | null;
  ship_date: string | null;
  recipient_name: string | null;
  recipient_phone: string | null;
  recipient_address: string | null;
  route_id: string | null;
  current_location_label: string | null;
  map_note: string | null;
};

type ShipmentItemRow = {
  shipment_tracking_number: string;
  item_name: string;
  quantity: number | null;
  length_cm: number | null;
  width_cm: number | null;
  height_cm: number | null;
  volume_m3: number | null;
  note: string | null;
};

const defaultSiteSettings: SiteSettings = {
  siteName: "JeparaKirim",
  siteTagline: "Ekspedisi Furniture",
  heroTitle: "Ekspedisi Furniture Jepara ke Seluruh Indonesia",
  subheadline: "Cek ongkir cepat, booking rapi, tracking realtime.",
  contactLocation: "Jepara, Jawa Tengah",
  whatsapp: "6281234567890",
  whatsappCtaLabel: "WhatsApp Nego Harga",
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
  vehicles: [] as VehicleRecord[],
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

function mapVehicleRow(vehicle: VehicleRow): VehicleRecord {
  return {
    id: String(vehicle.id),
    name: compactText(vehicle.name, "Armada"),
    plateNumber: compactText(vehicle.plate_number, "-"),
    vehicleType: compactText(vehicle.vehicle_type, "-"),
    capacityM3: Number(vehicle.capacity_m3 ?? 0),
    status: compactText(vehicle.status, "Aktif")
  };
}

function mapDriverRow(driver: DriverRow): DriverRecord {
  return {
    id: String(driver.id),
    name: compactText(driver.name, "Driver"),
    phone: compactText(driver.phone, "-"),
    status: compactText(driver.status, "Standby"),
    activeTrips: Number(driver.active_trips ?? 0),
    route: compactText(driver.route, "-"),
    isTracking: driver.is_tracking ?? false,
    lastSeenAt: driver.last_seen_at,
    lastLatitude: driver.last_latitude,
    lastLongitude: driver.last_longitude,
    lastAccuracy: driver.last_accuracy
  };
}

function mapRouteRow(route: RouteRateRow, vehicleMap: Map<string, VehicleRecord>): RouteRate {
  const mappedVehicle = route.vehicle_id ? vehicleMap.get(String(route.vehicle_id)) : undefined;
  const resolvedVehicleName = compactText(route.vehicle_name, compactText(route.vehicle, mappedVehicle?.name ?? "Armada belum dipilih"));
  return {
    id: String(route.id),
    origin: compactText(route.origin, "-"),
    destination: compactText(route.destination, "-"),
    itemType: compactText(route.item_type, "-"),
    flatPrice: Number(route.flat_price ?? 0),
    maxVolumeM3: Number(route.max_volume_m3 ?? 0),
    eta: compactText(route.eta, "-"),
    vehicleId: route.vehicle_id ? String(route.vehicle_id) : mappedVehicle?.id ?? "",
    vehicle: resolvedVehicleName,
    note: String(route.note ?? "")
  };
}

function mapShipmentRow(
  shipment: ShipmentRow,
  driverMap: Map<string, DriverRecord>,
  shipmentItems: ShipmentItemInput[]
): ShipmentRecord {
  const driver = shipment.driver_id ? driverMap.get(String(shipment.driver_id)) : undefined;
  const currentLocation = driver?.lastLatitude != null && driver.lastLongitude != null
    ? formatDriverLocation(driver, shipment.current_location_label)
    : compactText(shipment.current_location_label, "Driver belum mengirim lokasi");

  return {
    trackingNumber: shipment.tracking_number,
    customer: compactText(shipment.customer, "-"),
    item: compactText(shipment.item, shipmentItems.length ? `${shipmentItems.length} barang` : "-"),
    destination: compactText(shipment.destination, "-"),
    status: compactText(shipment.status, "Pickup Dijadwalkan"),
    driverId: shipment.driver_id ? String(shipment.driver_id) : driver?.id ?? "",
    driverName: driver?.name ?? compactText(shipment.driver, "Belum ditentukan"),
    vehicleId: shipment.vehicle_id ? String(shipment.vehicle_id) : "",
    vehicle: compactText(shipment.vehicle, "-"),
    eta: compactText(shipment.eta, "-"),
    shipDate: compactText(shipment.ship_date, "-"),
    recipientName: compactText(shipment.recipient_name, "-"),
    recipientPhone: compactText(shipment.recipient_phone, "-"),
    recipientAddress: compactText(shipment.recipient_address, "-"),
    routeId: shipment.route_id ? String(shipment.route_id) : "",
    currentLocation,
    currentLocationLabel: compactText(shipment.current_location_label, currentLocation),
    mapNote: driver?.lastLatitude != null && driver.lastLongitude != null
      ? "Posisi live diambil dari aplikasi driver."
      : compactText(shipment.map_note, "Menunggu titik lokasi pertama dari aplikasi driver."),
    isTracking: driver?.isTracking ?? false,
    lastSeenAt: driver?.lastSeenAt ?? null,
    lastLatitude: driver?.lastLatitude ?? null,
    lastLongitude: driver?.lastLongitude ?? null,
    items: shipmentItems
  };
}

function mapShipmentItemRow(item: ShipmentItemRow): ShipmentItemInput {
  return {
    itemName: compactText(item.item_name, "Barang"),
    quantity: Number(item.quantity ?? 1),
    lengthCm: Number(item.length_cm ?? 0),
    widthCm: Number(item.width_cm ?? 0),
    heightCm: Number(item.height_cm ?? 0),
    volumeM3: Number(item.volume_m3 ?? 0),
    note: String(item.note ?? "")
  };
}

function applySiteSettings(row: Record<string, unknown> | null) {
  if (!row) return;

  Object.assign(state.siteSettings, {
    siteName: (row.site_name as string | null) ?? defaultSiteSettings.siteName,
    siteTagline: (row.site_tagline as string | null) ?? defaultSiteSettings.siteTagline,
    heroTitle: (row.hero_title as string | null) ?? defaultSiteSettings.heroTitle,
    subheadline: (row.subheadline as string | null) ?? defaultSiteSettings.subheadline,
    contactLocation: (row.contact_location as string | null) ?? defaultSiteSettings.contactLocation,
    whatsapp: (row.whatsapp as string | null) ?? defaultSiteSettings.whatsapp,
    whatsappCtaLabel: (row.whatsapp_cta_label as string | null) ?? defaultSiteSettings.whatsappCtaLabel,
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
  });
}

async function loadPublicData() {
  if (!isSupabaseConfigured || !supabase) return false;

  const [settingsRes, routesRes, vehiclesRes] = await Promise.all([
    supabase.from("site_settings").select("*").limit(1).maybeSingle(),
    supabase.from("route_rates").select("*").order("destination"),
    supabase.from("vehicles").select("*").order("name")
  ]);

  applySiteSettings(settingsRes.data as Record<string, unknown> | null);

  const vehicleRows = (vehiclesRes.data ?? []) as VehicleRow[];
  state.vehicles = vehicleRows.map(mapVehicleRow);
  const vehicleMap = new Map(state.vehicles.map((vehicle) => [vehicle.id, vehicle]));

  const routeRows = (routesRes.data ?? []) as RouteRateRow[];
  state.routeRates = routeRows.map((route) => mapRouteRow(route, vehicleMap));
  state.source = "supabase";
  return true;
}

async function loadAdminData() {
  if (!isSupabaseConfigured || !supabase) return false;

  const [settingsRes, vehiclesRes, routesRes, driversRes, shipmentsRes, shipmentItemsRes] = await Promise.all([
    supabase.from("site_settings").select("*").limit(1).maybeSingle(),
    supabase.from("vehicles").select("*").order("name"),
    supabase.from("route_rates").select("*").order("destination"),
    supabase.from("drivers").select("*").order("name"),
    supabase.from("shipments").select("*").order("tracking_number", { ascending: false }),
    supabase.from("shipment_items").select("*").order("created_at", { ascending: true })
  ]);

  applySiteSettings(settingsRes.data as Record<string, unknown> | null);

  const vehicleRows = (vehiclesRes.data ?? []) as VehicleRow[];
  state.vehicles = vehicleRows.map(mapVehicleRow);
  const vehicleMap = new Map(state.vehicles.map((vehicle) => [vehicle.id, vehicle]));

  const routeRows = (routesRes.data ?? []) as RouteRateRow[];
  state.routeRates = routeRows.map((route) => mapRouteRow(route, vehicleMap));

  const driverRows = (driversRes.data ?? []) as DriverRow[];
  state.drivers = driverRows.map(mapDriverRow);
  const driverMap = new Map(state.drivers.map((driver) => [driver.id, driver]));

  const shipmentItemsByTracking = new Map<string, ShipmentItemInput[]>();
  ((shipmentItemsRes.data ?? []) as ShipmentItemRow[]).forEach((item) => {
    const tracking = String(item.shipment_tracking_number);
    const existing = shipmentItemsByTracking.get(tracking) ?? [];
    existing.push(mapShipmentItemRow(item));
    shipmentItemsByTracking.set(tracking, existing);
  });

  const shipmentRows = (shipmentsRes.data ?? []) as ShipmentRow[];
  state.shipments = shipmentRows.map((shipment) =>
    mapShipmentRow(shipment, driverMap, shipmentItemsByTracking.get(shipment.tracking_number) ?? [])
  );
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
      .select("id, name, phone, status, active_trips, route, is_tracking, last_seen_at, last_latitude, last_longitude, last_accuracy")
      .eq("id", shipmentRow.driver_id)
      .maybeSingle();

    if (driverRes.data) {
      const driver = mapDriverRow(driverRes.data as DriverRow);
      driverMap = new Map([[driver.id, driver]]);
    }
  }

  const itemsRes = await supabase
    .from("shipment_items")
    .select("*")
    .eq("shipment_tracking_number", normalizedTracking)
    .order("created_at", { ascending: true });

  return mapShipmentRow(shipmentRow, driverMap, ((itemsRes.data ?? []) as ShipmentItemRow[]).map(mapShipmentItemRow));
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

async function upsertVehicleRemote(vehicle: VehicleRecord) {
  if (!supabase || !isSupabaseConfigured) return;
  await supabase.from("vehicles").upsert({
    id: vehicle.id,
    name: vehicle.name,
    plate_number: vehicle.plateNumber,
    vehicle_type: vehicle.vehicleType,
    capacity_m3: vehicle.capacityM3,
    status: vehicle.status
  });
}

async function deleteVehicleRemote(id: string) {
  if (!supabase || !isSupabaseConfigured) return;
  await supabase.from("vehicles").delete().eq("id", id);
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
    vehicle_id: route.vehicleId || null,
    vehicle: route.vehicle,
    vehicle_name: route.vehicle,
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
    vehicle_id: shipment.vehicleId || null,
    vehicle: compactText(shipment.vehicle, "-"),
    eta: compactText(shipment.eta, "-"),
    ship_date: compactText(shipment.shipDate, "-"),
    recipient_name: compactText(shipment.recipientName, "-"),
    recipient_phone: compactText(shipment.recipientPhone, "-"),
    recipient_address: compactText(shipment.recipientAddress, "-"),
    route_id: shipment.routeId || null,
    current_location_label: compactText(shipment.currentLocationLabel, "Menunggu pickup driver"),
    map_note: compactText(shipment.mapNote, "Menunggu titik lokasi pertama dari aplikasi driver.")
  });

  if (shipment.items.length) {
    await supabase.from("shipment_items").insert(
      shipment.items.map((item) => ({
        shipment_tracking_number: shipment.trackingNumber,
        item_name: compactText(item.itemName, "Barang"),
        quantity: Math.max(1, item.quantity),
        length_cm: Math.max(0, item.lengthCm),
        width_cm: Math.max(0, item.widthCm),
        height_cm: Math.max(0, item.heightCm),
        volume_m3: item.volumeM3,
        note: item.note
      }))
    );
  }
}

async function upsertSiteSettingsRemote(settings: SiteSettings) {
  if (!supabase || !isSupabaseConfigured) return;
  await supabase.from("site_settings").upsert({
    id: 1,
    site_name: settings.siteName,
    site_tagline: settings.siteTagline,
    hero_title: settings.heroTitle,
    subheadline: settings.subheadline,
    contact_location: settings.contactLocation,
    whatsapp: settings.whatsapp,
    whatsapp_cta_label: settings.whatsappCtaLabel,
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
  const vehicleCount = computed(() => state.vehicles.length);

  async function saveVehicle(vehicle: VehicleRecord) {
    const index = state.vehicles.findIndex((entry) => entry.id === vehicle.id);
    if (index >= 0) state.vehicles[index] = vehicle;
    else state.vehicles.unshift(vehicle);
    await upsertVehicleRemote(vehicle);
    await refreshOpsStore();
  }

  async function deleteVehicle(id: string) {
    state.vehicles = state.vehicles.filter((entry) => entry.id !== id) as typeof state.vehicles;
    await deleteVehicleRemote(id);
    await refreshOpsStore();
  }

  async function saveRouteRate(route: RouteRate) {
    const index = state.routeRates.findIndex((entry) => entry.id === route.id);
    if (index >= 0) state.routeRates[index] = route;
    else state.routeRates.unshift(route);
    await upsertRouteRateRemote(route);
    await refreshOpsStore();
  }

  async function deleteRouteRate(id: string) {
    state.routeRates = state.routeRates.filter((entry) => entry.id !== id) as typeof state.routeRates;
    await deleteRouteRateRemote(id);
    await refreshOpsStore();
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
    Object.assign(state.siteSettings, settings);
    await upsertSiteSettingsRemote(settings);
  }

  return {
    state,
    shipmentCount,
    activeDriverCount,
    vehicleCount,
    saveVehicle,
    deleteVehicle,
    saveRouteRate,
    deleteRouteRate,
    saveDriver,
    deleteDriver,
    saveShipment,
    saveSiteSettings
  };
}
