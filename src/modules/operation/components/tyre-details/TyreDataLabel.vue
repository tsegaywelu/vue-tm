<template>
  <div class="flex flex-col gap-1">
    <span class="text-xs lg:text-sm text-grey-500 font-medium">{{ label }}</span>
    <span class="text-sm lg:text-base font-semibold text-grey-900">{{ value || '-' }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  value?: string | number | null;
}>();
</script>
