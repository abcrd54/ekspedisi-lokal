<template>
  <div class="min-h-screen">
    <header class="sticky top-0 z-50 border-b border-white/40 glass">
      <div class="container flex items-center justify-between py-4">
        <div>
          <RouterLink to="/" class="font-display text-xl font-bold text-primary">JeparaKirim</RouterLink>
          <p class="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">Ekspedisi Furniture</p>
        </div>

        <nav class="hidden items-center gap-6 text-sm font-semibold text-slate-600 lg:flex">
          <a href="#hero" class="transition hover:text-primary">Beranda</a>
          <a href="#cek-ongkir" class="transition hover:text-primary">Cek Ongkir</a>
          <a href="#tracking" class="transition hover:text-primary">Tracking</a>
          <a href="#why-us" class="transition hover:text-primary">Kenapa Kami</a>
          <a href="#testimonials" class="transition hover:text-primary">Testimoni</a>
          <a href="#history" class="transition hover:text-primary">Profil</a>
        </nav>

        <div class="flex items-center gap-3">
          <Button as="a" :href="whatsAppLink" target="_blank" rel="noreferrer" variant="secondary" size="sm">WhatsApp</Button>
          <button
            class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white/80 text-primary lg:hidden"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <span class="sr-only">Menu</span>
            <div class="flex flex-col gap-1.5">
              <span class="h-0.5 w-5 rounded-full bg-current"></span>
              <span class="h-0.5 w-5 rounded-full bg-current"></span>
              <span class="h-0.5 w-5 rounded-full bg-current"></span>
            </div>
          </button>
        </div>
      </div>
      <div v-if="mobileMenuOpen" class="border-t border-slate-200/80 bg-white/90 px-4 py-4 lg:hidden">
        <div class="container grid gap-2">
          <a v-for="link in mobileLinks" :key="link.href" :href="link.href" class="rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100" @click="mobileMenuOpen = false">
            {{ link.label }}
          </a>
        </div>
      </div>
    </header>

    <section id="hero" class="relative overflow-hidden bg-slate-950 text-white">
      <div
        v-for="(slide, index) in heroSlides"
        :key="slide.title"
        :class="index === currentSlide ? 'opacity-100' : 'pointer-events-none opacity-0'"
        class="absolute inset-0 transition-opacity duration-700"
      >
        <div class="absolute inset-0 bg-cover bg-center" :style="{ backgroundImage: slide.background }"></div>
        <div class="absolute inset-0 bg-[linear-gradient(110deg,rgba(2,6,23,0.88),rgba(2,6,23,0.6),rgba(2,6,23,0.18))]"></div>
      </div>
      <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:34px_34px] opacity-10"></div>
      <div class="absolute -left-24 top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl"></div>
      <div class="absolute right-12 top-32 h-48 w-48 rounded-full bg-amber-400/20 blur-3xl"></div>
      <div class="absolute bottom-8 left-1/2 h-28 w-[380px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl"></div>

      <div class="container relative flex min-h-[calc(100vh-84px)] items-center py-12 sm:py-16">
        <div class="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-10">
          <div class="max-w-3xl reveal-block is-visible">
            <span class="badge-soft bg-white/10 text-blue-100">Ekspedisi Furniture Jepara</span>
            <h1 class="editorial-title mt-6 text-[2.8rem] font-bold leading-[0.96] sm:text-6xl lg:text-7xl">
              {{ heroSlides[currentSlide].title }}
            </h1>
            <p class="mt-5 max-w-2xl text-[0.98rem] leading-8 text-slate-300 sm:text-lg">
              {{ heroSlides[currentSlide].subtitle }}
            </p>
            <div class="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button as="a" href="#cek-ongkir" variant="secondary" size="lg">Cek Ongkir</Button>
              <Button as="a" href="#tracking" variant="dark" size="lg">Lacak Barang</Button>
            </div>
          </div>

          <div class="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <div v-for="stat in heroStats" :key="stat.label" class="reveal-block rounded-[1.75rem] bg-white/10 p-5 backdrop-blur-md" data-reveal>
              <p class="text-3xl font-extrabold" :class="stat.valueClass">{{ stat.value }}</p>
              <p class="mt-2 text-sm text-slate-300">{{ stat.label }}</p>
            </div>
          </div>
        </div>

        <div class="absolute bottom-12 left-4 hidden max-w-xs rounded-[1.5rem] border border-white/10 bg-white/10 p-5 backdrop-blur-md xl:block">
          <p class="text-xs font-bold uppercase tracking-[0.24em] text-blue-100">Quick Note</p>
          <p class="mt-3 text-sm leading-7 text-slate-200">Tarif depan mengikuti data admin. Kalau volume melewati batas flat, sistem langsung memberi tanda extra trip.</p>
        </div>

        <div class="absolute bottom-8 right-4 flex items-center gap-3 sm:right-8">
          <button
            v-for="(slide, index) in heroSlides"
            :key="slide.title + index"
            :class="index === currentSlide ? 'w-10 bg-white' : 'w-3 bg-white/35'"
            class="h-3 rounded-full transition-all"
            @click="currentSlide = index"
          ></button>
        </div>
      </div>
    </section>

    <section id="cek-ongkir" class="section-shell relative overflow-hidden bg-[linear-gradient(180deg,#f8fbff_0%,#eef5ff_100%)]">
      <div class="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_left,_rgba(96,165,250,0.16),_transparent_38%)]"></div>
      <div class="container mobile-stack">
        <div class="mb-10 max-w-2xl">
          <p class="section-kicker">Cek Ongkir</p>
          <h2 class="editorial-title mt-3 text-4xl font-bold text-slate-950 sm:text-5xl">Isi ukuran barang, sistem cocokkan ke tarif flat.</h2>
        </div>

        <Card class="panel reveal-block overflow-hidden" data-reveal>
          <div class="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div class="p-6 sm:p-8">
              <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <label class="grid gap-2 text-sm font-semibold">
                  Jenis Barang
                  <select v-model="form.itemType" class="field">
                    <option v-for="item in itemTypes" :key="item.name" :value="item.name">{{ item.name }}</option>
                  </select>
                </label>
                <label class="grid gap-2 text-sm font-semibold">
                  Tujuan
                  <select v-model="form.destinationCity" class="field">
                    <option v-for="city in availableDestinations" :key="city" :value="city">{{ city }}</option>
                  </select>
                </label>
                <label class="grid gap-2 text-sm font-semibold">
                  Qty
                  <input v-model.number="form.quantity" class="field" min="1" type="number" />
                </label>
                <label class="grid gap-2 text-sm font-semibold">
                  Panjang (cm)
                  <input v-model.number="form.lengthCm" class="field" min="1" type="number" />
                </label>
                <label class="grid gap-2 text-sm font-semibold">
                  Lebar (cm)
                  <input v-model.number="form.widthCm" class="field" min="1" type="number" />
                </label>
                <label class="grid gap-2 text-sm font-semibold">
                  Tinggi (cm)
                  <input v-model.number="form.heightCm" class="field" min="1" type="number" />
                </label>
              </div>
              <div class="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" @click="calculateShipping">Cek Ongkir</Button>
                <Button as="a" :href="whatsAppLink" rel="noreferrer" target="_blank" size="lg" variant="ghost">Negosiasi via WhatsApp</Button>
              </div>
            </div>

            <div class="bg-slate-950 p-6 text-white sm:p-8">
              <p class="section-kicker !text-slate-400">Hasil</p>
              <div class="mt-6 grid gap-4">
                <div class="rounded-[1.5rem] bg-white/10 p-5">
                  <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Rute</p>
                  <p class="mt-2 text-2xl font-extrabold">{{ result.route }}</p>
                </div>
                <div class="grid gap-4 sm:grid-cols-2">
                  <div class="rounded-[1.5rem] bg-white/10 p-5">
                    <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Tarif Flat</p>
                    <p class="mt-2 text-2xl font-extrabold text-amber-300">{{ result.priceFormatted }}</p>
                  </div>
                  <div class="rounded-[1.5rem] bg-white/10 p-5">
                    <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Volume</p>
                    <p class="mt-2 text-2xl font-extrabold text-blue-200">{{ result.volumeM3 }}</p>
                  </div>
                </div>
                <div class="grid gap-4 sm:grid-cols-3">
                  <div class="rounded-[1.25rem] bg-white/10 p-4">
                    <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Batas Flat</p>
                    <p class="mt-2 text-lg font-extrabold">{{ result.flatCapacity }}</p>
                  </div>
                  <div class="rounded-[1.25rem] bg-white/10 p-4">
                    <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Extra Trip</p>
                    <p class="mt-2 text-lg font-extrabold">{{ result.extraTrips }}</p>
                  </div>
                  <div class="rounded-[1.25rem] bg-white/10 p-4">
                    <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Armada</p>
                    <p class="mt-2 text-lg font-extrabold">{{ result.vehicle }}</p>
                  </div>
                </div>
                <div class="rounded-[1.5rem] bg-emerald-500/10 px-4 py-4 text-sm font-semibold text-emerald-300">
                  {{ result.recommendation }}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>

    <section id="tracking" class="section-shell relative overflow-hidden bg-[linear-gradient(180deg,#fffaf3_0%,#fff1d6_100%)]">
      <div class="absolute right-0 top-0 h-48 w-48 rounded-full bg-amber-300/20 blur-3xl"></div>
      <div class="container mobile-stack">
        <div class="mb-10 max-w-2xl">
          <p class="section-kicker">Track Pengiriman</p>
          <h2 class="editorial-title mt-3 text-4xl font-bold text-slate-950 sm:text-5xl">Pantau posisi barang langsung dari halaman yang sama.</h2>
        </div>

        <Card class="panel reveal-block overflow-hidden" data-reveal>
          <div class="grid lg:grid-cols-[0.78fr_1.22fr]">
            <div class="bg-slate-950 px-8 py-8 text-white sm:px-10 sm:py-10">
              <p class="section-kicker !text-slate-400">Tracking Barang</p>
              <h3 class="font-display mt-3 text-3xl font-bold">Masukkan nomor tracking</h3>
              <div class="mt-8 grid gap-4">
                <input
                  v-model="trackingInput"
                  class="field border-white/10 bg-white/10 text-white placeholder:text-slate-400 focus:border-white/20 focus:bg-white/10 focus:text-white focus:ring-0"
                  placeholder="Contoh: JKR-240417-102"
                />
                <Button class="w-full" size="lg" variant="secondary" @click="trackShipment">Lacak Barang</Button>
              </div>
              <div class="mt-8 grid gap-4 sm:grid-cols-2">
                <div class="rounded-[1.5rem] bg-white/10 p-5">
                  <p class="text-sm text-slate-400">Status</p>
                    <p class="mt-2 text-2xl font-extrabold text-emerald-300">{{ trackingCard.status }}</p>
                </div>
                <div class="rounded-[1.5rem] bg-white/10 p-5">
                  <p class="text-sm text-slate-400">Armada</p>
                  <p class="mt-2 text-2xl font-extrabold text-blue-200">{{ trackingCard.vehicle }}</p>
                </div>
              </div>
            </div>

            <div class="p-8 sm:p-10">
              <div class="grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
                <div>
                  <p class="section-kicker">Detail Tracking</p>
                  <h3 class="font-display mt-2 text-3xl font-bold">{{ trackingCard.trackingNumber }}</h3>
                  <div class="mt-6 grid gap-4">
                    <div class="rounded-[1.25rem] bg-slate-50 p-4">
                      <p class="text-xs uppercase tracking-[0.2em] text-muted-foreground">Sopir</p>
                      <p class="mt-2 text-lg font-bold">{{ trackingCard.driverName }}</p>
                    </div>
                    <div class="rounded-[1.25rem] bg-slate-50 p-4">
                      <p class="text-xs uppercase tracking-[0.2em] text-muted-foreground">ETA</p>
                      <p class="mt-2 text-lg font-bold">{{ trackingCard.eta }}</p>
                    </div>
                    <div class="rounded-[1.25rem] bg-slate-50 p-4">
                      <p class="text-xs uppercase tracking-[0.2em] text-muted-foreground">Posisi Terakhir</p>
                      <p class="mt-2 text-lg font-bold">{{ trackingCard.currentLocation }}</p>
                    </div>
                    <div class="rounded-[1.25rem] bg-slate-50 p-4">
                      <p class="text-xs uppercase tracking-[0.2em] text-muted-foreground">Update Driver</p>
                      <p class="mt-2 text-lg font-bold">{{ trackingFreshness }}</p>
                    </div>
                  </div>
                </div>

                <div class="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-50">
                  <div class="border-b border-slate-200 px-5 py-4">
                    <p class="section-kicker">Realtime Maps</p>
                    <p class="mt-2 text-lg font-bold text-slate-950">Embed lokasi pengiriman</p>
                  </div>
                  <iframe
                    :src="embeddedMapUrl"
                    class="h-[360px] w-full border-0"
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"
                    title="Realtime Maps"
                  ></iframe>
                  <div class="px-5 py-4">
                    <div class="space-y-3">
                      <p class="text-sm leading-6 text-muted-foreground">{{ trackingCard.mapNote }}</p>
                      <Button as="a" :href="liveMapLink" class="w-full" rel="noreferrer" target="_blank" variant="secondary">Buka Google Maps</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>

    <section id="why-us" class="section-shell relative overflow-hidden bg-[linear-gradient(180deg,#f6fff8_0%,#e4f7ea_100%)]">
      <div class="absolute left-0 top-0 h-56 w-56 rounded-full bg-emerald-300/20 blur-3xl"></div>
      <div class="container mobile-stack">
        <div class="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <Card class="panel reveal-block p-8" data-reveal>
            <p class="section-kicker">Kenapa Harus Kami</p>
            <h2 class="editorial-title mt-3 text-4xl font-bold">Fokus ke furniture, bukan ekspedisi umum yang dipaksa cocok.</h2>
            <div class="mt-8 grid gap-4 sm:grid-cols-2">
              <div v-for="(visual, index) in whyUsVisuals" :key="visual.title" class="reveal-block relative min-h-[220px] overflow-hidden rounded-[1.75rem]" :style="{ transitionDelay: `${index * 120}ms` }" data-reveal>
                <div class="absolute inset-0 bg-cover bg-center" :style="{ backgroundImage: visual.image }"></div>
                <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.05),rgba(15,23,42,0.78))]"></div>
                <div class="absolute inset-x-0 bottom-0 p-5 text-white">
                  <p class="text-sm font-bold uppercase tracking-[0.2em] text-blue-100">{{ visual.kicker }}</p>
                  <p class="mt-2 text-xl font-bold">{{ visual.title }}</p>
                </div>
              </div>
            </div>
            <div class="mt-8 grid gap-4">
              <div v-for="(point, index) in whyUsPoints" :key="point.title" class="reveal-block rounded-[1.5rem] bg-slate-50 p-5" :style="{ transitionDelay: `${index * 100}ms` }" data-reveal>
                <p class="text-lg font-bold text-slate-950">{{ point.title }}</p>
                <p class="mt-2 text-sm leading-7 text-muted-foreground">{{ point.description }}</p>
              </div>
            </div>
          </Card>

          <Card class="panel reveal-block p-8" data-reveal>
            <p class="section-kicker">Cara Cek</p>
            <h3 class="mt-2 text-3xl font-bold text-slate-950">Alur dibuat singkat supaya customer tidak ribet isi banyak data.</h3>
            <div class="mt-8 grid gap-4 md:grid-cols-2">
              <div v-for="(step, index) in howToSteps" :key="step" class="rounded-[1.5rem] bg-slate-50 p-5 animate-in fade-in slide-in-from-bottom-8 duration-700" :style="{ animationDelay: `${index * 120}ms` }">
                <p class="text-sm font-bold text-primary">0{{ index + 1 }}</p>
                <p class="mt-2 text-base font-semibold text-slate-950">{{ step }}</p>
              </div>
            </div>
            <div class="mt-8 rounded-[1.75rem] bg-slate-950 p-6 text-white">
              <p class="text-sm font-bold uppercase tracking-[0.24em] text-blue-100">Catatan</p>
              <p class="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                Tarif diambil dari data rute admin. Ukuran barang tetap dicek supaya sistem bisa menandai kalau muatan melewati batas tarif flat.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>

    <section id="testimonials" class="section-shell relative overflow-hidden bg-[linear-gradient(180deg,#fff8fb_0%,#ffe9f1_100%)]">
      <div class="absolute left-1/2 top-12 h-44 w-44 -translate-x-1/2 rounded-full bg-rose-300/20 blur-3xl"></div>
      <div class="container mobile-stack">
        <div class="mb-8">
          <p class="section-kicker">Testimoni</p>
          <h2 class="editorial-title mt-3 text-4xl font-bold text-slate-950">Dipakai workshop, toko, dan proyek interior.</h2>
        </div>
        <div class="grid gap-6 lg:grid-cols-[1.18fr_0.82fr] lg:items-center">
          <Card class="panel reveal-block overflow-hidden p-0" data-reveal>
            <div class="relative h-64 overflow-hidden sm:h-80">
              <div class="absolute inset-0 bg-cover bg-center transition-transform duration-700" :style="{ backgroundImage: activeTestimonial.image }"></div>
              <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.08),rgba(15,23,42,0.76))]"></div>
              <div class="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
                <p class="text-sm font-bold uppercase tracking-[0.24em] text-blue-100">Testimoni Pilihan</p>
                <p class="mt-4 max-w-2xl text-2xl font-bold leading-tight sm:text-3xl">"{{ activeTestimonial.quote }}"</p>
                <div class="mt-6">
                  <p class="text-lg font-bold">{{ activeTestimonial.name }}</p>
                  <p class="mt-1 text-sm text-slate-200">{{ activeTestimonial.role }}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card class="panel reveal-block overflow-hidden p-0" data-reveal>
            <div class="border-b border-slate-200 bg-white px-6 py-5">
              <p class="section-kicker">Slider Testimoni</p>
              <div class="mt-3 flex items-center justify-between gap-4">
                <div>
                  <p class="text-xl font-bold text-slate-950">{{ activeTestimonial.name }}</p>
                  <p class="mt-1 text-sm text-slate-500">{{ activeTestimonial.role }}</p>
                </div>
                <div class="flex items-center gap-2">
                  <button
                    class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-50"
                    @click="prevTestimonial"
                  >
                    <span aria-hidden="true">←</span>
                  </button>
                  <button
                    class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-50"
                    @click="nextTestimonial"
                  >
                    <span aria-hidden="true">→</span>
                  </button>
                </div>
              </div>
            </div>
            <div class="space-y-6 p-6 sm:p-7">
              <div class="rounded-[1.5rem] bg-slate-50 p-6">
                <p class="text-lg leading-8 text-slate-900">"{{ activeTestimonial.quote }}"</p>
              </div>
              <div class="grid gap-3">
                <button
                  v-for="(testimonial, index) in testimonials"
                  :key="testimonial.name"
                  class="flex items-center justify-between rounded-[1.25rem] border px-4 py-4 text-left transition"
                  :class="index === activeTestimonialIndex ? 'border-primary bg-primary/5' : 'border-slate-200 bg-white hover:bg-slate-50'"
                  @click="activeTestimonialIndex = index"
                >
                  <div>
                    <p class="font-bold text-slate-950">{{ testimonial.name }}</p>
                    <p class="mt-1 text-sm text-slate-500">{{ testimonial.role }}</p>
                  </div>
                  <span class="text-sm font-semibold text-primary">0{{ index + 1 }}</span>
                </button>
              </div>
              <div class="flex items-center justify-center gap-2">
                <button
                  v-for="(testimonial, index) in testimonials"
                  :key="testimonial.name + '-dot'"
                  class="h-3 rounded-full transition-all"
                  :class="index === activeTestimonialIndex ? 'w-10 bg-primary' : 'w-3 bg-primary/30'"
                  @click="activeTestimonialIndex = index"
                ></button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>

    <section id="history" class="section-shell relative overflow-hidden bg-[linear-gradient(180deg,#f8f6ff_0%,#ebe7ff_100%)]">
      <div class="absolute right-0 top-0 h-52 w-52 rounded-full bg-violet-300/20 blur-3xl"></div>
      <div class="container mobile-stack">
        <div class="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
          <Card class="panel reveal-block p-8" data-reveal>
            <p class="section-kicker">Visi Misi</p>
            <div class="mt-6 grid gap-4">
              <div class="rounded-[1.5rem] bg-slate-50 p-6">
                <p class="text-sm font-bold text-primary">Visi</p>
                <p class="mt-3 text-2xl font-bold text-slate-950">Menjadi ekspedisi furniture Jepara yang paling rapi, transparan, dan mudah dipantau.</p>
              </div>
              <div class="rounded-[1.5rem] bg-slate-50 p-6">
                <p class="text-sm font-bold text-primary">Misi</p>
                <div class="mt-4 space-y-3">
                  <p v-for="mission in missions" :key="mission" class="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-900">{{ mission }}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card class="panel reveal-block p-8" data-reveal>
            <p class="section-kicker">Sejarah</p>
            <h2 class="editorial-title mt-3 text-4xl font-bold">Tumbuh dari kebutuhan kirim mebel yang butuh perlakuan berbeda.</h2>
            <div class="mt-6 overflow-hidden rounded-[1.75rem]">
              <div class="h-64 bg-cover bg-center" :style="{ backgroundImage: historyHero }"></div>
            </div>
            <div class="mt-8 space-y-4">
              <div v-for="story in historyTimeline" :key="story.year" class="rounded-[1.5rem] bg-slate-50 p-5">
                <p class="text-sm font-bold text-primary">{{ story.year }}</p>
                <p class="mt-2 text-lg font-bold text-slate-950">{{ story.title }}</p>
                <p class="mt-2 text-sm leading-7 text-muted-foreground">{{ story.description }}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>

    <footer class="relative overflow-hidden bg-slate-950 text-white">
      <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      <div class="container grid gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
        <div>
          <p class="text-sm font-bold uppercase tracking-[0.28em] text-blue-200">JeparaKirim</p>
          <h3 class="mt-4 max-w-xl font-display text-3xl font-bold leading-tight">Ekspedisi furniture Jepara untuk pengiriman yang lebih jelas, rapi, dan mudah dipantau.</h3>
          <p class="mt-4 max-w-xl text-sm leading-7 text-slate-300">
            Cek ongkir, lacak pengiriman, dan lanjut negosiasi langsung lewat WhatsApp tanpa pindah alur.
          </p>
        </div>
        <div class="grid gap-6 sm:grid-cols-2">
          <div>
            <p class="text-sm font-bold uppercase tracking-[0.24em] text-slate-400">Navigasi</p>
            <div class="mt-4 grid gap-3 text-sm text-slate-300">
              <a href="#hero" class="transition hover:text-white">Beranda</a>
              <a href="#cek-ongkir" class="transition hover:text-white">Cek Ongkir</a>
              <a href="#tracking" class="transition hover:text-white">Tracking</a>
              <a href="#testimonials" class="transition hover:text-white">Testimoni</a>
            </div>
          </div>
          <div>
            <p class="text-sm font-bold uppercase tracking-[0.24em] text-slate-400">Kontak</p>
            <div class="mt-4 grid gap-3 text-sm text-slate-300">
              <p>Jepara, Jawa Tengah</p>
              <p>{{ state.siteSettings.whatsapp }}</p>
              <a :href="whatsAppLink" class="transition hover:text-white" rel="noreferrer" target="_blank">Buka WhatsApp</a>
            </div>
          </div>
        </div>
      </div>
    </footer>

    <a
      :href="whatsAppLink"
      target="_blank"
      rel="noreferrer"
      class="fixed bottom-5 right-5 z-50 inline-flex items-center gap-3 rounded-full bg-emerald-500 px-5 py-4 text-sm font-bold text-white shadow-ambient transition hover:-translate-y-1"
    >
      <span class="h-3 w-3 rounded-full bg-white/90"></span>
      WhatsApp Nego Harga
    </a>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
