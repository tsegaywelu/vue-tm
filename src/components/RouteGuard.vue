<template>
  <div
    v-if="isRestoring"
    class="fixed inset-0 z-9999 bg-white flex flex-col items-center justify-center gap-6"
  >
    <!-- Premium Spinner -->
    <div class="relative size-16">
      <div
        class="absolute inset-0 border-4 border-primary-50 rounded-full"
      ></div>
      <div
        class="absolute inset-0 border-4 border-t-primary-600 rounded-full animate-spin"
      ></div>
    </div>

    <div class="flex flex-col items-center gap-2">
      <h2 class="text-xl font-bold text-primary-900 tracking-tight">
        Restoring Session
      </h2>
      <p class="text-sm text-primary-500 animate-pulse">
        Verifying your secure connection...
      </p>
    </div>

    <!-- Subtle branding -->
    <div
      class="absolute bottom-10 flex items-center gap-2 grayscale opacity-30"
    >
      <img
        src="@/assets/rlogo.png"
        alt="Logo"
        class="w-120"
        style="filter: brightness(0)"
        @error="(e) => ((e.target as HTMLImageElement).style.display = 'none')"
      />
    </div>
  </div>
  <RouterView v-else />
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/store/authStore";
import { useRouter, RouterView } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();
const isRestoring = ref(false);

onMounted(async () => {
  if (!authStore.is_authenticated) return;

  if (!authStore.current_user) {
    isRestoring.value = true;
    try {
      await authStore.fetch_user();
      if (!authStore.current_user) {
        router.push({
          name: "login",
          query: { redirect: router.currentRoute.value.fullPath },
        });
        return;
      }
    } catch (error) {
      router.push({
        name: "login",
        query: { redirect: router.currentRoute.value.fullPath },
      });
      return;
    } finally {
      setTimeout(() => {
        isRestoring.value = false;
      }, 500);
    }
  }

  // User is loaded (either pre-loaded from login or just fetched)
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
      : authStore.has_permission(perm as string, ["view", "read", "manage"]);
    if (!allowed) {
      router.push("/unauthorized");
    }
  }
});
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
