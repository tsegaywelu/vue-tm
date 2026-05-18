import { createRouter, createWebHistory } from "vue-router";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import RouteGuard from "@/components/RouteGuard.vue";
import { operation_routes } from "@/modules/operation/operation.routes";
import { shipper_routes } from "@/modules/shipper/shipper.routes";
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
          children: [...operation_routes, ...shipper_routes],
        },
      ],
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/modules/auth/pages/LoginPage.vue"),
    },
    {
      path: "/unauthorized",
      name: "unauthorized",
      component: () => import("@/modules/auth/pages/UnauthorizedPage.vue"),
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const auth_store = useAuthStore();

  // Basic guard: Redirect to login if not authenticated and not going to login
  if (to.name !== "login" && !auth_store.is_authenticated) {
    next({ name: "login", query: { redirect: to.fullPath } });
  } else if (to.name === "login" && auth_store.is_authenticated) {
    next({ path: auth_store.get_default_home_route() });
  } else {
    // Permission Guard
    if (to.meta.permission && auth_store.is_authenticated) {
      // If the user hasn't been fetched yet (hard refresh), let them pass to RouteGuard
      if (!auth_store.current_user) {
        return next();
      }

      const perm = to.meta.permission;
      const allowed = Array.isArray(perm)
        ? (perm as { subject: string; actions: string[] }[]).some((p) =>
            auth_store.has_permission(p.subject, p.actions),
          )
        : auth_store.has_permission(perm as string, ["view", "read", "manage"]);

      if (!allowed) {
        if (from.path && from.path !== "/") {
          return next(false); // cancel navigation
        }
        return next({ path: "/unauthorized" });
      }
    }
    next();
  }
});

export default router;