import { RouterLink } from "vue-router";
import Button from "@/components/ui/Button.vue";
import Card from "@/components/ui/Card.vue";
import { itemTypes } from "@/data/catalog";
import { formatCurrency } from "@/lib/utils";
import { initializeOpsStore, refreshOpsStore, useOpsStore } from "@/store/ops";

const { state } = useOpsStore();

const heroSlides = computed(() => [
  {
    title: "Ekspedisi furniture Jepara yang rapi, jelas, dan enak dipakai dari awal.",
    subtitle: "Cek ongkir, kirim barang, dan pantau posisi pengiriman dalam satu alur yang singkat.",
    background: `linear-gradient(120deg, rgba(15,23,42,0.2), rgba(15,23,42,0.15)), url('${state.siteSettings.heroImage1}')`
  },
  {
    title: "Tarif flat yang diatur admin, tapi ukuran barang tetap diperiksa.",
    subtitle: "Cocok untuk furniture yang sering makan volume lebih besar daripada perkiraan berat biasa.",
    background: `linear-gradient(120deg, rgba(15,23,42,0.2), rgba(15,23,42,0.15)), url('${state.siteSettings.heroImage2}')`
  },
  {
    title: "Booking dan tracking live tanpa ribet pindah halaman admin.",
    subtitle: "Yang di depan dibuat sederhana untuk customer, yang di belakang tetap siap untuk operasional harian.",
    background: `linear-gradient(120deg, rgba(15,23,42,0.2), rgba(15,23,42,0.15)), url('${state.siteSettings.heroImage3}')`
  }
]);

