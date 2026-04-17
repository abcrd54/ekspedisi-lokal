import { computed, reactive } from "vue";
import type { User } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

const authState = reactive({
  initialized: false,
  loading: false,
  user: null as User | null,
  error: ""
});

let listenerBound = false;

export async function initializeAuth() {
  if (authState.initialized) return;
  if (!isSupabaseConfigured || !supabase) {
    authState.initialized = true;
    return;
  }

  authState.loading = true;
  const { data, error } = await supabase.auth.getSession();
  authState.user = data.session?.user ?? null;
  authState.error = error?.message ?? "";
  authState.loading = false;
  authState.initialized = true;

  if (!listenerBound) {
    supabase.auth.onAuthStateChange((_event, session) => {
      authState.user = session?.user ?? null;
    });
    listenerBound = true;
  }
}

export async function signInAdmin(email: string, password: string) {
  if (!isSupabaseConfigured || !supabase) {
    authState.error = "Supabase belum dikonfigurasi. Isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY.";
    return false;
  }

  authState.loading = true;
  authState.error = "";
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  authState.loading = false;
  authState.error = error?.message ?? "";
  return !error;
}

export async function signOutAdmin() {
  if (!supabase) return;
  await supabase.auth.signOut();
}

export function useAuthStore() {
  return {
    state: authState,
    isAuthenticated: computed(() => Boolean(authState.user)),
    isSupabaseConfigured
  };
}
