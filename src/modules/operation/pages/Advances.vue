<template>
  <div class="flex flex-col gap-4">
    <!-- Tab Content -->
    <AdvanceTable
      v-if="activeTab === 'driverAdvances'"
      url="/advance-payment"
      pagination-id="driver-advance-list"
    />
    <AdvanceTable
      v-if="activeTab === 'transporterAdvances'"
      url="/pre-payment"
      pagination-id="transporter-advance-list"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import AdvanceTable from "../components/AdvanceTable.vue";

const route = useRoute();

const tabs = computed(() => route.meta.tabs as any[]);
const activeTab = computed(
  () => (route.query.tab as string) || (tabs.value?.[0]?.value as string),
);
</script>
