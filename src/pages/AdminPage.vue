<template>
  <div class="min-h-screen bg-slate-950 p-4 sm:p-5">
    <div v-if="!authState.initialized || opsState.loading" class="panel-dark flex min-h-[calc(100vh-2rem)] items-center justify-center text-white">
      <div class="text-center">
        <p class="section-kicker !text-slate-400">Memuat Dashboard</p>
        <p class="mt-3 text-lg font-semibold">Menyiapkan auth dan data operasional...</p>
      </div>
    </div>

    <div v-else class="grid min-h-[calc(100vh-2rem)] gap-4 xl:grid-cols-[300px_1fr]">
      <aside class="panel-dark flex h-full flex-col p-5 text-white">
        <div class="rounded-[1.5rem] bg-gradient-to-br from-primary to-slate-800 p-5">
          <p class="text-sm uppercase tracking-[0.28em] text-blue-100">Admin Panel</p>
          <h1 class="font-display mt-2 text-2xl font-bold">JeparaKirim Ops</h1>
          <p class="mt-3 text-sm leading-7 text-slate-300">Tarif flat, driver, dan pengiriman memakai sumber data yang sama.</p>
          <div class="mt-5 rounded-2xl bg-white/10 px-4 py-3 text-sm">
            Source data: <span class="font-bold">{{ opsState.source }}</span>
          </div>
        </div>

        <div class="mt-6 space-y-5">
          <div v-for="section in menuSections" :key="section.title">
            <p class="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-slate-400">{{ section.title }}</p>
            <div class="grid gap-2">
              <button
                v-for="item in section.items"
                :key="item.key"
                :class="active === item.key ? 'bg-white text-slate-950' : 'bg-white/5 text-slate-200 hover:bg-white/10'"
                class="flex items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-semibold transition"
                @click="active = item.key"
              >
                <span>{{ item.label }}</span>
                <span class="text-xs text-slate-400">{{ item.meta }}</span>
              </button>
            </div>
          </div>
        </div>

        <div class="mt-auto space-y-3 pt-6">
          <Button class="w-full" variant="dark" @click="handleSignOut">Keluar</Button>
          <RouterLink to="/" class="inline-flex rounded-full border border-white/10 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/5">
            Kembali ke Website
          </RouterLink>
        </div>
      </aside>

      <main class="panel h-full overflow-hidden p-0">
        <div class="flex h-full flex-col">
          <div class="border-b border-slate-100 px-6 py-5 sm:px-8">
            <div class="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p class="section-kicker">{{ activeHeader.eyebrow }}</p>
                <h2 class="font-display mt-2 text-3xl font-bold text-slate-950">{{ activeHeader.title }}</h2>
              </div>
              <div class="flex flex-wrap gap-3">
                <Button v-if="active === 'routes'" variant="secondary" @click="saveRoute">{{ editingRouteId ? "Update Rute" : "Input Rute" }}</Button>
                <Button v-if="active === 'drivers'" variant="secondary" @click="saveDriver">{{ editingDriverId ? "Update Driver" : "Input Driver" }}</Button>
                <Button v-if="active === 'create'" @click="createShipment">Simpan Pengiriman</Button>
              </div>
            </div>
          </div>

          <div class="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
            <template v-if="active === 'settings'">
              <div class="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                <Card class="panel p-6">
                  <p class="section-kicker">Setting Situs</p>
                  <div class="mt-6 grid gap-4">
                    <label class="grid gap-2 text-sm font-semibold">
                      Judul Hero
                      <input v-model="siteSettings.heroTitle" class="field" />
                    </label>
                    <label class="grid gap-2 text-sm font-semibold">
                      Subheadline
                      <input v-model="siteSettings.subheadline" class="field" />
                    </label>
                    <label class="grid gap-2 text-sm font-semibold">
                      WhatsApp
                      <input v-model="siteSettings.whatsapp" class="field" />
                    </label>
                    <label class="grid gap-2 text-sm font-semibold">
                      CTA Utama
                      <input v-model="siteSettings.primaryCta" class="field" />
                    </label>
                    <div class="grid gap-4 sm:grid-cols-2">
                      <label class="grid gap-2 text-sm font-semibold">
                        Hero Image 1
                        <input v-model="siteSettings.heroImage1" class="field" placeholder="/images/hero-main.svg" />
                      </label>
                      <label class="grid gap-2 text-sm font-semibold">
                        Hero Image 2
                        <input v-model="siteSettings.heroImage2" class="field" placeholder="/images/hero-route.svg" />
                      </label>
                    </div>
                    <div class="grid gap-4 sm:grid-cols-2">
                      <label class="grid gap-2 text-sm font-semibold">
                        Hero Image 3
                        <input v-model="siteSettings.heroImage3" class="field" placeholder="/images/hero-tracking.svg" />
                      </label>
                      <label class="grid gap-2 text-sm font-semibold">
                        History Image
                        <input v-model="siteSettings.historyImage" class="field" placeholder="/images/history-hero.svg" />
                      </label>
                    </div>
                    <div class="grid gap-4 sm:grid-cols-2">
                      <label class="grid gap-2 text-sm font-semibold">
                        Why Packaging Image
                        <input v-model="siteSettings.whyPackagingImage" class="field" placeholder="/images/why-packaging.svg" />
                      </label>
                      <label class="grid gap-2 text-sm font-semibold">
                        Why Delivery Image
                        <input v-model="siteSettings.whyDeliveryImage" class="field" placeholder="/images/why-delivery.svg" />
                      </label>
                    </div>
                    <div class="grid gap-4 sm:grid-cols-3">
                      <label class="grid gap-2 text-sm font-semibold">
                        Testimoni 1 Image
                        <input v-model="siteSettings.testimonialImage1" class="field" placeholder="/images/testimonial-1.svg" />
                      </label>
                      <label class="grid gap-2 text-sm font-semibold">
                        Testimoni 2 Image
                        <input v-model="siteSettings.testimonialImage2" class="field" placeholder="/images/testimonial-2.svg" />
                      </label>
                      <label class="grid gap-2 text-sm font-semibold">
                        Testimoni 3 Image
                        <input v-model="siteSettings.testimonialImage3" class="field" placeholder="/images/testimonial-3.svg" />
                      </label>
                    </div>
                    <Button class="w-full" @click="saveSettings">Simpan Setting</Button>
                  </div>
                </Card>

                <Card class="panel overflow-hidden bg-slate-950 text-white">
                  <div class="border-b border-white/10 px-6 py-5">
                    <p class="section-kicker !text-slate-400">Preview</p>
                    <h3 class="mt-2 font-display text-3xl font-bold">Tampilan ringkas</h3>
                  </div>
                  <div class="space-y-5 p-6">
                    <div class="rounded-[1.5rem] bg-white/5 p-6">
                      <p class="text-xs uppercase tracking-[0.2em] text-blue-100">Landing Page</p>
                      <h4 class="font-display mt-3 text-3xl font-bold">{{ siteSettings.heroTitle }}</h4>
                      <p class="mt-3 text-sm text-slate-300">{{ siteSettings.subheadline }}</p>
                    </div>
                    <div class="grid gap-4 sm:grid-cols-2">
                      <div class="overflow-hidden rounded-[1.5rem] bg-white/5">
                        <div class="h-32 bg-cover bg-center" :style="{ backgroundImage: `url('${siteSettings.heroImage1}')` }"></div>
                        <div class="px-4 py-3 text-sm text-slate-300">Hero 1</div>
                      </div>
                      <div class="overflow-hidden rounded-[1.5rem] bg-white/5">
                        <div class="h-32 bg-cover bg-center" :style="{ backgroundImage: `url('${siteSettings.historyImage}')` }"></div>
                        <div class="px-4 py-3 text-sm text-slate-300">History</div>
                      </div>
                    </div>
                    <div class="rounded-[1.5rem] bg-white/5 p-6">
                      <p class="text-sm text-slate-400">WhatsApp</p>
                      <p class="mt-2 text-xl font-bold">{{ siteSettings.whatsapp }}</p>
                    </div>
                  </div>
                </Card>
              </div>
            </template>

            <template v-else-if="active === 'routes'">
              <div class="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
                <Card class="panel p-6">
                  <p class="section-kicker">CRUD Data Rute</p>
                  <h3 class="mt-2 text-2xl font-bold">{{ editingRouteId ? "Edit tarif flat" : "Tambah tarif flat baru" }}</h3>

                  <div class="mt-6 grid gap-4">
                    <div class="grid gap-4 sm:grid-cols-2">
                      <label class="grid gap-2 text-sm font-semibold">
                        Asal
                        <input v-model="routeForm.origin" class="field" />
                      </label>
                      <label class="grid gap-2 text-sm font-semibold">
                        Tujuan
                        <input v-model="routeForm.destination" class="field" />
                      </label>
                    </div>
                    <div class="grid gap-4 sm:grid-cols-2">
                      <label class="grid gap-2 text-sm font-semibold">
                        Jenis Barang
                        <select v-model="routeForm.itemType" class="field">
                          <option v-for="item in itemTypes" :key="item.name" :value="item.name">{{ item.name }}</option>
                        </select>
                      </label>
                      <label class="grid gap-2 text-sm font-semibold">
                        Armada
                        <select v-model="routeForm.vehicle" class="field">
                          <option v-for="vehicle in vehicles" :key="vehicle.name" :value="vehicle.name">{{ vehicle.name }}</option>
                        </select>
                      </label>
                    </div>
                    <div class="grid gap-4 sm:grid-cols-3">
                      <label class="grid gap-2 text-sm font-semibold">
                        Tarif Flat
                        <input v-model.number="routeForm.flatPrice" class="field" min="0" type="number" />
                      </label>
                      <label class="grid gap-2 text-sm font-semibold">
                        Batas Volume Flat (m3)
                        <input v-model.number="routeForm.maxVolumeM3" class="field" min="1" step="0.1" type="number" />
                      </label>
                      <label class="grid gap-2 text-sm font-semibold">
                        ETA
                        <input v-model="routeForm.eta" class="field" />
                      </label>
                    </div>
                    <label class="grid gap-2 text-sm font-semibold">
                      Catatan
                      <textarea v-model="routeForm.note" class="field-textarea" rows="4"></textarea>
                    </label>
                    <div class="grid gap-3 sm:grid-cols-2">
                      <Button class="w-full" variant="secondary" @click="saveRoute">{{ editingRouteId ? "Update Rute" : "Input Rute" }}</Button>
                      <Button v-if="editingRouteId" class="w-full" variant="ghost" @click="resetRouteForm">Batal Edit</Button>
                    </div>
                  </div>
                </Card>

                <Card class="panel overflow-hidden">
                  <div class="border-b border-slate-100 px-6 py-5">
                    <p class="section-kicker">Data Rute</p>
                    <h3 class="mt-2 text-2xl font-bold">Tarif flat aktif</h3>
                    <div class="mt-4 grid gap-3 md:grid-cols-[1fr_180px_160px]">
                      <input v-model="routeSearch" class="field" placeholder="Cari tujuan, barang, armada..." />
                      <select v-model="routeSortKey" class="field">
                        <option value="destination">Sort: Tujuan</option>
                        <option value="itemType">Sort: Barang</option>
                        <option value="flatPrice">Sort: Tarif</option>
                        <option value="maxVolumeM3">Sort: Volume</option>
                      </select>
                      <select v-model="routeSortOrder" class="field">
                        <option value="asc">ASC</option>
                        <option value="desc">DESC</option>
                      </select>
                    </div>
                  </div>
                  <div class="overflow-x-auto">
                    <table class="min-w-full text-left text-sm">
                      <thead class="bg-slate-50 text-muted-foreground">
                        <tr>
                          <th class="px-6 py-4 font-semibold">Tujuan</th>
                          <th class="px-6 py-4 font-semibold">Barang</th>
                          <th class="px-6 py-4 font-semibold">Tarif</th>
                          <th class="px-6 py-4 font-semibold">Batas Flat</th>
                          <th class="px-6 py-4 font-semibold">Armada</th>
                          <th class="px-6 py-4 font-semibold">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="route in paginatedRouteRates" :key="route.id" class="border-t border-slate-100">
                          <td class="px-6 py-4 font-bold text-slate-950">{{ route.origin }} -> {{ route.destination }}</td>
                          <td class="px-6 py-4">{{ route.itemType }}</td>
                          <td class="px-6 py-4 text-primary">{{ formatCurrency(route.flatPrice) }}</td>
                          <td class="px-6 py-4">{{ route.maxVolumeM3 }} m3</td>
                          <td class="px-6 py-4">{{ route.vehicle }}</td>
                          <td class="px-6 py-4">
                            <div class="flex gap-2">
                              <Button size="sm" variant="ghost" @click="editRoute(route.id)">Edit</Button>
                              <Button size="sm" variant="ghost" class="text-red-600 hover:bg-red-50" @click="deleteRoute(route.id)">Hapus</Button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="flex items-center justify-between border-t border-slate-100 px-6 py-4 text-sm">
                    <p>Halaman {{ routePage }} / {{ routePageCount }}</p>
                    <div class="flex gap-2">
                      <Button size="sm" variant="ghost" :class="routePage <= 1 ? 'pointer-events-none opacity-50' : ''" @click="routePage--">Prev</Button>
                      <Button size="sm" variant="ghost" :class="routePage >= routePageCount ? 'pointer-events-none opacity-50' : ''" @click="routePage++">Next</Button>
                    </div>
                  </div>
                </Card>
              </div>
            </template>

            <template v-else-if="active === 'drivers'">
              <div class="grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
                <Card class="panel p-6">
                  <p class="section-kicker">CRUD Driver</p>
                  <h3 class="mt-2 text-2xl font-bold">{{ editingDriverId ? "Edit data driver" : "Tambah data driver baru" }}</h3>

                  <div class="mt-6 grid gap-4">
                    <div class="grid gap-4 sm:grid-cols-2">
                      <label class="grid gap-2 text-sm font-semibold">
                        Nama Driver
                        <input v-model="driverForm.name" class="field" />
                      </label>
                      <label class="grid gap-2 text-sm font-semibold">
                        Nomor HP
                        <input v-model="driverForm.phone" class="field" />
                      </label>
                    </div>
                    <div class="grid gap-4 sm:grid-cols-2">
                      <label class="grid gap-2 text-sm font-semibold">
                        Status
                        <select v-model="driverForm.status" class="field">
                          <option>On Duty</option>
                          <option>Standby</option>
                        </select>
                      </label>
                      <label class="grid gap-2 text-sm font-semibold">
                        Armada Utama
                        <select v-model="driverForm.primaryVehicle" class="field">
                          <option v-for="vehicle in vehicles" :key="vehicle.name" :value="vehicle.name">{{ vehicle.name }}</option>
                        </select>
                      </label>
                    </div>
                    <div class="grid gap-4 sm:grid-cols-2">
                      <label class="grid gap-2 text-sm font-semibold">
                        Trip Aktif
                        <input v-model.number="driverForm.activeTrips" class="field" min="0" type="number" />
                      </label>
                      <label class="grid gap-2 text-sm font-semibold">
                        Rute Utama
                        <input v-model="driverForm.route" class="field" />
                      </label>
                    </div>
                    <div class="grid gap-3 sm:grid-cols-2">
                      <Button class="w-full" variant="secondary" @click="saveDriver">{{ editingDriverId ? "Update Driver" : "Input Driver" }}</Button>
                      <Button v-if="editingDriverId" class="w-full" variant="ghost" @click="resetDriverForm">Batal Edit</Button>
                    </div>
                  </div>
                </Card>

                <div class="grid gap-4">
                  <div class="grid gap-3 md:grid-cols-[1fr_180px_160px]">
                    <input v-model="driverSearch" class="field" placeholder="Cari nama driver, armada, atau rute..." />
                    <select v-model="driverSortKey" class="field">
                      <option value="name">Sort: Nama</option>
                      <option value="status">Sort: Status</option>
                      <option value="activeTrips">Sort: Trip</option>
                      <option value="primaryVehicle">Sort: Armada</option>
                    </select>
                    <select v-model="driverSortOrder" class="field">
                      <option value="asc">ASC</option>
                      <option value="desc">DESC</option>
                    </select>
                  </div>
                  <div class="grid gap-6 md:grid-cols-2">
                    <Card v-for="driver in paginatedDrivers" :key="driver.id" class="panel p-6">
                      <div class="flex items-center justify-between gap-4">
                        <div>
                          <h3 class="text-xl font-bold text-slate-950">{{ driver.name }}</h3>
                          <p class="mt-1 text-sm text-muted-foreground">{{ driver.phone }}</p>
                        </div>
                        <span class="badge-soft" :class="driver.status === 'On Duty' ? 'bg-emerald-50 text-success' : 'bg-amber-50 text-warning'">{{ driver.status }}</span>
                      </div>
                      <div class="mt-5 space-y-3 rounded-[1.5rem] bg-slate-50 p-4 text-sm">
                        <p>Armada utama: <span class="font-bold text-slate-950">{{ driver.primaryVehicle }}</span></p>
                        <p>Trip aktif: <span class="font-bold text-slate-950">{{ driver.activeTrips }}</span></p>
                        <p>Rute utama: <span class="font-bold text-slate-950">{{ driver.route }}</span></p>
                      </div>
                      <div class="mt-4 flex gap-2">
                        <Button size="sm" variant="ghost" @click="editDriver(driver.id)">Edit</Button>
                        <Button size="sm" variant="ghost" class="text-red-600 hover:bg-red-50" @click="removeDriver(driver.id)">Hapus</Button>
                      </div>
                    </Card>
                  </div>
                  <div class="flex items-center justify-between text-sm">
                    <p>Halaman {{ driverPage }} / {{ driverPageCount }}</p>
                    <div class="flex gap-2">
                      <Button size="sm" variant="ghost" :class="driverPage <= 1 ? 'pointer-events-none opacity-50' : ''" @click="driverPage--">Prev</Button>
                      <Button size="sm" variant="ghost" :class="driverPage >= driverPageCount ? 'pointer-events-none opacity-50' : ''" @click="driverPage++">Next</Button>
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <template v-else-if="active === 'create'">
              <div class="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
                <Card class="panel p-6">
                  <p class="section-kicker">Input Pengiriman</p>
                  <div class="mt-6 grid gap-4">
                    <div class="grid gap-4 sm:grid-cols-2">
                      <label class="grid gap-2 text-sm font-semibold">
                        Nama Customer
                        <input v-model="shipmentForm.customer" class="field" />
                      </label>
                      <label class="grid gap-2 text-sm font-semibold">
                        Nomor WhatsApp
                        <input v-model="shipmentForm.phone" class="field" />
                      </label>
                    </div>
                    <div class="grid gap-4 sm:grid-cols-2">
                      <label class="grid gap-2 text-sm font-semibold">
                        Jenis Barang
                        <select v-model="shipmentForm.itemType" class="field">
                          <option v-for="item in itemTypes" :key="item.name" :value="item.name">{{ item.name }}</option>
                        </select>
                      </label>
                      <label class="grid gap-2 text-sm font-semibold">
                        Tujuan
                        <select v-model="shipmentForm.destination" class="field">
                          <option v-for="route in destinationOptions" :key="route" :value="route">{{ route }}</option>
                        </select>
                      </label>
                    </div>
                    <div class="grid gap-4 sm:grid-cols-3">
                      <label class="grid gap-2 text-sm font-semibold">
                        Panjang
                        <input v-model.number="shipmentForm.lengthCm" class="field" min="1" type="number" />
                      </label>
                      <label class="grid gap-2 text-sm font-semibold">
                        Lebar
                        <input v-model.number="shipmentForm.widthCm" class="field" min="1" type="number" />
                      </label>
                      <label class="grid gap-2 text-sm font-semibold">
                        Tinggi
                        <input v-model.number="shipmentForm.heightCm" class="field" min="1" type="number" />
                      </label>
                    </div>
                    <div class="grid gap-4 sm:grid-cols-3">
                      <label class="grid gap-2 text-sm font-semibold">
                        Qty
                        <input v-model.number="shipmentForm.quantity" class="field" min="1" type="number" />
                      </label>
                      <label class="grid gap-2 text-sm font-semibold">
                        Driver
                        <select v-model="shipmentForm.driverId" class="field">
                          <option v-for="driver in driversList" :key="driver.id" :value="driver.id">{{ driver.name }}</option>
                        </select>
                      </label>
                      <label class="grid gap-2 text-sm font-semibold">
                        Link Maps
                        <input v-model="shipmentForm.mapLink" class="field" />
                      </label>
                    </div>
                    <label class="grid gap-2 text-sm font-semibold">
                      Catatan
                      <textarea v-model="shipmentForm.note" class="field-textarea" rows="4"></textarea>
                    </label>
                  </div>
                </Card>

                <div class="grid gap-6">
                  <Card class="panel p-6">
                    <p class="section-kicker">Preview Hitung</p>
                    <h3 class="mt-2 text-2xl font-bold text-primary">{{ shipmentPreview.tracking }}</h3>
                    <div class="mt-5 grid gap-4 rounded-[1.5rem] bg-slate-50 p-5">
                      <div>
                        <p class="text-sm text-muted-foreground">Tarif Flat</p>
                        <p class="mt-1 text-2xl font-extrabold text-slate-950">{{ shipmentPreview.price }}</p>
                      </div>
                      <div>
                        <p class="text-sm text-muted-foreground">Volume</p>
                        <p class="mt-1 text-xl font-bold text-slate-950">{{ shipmentPreview.volume }}</p>
                      </div>
                      <div>
                        <p class="text-sm text-muted-foreground">Status Flat</p>
                        <p class="mt-1 text-xl font-bold text-secondary">{{ shipmentPreview.status }}</p>
                      </div>
                      <div>
                        <p class="text-sm text-muted-foreground">Rute & Driver</p>
                        <p class="mt-1 text-base font-bold text-slate-950">{{ shipmentPreview.routeDriver }}</p>
                      </div>
                    </div>
                  </Card>

                  <Card class="panel p-6">
                    <p class="section-kicker">Cara Input</p>
                    <div class="mt-4 space-y-4">
                      <div v-for="step in inputSteps" :key="step" class="rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-900">{{ step }}</div>
                    </div>
                  </Card>
                </div>
              </div>
            </template>

            <template v-else-if="active === 'shipments'">
              <div class="grid gap-6">
                <div class="grid gap-4 md:grid-cols-4">
                  <Card v-for="stat in shipmentStats" :key="stat.label" class="panel p-5">
                    <p class="text-sm font-semibold text-muted-foreground">{{ stat.label }}</p>
                    <p class="mt-3 text-4xl font-extrabold text-slate-950">{{ stat.value }}</p>
                    <p class="mt-2 text-sm text-muted-foreground">{{ stat.note }}</p>
                  </Card>
                </div>

                <Card class="panel overflow-hidden">
                  <div class="border-b border-slate-100 px-6 py-5">
                    <p class="section-kicker">Pencarian Pengiriman</p>
                    <div class="mt-4 grid gap-3 md:grid-cols-[1fr_180px_160px]">
                      <input v-model="shipmentSearch" class="field" placeholder="Cari tracking, customer, barang, rute, atau sopir..." />
                      <select v-model="shipmentSortKey" class="field">
                        <option value="trackingNumber">Sort: Tracking</option>
                        <option value="customer">Sort: Customer</option>
                        <option value="destination">Sort: Rute</option>
                        <option value="driver">Sort: Sopir</option>
                        <option value="status">Sort: Status</option>
                      </select>
                      <select v-model="shipmentSortOrder" class="field">
                        <option value="asc">ASC</option>
                        <option value="desc">DESC</option>
                      </select>
                    </div>
                  </div>
                  <div class="overflow-x-auto">
                    <table class="min-w-full text-left text-sm">
                      <thead class="bg-slate-50 text-muted-foreground">
                        <tr>
                          <th class="px-6 py-4 font-semibold">Tracking</th>
                          <th class="px-6 py-4 font-semibold">Customer</th>
                          <th class="px-6 py-4 font-semibold">Barang</th>
                          <th class="px-6 py-4 font-semibold">Rute</th>
                          <th class="px-6 py-4 font-semibold">Sopir</th>
                          <th class="px-6 py-4 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="shipment in paginatedShipments" :key="shipment.trackingNumber" class="border-t border-slate-100">
                          <td class="px-6 py-4 font-bold text-primary">{{ shipment.trackingNumber }}</td>
                          <td class="px-6 py-4">{{ shipment.customer }}</td>
                          <td class="px-6 py-4">{{ shipment.item }}</td>
                          <td class="px-6 py-4">{{ shipment.destination }}</td>
                          <td class="px-6 py-4">{{ shipment.driver }}</td>
                          <td class="px-6 py-4">
                            <span class="badge-soft" :class="statusClass(shipment.status)">{{ shipment.status }}</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="flex items-center justify-between border-t border-slate-100 px-6 py-4 text-sm">
                    <p>Halaman {{ shipmentPage }} / {{ shipmentPageCount }}</p>
                    <div class="flex gap-2">
                      <Button size="sm" variant="ghost" :class="shipmentPage <= 1 ? 'pointer-events-none opacity-50' : ''" @click="shipmentPage--">Prev</Button>
                      <Button size="sm" variant="ghost" :class="shipmentPage >= shipmentPageCount ? 'pointer-events-none opacity-50' : ''" @click="shipmentPage++">Next</Button>
                    </div>
                  </div>
                </Card>
              </div>
            </template>

            <template v-else-if="active === 'reports'">
              <div class="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                <div class="grid gap-6">
                  <Card v-for="report in reportCards" :key="report.label" class="panel p-6">
                    <p class="section-kicker">{{ report.label }}</p>
                    <p class="mt-3 text-4xl font-extrabold text-slate-950">{{ report.value }}</p>
                    <p class="mt-2 text-sm leading-7 text-muted-foreground">{{ report.note }}</p>
                  </Card>
                </div>

                <Card class="panel overflow-hidden">
                  <div class="border-b border-slate-100 px-6 py-5">
                    <p class="section-kicker">Laporan Ringkas</p>
                    <h3 class="mt-2 text-2xl font-bold">Performa tarif flat</h3>
                  </div>
                  <div class="space-y-4 p-6">
                    <div v-for="item in reportDetails" :key="item.title" class="rounded-2xl bg-slate-50 p-5">
                      <div class="flex items-center justify-between gap-4">
                        <p class="font-bold text-slate-950">{{ item.title }}</p>
                        <span class="badge-soft bg-accent text-accent-foreground">{{ item.badge }}</span>
                      </div>
                      <p class="mt-3 text-sm leading-7 text-muted-foreground">{{ item.description }}</p>
                    </div>
                  </div>
                </Card>
              </div>
            </template>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import { RouterLink } from "vue-router";
