<template>
  <div class="min-h-screen bg-slate-950 p-4 sm:p-5">
    <div class="panel mx-auto flex min-h-[calc(100vh-2rem)] max-w-5xl overflow-hidden">
      <div class="hidden flex-1 bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <p class="section-kicker !text-slate-400">Admin Login</p>
          <h1 class="font-display mt-3 text-5xl font-bold leading-tight">Masuk ke dashboard operasional JeparaKirim.</h1>
          <p class="mt-5 max-w-xl text-sm leading-7 text-slate-300">Auth admin menggunakan Supabase. Setelah login, route `/admin` hanya bisa diakses oleh sesi yang valid.</p>
        </div>
        <div class="grid gap-4">
          <div class="rounded-[1.5rem] bg-white/10 p-5">
            <p class="text-sm font-bold text-blue-100">Environment</p>
            <p class="mt-2 text-sm leading-7 text-slate-300">Isi `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`, lalu aktifkan email-password auth di Supabase.</p>
          </div>
          <div class="rounded-[1.5rem] bg-white/10 p-5">
            <p class="text-sm font-bold text-blue-100">Tables</p>
            <p class="mt-2 text-sm leading-7 text-slate-300">Siapkan tabel `site_settings`, `route_rates`, `drivers`, dan `shipments` agar CRUD langsung tersimpan.</p>
          </div>
        </div>
      </div>

      <div class="flex w-full items-center justify-center p-6 lg:w-[460px]">
        <Card class="panel w-full p-8">
          <p class="section-kicker">Supabase Auth</p>
          <h2 class="font-display mt-3 text-3xl font-bold text-slate-950">Login Admin</h2>
          <div class="mt-8 grid gap-4">
            <label class="grid gap-2 text-sm font-semibold">
              Email
              <input v-model="loginForm.email" class="field" placeholder="admin@domain.com" type="email" />
            </label>
            <label class="grid gap-2 text-sm font-semibold">
              Password
              <input v-model="loginForm.password" class="field" placeholder="••••••••" type="password" />
            </label>
            <Button class="w-full" :class="authState.loading ? 'opacity-70' : ''" @click="handleLogin">Masuk</Button>
            <p class="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600" v-if="!isSupabaseConfigured">
              Supabase belum dikonfigurasi. Isi file `.env` dari `.env.example`.
            </p>
            <p class="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600" v-if="authState.error">{{ authState.error }}</p>
            <RouterLink to="/" class="text-center text-sm font-semibold text-primary">Kembali ke website</RouterLink>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from "vue";
import { useRouter, RouterLink } from "vue-router";
import Button from "@/components/ui/Button.vue";
import Card from "@/components/ui/Card.vue";
import { initializeAuth, signInAdmin, useAuthStore } from "@/store/auth";

const router = useRouter();
const { state: authState, isAuthenticated, isSupabaseConfigured } = useAuthStore();

const loginForm = reactive({
  email: "",
  password: ""
});

async function handleLogin() {
  const success = await signInAdmin(loginForm.email, loginForm.password);
  if (success) {
    await router.replace("/admin");
  }
}

onMounted(async () => {
  await initializeAuth();
  if (isAuthenticated.value) {
    await router.replace("/admin");
  }
});
</script>
