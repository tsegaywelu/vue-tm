<template>
  <div
    v-if="isRestoring"
    class="fixed inset-0 z-9999 bg-surface flex flex-col items-center justify-center gap-4"
  >
    <div class="h-16 text-primary">
      <LogoAnimation :loop="true" :show_text="false" />
    </div>

    <p class="text-sm text-faint-text animate-pulse">Restoring session...</p>
  </div>
  <RouterView v-else />
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/store/authStore";
import { useRouter, RouterView } from "vue-router";
import LogoAnimation from "@/components/LogoAnimation.vue";

const authStore = useAuthStore();
const router = useRouter();
const isRestoring = ref(false);

onMounted(async () => {
  if (authStore.is_authenticated && !authStore.current_user) {
    isRestoring.value = true;
    try {
      await authStore.fetch_user();
      if (!authStore.current_user) {
        router.push({
          name: "login",
          query: { redirect: router.currentRoute.value.fullPath },
        });
      } else {
        const currentRoute = router.currentRoute.value;
        if (currentRoute.path === "/") {
          router.push(authStore.get_default_home_route());
          return;
        }

        if (currentRoute.meta.permission) {
          const perm = currentRoute.meta.permission;
          const allowed = Array.isArray(perm)
            ? (perm as { subject: string; actions: string[] }[]).some((p) =>
                authStore.has_permission(p.subject, p.actions),
              )
            : authStore.has_permission(perm as string, [
                "view",
                "read",
                "manage",
              ]);
          if (!allowed) {
            router.push("/unauthorized");
          }
        }
      }
    } catch {
      router.push({
        name: "login",
        query: { redirect: router.currentRoute.value.fullPath },
      });
    } finally {
      setTimeout(() => {
        isRestoring.value = false;
      }, 500);
    }
  }
});
</script>
