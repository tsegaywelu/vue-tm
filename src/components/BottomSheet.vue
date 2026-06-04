<script setup lang="ts">
import { watch } from "vue";
import { icons } from "@/utils/icons";

const props = defineProps<{
  modelValue: boolean;
  title?: string;
  subtitle?: string;
  no_handle?: boolean;
  fill?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", val: boolean): void;
}>();

function close() {
  emit("update:modelValue", false);
}

watch(
  () => props.modelValue,
  (open) => {
    document.body.style.overflow = open ? "hidden" : "";
  },
);
</script>

<template>
  <Teleport to="body">
    <template v-if="modelValue">
      <!-- Backdrop: renders immediately, no opacity animation so backdrop-blur computes right away -->
      <div
        class="fixed inset-0 bg-black/40 backdrop-blur-sm z-500"
        @click="close"
      />

      <!-- Sheet: slides up independently -->
      <Transition
        enter-active-class="transition-transform duration-350 ease-[cubic-bezier(0.32,0.72,0,1)]"
        enter-from-class="translate-y-full"
        enter-to-class="translate-y-0"
        leave-active-class="transition-transform duration-200 ease-in"
        leave-from-class="translate-y-0"
        leave-to-class="translate-y-full"
        appear
      >
        <div
          v-if="modelValue"
          class="fixed bottom-0 left-0 right-0 w-full bg-surface rounded-t-3xl shadow-2xl flex flex-col max-h-[90dvh] pb-6 z-501"
          @click.stop
        >
          <!-- Drag handle -->
          <div v-if="!no_handle" class="flex justify-center pt-4 pb-1 shrink-0">
            <div class="w-12 h-1.5 bg-line rounded-full" />
          </div>

          <!-- Header (optional) -->
          <div
            v-if="title"
            class="px-6 py-4 flex justify-between items-center border-b border-line shrink-0"
          >
            <div class="flex flex-col gap-0.5">
              <h3 class="text-xl font-bold text-base-text leading-tight">
                {{ title }}
              </h3>
              <span v-if="subtitle" class="text-sm text-grey-500">{{
                subtitle
              }}</span>
            </div>
            <button
              type="button"
              class="rounded-full w-10 h-10 grid place-items-center hover:bg-surface-hover transition-colors shrink-0"
              @click="close"
            >
              <i class="*:size-5 text-faint-text" v-html="icons.times" />
            </button>
          </div>

          <!-- Content -->
          <div :class="fill ? 'flex-1 flex flex-col overflow-hidden min-h-0' : 'flex-1 overflow-y-auto'">
            <slot />
          </div>
        </div>
      </Transition>
    </template>
  </Teleport>
</template>
