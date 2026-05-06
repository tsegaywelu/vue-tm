<template>
  <div class="flex flex-col h-full">
    <div class="mb-4 px-2">
      <nav class="flex space-x-8 border-b border-gray-200">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="currentTab = tab.id"
          :class="[
            currentTab === tab.id
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors'
          ]"
        >
          {{ tab.name }}
        </button>
      </nav>
    </div>

    <div class="flex-1 min-h-0">
      <ReceivableShipmentTable v-if="currentTab === 'shipment'" @action="handleAction" />
      <ReceivableSettlementTable v-else-if="currentTab === 'settlement'" @action="handleAction" />
      <ReceivableLeaseTable v-else-if="currentTab === 'lease'" @action="handleAction" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ReceivableShipmentTable from "../../components/finance/ReceivableShipmentTable.vue";
import ReceivableSettlementTable from "../../components/finance/ReceivableSettlementTable.vue";
import ReceivableLeaseTable from "../../components/finance/ReceivableLeaseTable.vue";

const route = useRoute();
const router = useRouter();

const tabs = [
  { id: 'shipment', name: 'Shipment' },
  { id: 'settlement', name: 'Settlement' },
  { id: 'lease', name: 'Lease' },
];

// Initialize tab from query string or default to 'shipment'
const currentTab = ref((route.query.tab as string) || tabs[0].id);

// Sync tab state with URL query to preserve on reload
watch(currentTab, (newTab) => {
  router.replace({ query: { ...route.query, tab: newTab } });
});

const handleAction = ({ row, action }: any) => {
  if (action === 'view') {
    router.push(`/operation/shipments/${row._id}`);
  } else {
    console.log(`Action: ${action} on Receivable:`, row);
  }
};
</script>
