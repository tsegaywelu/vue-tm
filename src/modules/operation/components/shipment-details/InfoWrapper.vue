<template>
  <div class="flex flex-col gap-4 bg-white lg:bg-transparent p-4 lg:p-0 rounded-2xl shadow lg:shadow-none border lg:border-none border-gray-100 lg:border-transparent">
    <h2 class="bg-[#F8F8F8] text-base font-bold lg:font-semibold lg:text-xl px-2 lg:px-4 py-2.5 rounded-2xl">
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
