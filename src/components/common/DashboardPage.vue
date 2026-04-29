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

    <!-- Global Tabs -->
    <template v-if="tabs && tabs.length > 0">
      <Teleport
        :to="route.meta.tabsTeleportTo"
        v-if="route.meta.tabsTeleportTo"
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
