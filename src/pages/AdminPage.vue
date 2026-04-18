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
          <h1 class="font-display mt-2 text-2xl font-bold">{{ siteSettings.siteName }} Ops</h1>
          <p class="mt-3 text-sm leading-7 text-slate-300">Flow baru: rute, driver, armada, lalu shipment header dengan list barang.</p>
          <div class="mt-5 rounded-2xl bg-white/10 px-4 py-3 text-sm">
            Source data: <span class="font-bold">{{ opsState.source }}</span>
          </div>
        </div>

        <div class="mt-6 grid gap-2">
          <button
            v-for="item in menuItems"
            :key="item.key"
            :class="active === item.key ? 'bg-white text-slate-950' : 'bg-white/5 text-slate-200 hover:bg-white/10'"
            class="rounded-2xl px-4 py-3 text-left text-sm font-semibold transition"
            @click="active = item.key"
          >
            {{ item.label }}
          </button>
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
            <p class="section-kicker">{{ activeHeader.eyebrow }}</p>
            <h2 class="font-display mt-2 text-3xl font-bold text-slate-950">{{ activeHeader.title }}</h2>
          </div>

          <div class="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
            <template v-if="active === 'settings'">
              <div class="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                <Card class="panel p-6">
                  <p class="section-kicker">Setting Situs</p>
                  <div class="mt-6 grid gap-4">
                    <div class="grid gap-4 sm:grid-cols-2">
                      <label class="grid gap-2 text-sm font-semibold">Nama Situs<input v-model="siteSettings.siteName" class="field" /></label>
                      <label class="grid gap-2 text-sm font-semibold">Tagline Situs<input v-model="siteSettings.siteTagline" class="field" /></label>
                    </div>
                    <label class="grid gap-2 text-sm font-semibold">Judul Hero<input v-model="siteSettings.heroTitle" class="field" /></label>
                    <label class="grid gap-2 text-sm font-semibold">Subheadline<input v-model="siteSettings.subheadline" class="field" /></label>
                    <div class="grid gap-4 sm:grid-cols-2">
                      <label class="grid gap-2 text-sm font-semibold">Lokasi Kontak<input v-model="siteSettings.contactLocation" class="field" /></label>
                      <label class="grid gap-2 text-sm font-semibold">WhatsApp<input v-model="siteSettings.whatsapp" class="field" /></label>
                    </div>
                    <div class="grid gap-4 sm:grid-cols-2">
                      <label class="grid gap-2 text-sm font-semibold">Label CTA WhatsApp<input v-model="siteSettings.whatsappCtaLabel" class="field" /></label>
                      <label class="grid gap-2 text-sm font-semibold">CTA Utama<input v-model="siteSettings.primaryCta" class="field" /></label>
                    </div>
                    <div class="rounded-[1.25rem] bg-slate-50 p-4 text-sm text-slate-600">
                      Field yang paling aman diubah dari admin: branding, copy utama, kontak, dan URL gambar per section.
                    </div>
                    <Button class="w-full" @click="saveSettings">Simpan Setting</Button>
                  </div>
                </Card>

                <Card class="panel p-6">
                  <p class="section-kicker">Visual Situs</p>
                  <div class="mt-6 grid gap-4">
                    <div class="grid gap-4 sm:grid-cols-2">
                      <label class="grid gap-2 text-sm font-semibold">Hero Image 1<input v-model="siteSettings.heroImage1" class="field" /></label>
                      <label class="grid gap-2 text-sm font-semibold">Hero Image 2<input v-model="siteSettings.heroImage2" class="field" /></label>
                    </div>
                    <div class="grid gap-4 sm:grid-cols-2">
                      <label class="grid gap-2 text-sm font-semibold">Hero Image 3<input v-model="siteSettings.heroImage3" class="field" /></label>
                      <label class="grid gap-2 text-sm font-semibold">History Image<input v-model="siteSettings.historyImage" class="field" /></label>
                    </div>
                    <div class="grid gap-4 sm:grid-cols-2">
                      <label class="grid gap-2 text-sm font-semibold">Why Packaging Image<input v-model="siteSettings.whyPackagingImage" class="field" /></label>
                      <label class="grid gap-2 text-sm font-semibold">Why Delivery Image<input v-model="siteSettings.whyDeliveryImage" class="field" /></label>
                    </div>
                    <div class="grid gap-4 sm:grid-cols-3">
                      <label class="grid gap-2 text-sm font-semibold">Testimonial Image 1<input v-model="siteSettings.testimonialImage1" class="field" /></label>
                      <label class="grid gap-2 text-sm font-semibold">Testimonial Image 2<input v-model="siteSettings.testimonialImage2" class="field" /></label>
                      <label class="grid gap-2 text-sm font-semibold">Testimonial Image 3<input v-model="siteSettings.testimonialImage3" class="field" /></label>
                    </div>
                    <Button class="w-full" @click="saveSettings">Simpan Setting</Button>
                  </div>
                </Card>

                <Card class="panel p-6">
                  <p class="section-kicker">Ringkasan</p>
                  <div class="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <div class="rounded-[1.5rem] bg-slate-50 p-5">
                      <p class="text-sm text-muted-foreground">Rute</p>
                      <p class="mt-2 text-3xl font-extrabold text-slate-950">{{ routeRates.length }}</p>
                    </div>
                    <div class="rounded-[1.5rem] bg-slate-50 p-5">
                      <p class="text-sm text-muted-foreground">Driver</p>
                      <p class="mt-2 text-3xl font-extrabold text-slate-950">{{ driversList.length }}</p>
                    </div>
                    <div class="rounded-[1.5rem] bg-slate-50 p-5">
                      <p class="text-sm text-muted-foreground">Armada</p>
                      <p class="mt-2 text-3xl font-extrabold text-slate-950">{{ vehiclesList.length }}</p>
                    </div>
                    <div class="rounded-[1.5rem] bg-slate-50 p-5 sm:col-span-2 xl:col-span-3">
                      <p class="text-sm text-muted-foreground">Flow Operasional</p>
                      <p class="mt-2 text-lg font-bold text-slate-950">1. Rute 2. Driver 3. Armada 4. Shipment header + item list</p>
                    </div>
                  </div>
                </Card>
              </div>
            </template>

            <template v-else-if="active === 'routes'">
              <div class="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
                <Card class="panel p-6">
                  <p class="section-kicker">Master Rute</p>
                  <div class="mt-6 grid gap-4">
                    <div class="grid gap-4 sm:grid-cols-2">
                      <label class="grid gap-2 text-sm font-semibold">Asal<input v-model="routeForm.origin" class="field" /></label>
                      <label class="grid gap-2 text-sm font-semibold">Tujuan<input v-model="routeForm.destination" class="field" /></label>
                    </div>
                    <div class="grid gap-4 sm:grid-cols-2">
                      <label class="grid gap-2 text-sm font-semibold">Jenis Barang
                        <select v-model="routeForm.itemType" class="field">
                          <option v-for="item in itemTypes" :key="item.name" :value="item.name">{{ item.name }}</option>
                        </select>
                      </label>
                      <label class="grid gap-2 text-sm font-semibold">Armada Rekomendasi
                        <select v-model="routeForm.vehicleId" class="field">
                          <option value="">Pilih armada</option>
                          <option v-for="vehicle in vehiclesList" :key="vehicle.id" :value="vehicle.id">{{ vehicle.name }} - {{ vehicle.plateNumber }}</option>
                        </select>
                      </label>
                    </div>
                    <div class="grid gap-4 sm:grid-cols-3">
                      <label class="grid gap-2 text-sm font-semibold">Tarif Flat<input v-model.number="routeForm.flatPrice" class="field" type="number" min="0" /></label>
                      <label class="grid gap-2 text-sm font-semibold">Batas Volume<input v-model.number="routeForm.maxVolumeM3" class="field" type="number" min="0.1" step="0.1" /></label>
                      <label class="grid gap-2 text-sm font-semibold">ETA<input v-model="routeForm.eta" class="field" /></label>
                    </div>
                    <label class="grid gap-2 text-sm font-semibold">Catatan<textarea v-model="routeForm.note" class="field-textarea" rows="4"></textarea></label>
                    <div class="grid gap-3 sm:grid-cols-2">
                      <Button class="w-full" variant="secondary" @click="saveRoute">{{ editingRouteId ? 'Update Rute' : 'Input Rute' }}</Button>
                      <Button v-if="editingRouteId" class="w-full" variant="ghost" @click="resetRouteForm">Batal Edit</Button>
                    </div>
                  </div>
                </Card>

                <Card class="panel overflow-hidden">
                  <div class="border-b border-slate-100 px-6 py-5">
                    <p class="section-kicker">Data Rute</p>
                    <h3 class="mt-2 text-2xl font-bold">Tarif flat aktif</h3>
                  </div>
                  <div class="overflow-x-auto">
                    <table class="min-w-full text-left text-sm">
                      <thead class="bg-slate-50 text-muted-foreground">
                        <tr>
                          <th class="px-6 py-4 font-semibold">Rute</th>
                          <th class="px-6 py-4 font-semibold">Barang</th>
                          <th class="px-6 py-4 font-semibold">Tarif</th>
                          <th class="px-6 py-4 font-semibold">Armada</th>
                          <th class="px-6 py-4 font-semibold">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="route in routeRates" :key="route.id" class="border-t border-slate-100">
                          <td class="px-6 py-4 font-bold text-slate-950">{{ route.origin }} -> {{ route.destination }}</td>
                          <td class="px-6 py-4">{{ route.itemType }}</td>
                          <td class="px-6 py-4 text-primary">{{ formatCurrency(route.flatPrice) }}</td>
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
                </Card>
              </div>
            </template>

            <template v-else-if="active === 'vehicles'">
              <div class="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
                <Card class="panel p-6">
                  <p class="section-kicker">Master Armada</p>
                  <div class="mt-6 grid gap-4">
                    <div class="grid gap-4 sm:grid-cols-2">
                      <label class="grid gap-2 text-sm font-semibold">Nama Armada<input v-model="vehicleForm.name" class="field" /></label>
                      <label class="grid gap-2 text-sm font-semibold">Nomor Polisi<input v-model="vehicleForm.plateNumber" class="field" /></label>
                    </div>
                    <div class="grid gap-4 sm:grid-cols-3">
                      <label class="grid gap-2 text-sm font-semibold">Tipe<input v-model="vehicleForm.vehicleType" class="field" /></label>
                      <label class="grid gap-2 text-sm font-semibold">Kapasitas m3<input v-model.number="vehicleForm.capacityM3" class="field" type="number" min="0" step="0.1" /></label>
                      <label class="grid gap-2 text-sm font-semibold">Status
                        <select v-model="vehicleForm.status" class="field">
                          <option>Aktif</option>
                          <option>Maintenance</option>
                          <option>Nonaktif</option>
                        </select>
                      </label>
                    </div>
                    <div class="grid gap-3 sm:grid-cols-2">
                      <Button class="w-full" variant="secondary" @click="saveVehicleRecord">{{ editingVehicleId ? 'Update Armada' : 'Input Armada' }}</Button>
                      <Button v-if="editingVehicleId" class="w-full" variant="ghost" @click="resetVehicleForm">Batal Edit</Button>
                    </div>
                  </div>
                </Card>

                <Card class="panel overflow-hidden">
                  <div class="border-b border-slate-100 px-6 py-5">
                    <p class="section-kicker">Data Armada</p>
                    <h3 class="mt-2 text-2xl font-bold">Armada tersedia</h3>
                  </div>
                  <div class="overflow-x-auto">
                    <table class="min-w-full text-left text-sm">
                      <thead class="bg-slate-50 text-muted-foreground">
                        <tr>
                          <th class="px-6 py-4 font-semibold">Armada</th>
                          <th class="px-6 py-4 font-semibold">Plat</th>
                          <th class="px-6 py-4 font-semibold">Kapasitas</th>
                          <th class="px-6 py-4 font-semibold">Status</th>
                          <th class="px-6 py-4 font-semibold">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="vehicle in vehiclesList" :key="vehicle.id" class="border-t border-slate-100">
                          <td class="px-6 py-4 font-bold text-slate-950">{{ vehicle.name }}</td>
                          <td class="px-6 py-4">{{ vehicle.plateNumber }}</td>
                          <td class="px-6 py-4">{{ vehicle.capacityM3 }} m3</td>
                          <td class="px-6 py-4">{{ vehicle.status }}</td>
                          <td class="px-6 py-4">
                            <div class="flex gap-2">
                              <Button size="sm" variant="ghost" @click="editVehicle(vehicle.id)">Edit</Button>
                              <Button size="sm" variant="ghost" class="text-red-600 hover:bg-red-50" @click="deleteVehicleRecord(vehicle.id)">Hapus</Button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            </template>

            <template v-else-if="active === 'drivers'">
              <div class="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
                <Card class="panel p-6">
                  <p class="section-kicker">Master Driver</p>
                  <div class="mt-6 grid gap-4">
                    <div class="grid gap-4 sm:grid-cols-2">
                      <label class="grid gap-2 text-sm font-semibold">Nama Driver<input v-model="driverForm.name" class="field" /></label>
                      <label class="grid gap-2 text-sm font-semibold">Nomor HP<input v-model="driverForm.phone" class="field" /></label>
                    </div>
                    <div class="grid gap-4 sm:grid-cols-2">
                      <label class="grid gap-2 text-sm font-semibold">Status
                        <select v-model="driverForm.status" class="field">
                          <option>On Duty</option>
                          <option>Standby</option>
                        </select>
                      </label>
                      <label class="grid gap-2 text-sm font-semibold">Trip Aktif<input v-model.number="driverForm.activeTrips" class="field" type="number" min="0" /></label>
                    </div>
                    <label class="grid gap-2 text-sm font-semibold">Rute Utama<input v-model="driverForm.route" class="field" /></label>
                    <label class="grid gap-2 text-sm font-semibold">Password Login App Driver<input v-model="driverForm.password" class="field" type="password" placeholder="Isi saat buat baru atau reset password" /></label>
                    <p class="text-sm leading-7 text-muted-foreground">Password disimpan lewat <code>password_input</code> lalu otomatis di-hash di database.</p>
                    <div class="grid gap-3 sm:grid-cols-2">
                      <Button class="w-full" variant="secondary" @click="saveDriverRecord">{{ editingDriverId ? 'Update Driver' : 'Input Driver' }}</Button>
                      <Button v-if="editingDriverId" class="w-full" variant="ghost" @click="resetDriverForm">Batal Edit</Button>
                    </div>
                  </div>
                </Card>

                <Card class="panel overflow-hidden">
                  <div class="border-b border-slate-100 px-6 py-5">
                    <p class="section-kicker">Data Driver</p>
                    <h3 class="mt-2 text-2xl font-bold">Driver aktif</h3>
                  </div>
                  <div class="overflow-x-auto">
                    <table class="min-w-full text-left text-sm">
                      <thead class="bg-slate-50 text-muted-foreground">
                        <tr>
                          <th class="px-6 py-4 font-semibold">Driver</th>
                          <th class="px-6 py-4 font-semibold">HP</th>
                          <th class="px-6 py-4 font-semibold">Trip Aktif</th>
                          <th class="px-6 py-4 font-semibold">Status</th>
                          <th class="px-6 py-4 font-semibold">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="driver in driversList" :key="driver.id" class="border-t border-slate-100">
                          <td class="px-6 py-4 font-bold text-slate-950">{{ driver.name }}</td>
                          <td class="px-6 py-4">{{ driver.phone }}</td>
                          <td class="px-6 py-4">{{ driver.activeTrips }}</td>
                          <td class="px-6 py-4">{{ driver.status }}</td>
                          <td class="px-6 py-4">
                            <div class="flex gap-2">
                              <Button size="sm" variant="ghost" @click="editDriver(driver.id)">Edit</Button>
                              <Button size="sm" variant="ghost" class="text-red-600 hover:bg-red-50" @click="removeDriver(driver.id)">Hapus</Button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            </template>

            <template v-else-if="active === 'create'">
              <div class="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
                <Card class="panel p-6">
                  <p class="section-kicker">Buat Shipment</p>
                  <div class="mt-6 grid gap-4">
                    <div class="grid gap-4 sm:grid-cols-2">
                      <label class="grid gap-2 text-sm font-semibold">Nama Customer<input v-model="shipmentForm.customer" class="field" /></label>
                      <label class="grid gap-2 text-sm font-semibold">Tanggal Kirim<input v-model="shipmentForm.shipDate" class="field" type="date" /></label>
                    </div>
                    <div class="grid gap-4 sm:grid-cols-3">
                      <label class="grid gap-2 text-sm font-semibold">Rute
                        <select v-model="shipmentForm.routeId" class="field">
                          <option value="">Pilih rute</option>
                          <option v-for="route in routeRates" :key="route.id" :value="route.id">{{ route.origin }} -> {{ route.destination }} | {{ route.itemType }}</option>
                        </select>
                      </label>
                      <label class="grid gap-2 text-sm font-semibold">Driver
                        <select v-model="shipmentForm.driverId" class="field">
                          <option value="">Pilih driver</option>
                          <option v-for="driver in driversList" :key="driver.id" :value="driver.id">{{ driver.name }}</option>
                        </select>
                      </label>
                      <label class="grid gap-2 text-sm font-semibold">Armada
                        <select v-model="shipmentForm.vehicleId" class="field">
                          <option value="">Pilih armada</option>
                          <option v-for="vehicle in vehiclesList" :key="vehicle.id" :value="vehicle.id">{{ vehicle.name }} - {{ vehicle.plateNumber }}</option>
                        </select>
                      </label>
                    </div>
                    <div class="grid gap-4 sm:grid-cols-2">
                      <label class="grid gap-2 text-sm font-semibold">Nama Penerima<input v-model="shipmentForm.recipientName" class="field" /></label>
                      <label class="grid gap-2 text-sm font-semibold">Nomor Penerima<input v-model="shipmentForm.recipientPhone" class="field" /></label>
                    </div>
                    <label class="grid gap-2 text-sm font-semibold">Alamat Penerima<textarea v-model="shipmentForm.recipientAddress" class="field-textarea" rows="3"></textarea></label>
                    <label class="grid gap-2 text-sm font-semibold">Catatan Pengiriman<textarea v-model="shipmentForm.note" class="field-textarea" rows="3"></textarea></label>
                  </div>
                </Card>

                <Card class="panel p-6">
                  <div class="flex items-center justify-between gap-4">
                    <div>
                      <p class="section-kicker">List Barang</p>
                      <h3 class="mt-2 text-2xl font-bold text-slate-950">Satu nomor shipment, banyak item</h3>
                    </div>
                    <Button variant="secondary" @click="addShipmentItem">Tambah Item</Button>
                  </div>

                  <div class="mt-6 grid gap-4">
                    <div v-for="(item, index) in shipmentItems" :key="index" class="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                      <div class="flex items-center justify-between gap-4">
                        <p class="text-sm font-bold uppercase tracking-[0.24em] text-primary">Item {{ index + 1 }}</p>
                        <Button v-if="shipmentItems.length > 1" size="sm" variant="ghost" class="text-red-600 hover:bg-red-50" @click="removeShipmentItem(index)">Hapus</Button>
                      </div>
                      <div class="mt-4 grid gap-4 sm:grid-cols-2">
                        <label class="grid gap-2 text-sm font-semibold">Nama Barang<input v-model="item.itemName" class="field" /></label>
                        <label class="grid gap-2 text-sm font-semibold">Qty<input v-model.number="item.quantity" class="field" type="number" min="1" /></label>
                      </div>
                      <div class="mt-4 grid gap-4 sm:grid-cols-3">
                        <label class="grid gap-2 text-sm font-semibold">Panjang<input v-model.number="item.lengthCm" class="field" type="number" min="0" /></label>
                        <label class="grid gap-2 text-sm font-semibold">Lebar<input v-model.number="item.widthCm" class="field" type="number" min="0" /></label>
                        <label class="grid gap-2 text-sm font-semibold">Tinggi<input v-model.number="item.heightCm" class="field" type="number" min="0" /></label>
                      </div>
                      <label class="mt-4 grid gap-2 text-sm font-semibold">Catatan Item<textarea v-model="item.note" class="field-textarea" rows="2"></textarea></label>
                    </div>
                  </div>

                  <div class="mt-6 rounded-[1.5rem] bg-slate-950 p-6 text-white">
                    <p class="section-kicker !text-slate-400">Preview Shipment</p>
                    <p class="mt-3 text-3xl font-extrabold">{{ previewTracking }}</p>
                    <div class="mt-5 grid gap-3 sm:grid-cols-2">
                      <div class="rounded-2xl bg-white/10 p-4">
                        <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Rute</p>
                        <p class="mt-2 text-lg font-bold">{{ selectedRoute ? `${selectedRoute.origin} -> ${selectedRoute.destination}` : '-' }}</p>
                      </div>
                      <div class="rounded-2xl bg-white/10 p-4">
                        <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Driver / Armada</p>
                        <p class="mt-2 text-lg font-bold">{{ selectedDriver?.name ?? '-' }} / {{ selectedVehicle?.name ?? '-' }}</p>
                      </div>
                      <div class="rounded-2xl bg-white/10 p-4">
                        <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Item</p>
                        <p class="mt-2 text-lg font-bold">{{ shipmentItems.length }} barang</p>
                      </div>
                      <div class="rounded-2xl bg-white/10 p-4">
                        <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Volume</p>
                        <p class="mt-2 text-lg font-bold">{{ totalShipmentVolume.toFixed(2) }} m3</p>
                      </div>
                    </div>
                    <Button class="mt-5 w-full" size="lg" @click="createShipment">Generate Shipment</Button>
                  </div>
                </Card>
              </div>
            </template>

            <template v-else-if="active === 'shipments'">
              <Card class="panel overflow-hidden">
                <div class="border-b border-slate-100 px-6 py-5">
                  <p class="section-kicker">Data Shipment</p>
                  <h3 class="mt-2 text-2xl font-bold">Shipment header aktif</h3>
                </div>
                <div class="overflow-x-auto">
                  <table class="min-w-full text-left text-sm">
                    <thead class="bg-slate-50 text-muted-foreground">
                      <tr>
                        <th class="px-6 py-4 font-semibold">Nomor</th>
                        <th class="px-6 py-4 font-semibold">Tanggal</th>
                        <th class="px-6 py-4 font-semibold">Customer</th>
                        <th class="px-6 py-4 font-semibold">Penerima</th>
                        <th class="px-6 py-4 font-semibold">Driver</th>
                        <th class="px-6 py-4 font-semibold">Armada</th>
                        <th class="px-6 py-4 font-semibold">Item</th>
                        <th class="px-6 py-4 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="shipment in shipmentsList" :key="shipment.trackingNumber" class="border-t border-slate-100">
                        <td class="px-6 py-4 font-bold text-primary">{{ shipment.trackingNumber }}</td>
                        <td class="px-6 py-4">{{ shipment.shipDate }}</td>
                        <td class="px-6 py-4">{{ shipment.customer }}</td>
                        <td class="px-6 py-4">
                          <p class="font-semibold text-slate-950">{{ shipment.recipientName }}</p>
                          <p class="text-xs text-muted-foreground">{{ shipment.recipientPhone }}</p>
                        </td>
                        <td class="px-6 py-4">{{ shipment.driverName }}</td>
                        <td class="px-6 py-4">{{ shipment.vehicle }}</td>
                        <td class="px-6 py-4">{{ shipment.item }}</td>
                        <td class="px-6 py-4"><span class="badge-soft" :class="statusClass(shipment.status)">{{ shipment.status }}</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Card>
            </template>

            <template v-else>
              <div class="grid gap-6 xl:grid-cols-4">
                <Card class="panel p-6"><p class="section-kicker">Rute</p><p class="mt-3 text-4xl font-extrabold text-slate-950">{{ routeRates.length }}</p></Card>
                <Card class="panel p-6"><p class="section-kicker">Driver</p><p class="mt-3 text-4xl font-extrabold text-slate-950">{{ driversList.length }}</p></Card>
                <Card class="panel p-6"><p class="section-kicker">Armada</p><p class="mt-3 text-4xl font-extrabold text-slate-950">{{ vehiclesList.length }}</p></Card>
                <Card class="panel p-6"><p class="section-kicker">Shipment</p><p class="mt-3 text-4xl font-extrabold text-slate-950">{{ shipmentsList.length }}</p></Card>
              </div>
            </template>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { RouterLink } from "vue-router";