import Button from "@/components/ui/Button.vue";
import Card from "@/components/ui/Card.vue";
import { itemTypes, vehicles } from "@/data/catalog";
import { formatCurrency } from "@/lib/utils";
import { initializeAuth, signOutAdmin, useAuthStore } from "@/store/auth";
import { type DriverRecord, type RouteRate, initializeOpsStore, useOpsStore } from "@/store/ops";

type ActiveMenu = "settings" | "routes" | "create" | "shipments" | "drivers" | "reports";

const { state: authState } = useAuthStore();
const { state: opsState, saveRouteRate, deleteRouteRate, saveDriver: persistDriver, deleteDriver: removePersistedDriver, saveShipment, saveSiteSettings } = useOpsStore();

const menuSections = [
  { title: "Website", items: [{ key: "settings", label: "Setting Situs", meta: "Web" }] },
  { title: "Master Data", items: [{ key: "routes", label: "Data Rute", meta: "Flat" }, { key: "drivers", label: "Data Supir", meta: "Driver" }] },
  { title: "Operasional", items: [{ key: "create", label: "Input Pengiriman", meta: "Input" }, { key: "shipments", label: "Data Pengiriman", meta: "Data" }, { key: "reports", label: "Laporan", meta: "Report" }] }
] as const;

const active = ref<ActiveMenu>("routes");
const editingRouteId = ref<string | null>(null);
const editingDriverId = ref<string | null>(null);
const routeSearch = ref("");
const driverSearch = ref("");
const shipmentSearch = ref("");
const routeSortKey = ref<"destination" | "itemType" | "flatPrice" | "maxVolumeM3">("destination");
const routeSortOrder = ref<"asc" | "desc">("asc");
const driverSortKey = ref<"name" | "status" | "activeTrips" | "primaryVehicle">("name");
const driverSortOrder = ref<"asc" | "desc">("asc");
const shipmentSortKey = ref<"trackingNumber" | "customer" | "destination" | "driver" | "status">("trackingNumber");
const shipmentSortOrder = ref<"asc" | "desc">("desc");
const routePage = ref(1);
const driverPage = ref(1);
const shipmentPage = ref(1);
const pageSize = 5;

