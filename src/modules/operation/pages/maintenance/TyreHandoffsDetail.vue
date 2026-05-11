<template>
  <div class="h-full flex flex-col gap-4">
    <!-- Tab container must be always present for Teleport to work reliably -->
    <div id="tyre-handoff-details-tabs" class="w-full"></div>

    <div v-if="isLoading" class="flex justify-center py-20">
      <i class="mdi mdi-loading mdi-spin text-4xl text-primary"></i>
    </div>

    <div id="tyre-handoff-details-tabs" class="w-full mt-2"></div>

    <template v-else-if="handoff">
      <!-- Header Section -->
      <div
        class="bg-white flex flex-col md:flex-row md:items-center justify-between px-3 md:px-4 py-4 md:py-3 rounded-[20px] gap-4 shadow-sm border border-gray-100"
      >
        <div class="flex flex-col gap-2 flex-1">
          <div class="flex items-center gap-4">
            <div class="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <i class="mdi mdi-tire text-2xl"></i>
            </div>
            <div>
              <h1 class="font-bold text-2xl leading-tight text-gray-900">
                Tyre Handoff #{{ handoff.serialNumber || '-------' }}
              </h1>
              <div class="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                <span class="text-sm text-gray-600">
                  Event:
                  <span :class="getEventTypeClass(handoff.eventType)" class="ml-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                    {{ formatStatus(handoff.eventType) }}
                  </span>
                </span>
                <span class="text-sm text-gray-600" v-if="handoff.assignedTo">
                  Assigned To:
                  <span class="font-bold text-black text-sm ml-1">
                    {{ handoff.assignedTo?.username }}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-row items-center justify-between md:justify-end gap-3 md:gap-4">
          <div class="flex flex-row lg:flex-col items-start md:items-end gap-1 md:gap-2">
            <Status :variant="getStatusVariant(handoff.status)" type="wrapped">
              {{ handoff.status || 'PENDING' }}
            </Status>
          </div>
          <div class="flex gap-2">
            <Button
              v-if="handoff.status === 'PENDING'"
              variant="primary"
              size="md"
              @click="handleAssign"
            >
              Assign
            </Button>
            <Button
              variant="outline"
              size="md"
              @click="$router.push('/maintenance/tyre-handoffs')"
            >
              Back to List
            </Button>
          </div>
        </div>
      </div>

      <div class="flex-1 min-h-0 overflow-y-auto">
        <component
          :is="activeTabComponent"
          :key="activeTab"
          :handoff="handoff"
          @refresh="refetch"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import { fetch_tyre_handoff_by_id } from "../../api/tyre-handoff.api";
import type { TyreHandoff } from "../../operation.types";
import Status from "@/components/common/Status.vue";
import Button from "@/components/Button.vue";
import { dateFormatter, formatStatus } from "@/utils/utils";

// Tabs
import TyreHandoffOverviewTab from "../../components/maintenance/TyreHandoffOverviewTab.vue";

const route = useRoute();
const handoffId = route.params.id as string;

const tabs = computed(() => (route.meta.tabs || []) as any[]);
const activeTab = computed(
  () => (route.query.tab as string) || (tabs.value?.[0]?.value as string) || "overview",
);

const { data: response, isLoading, refetch } = useQuery({
  queryKey: ["tyre-handoff", handoffId],
  queryFn: () => fetch_tyre_handoff_by_id(handoffId),
  enabled: !!handoffId,
});

const handoff = computed(() => response.value?.data as TyreHandoff);

const activeTabComponent = computed(() => {
  switch (activeTab.value) {
    case "overview":
      return TyreHandoffOverviewTab;
    default:
      return TyreHandoffOverviewTab;
  }
});

const getStatusVariant = (status?: string) => {
  switch (status) {
    case "PENDING": return "pending";
    case "IN_PROGRESS": return "active";
    case "COMPLETED": return "completed";
    case "FAILED":
    case "CANCELLED": return "cancelled";
    default: return "pending";
  }
};

const getEventTypeClass = (eventType?: string) => {
  const classes: Record<string, string> = {
    ISSUE_TO_MAINTENANCE: "bg-purple-100 text-purple-800",
    INSTALL_ON_VEHICLE: "bg-green-100 text-green-800",
    REMOVE_FROM_VEHICLE: "bg-orange-100 text-orange-800",
    RETURN_TO_STORE: "bg-blue-100 text-blue-800",
    REISSUE_FROM_STORE: "bg-indigo-100 text-indigo-800",
    TRANSFER_VEHICLE_TO_VEHICLE: "bg-cyan-100 text-cyan-800",
    DECOMMISSION: "bg-red-100 text-red-800",
    CANCELLED: "bg-gray-100 text-gray-800",
    FAILED: "bg-red-100 text-red-800",
  };
  return eventType && classes[eventType] ? classes[eventType] : "bg-gray-100 text-gray-800";
};

const handleAssign = () => {
  // Logic for assignment modal/action
};
</script>
