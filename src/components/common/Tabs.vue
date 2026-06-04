<template>
  <nav
    class="flex items-center p-0.5 space-x-2 overflow-x-auto no-scrollbar whitespace-nowrap"
  >
    <button
      v-for="tab in tabs"
      :key="tab.value"
      class="relative py-2 px-4 active:shadow-none! font-medium text-sm transition duration-200 ease-in-out cursor-pointer flex items-center gap-2"
      :class="[
        modelValue === tab.value
          ? 'text-base-text shadow-primary shadow-[0_2px_0px_rgba(0,0,0,0.1)]'
          : 'text-dim-text hover:text-base-text',
      ]"
      @click="$emit('update:modelValue', tab.value)"
    >
      <i v-if="tab.icon" v-html="tab.icon" class="size-4 shrink-0" />
      {{ tab.label }}
    </button>
  </nav>
</template>

<script setup lang="ts">
defineProps<{
  tabs: { label: string; value: string; icon?: string }[];
  modelValue: string;
}>();

defineEmits(["update:modelValue"]);
</script>