const siteSettings = opsState.siteSettings;
const routeRates = computed(() => opsState.routeRates);
const driversList = computed(() => opsState.drivers);
const shipmentsList = computed(() => opsState.shipments);
const destinationOptions = computed(() => [...new Set(routeRates.value.map((route) => route.destination))]);

const routeForm = reactive({
  origin: "Jepara",
  destination: "Bandung",
  itemType: "Sofa",
  flatPrice: 2500000,
  maxVolumeM3: 6,
  eta: "2-4 hari",
  vehicle: "CDD Box",
  note: "Tarif flat untuk sofa tujuan Bandung."
});

const driverForm = reactive({
  name: "Agus Santoso",
  phone: "0812-9090-1101",
  status: "On Duty",
  primaryVehicle: "Box Besar",
  activeTrips: 2,
  route: "Bandung - Jakarta"
});

const shipmentForm = reactive({
  customer: "CV Mebel Nusantara",
  phone: "0812-0000-1122",
  itemType: "Lemari",
  destination: destinationOptions.value[0] ?? "Bandung",
  lengthCm: 200,
  widthCm: 90,
  heightCm: 200,
  quantity: 2,
  driverId: "",
  mapLink: "https://maps.google.com",
  note: "Menunggu pickup dari workshop."
});

const activeHeader = computed(() => {
  if (active.value === "settings") return { eyebrow: "Website", title: "Setting situs publik" };
  if (active.value === "routes") return { eyebrow: "Master Data", title: "Tarif flat per rute dan jenis barang" };
  if (active.value === "drivers") return { eyebrow: "Master Data", title: "CRUD data supir" };
  if (active.value === "create") return { eyebrow: "Operasional", title: "Input pengiriman model front page" };
  if (active.value === "shipments") return { eyebrow: "Operasional", title: "Data pengiriman aktif" };
  return { eyebrow: "Operasional", title: "Laporan ringkas" };
});

