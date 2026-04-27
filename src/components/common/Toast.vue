<template>
  <Teleport to="body">
    <div
      class="fixed top-5 right-5 z-10000 flex flex-col gap-3 pointer-events-none"
    >
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto flex flex-col rounded-xl shadow-2xl border min-w-[300px] max-w-md bg-white transition-all duration-300 transform overflow-hidden"
          :class="[borderClass(toast.type)]"
          @mouseenter="pauseToast(toast.id)"
          @mouseleave="resumeToast(toast.id)"
        >
          <!-- Content row -->
          <div class="flex items-center gap-3 px-4 py-3">
            <div class="shrink-0 relative size-10 grid place-items-center">
              <!-- Circular Progress SVG -->
              <svg
                class="absolute inset-0 size-10 -rotate-90 transform"
                viewBox="0 0 40 40"
              >
                <!-- Background circle -->
                <circle
                  cx="20"
                  cy="20"
                  r="18"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  class="text-gray-100"
                />
                <!-- Progress circle -->
                <circle
                  cx="20"
                  cy="20"
                  r="18"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  :class="[textClass(toast.type)]"
                  :style="{
                    strokeDasharray: '113.1',
                    strokeDashoffset: calculateOffset(toast),
                    transition: toast.paused
                      ? 'none'
                      : 'stroke-dashoffset 0.1s linear',
                  }"
                />
              </svg>

              <!-- Bell Icon -->
              <div class="relative z-10 size-10 grid place-items-center">
                <span
                  v-if="toast.type === 'success'"
                  v-html="icons.successBell"
                  class="*:size-10"
                ></span>
                <span
                  v-else-if="toast.type === 'error'"
                  v-html="icons.rejectedBell"
                  class="*:size-10"
                ></span>
                <span
                  v-else-if="toast.type === 'warning'"
                  v-html="icons.infoBell"
                  class="*:size-10"
                ></span>
                <span v-else v-html="icons.infoBell" class="*:size-10"></span>
              </div>
            </div>

            <div class="grow">
              <p class="text-sm font-semibold text-gray-900 leading-tight">
                {{ toast.type.charAt(0).toUpperCase() + toast.type.slice(1) }}
              </p>
              <p class="text-xs text-gray-500 mt-1">
                {{ toast.message }}
              </p>
            </div>

            <button
              @click="removeToast(toast.id)"
              class="shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <i class="mdi mdi-close text-lg"></i>
            </button>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useToastStore, type Toast } from "@/store/toastStore";
import { icons } from "@/utils/icons";
import { storeToRefs } from "pinia";

const toastStore = useToastStore();
const { toasts } = storeToRefs(toastStore);
const { removeToast, pauseToast, resumeToast, pauseAll, resumeAll } =
  toastStore;

// ── Reactive Time ────────────────────────────────────────────────
const currentTime = ref(Date.now());
let rafId: number | null = null;

function tick() {
  currentTime.value = Date.now();
  // Iterate in reverse so splice doesn't shift indices
  for (let i = toasts.value.length - 1; i >= 0; i--) {
    const t = toasts.value[i];
    if (t.paused) continue;

    const elapsed = currentTime.value - t.startedAt;
    const left = t.remaining - elapsed;

    if (left <= 0) {
      removeToast(t.id);
    }
  }
  rafId = requestAnimationFrame(tick);
}

onMounted(() => {
  rafId = requestAnimationFrame(tick);
  document.addEventListener("visibilitychange", handleVisibility);
});

onUnmounted(() => {
  if (rafId !== null) cancelAnimationFrame(rafId);
  document.removeEventListener("visibilitychange", handleVisibility);
});

// ── Pause when tab is hidden ────────────────────────────────────
function handleVisibility() {
  if (document.hidden) {
    pauseAll();
  } else {
    resumeAll();
  }
}

// ── Progress helpers ────────────────────────────────────────────
function calculateOffset(toast: Toast): string {
  if (toast.duration <= 0) return "0";

  let remaining: number;
  if (toast.paused) {
    remaining = toast.remaining;
  } else {
    remaining = Math.max(
      0,
      toast.remaining - (currentTime.value - toast.startedAt),
    );
  }

  const pct = remaining / toast.duration;
  // Circumference = 2 * PI * r = 2 * 3.14159 * 18 ≈ 113.1
  const circumference = 113.1;
  return String(circumference * (1 - pct));
}

function borderClass(type: string) {
  return type === "success"
    ? "border-green-100"
    : type === "error"
      ? "border-red-100"
      : type === "warning"
        ? "border-orange-100"
        : "border-blue-100";
}

function textClass(type: string) {
  return type === "success"
    ? "text-green-500"
    : type === "error"
      ? "text-red-500"
      : type === "warning"
        ? "text-orange-500"
        : "text-blue-500";
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}

.toast-move {
  transition: transform 0.4s ease;
}
</style>