import Button from "@/components/ui/Button.vue";
import Card from "@/components/ui/Card.vue";
import { itemTypes } from "@/data/catalog";
import { formatCurrency } from "@/lib/utils";
import { initializeAuth, signOutAdmin, useAuthStore } from "@/store/auth";
import {
  initializeOpsStore,
  useOpsStore,
  type DriverRecord,
  type RouteRate,
  type ShipmentItemInput,
  type ShipmentRecord,
  type VehicleRecord
} from "@/store/ops";

type ActiveMenu = "settings" | "routes" | "vehicles" | "drivers" | "create" | "shipments" | "reports";

const { state: authState } = useAuthStore();
const {
  state: opsState,
  saveVehicle,
  deleteVehicle,
  saveRouteRate,
  deleteRouteRate,
  saveDriver,
  deleteDriver,
  saveShipment,
  saveSiteSettings
} = useOpsStore();

const menuItems = [
  { key: "settings", label: "Setting Situs" },
  { key: "routes", label: "Data Rute" },
  { key: "vehicles", label: "Data Armada" },
  { key: "drivers", label: "Data Driver" },
  { key: "create", label: "Buat Shipment" },
  { key: "shipments", label: "Data Shipment" },
  { key: "reports", label: "Laporan" }
] as const;

const active = ref<ActiveMenu>("routes");
const editingRouteId = ref<string | null>(null);
const editingDriverId = ref<string | null>(null);
const editingVehicleId = ref<string | null>(null);

