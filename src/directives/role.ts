import { useAuthStore } from "@/store/authStore";
import type { Directive } from "vue";

export const roleDirective: Directive = {
  mounted(el, binding) {
    const authStore = useAuthStore();
    const requiredRole = binding.value;

    if (!authStore.current_user?.user?.role) {
      el.parentNode?.removeChild(el);
      return;
    }

    const userRole = authStore.current_user.user.role.type;

    if (userRole !== "ADMIN" && userRole !== requiredRole) {
      el.parentNode?.removeChild(el);
    }
  },
};
