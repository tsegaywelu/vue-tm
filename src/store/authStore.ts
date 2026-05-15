import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const token = ref(localStorage.getItem("token") || "");
  const refresh_token = ref(localStorage.getItem("refreshToken") || "");
  const current_user = ref<any>(null);
  const is_loading = ref(false);

  const is_authenticated = computed(() => !!token.value);

  // Shipper detection: shipper users have a `shipper` object on their user profile
  const is_shipper = computed(() => {
    const user = current_user.value?.user || current_user.value;
    return !!user?.shipper;
  });

  const shipperId = computed(() => {
    const user = current_user.value?.user || current_user.value;
    return user?.shipper?._id || "";
  });

  const carrierId = computed(() => {
    const user = current_user.value?.user || current_user.value;
    return user?.carrier?._id || "";
  });

  const set_tokens = (accessToken: string, refreshToken?: string) => {
    token.value = accessToken;
    localStorage.setItem("token", accessToken);
    if (refreshToken) {
      refresh_token.value = refreshToken;
      localStorage.setItem("refreshToken", refreshToken);
    }
  };

  const set_user = (user: any) => {
    current_user.value = user;
  };

  const logout = () => {
    token.value = "";
    refresh_token.value = "";
    current_user.value = null;
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
  };

  // Permission helper
  const has_permission = (subject: string, actions: string[]) => {
    const user = current_user.value?.user || current_user.value;
    if (!user) return false;

    // 1. Admin Override
    if (user.type === "ADMIN") return true;

    const permissions = user.permissions || user.role?.permissions || [];

    // 2. Global "ALL" Subject Override
    if (permissions.some((p: any) => p.subject === "ALL")) return true;

    // 3. Subject-level "manage" action or specific actions
    return permissions.some(
      (p: any) =>
        p.subject === subject &&
        (p.action.includes("manage") ||
          actions.some((a) => p.action.includes(a))),
    );
  };

  const fetch_user = async () => {
    if (!token.value) return;
    is_loading.value = true;
    try {
      const { fetch_current_user } =
        await import("@/modules/auth/api/auth.api");
      const res = await fetch_current_user();
      if (res.success) {
        current_user.value = res.data;
      } else {
        // If fetching user fails (e.g. token expired), logout
        logout();
      }
    } catch (error) {
      logout();
    } finally {
      is_loading.value = false;
    }
  };

  const get_default_home_route = () => {
    if (!token.value) return "/login";

    // Shipper users always go to the shipper dashboard
    if (is_shipper.value) return "/shipper/dashboard";

    if (has_permission("REPORT", ["view"])) return "/operation/dashboard";
    if (has_permission("SHIPMENT", ["view"])) return "/operation/shipments";
    if (has_permission("ORDER", ["view"])) return "/operation/orders";
    if (has_permission("ADVANCE_PAYMENT", ["view"]))
      return "/operation/advances";
    if (has_permission("TRANSACTION", ["view"]))
      return "/operation/settlements";
    if (
      has_permission("MECHANIC", ["view"]) ||
      has_permission("SERVICE_TASK", ["view"])
    )
      return "/operation/maintenance/service-task";
    if (has_permission("INVENTORY_ITEM", ["view"]))
      return "/operation/inventory/items";
    // Ultimate fallback for very restricted users to avoid infinite loop
    return "/unauthorized";
  };

  return {
    token,
    refresh_token,
    current_user,
    is_loading,
    is_authenticated,
    is_shipper,
    shipperId,
    carrierId,
    set_tokens,
    set_user,
    logout,
    has_permission,
    fetch_user,
    get_default_home_route,
  };
});
