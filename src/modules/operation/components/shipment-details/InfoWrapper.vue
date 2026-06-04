<template>
  <div
    class="flex md:flex-col gap-4 bg-grey-50/10 p-2! lg:p-0 dark:bg-surface dark:lg:p-3 rounded-2xl shadow border border-gray-100 lg:border-none dark:lg:border dark:border-line lg:border-transparent"
  >
    <div
      class="bg-surface-muted dark:bg-surface-hover flex items-center justify-between px-2 lg:px-4 py-2.5 rounded-2xl"
    >
      <h2 class="text-base font-bold lg:font-semibold lg:text-xl">
        {{ title }}
      </h2>
      <slot name="title-extra" />
    </div>
    <div class="px-4">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>
