import { createRouter, createWebHistory } from "vue-router";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import RouteGuard from "@/components/RouteGuard.vue";
import { operation_routes } from "@/modules/operation/operation.routes";
import { useAuthStore } from "@/store/authStore";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: RouteGuard,
      children: [
        {
          path: "",
          component: DashboardLayout,
          redirect: "/operation/dashboard",
          children: [...operation_routes],
        },
      ],
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/modules/auth/pages/LoginPage.vue"),
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const auth_store = useAuthStore();

  // Basic guard: Redirect to login if not authenticated and not going to login
  if (to.name !== "login" && !auth_store.is_authenticated) {
    next({ name: "login", query: { redirect: to.fullPath } });
  } else if (to.name === "login" && auth_store.is_authenticated) {
    next({ path: "/operation/dashboard" });
  } else {
    next();
  }
});

export default router;
