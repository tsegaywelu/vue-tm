import { defineStore } from "pinia";
import { ref, markRaw } from "vue";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
  /** Remaining time in ms — mutated by the Toast component for pause/resume */
  remaining: number;
  /** Timestamp when the current countdown segment started */
  startedAt: number;
  /** Whether the countdown is currently paused */
  paused: boolean;
  component?: any;
  componentProps?: Record<string, any>;
}

export const useToastStore = defineStore("toast", () => {
  const toasts = ref<Toast[]>([]);

  function addToast(
    message: string,
    type: ToastType = "success",
    duration = 5000,
  ) {
    const id = Math.random().toString(36).substring(2, 9);
    const toast: Toast = {
      id,
      message,
      type,
      duration,
      remaining: duration,
      startedAt: Date.now(),
      paused: false,
    };
    toasts.value.push(toast);
    return id;
  }

  function addCustomToast(
    component: any,
    componentProps?: Record<string, any>,
    duration = Infinity,
  ) {
    const id = Math.random().toString(36).substring(2, 9);
    const toast: Toast = {
      id,
      message: "",
      type: "info",
      duration,
      remaining: duration,
      startedAt: Date.now(),
      paused: false,
      component: markRaw(component),
      componentProps,
    };
    toasts.value.push(toast);
    return id;
  }

  function removeToast(id: string) {
    const index = toasts.value.findIndex((t) => t.id === id);
    if (index !== -1) {
      toasts.value.splice(index, 1);
    }
  }

  function pauseToast(id: string) {
    const toast = toasts.value.find((t) => t.id === id);
    if (toast && !toast.paused) {
      toast.remaining = Math.max(
        0,
        toast.remaining - (Date.now() - toast.startedAt),
      );
      toast.paused = true;
    }
  }

  function resumeToast(id: string) {
    const toast = toasts.value.find((t) => t.id === id);
    if (toast && toast.paused) {
      toast.startedAt = Date.now();
      toast.paused = false;
    }
  }

  function pauseAll() {
    toasts.value.forEach((t) => pauseToast(t.id));
  }

  function resumeAll() {
    toasts.value.forEach((t) => resumeToast(t.id));
  }

  function success(message: string, duration?: number) {
    addToast(message, "success", duration);
  }

  function error(message: string, duration?: number) {
    addToast(message, "error", duration);
  }

  function info(message: string, duration?: number) {
    addToast(message, "info", duration);
  }

  function warning(message: string, duration?: number) {
    addToast(message, "warning", duration);
  }

  return {
    toasts,
    addToast,
    addCustomToast,
    removeToast,
    pauseToast,
    resumeToast,
    pauseAll,
    resumeAll,
    success,
    error,
    info,
    warning,
  };
});