function sortList<T extends Record<string, string | number>>(items: T[], key: keyof T, order: "asc" | "desc") {
  return [...items].sort((a, b) => {
    const aValue = a[key];
    const bValue = b[key];
    if (typeof aValue === "number" && typeof bValue === "number") {
      return order === "asc" ? aValue - bValue : bValue - aValue;
    }
    return order === "asc" ? String(aValue).localeCompare(String(bValue)) : String(bValue).localeCompare(String(aValue));
  });
}

function paginate<T>(items: T[], page: number) {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

const filteredRouteRates = computed(() => {
  const query = routeSearch.value.trim().toLowerCase();
  const filtered = !query
    ? routeRates.value
    : routeRates.value.filter((route) => [route.origin, route.destination, route.itemType, route.vehicle].some((value) => value.toLowerCase().includes(query)));
  return sortList(filtered, routeSortKey.value, routeSortOrder.value);
});

const filteredDrivers = computed(() => {
  const query = driverSearch.value.trim().toLowerCase();
  const filtered = !query
    ? driversList.value
    : driversList.value.filter((driver) => [driver.name, driver.phone, driver.primaryVehicle, driver.route, driver.status].some((value) => value.toLowerCase().includes(query)));
  return sortList(filtered, driverSortKey.value, driverSortOrder.value);
});

const filteredShipments = computed(() => {
  const query = shipmentSearch.value.trim().toLowerCase();
  const filtered = !query
    ? shipmentsList.value
    : shipmentsList.value.filter((shipment) =>
        [shipment.trackingNumber, shipment.customer, shipment.item, shipment.destination, shipment.driver, shipment.status].some((value) => value.toLowerCase().includes(query))
      );
  return sortList(filtered, shipmentSortKey.value, shipmentSortOrder.value);
});

const routePageCount = computed(() => Math.max(1, Math.ceil(filteredRouteRates.value.length / pageSize)));
const driverPageCount = computed(() => Math.max(1, Math.ceil(filteredDrivers.value.length / pageSize)));
const shipmentPageCount = computed(() => Math.max(1, Math.ceil(filteredShipments.value.length / pageSize)));
const paginatedRouteRates = computed(() => paginate(filteredRouteRates.value, routePage.value));
const paginatedDrivers = computed(() => paginate(filteredDrivers.value, driverPage.value));
const paginatedShipments = computed(() => paginate(filteredShipments.value, shipmentPage.value));

watch([routeSearch, routeSortKey, routeSortOrder], () => (routePage.value = 1));
watch([driverSearch, driverSortKey, driverSortOrder], () => (driverPage.value = 1));
watch([shipmentSearch, shipmentSortKey, shipmentSortOrder], () => (shipmentPage.value = 1));
watch(routePageCount, (count) => {
  if (routePage.value > count) routePage.value = count;
});
watch(driverPageCount, (count) => {
  if (driverPage.value > count) driverPage.value = count;
});
watch(shipmentPageCount, (count) => {
  if (shipmentPage.value > count) shipmentPage.value = count;
});

const selectedRoute = computed(() => {
  return (
    routeRates.value.find((route) => route.destination === shipmentForm.destination && route.itemType === shipmentForm.itemType) ??
    routeRates.value.find((route) => route.destination === shipmentForm.destination) ??
    routeRates.value[0]
  );
});

const selectedDriver = computed(() => driversList.value.find((driver) => driver.id === shipmentForm.driverId) ?? driversList.value[0]);

const shipmentPreview = computed(() => {
  const route = selectedRoute.value;
  const volume = ((shipmentForm.lengthCm * shipmentForm.widthCm * shipmentForm.heightCm) / 1_000_000) * Math.max(1, shipmentForm.quantity);
  const multiplier = route ? Math.max(1, Math.ceil(volume / route.maxVolumeM3)) : 1;

  return {
    tracking: previewTracking.value,
    price: route ? formatCurrency(route.flatPrice * multiplier) : "-",
    volume: `${volume.toFixed(2)} m3`,
    status: route ? (multiplier > 1 ? `${multiplier}x tarif flat` : "Masuk tarif flat") : "-",
    routeDriver: route && selectedDriver.value ? `${route.origin} -> ${route.destination} · ${selectedDriver.value.name}` : "-"
  };
});

const shipmentStats = computed(() => [
  { label: "Pengiriman Aktif", value: shipmentsList.value.length, note: "Order berjalan atau terjadwal" },
  { label: "Tarif Flat Aktif", value: routeRates.value.length, note: "Data rute dan barang" },
  { label: "Driver Tersedia", value: driversList.value.length, note: "Masuk master data" },
  { label: "Rata-rata Flat", value: formatCurrency(Math.round(routeRates.value.reduce((sum, route) => sum + route.flatPrice, 0) / Math.max(routeRates.value.length, 1))), note: "Rata-rata ongkir dasar" }
]);

const reportCards = computed(() => {
  const prices = routeRates.value.map((route) => route.flatPrice);
  return [
    { label: "Tarif Terendah", value: prices.length ? formatCurrency(Math.min(...prices)) : "-", note: "Flat rate paling rendah di sistem." },
    { label: "Tarif Tertinggi", value: prices.length ? formatCurrency(Math.max(...prices)) : "-", note: "Flat rate paling tinggi di sistem." },
    { label: "Route Favorit", value: routeRates.value[0] ? `${routeRates.value[0].destination}` : "-", note: "Route yang paling sering dijadikan referensi awal." }
  ];
});

const reportDetails = computed(() => [
  { title: "Cakupan tarif", badge: "Flat", description: `${routeRates.value.length} kombinasi rute dan jenis barang sudah tersedia sebagai dasar cek ongkir depan.` },
  { title: "Kapasitas supir", badge: "Driver", description: `${driversList.value.filter((driver) => driver.status === "On Duty").length} driver sedang aktif, sisanya standby.` },
  { title: "Data pengiriman", badge: "Order", description: `${shipmentsList.value.length} order tercatat di dashboard saat ini.` }
]);

const inputSteps = ["Pilih jenis barang", "Pilih tujuan", "Isi p x l x t dan qty", "Pilih driver", "Simpan pengiriman"];

const previewTracking = computed(() => {
  const now = new Date();
  const stamp = `${String(now.getFullYear()).slice(-2)}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  return `JKR-${stamp}-NEW`;
});

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function resetRouteForm() {
  editingRouteId.value = null;
  routeForm.origin = "Jepara";
  routeForm.destination = "Bandung";
  routeForm.itemType = "Sofa";
  routeForm.flatPrice = 2500000;
  routeForm.maxVolumeM3 = 6;
  routeForm.eta = "2-4 hari";
  routeForm.vehicle = "CDD Box";
  routeForm.note = "Tarif flat untuk sofa tujuan Bandung.";
}

function editRoute(id: string) {
  const route = routeRates.value.find((entry) => entry.id === id);
  if (!route) return;
  editingRouteId.value = id;
  routeForm.origin = route.origin;
  routeForm.destination = route.destination;
  routeForm.itemType = route.itemType;
  routeForm.flatPrice = route.flatPrice;
  routeForm.maxVolumeM3 = route.maxVolumeM3;
  routeForm.eta = route.eta;
  routeForm.vehicle = route.vehicle;
  routeForm.note = route.note;
}

async function saveRoute() {
  const payload: RouteRate = {
    id: editingRouteId.value ?? makeId("route"),
    origin: routeForm.origin,
    destination: routeForm.destination,
    itemType: routeForm.itemType,
    flatPrice: routeForm.flatPrice,
    maxVolumeM3: routeForm.maxVolumeM3,
    eta: routeForm.eta,
    vehicle: routeForm.vehicle,
    note: routeForm.note
  };
  await saveRouteRate(payload);
  resetRouteForm();
}

async function deleteRoute(id: string) {
  await deleteRouteRate(id);
  if (editingRouteId.value === id) resetRouteForm();
}

function resetDriverForm() {
  editingDriverId.value = null;
  driverForm.name = "Agus Santoso";
  driverForm.phone = "0812-9090-1101";
  driverForm.status = "On Duty";
  driverForm.primaryVehicle = "Box Besar";
  driverForm.activeTrips = 2;
  driverForm.route = "Bandung - Jakarta";
}

function editDriver(id: string) {
  const driver = driversList.value.find((entry) => entry.id === id);
  if (!driver) return;
  editingDriverId.value = id;
  driverForm.name = driver.name;
  driverForm.phone = driver.phone;
  driverForm.status = driver.status;
  driverForm.primaryVehicle = driver.primaryVehicle;
  driverForm.activeTrips = driver.activeTrips;
  driverForm.route = driver.route;
}

async function saveDriver() {
  const payload: DriverRecord = {
    id: editingDriverId.value ?? makeId("driver"),
    name: driverForm.name,
    phone: driverForm.phone,
    status: driverForm.status,
    primaryVehicle: driverForm.primaryVehicle,
    activeTrips: driverForm.activeTrips,
    route: driverForm.route
  };
  await persistDriver(payload);
  resetDriverForm();
}

async function removeDriver(id: string) {
  await removePersistedDriver(id);
  if (editingDriverId.value === id) resetDriverForm();
}

function statusClass(status: string) {
  if (status === "Pickup Dijadwalkan") return "bg-amber-50 text-warning";
  if (status === "Terkirim") return "bg-emerald-50 text-success";
  return "bg-blue-50 text-primary";
}

async function createShipment() {
  const route = selectedRoute.value;
  const driver = selectedDriver.value;
  if (!route || !driver) return;

  const volume = ((shipmentForm.lengthCm * shipmentForm.widthCm * shipmentForm.heightCm) / 1_000_000) * Math.max(1, shipmentForm.quantity);
  const multiplier = Math.max(1, Math.ceil(volume / route.maxVolumeM3));
  const now = new Date();
  const stamp = `${String(now.getFullYear()).slice(-2)}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const serial = String(shipmentsList.value.length + 101).padStart(3, "0");

  await saveShipment({
    trackingNumber: `JKR-${stamp}-${serial}`,
    customer: shipmentForm.customer,
    item: `${shipmentForm.itemType} · ${shipmentForm.lengthCm}x${shipmentForm.widthCm}x${shipmentForm.heightCm} cm · qty ${shipmentForm.quantity}`,
    destination: `${route.origin} -> ${route.destination}`,
    status: "Pickup Dijadwalkan",
    driver: driver.name,
    vehicle: route.vehicle,
    eta: route.eta,
    currentLocation: route.origin,
    mapLink: shipmentForm.mapLink,
    mapNote: multiplier > 1 ? `Melebihi batas flat ${route.maxVolumeM3} m3, dihitung ${multiplier}x tarif flat.` : shipmentForm.note
  });

  await persistDriver({
    ...driver,
    activeTrips: driver.activeTrips + 1,
    status: "On Duty"
  });

  active.value = "shipments";
}

async function saveSettings() {
  await saveSiteSettings({ ...siteSettings });
}

async function handleSignOut() {
  await signOutAdmin();
}

onMounted(async () => {
  await initializeAuth();
  await initializeOpsStore();
  if (!shipmentForm.driverId && driversList.value[0]) shipmentForm.driverId = driversList.value[0].id;
});
</script>
