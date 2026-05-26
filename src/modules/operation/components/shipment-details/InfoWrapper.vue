<template>
  <div
    class="flex flex-col gap-4 bg-grey-50/10 p-2! lg:p-0 rounded-2xl shadow border lg:border-none border-gray-100 lg:border-transparent"
  >
    <div
      class="bg-[#F8F8F8] flex items-center justify-between px-2 lg:px-4 py-2.5 rounded-2xl"
    >
      <h2 class="text-base font-bold lg:font-semibold lg:text-xl">
        {{ title }}
      </h2>
      <slot name="title-extra" />
    </div>
    <div class="px-1 sm:px-4">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>