const heroStats = [
  { value: "Flat Rate", label: "Tarif dari data admin", valueClass: "text-amber-300" },
  { value: "PXLT", label: "Ukuran langsung dicek", valueClass: "text-blue-200" },
  { value: "Live", label: "Tracking realtime", valueClass: "text-emerald-300" }
];

const whyUsPoints = [
  { title: "Tarif lebih jelas", description: "Admin mengatur tarif flat per rute dan jenis barang, jadi front page tidak terasa random." },
  { title: "Ukuran tetap dihitung", description: "Barang besar tetap dicek dari p x l x t supaya muatan di luar batas flat bisa ketahuan." },
  { title: "Operasional nyambung", description: "Data rute, driver, dan input pengiriman memakai alur data yang sama." }
];

const whyUsVisuals = computed(() => [
  { kicker: "Packaging", title: "Packing lebih siap untuk mebel besar", image: `url('${state.siteSettings.whyPackagingImage}')` },
  { kicker: "Delivery", title: "Armada dan handling dibuat untuk barang volume besar", image: `url('${state.siteSettings.whyDeliveryImage}')` }
]);

const howToSteps = ["Pilih jenis barang", "Isi panjang, lebar, tinggi", "Klik cek ongkir", "Lanjut booking jika cocok"];

const testimonials = computed(() => [
  { name: "Rizky Furnitura", role: "Owner Workshop", quote: "Lebih enak karena calon customer langsung punya kisaran harga yang masuk akal.", image: `url('${state.siteSettings.testimonialImage1}')` },
  { name: "Aruna Interior", role: "Project Lead", quote: "Tracking dan koordinasi lebih rapi. Tidak perlu tanya posisi barang berulang-ulang.", image: `url('${state.siteSettings.testimonialImage2}')` },
  { name: "Mebel Sentra Jaya", role: "Toko Retail", quote: "Flow adminnya terasa dekat ke operasional harian, bukan dashboard pajangan.", image: `url('${state.siteSettings.testimonialImage3}')` }
]);

