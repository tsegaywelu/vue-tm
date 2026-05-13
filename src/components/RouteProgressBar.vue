<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const isLoading = ref(false);
const progress = ref(0);
const isVisible = ref(false);

// Cache of route paths whose chunks have already been loaded
const loadedRoutes = new Set<string>();

let progressInterval: ReturnType<typeof setInterval> | null = null;

const startProgress = () => {
  isLoading.value = true;
  isVisible.value = true;
  progress.value = 0;

  // Animate progress from 0 → 90% over ~2s
  progressInterval = setInterval(() => {
    if (progress.value < 90) {
      progress.value += Math.random() * 12;
      if (progress.value > 90) progress.value = 90;
    }
  }, 200);
};

const finishProgress = () => {
  if (progressInterval) {
    clearInterval(progressInterval);
    progressInterval = null;
  }
  progress.value = 100;
  isLoading.value = false;

  // Hide the bar after the transition completes
  setTimeout(() => {
    isVisible.value = false;
    progress.value = 0;
  }, 400);
};

let removeBeforeEach: (() => void) | null = null;
let removeAfterEach: (() => void) | null = null;

onMounted(() => {
  removeBeforeEach = router.beforeEach((to, _from) => {
    const routePath = to.matched?.[to.matched.length - 1]?.path || to.path;
    if (!loadedRoutes.has(routePath)) {
      startProgress();
    }
  });

  removeAfterEach = router.afterEach((to) => {
    const routePath = to.matched?.[to.matched.length - 1]?.path || to.path;
    loadedRoutes.add(routePath);

    if (isLoading.value) {
      finishProgress();
    }
  });
});

onUnmounted(() => {
  removeBeforeEach?.();
  removeAfterEach?.();
  if (progressInterval) clearInterval(progressInterval);
});
</script>

<template>
  <div
    v-if="isVisible"
    class="route-progress-bar"
    :style="{ width: `${progress}%` }"
  ></div>
</template>

<style scoped>
.route-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(
    90deg,
    var(--color-primary, #2563eb),
    var(--color-primary-600, #1d4ed8)
  );
  z-index: 99999;
  transition: width 0.2s ease-out;
  box-shadow: 0 0 8px rgba(37, 99, 235, 0.4);
}
</style>