const siteSettings = opsState.siteSettings;
const routeRates = computed(() => opsState.routeRates);
const vehiclesList = computed(() => opsState.vehicles);
const driversList = computed(() => opsState.drivers);
const shipmentsList = computed(() => opsState.shipments);

const routeForm = reactive({
  origin: "Jepara",
  destination: "Bandung",
  itemType: "Sofa",
  flatPrice: 2500000,
  maxVolumeM3: 6,
  eta: "2-4 hari",
  vehicleId: "",
  note: "Tarif flat untuk pengiriman furniture tujuan Bandung."
});

const vehicleForm = reactive({
  name: "CDD Box",
  plateNumber: "B 9123 CD",
  vehicleType: "Box Besar",
  capacityM3: 12,
  status: "Aktif"
});

const driverForm = reactive({
  name: "Agus Santoso",
  phone: "0812-9090-1101",
  status: "On Duty",
  activeTrips: 2,
  route: "Bandung - Jakarta",
  password: ""
});

const shipmentForm = reactive({
  customer: "CV Mebel Nusantara",
  routeId: "",
  driverId: "",
  vehicleId: "",
  shipDate: new Date().toISOString().slice(0, 10),
  recipientName: "Budi Setiawan",
  recipientPhone: "0812-0000-1122",
  recipientAddress: "Jl. Soekarno Hatta No. 18, Bandung",
  note: "Menunggu pickup dari workshop."
});

