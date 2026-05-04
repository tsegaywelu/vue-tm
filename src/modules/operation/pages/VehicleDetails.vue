<template>
  <Teleport defer to="#page-actions">
    <Button
      variant="primary"
      size="md"
      @click="$router.push(`/vehicles/edit/${vehicleId}`)"
    >
      Edit Vehicle
    </Button>
  </Teleport>
  <div v-if="isLoading" class="flex justify-center py-20">
    <i class="mdi mdi-loading mdi-spin text-4xl text-primary"></i>
  </div>

  <div v-else-if="vehicle" class="flex flex-col gap-6">
    <!-- Header Info Card -->
    <div
      class="bg-grey-25 rounded-[32px] p-6 md:p-10 border border-grey-100 flex flex-col md:flex-row items-center justify-between gap-8"
    >
      <div class="flex items-center gap-8">
        <div
          class="size-24 md:size-32 rounded-full bg-white flex items-center justify-center shadow-lg border border-grey-100 p-4"
        >
          <div class="text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
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
        <div class="flex flex-col gap-1">
          <h2
            class="text-3xl md:text-4xl font-black text-grey-900 tracking-tight"
          >
            {{ vehicle.plateNumber }}
          </h2>
          <div class="flex items-center gap-2">
            <span
              class="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase"
              >{{ vehicle.vehicleType?.name }}</span
            >
            <span
              class="px-3 py-1 bg-grey-100 text-grey-600 text-xs font-bold rounded-full uppercase"
              >{{ vehicle.ownership }}</span
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
