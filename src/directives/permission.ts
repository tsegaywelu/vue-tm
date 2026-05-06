import { useAuthStore } from "@/store/authStore";
import type { Directive } from "vue";

export const permissionDirective: Directive = {
  mounted(el, binding) {
    const authStore = useAuthStore();
    let subject: string = "";
    let actions: string[] = [];

    if (typeof binding.value === "string") {
      const [s, a] = binding.value.split(":");
      subject = s;
      actions = a ? a.split(",") : ["read"];
    } else if (typeof binding.value === "object") {
      subject = binding.value.subject;
      actions = Array.isArray(binding.value.actions)
        ? binding.value.actions
        : [binding.value.actions];
    }

    if (!authStore.has_permission(subject, actions)) {
      el.parentNode?.removeChild(el);
    }
  },
};
