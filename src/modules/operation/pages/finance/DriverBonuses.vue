<template>
  <div class="p-6">
 
    <div class="flex items-center mb-4">
      <!-- Tab Toggle -->
      <div class="flex items-center gap-2 mr-4">
        <button
          @click="activeTab = 'pending'"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            activeTab === 'pending' ? 'bg-brightBlue text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
          ]"
        >
          Pending
        </button>
        <button
          @click="activeTab = 'history'"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            activeTab === 'history' ? 'bg-brightBlue text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
          ]"
        >
          History
        </button>
      </div>
      <!-- Date Filter -->
      <div class="flex items-center gap-2">
        <button
          class="px-5 py-[4px] rounded-[5px] text-sm font-medium leading-normal cursor-pointer"
          :class="{ 'bg-surface-light/50 text-black': dateFilter === 'today', 'bg-transparent text-content-subtle hover:bg-surface-light/50': dateFilter !== 'today' }"
          @click="dateFilter = 'today'"
        >
          Day
        </button>
        <button
          class="px-5 py-[4px] rounded-[5px] text-sm font-medium leading-normal cursor-pointer"
          :class="{ 'bg-surface-light/50 text-black': dateFilter === 'week', 'bg-transparent text-content-subtle hover:bg-surface-light/50': dateFilter !== 'week' }"
          @click="dateFilter = 'week'"
        >
          Week
        </button>
        <button
          class="px-5 py-[4px] rounded-[5px] text-sm font-medium leading-normal cursor-pointer"
          :class="{ 'bg-surface-light/50 text-black': dateFilter === 'month', 'bg-transparent text-content-subtle hover:bg-surface-light/50': dateFilter !== 'month' }"
          @click="dateFilter = 'month'"
        >
          Month
        </button>
        <button
          class="px-5 py-[4px] rounded-[5px] text-sm font-medium leading-normal cursor-pointer"
          :class="{ 'bg-surface-light/50 text-black': dateFilter === '', 'bg-transparent text-content-subtle hover:bg-surface-light/50': dateFilter !== '' }"
          @click="dateFilter = ''"
        >
          All
        </button>
      </div>
    </div>
    <!-- Table Component -->
    <component
      :is="activeTab === 'pending' ? PendingBonusesTable : BonusHistoryTable"
      @action="handleAction"
      ref="tableRef"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineEmits, defineExpose } from 'vue';
import PendingBonusesTable from '@/modules/operation/components/finance/PendingBonusesTable.vue';
import BonusHistoryTable from '@/modules/operation/components/finance/BonusHistoryTable.vue';

const emit = defineEmits(['action']);

const activeTab = ref('pending');
const dateFilter = ref('');

const tableRef = ref<any>(null);

const handleAction = (payload: any) => {
  emit('action', payload);
};

// When tab or date filter changes, trigger a refetch on the child table if it exists
watch([activeTab, dateFilter], () => {
  if (tableRef.value && typeof tableRef.value.refetch === 'function') {
    tableRef.value.refetch();
  }
});

// Expose a manual refetch for parent components if needed
defineExpose({
  refetch: () => {
    if (tableRef.value && typeof tableRef.value.refetch === 'function') {
      tableRef.value.refetch();
    }
  },
});
</script>
