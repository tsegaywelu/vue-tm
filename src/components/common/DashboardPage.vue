<template>
  <div
    class="flex flex-col gap-4 px-5 py-4 bg-white rounded-3xl max-w-[2000px] mx-auto min-h-screen animate-fade-in"
  >
    <div class="flex justify-between items-center">
      <div class="flex flex-col">
        <h1 v-if="title" class="text-2xl font-bold text-gray-800">
          {{ title }}
        </h1>
        <p v-if="description" class="text-gray-600">
          {{ description }}
        </p>
      </div>
      <div id="page-actions" class="flex items-center gap-4">
        <!-- Teleport target for page-specific actions -->
      </div>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const title = computed(() => route.meta.title as string);
const description = computed(() => route.meta.description as string);
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
