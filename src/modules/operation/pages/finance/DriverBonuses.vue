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
      <PendingBonusesTable v-if="currentTab === 'pending'" @action="handleAction" />
      <BonusHistoryTable v-else-if="currentTab === 'history'" @action="handleAction" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import PendingBonusesTable from '@/modules/operation/components/finance/PendingBonusesTable.vue';
import BonusHistoryTable from '@/modules/operation/components/finance/BonusHistoryTable.vue';

const route = useRoute();
const router = useRouter();

const tabs = [
  { id: 'pending', name: 'Pending Bonuses' },
  { id: 'history', name: 'Bonus History' },
];

const currentTab = ref((route.query.tab as string) || tabs[0].id);

// Sync tab state with URL query
watch(currentTab, (newTab) => {
  router.replace({ query: { ...route.query, tab: newTab } });
});

const handleAction = ({ row, action }: any) => {
  console.log(`Action: ${action} on Driver Bonus:`, row);
};
</script>
