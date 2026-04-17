import { createRouter, createWebHistory } from "vue-router";
import PublicPage from "@/pages/PublicPage.vue";
import AdminPage from "@/pages/AdminPage.vue";
import AdminLoginPage from "@/pages/AdminLoginPage.vue";
import { initializeAuth, useAuthStore } from "@/store/auth";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "home", component: PublicPage },
    { path: "/admin/login", name: "admin-login", component: AdminLoginPage },
    { path: "/admin", name: "admin", component: AdminPage, meta: { requiresAuth: true } }
  ]
});

router.beforeEach(async (to) => {
  await initializeAuth();
  const { isAuthenticated, isSupabaseConfigured } = useAuthStore();

  if (to.meta.requiresAuth && isSupabaseConfigured && !isAuthenticated.value) {
    return { name: "admin-login" };
  }

  if (to.name === "admin-login" && isAuthenticated.value) {
    return { name: "admin" };
  }

  return true;
});

export default router;
