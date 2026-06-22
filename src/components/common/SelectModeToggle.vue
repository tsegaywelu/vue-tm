<template>
  <!-- Inside a MobileTableOptions sheet: render as an action row at the top of the
       options (only while the sheet is open, since its content is v-if-mounted). -->
  <Teleport
    v-if="registry.mounted && registry.open"
    :to="`#${registry.actionsId}`"
    defer
  >
    <button
      class="flex items-center gap-3 px-4 py-3.5 hover:bg-surface-hover transition-colors text-left"
      @click="toggle"
    >
      <i class="*:size-5 shrink-0 text-gray-500" v-html="icons.circleCheck"></i>
      <div class="flex flex-col flex-1">
        <span class="font-medium text-gray-900">
          {{ modelValue ? activeLabel : inactiveLabel }}
        </span>
        <span class="text-xs text-gray-400 mt-0.5">
          {{ modelValue ? "Tap to show row actions" : "Pick rows to print" }}
        </span>
      </div>
    </button>
  </Teleport>

  <!-- No MobileTableOptions on the page: fall back to a header icon button. -->
  <Teleport v-else-if="!registry.mounted" to="#page-title-actions" defer>
    <button
      class="sm:hidden size-8 rounded-xl border border-line flex items-center justify-center transition-colors"
      :class="modelValue ? 'bg-primary/10 text-primary border-primary/30' : 'text-faint-text hover:bg-surface-hover'"
      :title="modelValue ? activeLabel : inactiveLabel"
      @click="toggle"
    >
      <i class="*:size-4" v-html="icons.circleCheck"></i>
    </button>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { icons } from "@/utils/icons";
import {
  registerTableAction,
  useMobileTableOptions,
} from "@/composables/useMobileTableOptions";

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    activeLabel?: string;
    inactiveLabel?: string;
  }>(),
  {
    activeLabel: "Show actions",
    inactiveLabel: "Select rows",
  },
);

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const registry = useMobileTableOptions();

let unregister: (() => void) | undefined;
onMounted(() => {
  unregister = registerTableAction();
});
onUnmounted(() => {
  unregister?.();
});

const toggle = () => emit("update:modelValue", !props.modelValue);
</script>
