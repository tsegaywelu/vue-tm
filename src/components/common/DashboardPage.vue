<template>
  <div
    class="flex flex-col mg:gap-2 sm:gap-4 px-2 py-1 sm:px-5 sm:py-4 bg-white rounded-3xl max-w-500 mx-auto min-h-screen animate-fade-in"
  >
    <div class="flex items-center justify-between gap-3">
      <!-- Left: title + description -->
      <div class="flex flex-col min-w-0">
        <h1 v-if="title" class="text-xl sm:text-2xl font-bold text-gray-800">
          {{ title }}
        </h1>
        <p v-if="description" class="text-gray-600 text-sm">
          {{ description }}
        </p>
      </div>
      <!-- Right: icon buttons + full action buttons, all in one row -->
      <div class="flex items-center gap-2 shrink-0">
        <div id="page-title-actions" class="flex items-center gap-1"></div>
        <div id="page-actions" class="flex flex-wrap items-center gap-2"></div>
      </div>
    </div>

    <!-- Global Tabs -->
    <template v-if="tabs && tabs.length > 0">
      <Teleport
        :to="route.meta?.tabsTeleportTo"
        v-if="route.meta?.tabsTeleportTo"
        defer
      >
        <div
          class="flex items-center gap-3 overflow-x-auto no-scrollbar whitespace-nowrap border-b border-gray-200 mb-2"
        >
          <Tabs :tabs="tabs" v-model="activeTab" />
        </div>
      </Teleport>
      <div
        v-else
        class="flex items-center gap-3 overflow-x-auto no-scrollbar whitespace-nowrap border-b border-gray-200"
      >
        <Tabs :tabs="tabs" v-model="activeTab" />
      </div>
    </template>

    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import Tabs from "./Tabs.vue";

const route = useRoute();
const router = useRouter();

const title = computed(() => route.meta.title as string);
const description = computed(() => route.meta.description as string);
const tabs = computed(() => route.meta.tabs as any[]);

const activeTab = computed({
  get: () => (route.query.tab as string) || tabs.value?.[0]?.value,
  set: (val) => {
    router.replace({ query: { ...route.query, tab: val } });
  },
});
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