const missions = ["Menjaga tarif tetap transparan dan mudah dipahami.", "Membuat pengiriman furniture terasa lebih aman dan terukur.", "Memberi alat admin yang cepat dipakai tanpa ribet."];

const historyTimeline = [
  { year: "2018", title: "Mulai dari pengiriman workshop lokal", description: "Berawal dari kebutuhan kirim furniture Jepara yang sering tidak cocok jika disamakan dengan ekspedisi umum." },
  { year: "2021", title: "Masuk ke pengiriman toko dan proyek", description: "Permintaan meningkat dari reseller, toko retail, dan interior project dengan kebutuhan koordinasi lebih rapi." },
  { year: "2026", title: "Masuk ke dashboard operasional", description: "Tarif, input pengiriman, driver, dan tracking mulai dirapikan dalam satu sistem admin." }
];

const historyHero = computed(() => `url('${state.siteSettings.historyImage}')`);
const emptyShipment = {
  trackingNumber: "-",
  customer: "Masukkan kode track",
  item: "Masukkan kode track",
  destination: "Masukkan kode track",
  status: "Masukkan kode track",
  driverId: "",
  driverName: "Masukkan kode track",
  vehicle: "Masukkan kode track",
  eta: "Masukkan kode track",
  currentLocation: "Masukkan kode track",
  currentLocationLabel: "Masukkan kode track",
  mapNote: "Masukkan kode track untuk melihat status pengiriman dan posisi driver.",
  isTracking: false,
  lastSeenAt: null,
  lastLatitude: null,
  lastLongitude: null
};

