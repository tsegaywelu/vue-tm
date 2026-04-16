import { defineStore } from 'pinia';
import { ref } from 'vue';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<Toast[]>([]);

  function addToast(message: string, type: ToastType = 'success', duration = 3000) {
    const id = Math.random().toString(36).substring(2, 9);
    const toast: Toast = { id, message, type, duration };
    toasts.value.push(toast);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }

  function removeToast(id: string) {
    const index = toasts.value.findIndex((t) => t.id === id);
    if (index !== -1) {
      toasts.value.splice(index, 1);
    }
  }

  function success(message: string, duration?: number) {
    addToast(message, 'success', duration);
  }

  function error(message: string, duration?: number) {
    addToast(message, 'error', duration);
  }

  function info(message: string, duration?: number) {
    addToast(message, 'info', duration);
  }

  function warning(message: string, duration?: number) {
    addToast(message, 'warning', duration);
  }

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info,
    warning,
  };
});
