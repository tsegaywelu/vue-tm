<template>
  <Teleport to="body">
    <div
      class="fixed top-5 right-5 z-[10000] flex flex-col gap-3 pointer-events-none"
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
            <div class="flex-shrink-0">
              <span
                v-if="toast.type === 'success'"
                v-html="icons.successBell"
              ></span>
              <span
                v-else-if="toast.type === 'error'"
                v-html="icons.rejectedBell"
              ></span>
              <span
                v-else-if="toast.type === 'warning'"
                v-html="icons.infoBell"
              ></span>
              <span v-else v-html="icons.infoBell"></span>
            </div>

            <div class="flex-grow">
              <p class="text-sm font-semibold text-gray-900 leading-tight">
                {{ toast.type.charAt(0).toUpperCase() + toast.type.slice(1) }}
              </p>
              <p class="text-xs text-gray-500 mt-1">
                {{ toast.message }}
              </p>
            </div>

            <button
              @click="removeToast(toast.id)"
              class="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <i class="mdi mdi-close text-lg"></i>
            </button>
          </div>

          <!-- Progress bar -->
          <div class="h-[3px] w-full bg-gray-100">
            <div
              class="h-full transition-[width] ease-linear"
              :class="[progressClass(toast.type)]"
              :style="{ width: progressWidth(toast) }"
            ></div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { useToastStore, type Toast } from "@/store/toastStore";
import { icons } from "@/utils/icons";
import { storeToRefs } from "pinia";

const toastStore = useToastStore();
const { toasts } = storeToRefs(toastStore);
const { removeToast, pauseToast, resumeToast, pauseAll, resumeAll } =
  toastStore;

// ── Timer tick ──────────────────────────────────────────────────
let rafId: number | null = null;

function tick() {
  const now = Date.now();
  // Iterate in reverse so splice doesn't shift indices
  for (let i = toasts.value.length - 1; i >= 0; i--) {
    const t = toasts.value[i];
    if (t.paused) continue;

    const elapsed = now - t.startedAt;
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
function progressWidth(toast: Toast): string {
  if (toast.duration <= 0) return "100%";

  let remaining: number;
  if (toast.paused) {
    remaining = toast.remaining;
  } else {
    remaining = Math.max(0, toast.remaining - (Date.now() - toast.startedAt));
  }
  const pct = (remaining / toast.duration) * 100;
  return `${Math.max(0, Math.min(100, pct))}%`;
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

function progressClass(type: string) {
  return type === "success"
    ? "bg-green-400"
    : type === "error"
      ? "bg-red-400"
      : type === "warning"
        ? "bg-orange-400"
        : "bg-blue-400";
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