const currentSlide = ref(0);
const activeTestimonialIndex = ref(0);
let sliderTimer: number | undefined;
let testimonialTimer: number | undefined;
let revealObserver: IntersectionObserver | undefined;
let trackingTimer: number | undefined;

const availableDestinations = computed(() => [...new Set(state.routeRates.map((route) => route.destination))]);

const form = reactive({
  itemType: "Sofa",
  destinationCity: availableDestinations.value[0] ?? "",
  lengthCm: 200,
  widthCm: 90,
  heightCm: 120,
  quantity: 2
});

const result = reactive({
  route: "Menunggu data rute",
  priceFormatted: "-",
  volumeM3: "-",
  flatCapacity: "-",
  extraTrips: "-",
  vehicle: "-",
  recommendation: "Isi data rute di dashboard admin Supabase untuk menampilkan estimasi ongkir."
});

const trackingInput = ref("");
const submittedTracking = ref("");
const trackedShipment = computed(() =>
  state.shipments.find((shipment) => shipment.trackingNumber.toLowerCase() === submittedTracking.value.toLowerCase()) ?? null
);
const trackingCard = computed(() => {
  if (!submittedTracking.value.trim()) return emptyShipment;
  return trackedShipment.value ?? {
    ...emptyShipment,
    trackingNumber: submittedTracking.value,
    status: "Kode track tidak ditemukan",
    mapNote: "Periksa kembali kode tracking atau pastikan data shipment sudah tersimpan di Supabase."
  };
});
const activeTestimonial = computed(() => testimonials.value[activeTestimonialIndex.value] ?? testimonials.value[0]);
const mobileMenuOpen = ref(false);
const mobileLinks = [
  { href: "#hero", label: "Beranda" },
  { href: "#cek-ongkir", label: "Cek Ongkir" },
  { href: "#tracking", label: "Tracking" },
  { href: "#why-us", label: "Kenapa Kami" },
  { href: "#testimonials", label: "Testimoni" },
  { href: "#history", label: "Profil" }
];

