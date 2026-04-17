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
};

export type ShipmentRecord = {
  trackingNumber: string;
  customer: string;
  item: string;
  destination: string;
  status: string;
  driver: string;
  vehicle: string;
  eta: string;
  currentLocation: string;
  mapLink: string;
  mapNote: string;
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
  source: isSupabaseConfigured ? "supabase" : "local",
  siteSettings: { ...defaultSiteSettings } as SiteSettings,
  routeRates: [] as RouteRate[],
  drivers: [] as DriverRecord[],
  shipments: [] as ShipmentRecord[]
});

export async function initializeOpsStore() {
  if (state.initialized) return;
  state.loading = true;

  if (isSupabaseConfigured && supabase) {
    try {
      const [settingsRes, routesRes, driversRes, shipmentsRes] = await Promise.all([
        supabase.from("site_settings").select("*").limit(1).maybeSingle(),
        supabase.from("route_rates").select("*").order("destination"),
        supabase.from("drivers").select("*").order("name"),
        supabase.from("shipments").select("*").order("trackingNumber", { ascending: false })
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

      if (driversRes.data?.length) {
        state.drivers = driversRes.data.map((driver) => ({
          id: String(driver.id),
          name: driver.name,
          phone: driver.phone,
          status: driver.status,
          primaryVehicle: driver.primary_vehicle,
          activeTrips: driver.active_trips,
          route: driver.route
        }));
      }

      if (shipmentsRes.data?.length) {
        state.shipments = shipmentsRes.data.map((shipment) => ({
          trackingNumber: shipment.tracking_number,
          customer: shipment.customer,
          item: shipment.item,
          destination: shipment.destination,
          status: shipment.status,
          driver: shipment.driver,
          vehicle: shipment.vehicle,
          eta: shipment.eta,
          currentLocation: shipment.current_location,
          mapLink: shipment.map_link,
          mapNote: shipment.map_note
        }));
      }
      state.source = "supabase";
    } catch {
      state.source = "local";
    }
  }

  state.loading = false;
  state.initialized = true;
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
  await supabase.from("drivers").upsert({
    id: driver.id,
    name: driver.name,
    phone: driver.phone,
    status: driver.status,
    primary_vehicle: driver.primaryVehicle,
    active_trips: driver.activeTrips,
    route: driver.route
  });
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
    driver: shipment.driver,
    vehicle: shipment.vehicle,
    eta: shipment.eta,
    current_location: shipment.currentLocation,
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
  const activeDriverCount = computed(() => state.drivers.filter((driver) => driver.status === "On Duty").length);

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
    const index = state.drivers.findIndex((entry) => entry.id === driver.id);
    if (index >= 0) state.drivers[index] = driver;
    else state.drivers.unshift(driver);
    await upsertDriverRemote(driver);
  }

  async function deleteDriver(id: string) {
    state.drivers = state.drivers.filter((entry) => entry.id !== id) as typeof state.drivers;
    await deleteDriverRemote(id);
  }

  async function saveShipment(shipment: ShipmentRecord) {
    state.shipments.unshift(shipment);
    await insertShipmentRemote(shipment);
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
