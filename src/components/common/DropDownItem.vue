<template>
  <button
    class="w-full flex items-center gap-2 text-left px-3 py-2 text-sm font-medium rounded-lg transition-colors"
    :class="[
      variant === 'danger'
        ? 'hover:bg-red-50 text-red-600'
        : 'hover:bg-surface-hover text-base-text',
      $attrs.class
    ]"
    @click="$emit('click', $event)"
  >
    <i
      v-if="icon"
      class="flex justify-center items-center *:size-4.5"
      v-html="icon"
    ></i>
    <span class="flex-1 min-w-0 truncate">
      <slot>{{ label }}</slot>
    </span>
  </button>
</template>

<script setup lang="ts">
export interface DropDownItemProps {
  icon?: string;
  label?: string;
  variant?: "default" | "danger";
}

withDefaults(defineProps<DropDownItemProps>(), {
  variant: "default",
});

defineEmits(["click"]);
</script>
