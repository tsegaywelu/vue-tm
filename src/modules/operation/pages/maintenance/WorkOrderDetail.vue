<template>
  <div class="h-full flex flex-col gap-4">
    <div v-if="isLoading" class="flex justify-center py-20">
      <i class="mdi mdi-loading mdi-spin text-4xl text-primary"></i>
    </div>

    <template v-else-if="workOrder">
      <!-- Header Section -->
      <div
        class="bg-white flex flex-col md:flex-row md:items-center justify-between px-3 md:px-4 py-4 md:py-3 rounded-[20px] gap-4 shadow-sm border border-gray-100"
      >
        <div class="flex flex-col gap-2 flex-1">
          <div class="flex items-center gap-4">
            <div class="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <i class="mdi mdi-tools text-2xl"></i>
            </div>
            <div>
              <h1 class="font-bold text-2xl leading-tight text-gray-900 uppercase">
                Work Order #{{ workOrder._id?.slice(-6) || '-------' }}
              </h1>
              <div class="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                <span class="text-sm text-gray-600">
                  Vehicle:
                  <span class="font-bold text-black text-sm ml-1 cursor-pointer hover:underline" @click="$router.push(`/vehicles/${workOrder.vehicle?._id}`)">
                    {{ workOrder.vehicle?.plateNumber || '-------' }}
                  </span>
                </span>
                <span class="text-sm text-gray-600">
                  Start Date:
                  <span class="font-bold text-black text-sm ml-1">
                    {{ workOrder.startDate ? dateFormatter(workOrder.startDate) : '-' }}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-row items-center justify-between md:justify-end gap-3 md:gap-4">
          <div class="flex flex-row lg:flex-col items-start md:items-end gap-1 md:gap-2">
            <Status :variant="workOrder.status" type="wrapped">
              {{ formatStatus(workOrder.status) }}
            </Status>
          </div>
          <div class="flex gap-2">
            <Button
              variant="outline"
              size="md"
              @click="$router.push(`/maintenance/work-order/edit/${workOrderId}`)"
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

      <div id="work-order-details-tabs" class="w-full mt-2"></div>

      <div class="flex-1 min-h-0 overflow-y-auto">
        <component
          :is="activeTabComponent"
          :work-order="workOrder"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import { fetch_work_order_by_id } from "../../api/work-order.api";
import type { WorkOrder } from "../../operation.types";
import Status from "@/components/common/Status.vue";
import Button from "@/components/Button.vue";
import { dateFormatter, formatStatus } from "@/utils/utils";

// Tabs
import WorkOrderOverviewTab from "../../components/maintenance/WorkOrderOverviewTab.vue";
import WorkOrderTasksTab from "../../components/maintenance/WorkOrderTasksTab.vue";

const route = useRoute();
const workOrderId = route.params.id as string;

const tabs = computed(() => (route.meta.tabs || []) as any[]);
const activeTab = computed(
  () => (route.query.tab as string) || (tabs.value?.[0]?.value as string) || "overview",
);

const { data: response, isLoading } = useQuery({
  queryKey: ["work-order", workOrderId],
  queryFn: () => fetch_work_order_by_id(workOrderId),
  enabled: !!workOrderId,
});

const workOrder = computed(() => response.value?.data);

const activeTabComponent = computed(() => {
  switch (activeTab.value) {
    case "overview":
      return WorkOrderOverviewTab;
    case "tasks":
      return WorkOrderTasksTab;
    default:
      return WorkOrderOverviewTab;
  }
});

const handlePrint = () => {
  window.print();
};
</script>
