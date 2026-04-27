<template>
  <div class="flex flex-col gap-0.5">
    <span class="text-sm lg:text-base text-[#666D80]">{{ label }}</span>
    <span class="font-bold text-sm lg:text-base text-gray-900">{{ value || '-' }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  value?: string | number | null;
}>();
</script>
