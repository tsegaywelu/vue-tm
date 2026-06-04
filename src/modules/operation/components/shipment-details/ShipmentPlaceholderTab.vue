<template>
  <div class="flex items-center justify-center h-full p-8">
    <div class="flex flex-col items-center text-center gap-4 bg-surface p-12 rounded-3xl shadow-sm border border-gray-100 max-w-md w-full">
      <div class="w-20 h-20 bg-surface-muted rounded-full flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <h3 class="text-xl font-bold text-gray-900">{{ title }}</h3>
      <p class="text-gray-500">
        This section is currently under development or awaiting data integration. Please check back later.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>