const shipmentItems = ref<ShipmentItemInput[]>([
  { itemName: "Lemari 2 Pintu", quantity: 1, lengthCm: 200, widthCm: 90, heightCm: 200, volumeM3: 0, note: "Finishing doff" }
]);

const selectedRoute = computed(() => routeRates.value.find((route) => route.id === shipmentForm.routeId) ?? routeRates.value[0]);
const selectedDriver = computed(() => driversList.value.find((driver) => driver.id === shipmentForm.driverId) ?? driversList.value[0]);
const selectedVehicle = computed(() => vehiclesList.value.find((vehicle) => vehicle.id === shipmentForm.vehicleId) ?? vehiclesList.value[0]);

const totalShipmentVolume = computed(() => shipmentItems.value.reduce((sum, item) => {
  const volume = ((item.lengthCm * item.widthCm * item.heightCm) / 1_000_000) * Math.max(1, item.quantity);
  return sum + volume;
}, 0));

const activeHeader = computed(() => {
  if (active.value === "settings") return { eyebrow: "Website", title: "Setting situs publik" };
  if (active.value === "routes") return { eyebrow: "Master Data", title: "Master rute dan tarif flat" };
  if (active.value === "vehicles") return { eyebrow: "Master Data", title: "Master armada pengiriman" };
  if (active.value === "drivers") return { eyebrow: "Master Data", title: "Master driver aplikasi" };
  if (active.value === "create") return { eyebrow: "Operasional", title: "Buat shipment header dan item" };
  if (active.value === "shipments") return { eyebrow: "Operasional", title: "Data shipment aktif" };
  return { eyebrow: "Operasional", title: "Laporan ringkas" };
});

