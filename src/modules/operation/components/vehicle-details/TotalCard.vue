<template>
  <div class="bg-surface rounded-2xl p-4 shadow-sm border border-grey-100 flex flex-col gap-1">
    <span class="text-xs font-medium text-grey-500 uppercase tracking-wider">{{ label }}</span>
    <span class="text-lg font-bold text-primary">{{ value }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  value: string;
}>();
</script>
