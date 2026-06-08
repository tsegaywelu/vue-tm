<template>
  <Teleport defer to="#page-actions">
    <Button
      v-permission="'VEHICLE:update'"
      variant="primary"
      size="md"
      class="hidden sm:flex"
      @click="$router.push(`/vehicles/edit/${vehicleId}`)"
    >
      Edit Vehicle 
    </Button>
  </Teleport>

  <!-- Tab target — always rendered so Teleport can find it -->
  <div id="vehicle-details-tabs"></div>

  <div v-if="isLoading" class="flex justify-center py-20">
    <i class="mdi mdi-loading mdi-spin text-4xl text-primary"></i>
  </div>

  <div v-else-if="vehicle" class="flex flex-col gap-6">
    <!-- Header Info Card -->
    <div
      class="bg-grey-25 rounded-[32px] p-4 md:p-10 border border-grey-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-8"
    >
      <div class="flex items-center gap-4 md:gap-8">
        <div
          class="size-16 md:size-32 rounded-full bg-surface flex items-center justify-center shadow-lg border border-grey-100 shrink-0"
        >
          <div class="text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-8 h-8 md:w-16 md:h-16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="1" y="3" width="15" height="13" rx="2" ry="2" />
              <rect x="16" y="8" width="6" height="8" rx="2" ry="2" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
          </div>
        </div>
        <div class="flex flex-col gap-1 min-w-0">
          <h2
            class="text-xl md:text-4xl font-black text-grey-900 tracking-tight truncate"
          >
            {{ vehicle.plateNumber }}
          </h2>
          <div class="flex flex-wrap items-center gap-2">
            <span
              class="px-2 py-0.5 md:px-3 md:py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase"
              >{{ vehicle.vehicleType?.name }}</span
            >
            <span
              class="px-2 py-0.5 md:px-3 md:py-1 bg-grey-100 text-grey-600 text-xs font-bold rounded-full uppercase"
              >{{ vehicle.ownership }}</span
            >
            <span
              v-if="vehicle.operationalRole"
              class="px-2 py-0.5 md:px-3 md:py-1 text-xs font-bold rounded-full uppercase"
              :class="{
                'bg-blue-100 text-blue-700': vehicle.operationalRole === 'SHIPMENT',
                'bg-amber-100 text-amber-700': vehicle.operationalRole === 'NON_SHIPMENT',
                'bg-purple-100 text-purple-700': vehicle.operationalRole === 'BOTH',
              }"
              >{{ vehicle.operationalRole.replace('_', ' ') }}</span
            >
          </div>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <Status
          :variant="vehicle.status"
          type="wrapped"
          :label="vehicle.status"
        />
      </div>
    </div>

    <!-- Tab Content -->
    <div class="transition-all duration-300">
      <component :is="activeTabComponent" :vehicle="vehicle" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import Button from "@/components/common/Button.vue";
import Status from "@/components/common/Status.vue";
import InfoWrapper from "../components/shipment-details/InfoWrapper.vue";
import { fetch_vehicle_by_id } from "../api/operation.api";

// Tabs
import BasicDetailsTab from "../components/vehicle-details/BasicDetailsTab.vue";
import DocumentsTab from "../components/vehicle-details/DocumentsTab.vue";
import ShipmentsTab from "../components/vehicle-details/ShipmentsTab.vue";
import InsuranceTab from "../components/vehicle-details/InsuranceTab.vue";
import FuelTab from "../components/vehicle-details/FuelTab.vue";
import DriverHistoryTab from "../components/vehicle-details/DriverHistoryTab.vue";
import TyreHistoryTab from "../components/vehicle-details/TyreHistoryTab.vue";
import VehicleFuelEntriesTab from "../components/vehicle-details/VehicleFuelEntriesTab.vue";
import VehicleMeterEntriesTab from "../components/vehicle-details/VehicleMeterEntriesTab.vue";
import VehicleExpensesTab from "../components/vehicle-details/VehicleExpensesTab.vue";
import VehicleRecurringRulesTab from "../components/vehicle-details/VehicleRecurringRulesTab.vue";

const route = useRoute();
const router = useRouter();
const vehicleId = route.params.id as string;

const { data: vehicleData, isLoading } = useQuery({
  queryKey: ["vehicle", vehicleId],
  queryFn: () => fetch_vehicle_by_id(vehicleId),
});

const vehicle = computed(() => vehicleData.value?.data);

const tabs = computed(() => (route.meta.tabs || []) as any[]);
const activeTab = computed(() => {
  return (
    (route.query.tab as string) || (tabs.value?.[0]?.value as string) || "basic"
  );
});

const tabComponents: Record<string, any> = {
  basic: BasicDetailsTab,
  documents: DocumentsTab,
  shipments: ShipmentsTab,
  insurance: InsuranceTab,
  fuel: FuelTab,
  drivers: DriverHistoryTab,
  tyres: TyreHistoryTab,
  "fuel-entries": VehicleFuelEntriesTab,
  "meter-entries": VehicleMeterEntriesTab,
  "vehicle-expenses": VehicleExpensesTab,
  "recurring-rules": VehicleRecurringRulesTab,
};

const activeTabComponent = computed(() => {
  return tabComponents[activeTab.value];
});

const activeTabLabel = computed(() => {
  return (
    tabs.value?.find((t) => t.value === activeTab.value)?.label || "Details"
  );
});
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