const previewTracking = computed(() => {
  const date = new Date(shipmentForm.shipDate || new Date().toISOString());
  const stamp = `${String(date.getFullYear()).slice(-2)}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  const serial = String(shipmentsList.value.length + 101).padStart(3, "0");
  return `JKR-${stamp}-${serial}`;
});

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function routeVehicleName(vehicleId: string) {
  return vehiclesList.value.find((vehicle) => vehicle.id === vehicleId)?.name ?? "Armada belum dipilih";
}

function resetRouteForm() {
  editingRouteId.value = null;
  routeForm.origin = "Jepara";
  routeForm.destination = "Bandung";
  routeForm.itemType = "Sofa";
  routeForm.flatPrice = 2500000;
  routeForm.maxVolumeM3 = 6;
  routeForm.eta = "2-4 hari";
  routeForm.vehicleId = vehiclesList.value[0]?.id ?? "";
  routeForm.note = "Tarif flat untuk pengiriman furniture tujuan Bandung.";
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
  routeForm.vehicleId = route.vehicleId;
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
    vehicleId: routeForm.vehicleId,
    vehicle: routeVehicleName(routeForm.vehicleId),
    note: routeForm.note
  };
  await saveRouteRate(payload);
  resetRouteForm();
}

async function deleteRoute(id: string) {
  await deleteRouteRate(id);
  if (editingRouteId.value === id) resetRouteForm();
}

function resetVehicleForm() {
  editingVehicleId.value = null;
  vehicleForm.name = "CDD Box";
  vehicleForm.plateNumber = "B 9123 CD";
  vehicleForm.vehicleType = "Box Besar";
  vehicleForm.capacityM3 = 12;
  vehicleForm.status = "Aktif";
}

function editVehicle(id: string) {
  const vehicle = vehiclesList.value.find((entry) => entry.id === id);
  if (!vehicle) return;
  editingVehicleId.value = id;
  vehicleForm.name = vehicle.name;
  vehicleForm.plateNumber = vehicle.plateNumber;
  vehicleForm.vehicleType = vehicle.vehicleType;
  vehicleForm.capacityM3 = vehicle.capacityM3;
  vehicleForm.status = vehicle.status;
}

async function saveVehicleRecord() {
  const payload: VehicleRecord = {
    id: editingVehicleId.value ?? makeId("vehicle"),
    name: vehicleForm.name,
    plateNumber: vehicleForm.plateNumber,
    vehicleType: vehicleForm.vehicleType,
    capacityM3: vehicleForm.capacityM3,
    status: vehicleForm.status
  };
  await saveVehicle(payload);
  resetVehicleForm();
}

async function deleteVehicleRecord(id: string) {
  await deleteVehicle(id);
  if (editingVehicleId.value === id) resetVehicleForm();
}

function resetDriverForm() {
  editingDriverId.value = null;
  driverForm.name = "Agus Santoso";
  driverForm.phone = "0812-9090-1101";
  driverForm.status = "On Duty";
  driverForm.activeTrips = 2;
  driverForm.route = "Bandung - Jakarta";
  driverForm.password = "";
}

function editDriver(id: string) {
  const driver = driversList.value.find((entry) => entry.id === id);
  if (!driver) return;
  editingDriverId.value = id;
  driverForm.name = driver.name;
  driverForm.phone = driver.phone;
  driverForm.status = driver.status;
  driverForm.activeTrips = driver.activeTrips;
  driverForm.route = driver.route;
  driverForm.password = "";
}

async function saveDriverRecord() {
  const existingDriver = editingDriverId.value ? driversList.value.find((entry) => entry.id === editingDriverId.value) : undefined;
  const payload: DriverRecord = {
    id: editingDriverId.value ?? makeId("driver"),
    name: driverForm.name,
    phone: driverForm.phone,
    status: driverForm.status,
    activeTrips: driverForm.activeTrips,
    route: driverForm.route,
    isTracking: existingDriver?.isTracking ?? false,
    lastSeenAt: existingDriver?.lastSeenAt ?? null,
    lastLatitude: existingDriver?.lastLatitude ?? null,
    lastLongitude: existingDriver?.lastLongitude ?? null,
    lastAccuracy: existingDriver?.lastAccuracy ?? null,
    password: driverForm.password
  };
  await saveDriver(payload);
  resetDriverForm();
}

async function removeDriver(id: string) {
  await deleteDriver(id);
  if (editingDriverId.value === id) resetDriverForm();
}

function addShipmentItem() {
  shipmentItems.value.push({ itemName: "Barang Baru", quantity: 1, lengthCm: 100, widthCm: 50, heightCm: 50, volumeM3: 0, note: "" });
}

function removeShipmentItem(index: number) {
  shipmentItems.value.splice(index, 1);
}

function resetShipmentForm() {
  shipmentForm.customer = "CV Mebel Nusantara";
  shipmentForm.routeId = routeRates.value[0]?.id ?? "";
  shipmentForm.driverId = driversList.value[0]?.id ?? "";
  shipmentForm.vehicleId = vehiclesList.value[0]?.id ?? "";
  shipmentForm.shipDate = new Date().toISOString().slice(0, 10);
  shipmentForm.recipientName = "Budi Setiawan";
  shipmentForm.recipientPhone = "0812-0000-1122";
  shipmentForm.recipientAddress = "Jl. Soekarno Hatta No. 18, Bandung";
  shipmentForm.note = "Menunggu pickup dari workshop.";
  shipmentItems.value = [
    { itemName: "Lemari 2 Pintu", quantity: 1, lengthCm: 200, widthCm: 90, heightCm: 200, volumeM3: 0, note: "Finishing doff" }
  ];
}

function statusClass(status: string) {
  if (status === "Pickup Dijadwalkan") return "bg-amber-50 text-warning";
  if (status === "Terkirim") return "bg-emerald-50 text-success";
  return "bg-blue-50 text-primary";
}

async function createShipment() {
  const route = selectedRoute.value;
  const driver = selectedDriver.value;
  const vehicle = selectedVehicle.value;
  if (!route || !driver || !vehicle) return;

  const normalizedItems = shipmentItems.value.map((item) => {
    const volumeM3 = ((item.lengthCm * item.widthCm * item.heightCm) / 1_000_000) * Math.max(1, item.quantity);
    return {
      ...item,
      volumeM3
    };
  });

  const itemSummary = normalizedItems.length === 1
    ? normalizedItems[0].itemName
    : `${normalizedItems.length} barang (${normalizedItems[0].itemName} + lainnya)`;

  const payload: ShipmentRecord = {
    trackingNumber: previewTracking.value,
    customer: shipmentForm.customer,
    item: itemSummary,
    destination: `${route.origin} -> ${route.destination}`,
    status: "Pickup Dijadwalkan",
    driverId: driver.id,
    driverName: driver.name,
    vehicleId: vehicle.id,
    vehicle: `${vehicle.name} - ${vehicle.plateNumber}`,
    eta: route.eta,
    shipDate: shipmentForm.shipDate,
    recipientName: shipmentForm.recipientName,
    recipientPhone: shipmentForm.recipientPhone,
    recipientAddress: shipmentForm.recipientAddress,
    routeId: route.id,
    currentLocation: route.origin,
    currentLocationLabel: route.origin,
    mapNote: shipmentForm.note,
    isTracking: driver.isTracking,
    lastSeenAt: driver.lastSeenAt,
    lastLatitude: driver.lastLatitude,
    lastLongitude: driver.lastLongitude,
    items: normalizedItems
  };

  await saveShipment(payload);
  await saveDriver({ ...driver, activeTrips: driver.activeTrips + 1, status: "On Duty", password: "" });
  resetShipmentForm();
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
  if (!routeForm.vehicleId && vehiclesList.value[0]) routeForm.vehicleId = vehiclesList.value[0].id;
  resetShipmentForm();
});
</script>
