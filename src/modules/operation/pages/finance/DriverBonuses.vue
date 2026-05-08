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
      <PendingBonusesTable v-if="currentTab === 'pending'" ref="pendingTableRef" @action="handleAction" />
      <BonusHistoryTable v-else-if="currentTab === 'history'" ref="historyTableRef" @action="handleAction" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import PendingBonusesTable from '@/modules/operation/components/finance/PendingBonusesTable.vue';
import BonusHistoryTable from '@/modules/operation/components/finance/BonusHistoryTable.vue';
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { useToastStore } from "@/store/toastStore";
import { openModal } from "@customizer/modal-x";
import { collect_bonus } from "../../api/operation.api";

const route = useRoute();
const router = useRouter();
const toast = useToastStore();
const queryClient = useQueryClient();
const pendingTableRef = ref<any>(null);
const historyTableRef = ref<any>(null);
const isCollecting = ref(false);

const tabs = [
  { id: 'pending', name: 'Pending Bonuses' },
  { id: 'history', name: 'Bonus History' },
];

const currentTab = ref((route.query.tab as string) || tabs[0].id);

// Sync tab state with URL query
watch(currentTab, (newTab) => {
  router.replace({ query: { ...route.query, tab: newTab } });
});

const collectMutation = useMutation({
  mutationFn: (id: string) => collect_bonus(id),
  onSuccess: () => {
    toast.success("Bonus collected successfully!");
    queryClient.invalidateQueries({ queryKey: ["pending-bonuses-list"] });
    queryClient.invalidateQueries({ queryKey: ["bonus-history-list"] });
    pendingTableRef.value?.refetch();
    historyTableRef.value?.refetch();
  },
  onError: (error: any) => {
    toast.error(error.response?.data?.message || "Failed to collect bonus");
  },
});

const handleAction = async ({ row, action }: any) => {
  if (action === 'collect') {
    const confirmed = await openModal("ConfirmationModal", {
      title: "Collect Bonus",
      message: `Are you sure you want to mark the bonus of ${row.amount} for ${row.driver?.firstName} as collected?`,
      variant: "primary",
      confirmLabel: "Collect",
    });

    if (confirmed) {
      collectMutation.mutate(row._id);
    }
  } else if (action === 'view') {
    console.log(`View bonus details for:`, row);
  }
};
</script>
