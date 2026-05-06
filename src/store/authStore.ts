import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const token = ref(localStorage.getItem("token") || "");
  const refresh_token = ref(localStorage.getItem("refreshToken") || "");
  const current_user = ref<any>(null);
  const is_loading = ref(false);

  const is_authenticated = computed(() => !!token.value);

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
    const user = current_user.value?.user;
    if (!user) return false;

    const permissions = user.permissions || user.role?.permissions || [];

    return permissions.some(
      (p: any) =>
        p.subject === subject &&
        actions.some((a) => p.action.includes(a)),
    );
  };

  const fetch_user = async () => {
    if (!token.value) return;
    is_loading.value = true;
    try {
      const { fetch_current_user } = await import("@/modules/auth/api/auth.api");
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

  return {
    token,
    refresh_token,
    current_user,
    is_loading,
    is_authenticated,
    set_tokens,
    set_user,
    logout,
    has_permission,
    fetch_user,
  };
});
