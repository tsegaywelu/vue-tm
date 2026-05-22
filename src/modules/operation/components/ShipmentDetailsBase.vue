<template>
  <div class="h-full flex flex-col gap-4">
    <!-- Header Section -->
    <div
      class="bg-white flex flex-col md:flex-row md:items-center justify-between px-3 md:px-4 py-4 md:py-3 rounded-[20px] gap-4 shadow-sm border border-gray-100"
    >
      <div class="flex flex-col gap-2 flex-1">
        <h1 class="font-bold text-2xl leading-tight text-gray-900">
          {{ shipment?.route?.origin || "-------" }}, ET →
          {{ shipment?.route?.destination || "-------" }}, ET
        </h1>
        <div class="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
          <span class="text-sm text-gray-600">
            Shipment Reference
            <span class="font-bold text-black text-sm ml-1">
              {{ shipment?.shipmentCode }}
            </span>
          </span>
          <span v-if="shipment?.shipper?.name" class="text-sm text-gray-600">
            Shipper
            <span class="font-bold text-black text-sm ml-1">
              {{ shipment?.shipper?.name }}
            </span>
          </span>
          <span v-if="shipment?.orderCode" class="text-sm text-gray-600">
            Order
            <span class="font-bold text-black text-sm ml-1">
              {{ shipment?.orderCode }}
            </span>
          </span>
          <div
            class="mt-2 lg:mt-0 md:hidden flex items-center justify-between w-full"
          >
            <Status :variant="shipment?.status" type="wrapped">
              {{ formatStatus(shipment?.status) }}
            </Status>
          </div>
        </div>
      </div>

      <div
        class="flex flex-row items-center justify-between md:justify-end gap-3 md:gap-4"
      >
        <div
          class="flex flex-row lg:flex-col items-start md:items-end gap-1 md:gap-2"
        >
          <div class="hidden md:block">
            <Status :variant="shipment?.status" type="wrapped">
              {{ formatStatus(shipment?.status) }}
            </Status>
          </div>
          <span
            class="text-xs md:text-sm text-gray-600"
            v-if="shipment?.dispatchDate"
          >
            Dispatch Date
            <span class="font-bold text-black ml-1">
              {{ dateFormatter(shipment?.dispatchDate) }}
            </span>
          </span>
        </div>
        <div
          v-role="UserRoles.CARRIER"
          class="flex-1 md:flex-none justify-end flex"
        >
          <ShipmentDropdown
            :filters="dropdownFilters"
            v-if="shipment"
            :shipment="shipment"
            :on-action-complete="refetch"
          />
        </div>
      </div>
    </div>
    <div id="shipment-details-tabs" class="w-full mt-2"></div>
    <div v-if="shipment" class="flex-1 min-h-0 overflow-y-auto">
      <slot :shipment="shipment" :active-tab="activeTab" :refetch="refetch">
        <component
          :is="activeTabComponent"
          :shipment="shipment"
          v-bind="extraProps"
          @refresh="refetch"
        />
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import { fetch_shipment_details } from "../api/shipment.api";
import type { Shipment } from "@/utils/type";
import Status from "@/components/common/Status.vue";
import ShipmentDropdown from "./ShipmentDropdown.vue";
import type { ShipmentDropdownFilters } from "./ShipmentDropdown.vue";
import { dateFormatter } from "@/utils/utils";

// Import Tabs Content
import ShipmentOverviewTab from "./shipment-details/ShipmentOverviewTab.vue";
import ShipmentUploadsTab from "./shipment-details/ShipmentUploadsTab.vue";
import ShipmentPreTripInspectionsTab from "./shipment-details/ShipmentPreTripInspectionsTab.vue";
import ShipmentSettlementsTab from "./shipment-details/ShipmentSettlementsTab.vue";
import ShipmentEmptyReturnTab from "./shipment-details/ShipmentEmptyReturnTab.vue";
import { UserRoles } from "../operation.types";

const props = defineProps<{
  tabs?: any[];
  tabsTeleportTo?: string;
  dropdownFilters?: ShipmentDropdownFilters;
  extraProps?: Record<string, any>;
}>();

const route = useRoute();
const shipmentId = route.params.id as string;

const tabs = computed(() => props.tabs || (route.meta.tabs as any[]));
const tabsTeleportTo = computed(
  () =>
    props.tabsTeleportTo ||
    (route.meta.tabsTeleportTo as string) ||
    "#shipment-details-tabs",
);

const activeTab = computed(
  () => (route.query.tab as string) || (tabs.value?.[0]?.value as string),
);

const { data: shipmentResponse, refetch } = useQuery({
  queryKey: ["shipment", shipmentId],
  queryFn: () => fetch_shipment_details(shipmentId),
  enabled: computed(() => !!shipmentId && shipmentId !== "add"),
});

const shipment = computed(
  () => shipmentResponse.value?.data as Shipment | undefined,
);

const formatStatus = (status?: string) => {
  if (!status) return "-";
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

const activeTabComponent = computed(() => {
  switch (activeTab.value) {
    case "overview":
      return ShipmentOverviewTab;
    case "uploads":
      return ShipmentUploadsTab;
    case "pre-trip-inspections":
      return ShipmentPreTripInspectionsTab;
    case "settlements":
      return ShipmentSettlementsTab;
    case "emptyReturn":
      return ShipmentEmptyReturnTab;
    default:
      return ShipmentOverviewTab;
  }
});

defineExpose({
  refetch,
  shipment,
});
</script>
