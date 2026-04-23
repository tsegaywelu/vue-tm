<template>
  <div class="flex flex-col gap-4">
    <!-- Tab Navigation -->
    <nav class="flex space-x-4 border-b border-gray-200 pb-0">
      <button
        @click="switchTab('driverAdvances')"
        :class="[
          'relative py-3 px-5 font-medium text-sm transition duration-200 ease-in-out cursor-pointer',
          currentTab === 'driverAdvances'
            ? 'text-gray-900'
            : 'text-gray-500 hover:text-gray-700',
        ]"
      >
        <i class="mdi mdi-account-outline mr-2"></i>
        Driver Advance Payments
        <span
          v-if="currentTab === 'driverAdvances'"
          class="absolute left-0 right-0 bottom-0 h-0.5 bg-primary"
        ></span>
      </button>
      <button
        @click="switchTab('transporterAdvances')"
        :class="[
          'relative py-3 px-5 font-medium text-sm transition duration-200 ease-in-out cursor-pointer',
          currentTab === 'transporterAdvances'
            ? 'text-gray-900'
            : 'text-gray-500 hover:text-gray-700',
        ]"
      >
        <i class="mdi mdi-truck-outline mr-2"></i>
        Transporter Advance Payments
        <span
          v-if="currentTab === 'transporterAdvances'"
          class="absolute left-0 right-0 bottom-0 h-0.5 bg-primary"
        ></span>
      </button>
    </nav>

    <!-- Tab Content -->
    <AdvanceTable
      v-if="currentTab === 'driverAdvances'"
      url="/advance-payment"
      pagination-id="driver-advance-list"
    />
    <AdvanceTable
      v-if="currentTab === 'transporterAdvances'"
      url="/pre-payment"
      pagination-id="transporter-advance-list"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import AdvanceTable from "../components/AdvanceTable.vue";

const route = useRoute();
const router = useRouter();

const currentTab = ref<string>(
  (route.query.tab as string) || "driverAdvances",
);

const switchTab = (tab: string) => {
  currentTab.value = tab;
  router.push({ query: { ...route.query, tab } });
};

// Sync tab from URL changes
watch(
  () => route.query.tab,
  (newTab) => {
    if (newTab && typeof newTab === "string") {
      currentTab.value = newTab;
    }
  },
);
</script>
