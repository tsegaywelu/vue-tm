<template>
  <Teleport to="body">
    <div class="fixed top-5 right-5 z-[10000] flex flex-col gap-3 pointer-events-none">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border min-w-[300px] max-w-md bg-white transition-all duration-300 transform"
          :class="[
            toast.type === 'success' ? 'border-green-100' : 
            toast.type === 'error' ? 'border-red-100' : 
            toast.type === 'warning' ? 'border-orange-100' : 'border-blue-100'
          ]"
        >
          <div class="flex-shrink-0">
            <span v-if="toast.type === 'success'" v-html="icons.successBell"></span>
            <span v-else-if="toast.type === 'error'" v-html="icons.rejectedBell"></span>
            <span v-else-if="toast.type === 'warning'" v-html="icons.infoBell"></span>
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
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useToastStore } from '@/store/toastStore';
import { icons } from '@/utils/icons';
import { storeToRefs } from 'pinia';

const toastStore = useToastStore();
const { toasts } = storeToRefs(toastStore);
const { removeToast } = toastStore;
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