const embeddedMapUrl = computed(() => {
  if (trackingCard.value.lastLatitude != null && trackingCard.value.lastLongitude != null) {
    return `https://www.google.com/maps?q=${trackingCard.value.lastLatitude},${trackingCard.value.lastLongitude}&z=12&output=embed`;
  }

  const q = encodeURIComponent(trackingCard.value.currentLocation || "Jepara");
  return `https://www.google.com/maps?q=${q}&z=12&output=embed`;
});

const liveMapLink = computed(() => {
  if (trackingCard.value.lastLatitude != null && trackingCard.value.lastLongitude != null) {
    return `https://www.google.com/maps?q=${trackingCard.value.lastLatitude},${trackingCard.value.lastLongitude}`;
  }

  const q = encodeURIComponent(trackingCard.value.currentLocation || "Jepara");
  return `https://www.google.com/maps?q=${q}`;
});

const trackingFreshness = computed(() => {
  if (!submittedTracking.value.trim()) {
    return "Masukkan kode track";
  }

  if (!trackingCard.value.lastSeenAt) {
    return trackingCard.value.isTracking ? "Tracking aktif, menunggu titik pertama" : "Masukkan kode track";
  }

  const diffMs = Date.now() - new Date(trackingCard.value.lastSeenAt).getTime();
  const diffMinutes = Math.max(0, Math.round(diffMs / 60000));

  if (diffMinutes < 1) return "Baru saja diperbarui";
  if (diffMinutes === 1) return "Diperbarui 1 menit lalu";
  if (diffMinutes <= 15) return `Diperbarui ${diffMinutes} menit lalu`;
  return `Lokasi terakhir ${diffMinutes} menit lalu`;
});

