<template>
  <div class="h-full flex flex-col gap-4">
    <div v-if="isLoading" class="flex justify-center py-20">
      <i class="mdi mdi-loading mdi-spin text-4xl text-primary"></i>
    </div>

    <template v-else-if="transfer">
      <!-- Header Section -->
      <div
        class="bg-white flex flex-col md:flex-row md:items-center justify-between px-3 md:px-4 py-4 md:py-3 rounded-[20px] gap-4 shadow-sm border border-gray-100"
      >
        <div class="flex flex-col gap-2 flex-1">
          <div class="flex items-center gap-4">
            <div class="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <i class="mdi mdi-swap-horizontal text-2xl"></i>
            </div>
            <div>
              <h1 class="font-bold text-2xl leading-tight text-gray-900 uppercase">
                GRIV #{{ transfer.referenceNumber || '-------' }}
              </h1>
              <div class="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                <span class="text-sm text-gray-600">
                  Type:
                  <span class="font-bold text-black text-sm ml-1">
                    {{ transfer.type === 'RECEIVE' ? 'Receiving' : 'Issue' }}
                  </span>
                </span>
                <span class="text-sm text-gray-600">
                  Date:
                  <span class="font-bold text-black text-sm ml-1">
                    {{ transfer.createdAt ? dateFormatter(transfer.createdAt) : '-' }}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-row items-center justify-between md:justify-end gap-3 md:gap-4">
          <div class="flex flex-row lg:flex-col items-start md:items-end gap-1 md:gap-2">
            <Status :variant="transfer.status" type="wrapped">
              {{ transfer.status?.replace(/_/g, " ") }}
            </Status>
          </div>
          <div class="flex gap-2">
            <Button
              v-if="transfer.status === 'PENDING'"
              variant="outline"
              size="md"
              @click="$router.push(`/inventory/good-transfer/edit/${transferId}`)"
            >
              Edit
            </Button>
            <Button
              variant="primary"
              size="md"
              @click="handlePrint"
            >
              <template #leading>
                <i class="mdi mdi-printer text-lg"></i>
              </template>
              Print
            </Button>
          </div>
        </div>
      </div>

      <div id="good-transfer-details-tabs" class="w-full mt-2"></div>

      <div class="flex-1 min-h-0 overflow-y-auto">
        <component
          :is="activeTabComponent"
          :transfer="transfer"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import { fetch_good_transfer_details } from "../../api/inventory.api";
import Status from "@/components/common/Status.vue";
import Button from "@/components/Button.vue";
import { dateFormatter } from "@/utils/utils";

// Tabs
import GoodTransferOverviewTab from "../../components/inventory/GoodTransferOverviewTab.vue";

const route = useRoute();
const transferId = route.params.id as string;

const tabs = computed(() => (route.meta.tabs || []) as any[]);
const activeTab = computed(
  () => (route.query.tab as string) || (tabs.value?.[0]?.value as string) || "overview",
);

const { data: response, isLoading } = useQuery({
  queryKey: ["good-transfer", transferId],
  queryFn: () => fetch_good_transfer_details(transferId),
  enabled: !!transferId,
});

const transfer = computed(() => response.value?.data);

const activeTabComponent = computed(() => {
  switch (activeTab.value) {
    case "overview":
      return GoodTransferOverviewTab;
    default:
      return GoodTransferOverviewTab;
  }
});

const handlePrint = () => {
  window.print();
};
</script>
