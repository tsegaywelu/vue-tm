import { useAuthStore } from "@/store/authStore";
import type { Directive, DirectiveBinding } from "vue";

function checkRole(el: HTMLElement, binding: DirectiveBinding) {
  const authStore = useAuthStore();
  const requiredRole = binding.value;

  if (!authStore.current_user?.user?.role) {
    el.parentNode?.removeChild(el);
    return;
  }

  const user = authStore.current_user.user;
  const userRole = user.role?.type;
  const requiredLower = (requiredRole as string).toLowerCase();
  const existsAsValue = user?.[requiredLower];

  if (userRole !== requiredRole && !existsAsValue) {
    el.parentNode?.removeChild(el);
  }
}

export const roleDirective: Directive = {
  mounted: checkRole,
  updated: checkRole,
};
