<template>
  <div class="flex flex-col gap-4 bg-surface lg:bg-transparent dark:lg:bg-surface p-4 lg:p-0 dark:lg:p-3 rounded-2xl shadow lg:shadow-none dark:shadow-sm border lg:border-none dark:lg:border border-gray-100 dark:border-line lg:border-transparent">
    <h2 class="bg-surface-muted dark:bg-surface-hover text-base font-bold lg:font-semibold lg:text-xl px-2 lg:px-4 py-2.5 rounded-2xl">
      {{ title }}
    </h2>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>
