import { createRouter, createWebHistory } from "vue-router";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import RouteGuard from "@/components/RouteGuard.vue";
import { operation_routes } from "@/modules/operation/operation.routes";
import { shipper_routes } from "@/modules/shipper/shipper.routes";
import { fleet_routes } from "@/modules/fleet/fleet.routes";
import { admin_routes } from "@/modules/admin/admin.routes";
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
          children: [...operation_routes, ...shipper_routes, ...fleet_routes, ...admin_routes],
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
    // On hard refresh user may not be loaded yet — skip type checks until RouteGuard loads user
    if (auth_store.is_authenticated && auth_store.current_user) {
      const isAdminRoute = to.path.startsWith("/admin");
      const isCarrierOrShipperRoute =
        to.path.startsWith("/operation") ||
        to.path.startsWith("/shipper") ||
        to.path.startsWith("/vehicles") ||
        to.path.startsWith("/drivers") ||
        to.path.startsWith("/fleet") ||
        to.path.startsWith("/finance") ||
        to.path.startsWith("/maintenance") ||
        to.path.startsWith("/inventory") ||
        to.path.startsWith("/setting") ||
        to.path.startsWith("/reports") ||
        to.path.startsWith("/customers") ||
        to.path.startsWith("/contacts") ||
        to.path.startsWith("/agents") ||
        to.path.startsWith("/facilities") ||
        to.path.startsWith("/transporters") ||
        to.path.startsWith("/insurances");

      // Super Admin must stay in /admin routes
      if (auth_store.is_super_admin && isCarrierOrShipperRoute) {
        return next({ path: "/admin/dashboard" });
      }

      // Non-super-admin must not access /admin routes
      if (!auth_store.is_super_admin && isAdminRoute) {
        return next({ path: auth_store.get_default_home_route() });
      }
    }

    // Permission Guard
    if (to.meta.permission && auth_store.is_authenticated) {
      // On hard refresh there is no previous route — skip the check and let
      // the page/RouteGuard re-evaluate once fresh user data is loaded.
      if (!auth_store.current_user || !from.name) {
        return next();
      }

      const perm = to.meta.permission;
      const allowed = Array.isArray(perm)
        ? (perm as { subject: string; actions: string[] }[]).some((p) =>
            auth_store.has_permission(p.subject, p.actions),
          )
        : auth_store.has_permission(perm as string, ["view", "manage"]);

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
