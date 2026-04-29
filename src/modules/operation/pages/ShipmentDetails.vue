<template>
  <div class="h-full flex flex-col gap-4">
    <!-- Header Section (adapted from raaz ShipmentDetailHeader) -->
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
        <div class="flex-1 md:flex-none justify-end flex">
          <Dropdown>
            <template #default="{ close }">
              <DropDownItem
                :icon="icons.editIcon"
                label="Edit Shipment"
                @click="close"
              />
              <DropDownItem :icon="icons.trash" label="Delete" @click="close" />
            </template>
          </Dropdown>
        </div>
      </div>
    </div>
    <div id="shipment-details-tabs" class="w-full mt-2"></div>
    <div class="flex-1 min-h-0 overflow-y-auto">
      <component
        :is="activeTabComponent"
        :shipment="shipment"
        @refresh="refetch"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import { fetch_shipment_details } from "../api/shipment.api";
import type { Shipment } from "../operation.types";
import Status from "@/components/common/Status.vue";
import Dropdown from "@/components/common/Dropdown.vue";
import DropDownItem from "@/components/common/DropDownItem.vue";
import { icons } from "@/utils/icons";
import { raaz_icons } from "@/utils/raaz_icons";
import { dateFormatter, numberFormatter } from "@/utils/utils";

// Import Tabs Content
import ShipmentOverviewTab from "../components/shipment-details/ShipmentOverviewTab.vue";
import ShipmentUploadsTab from "../components/shipment-details/ShipmentUploadsTab.vue";
import ShipmentPlaceholderTab from "../components/shipment-details/ShipmentPlaceholderTab.vue";
import { h } from "vue";

const route = useRoute();
const shipmentId = route.params.id as string;

const tabs = computed(() => route.meta.tabs as any[]);
const activeTab = computed(
  () => (route.query.tab as string) || (tabs.value?.[0]?.value as string),
);

const { data: shipmentResponse, refetch } = useQuery({
  queryKey: ["shipment", shipmentId],
  queryFn: () => fetch_shipment_details(shipmentId),
  staleTime: Infinity,
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
      return () => h(ShipmentPlaceholderTab, { title: "Pre-Trip Inspections" });
    case "settlements":
      return () => h(ShipmentPlaceholderTab, { title: "Settlements" });
    case "emptyReturn":
      return () => h(ShipmentPlaceholderTab, { title: "Empty Return" });
    default:
      return ShipmentOverviewTab;
  }
});
</script>