function calculateShipping() {
  const route =
    state.routeRates.find((entry) => entry.destination === form.destinationCity && entry.itemType === form.itemType) ??
    state.routeRates.find((entry) => entry.destination === form.destinationCity) ??
    state.routeRates[0];

  if (!route) {
    result.route = "Belum ada rute aktif";
    result.priceFormatted = "-";
    result.volumeM3 = "-";
    result.flatCapacity = "-";
    result.extraTrips = "-";
    result.vehicle = "-";
    result.recommendation = "Isi data rute di Supabase agar ongkir bisa dihitung.";
    return;
  }

  const totalVolumeM3 = ((form.lengthCm * form.widthCm * form.heightCm) / 1_000_000) * Math.max(1, form.quantity);
  const tripMultiplier = Math.max(1, Math.ceil(totalVolumeM3 / route.maxVolumeM3));
  const totalPrice = route.flatPrice * tripMultiplier;

  result.route = `${route.origin} -> ${route.destination}`;
  result.priceFormatted = formatCurrency(totalPrice);
  result.volumeM3 = `${totalVolumeM3.toFixed(2)} m3`;
  result.flatCapacity = `${route.maxVolumeM3} m3`;
  result.extraTrips = tripMultiplier > 1 ? `${tripMultiplier - 1} trip tambahan` : "0";
  result.vehicle = route.vehicle;
  result.recommendation = tripMultiplier > 1 ? `Melebihi tarif flat, perlu ${tripMultiplier} trip` : "Masuk tarif flat";
}

