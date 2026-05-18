import { useAuthStore } from "@/store/authStore";
import type { Directive, DirectiveBinding } from "vue";

function checkPermission(el: HTMLElement, binding: DirectiveBinding) {
  const authStore = useAuthStore();

  const check = (value: any): boolean => {
    if (typeof value === "string") {
      const [s, a] = value.split(":");
      return authStore.has_permission(s, a ? a.split(",") : ["read"]);
    }
    if (Array.isArray(value)) {
      return value.some((p) => authStore.has_permission(p.subject, p.actions));
    }
    if (typeof value === "object" && value !== null) {
      return authStore.has_permission(
        value.subject,
        Array.isArray(value.actions) ? value.actions : [value.actions],
      );
    }
    return false;
  };

  el.style.display = check(binding.value) ? "" : "none";
}

export const permissionDirective: Directive = {
  mounted(el, binding) {
    checkPermission(el, binding);
  },
  updated(el, binding) {
    checkPermission(el, binding);
  },
};
