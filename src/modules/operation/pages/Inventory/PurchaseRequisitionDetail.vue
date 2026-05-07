<template>
  <div class="h-full flex flex-col gap-4">
    <div v-if="isLoading" class="flex justify-center py-20">
      <i class="mdi mdi-loading mdi-spin text-4xl text-primary"></i>
    </div>

    <div id="purchase-requisition-details-tabs" class="w-full mt-2"></div>

    <template v-if="!isLoading && requisition">
      <!-- Header Section -->
      <div
        class="bg-white flex flex-col md:flex-row md:items-center justify-between px-3 md:px-4 py-4 md:py-3 rounded-[20px] gap-4 shadow-sm border border-gray-100"
      >
        <div class="flex flex-col gap-2 flex-1">
          <div class="flex items-center gap-4">
            <div class="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <i class="mdi mdi-file-document-edit-outline text-2xl"></i>
            </div>
            <div>
              <h1 class="font-bold text-2xl leading-tight text-gray-900 uppercase">
                PR #{{ requisition.referenceNumber || '-------' }}
              </h1>
              <div class="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                <span class="text-sm text-gray-600">
                  Carrier:
                  <span class="font-bold text-black text-sm ml-1">
                    {{ requisition.carrier?.name || '-' }}
                  </span>
                </span>
                <span class="text-sm text-gray-600">
                  Date:
                  <span class="font-bold text-black text-sm ml-1">
                    {{ requisition.date ? dateFormatter(requisition.date) : '-' }}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-row items-center justify-between md:justify-end gap-3 md:gap-4">
          <div class="flex flex-row lg:flex-col items-start md:items-end gap-1 md:gap-2">
            <Status :variant="requisition.status" type="wrapped">
              {{ requisition.status?.replace(/_/g, " ") }}
            </Status>
          </div>
          <div class="flex gap-2">
            <Button
              v-if="requisition.status === 'PENDING'"
              v-permission="'PURCHASE_REQUISITION:update'"
              variant="outline"
              size="md"
              @click="$router.push(`/inventory/purchase-requisition/edit/${requisitionId}`)"
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

      <div class="flex-1 min-h-0 overflow-y-auto">
        <component
          :is="activeTabComponent"
          :requisition="requisition"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import { fetch_purchase_requisition_details } from "../../api/inventory.api";
import Status from "@/components/common/Status.vue";
import Button from "@/components/Button.vue";
import { useAuthStore } from "@/store/authStore";
import { printPurchaseRequisition } from "../../utils/printPurchaseRequisition";
import { dateFormatter } from "@/utils/utils";

// Tabs
import PurchaseRequisitionOverviewTab from "../../components/inventory/PurchaseRequisitionOverviewTab.vue";

const route = useRoute();
const authStore = useAuthStore();
const requisitionId = route.params.id as string;

const tabs = computed(() => (route.meta.tabs || []) as any[]);
const activeTab = computed(
  () => (route.query.tab as string) || (tabs.value?.[0]?.value as string) || "overview",
);

const { data: response, isLoading } = useQuery({
  queryKey: ["purchase-requisition", requisitionId],
  queryFn: () => fetch_purchase_requisition_details(requisitionId),
  enabled: !!requisitionId,
});

const requisition = computed(() => response.value?.data);

const activeTabComponent = computed(() => {
  switch (activeTab.value) {
    case "overview":
      return PurchaseRequisitionOverviewTab;
    default:
      return PurchaseRequisitionOverviewTab;
  }
});

const handlePrint = () => {
  if (!requisition.value) return;
  printPurchaseRequisition(requisition.value, authStore.user);
};
</script>
