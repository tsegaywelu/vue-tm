<template>
  <!-- Mobile trigger: teleported next to the page title (matches Shipments.vue) -->
  <Teleport to="#page-title-actions" defer>
    <button
      class="sm:hidden size-8 rounded-xl border border-line flex items-center justify-center text-faint-text hover:bg-surface-hover transition-colors"
      @click="open = true"
    >
      <i class="*:size-4" v-html="icons.filterOptions"></i>
    </button>
  </Teleport>

  <BottomSheet
    v-model="open"
    :title="registry.hasActions ? 'Options' : title || 'Search By'"
  >
    <!-- Shipment-style "Options" layout when a select/bulk action is registered.
         Action rows teleport into the landing element below, then the Search By
         options follow. When no action is registered, only the flat list shows. -->
    <div class="flex flex-col py-2">
      <template v-if="registry.hasActions">
        <div :id="registry.actionsId" class="flex flex-col"></div>
        <div class="my-1 border-t border-line"></div>
      </template>

      <div class="px-4 pt-1 pb-2">
        <span class="text-[11px] uppercase text-gray-400 font-semibold tracking-wide">
          Search By
        </span>
      </div>

      <button
        v-for="opt in options"
        :key="opt.value"
        class="flex items-center justify-between py-3 px-4 mx-2 hover:bg-surface-hover rounded-xl transition-colors text-left"
        @click="select(opt.value)"
      >
        <span class="font-medium">{{ opt.label }}</span>
        <i
          v-if="modelValue === opt.value"
          class="*:size-4 text-primary"
          v-html="icons.check"
        ></i>
      </button>
    </div>
  </BottomSheet>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";
import BottomSheet from "@/components/BottomSheet.vue";
import { icons } from "@/utils/icons";
import {
  registerMobileTableOptions,
  setMobileTableOptionsOpen,
  useMobileTableOptions,
} from "@/composables/useMobileTableOptions";

interface SearchOption {
  label: string;
  value: string;
}

const props = defineProps<{
  modelValue: string;
  options: SearchOption[];
  title?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const registry = useMobileTableOptions();
const open = ref(false);

let unregister: (() => void) | undefined;
onMounted(() => {
  unregister = registerMobileTableOptions();
});
onUnmounted(() => {
  unregister?.();
});

watch(open, (v) => setMobileTableOptionsOpen(v));

const select = (value: string) => {
  emit("update:modelValue", value);
  open.value = false;
};
</script>