function trackShipment() {
  submittedTracking.value = trackingInput.value.trim();
}

function startTrackingRefresh() {
  trackingTimer = window.setInterval(async () => {
    await refreshOpsStore();
  }, 15000);
}

function nextTestimonial() {
  activeTestimonialIndex.value = (activeTestimonialIndex.value + 1) % testimonials.value.length;
}

function prevTestimonial() {
  activeTestimonialIndex.value = (activeTestimonialIndex.value - 1 + testimonials.value.length) % testimonials.value.length;
}

function startSlider() {
  sliderTimer = window.setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % heroSlides.value.length;
  }, 4500);
}

function startTestimonialSlider() {
  testimonialTimer = window.setInterval(() => {
    nextTestimonial();
  }, 5200);
}

function setupScrollReveal() {
  const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver?.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  elements.forEach((element) => revealObserver?.observe(element));
}

const whatsAppLink = computed(() => {
  const phone = state.siteSettings.whatsapp.replace(/\D/g, "");
  const text = encodeURIComponent(
    `Halo admin JeparaKirim, saya cek ongkir untuk ${form.itemType}, ukuran ${form.lengthCm}x${form.widthCm}x${form.heightCm} cm, qty ${form.quantity}, tujuan ${form.destinationCity}.`
  );
  return `https://wa.me/${phone}?text=${text}`;
});

calculateShipping();

watch(availableDestinations, (destinations) => {
  if (!form.destinationCity && destinations.length) {
    form.destinationCity = destinations[0];
    calculateShipping();
  }
});

watch(
  () => state.shipments,
  (shipments) => {
    if (submittedTracking.value) {
      const matchedShipment = shipments.find((shipment) => shipment.trackingNumber.toLowerCase() === submittedTracking.value.toLowerCase());
      if (!matchedShipment) return;
    }
  },
  { deep: true }
);

onMounted(async () => {
  await initializeOpsStore();
  if (!form.destinationCity && availableDestinations.value.length) {
    form.destinationCity = availableDestinations.value[0];
  }
  calculateShipping();
  startSlider();
  startTestimonialSlider();
  startTrackingRefresh();
  setupScrollReveal();
});

onBeforeUnmount(() => {
  if (sliderTimer) window.clearInterval(sliderTimer);
  if (testimonialTimer) window.clearInterval(testimonialTimer);
  if (trackingTimer) window.clearInterval(trackingTimer);
  revealObserver?.disconnect();
});
</script>
