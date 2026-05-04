<template>
  <div class="bg-white rounded-2xl p-4 shadow-sm border border-grey-100 flex flex-col gap-1">
    <span class="text-xs font-medium text-grey-500 uppercase tracking-wider">{{ label }}</span>
    <span class="text-sm font-bold text-grey-900">{{ value || 'N/A' }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  value: any;
}>();
</script>
