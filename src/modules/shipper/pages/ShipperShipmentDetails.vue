<template>
  <ShipmentDetailsBase
    :tabs="filteredTabs"
    :dropdown-filters="{ view: false, create_advance: false }"
  >
    <template #default="{ shipment, activeTab, refetch }">
      <component
        v-if="activeTab !== 'carriers'"
        :is="getComponent(activeTab)"
        :shipment="shipment"
        @refresh="refetch"
      />
      <div
        v-else
        class="bg-surface p-6 rounded-2xl border border-gray-100 shadow-sm"
      >
        <h2 class="text-lg font-bold mb-4">Contracted Carriers</h2>
        <Table :columns="carrierColumns" :rows="carriersResponse?.data || []" />
      </div>
    </template>
  </ShipmentDetailsBase>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import ShipmentDetailsBase from "../../operation/components/ShipmentDetailsBase.vue";
import { fetch_shipper_carriers } from "../api/shipper.api";
import Table from "@/components/common/Table.vue";

// Tabs components
import ShipmentOverviewTab from "../../operation/components/shipment-details/ShipmentOverviewTab.vue";
import ShipmentUploadsTab from "../../operation/components/shipment-details/ShipmentUploadsTab.vue";
import ShipmentEmptyReturnTab from "../../operation/components/shipment-details/ShipmentEmptyReturnTab.vue";

const route = useRoute();

const filteredTabs = [
  { label: "Overview", value: "overview" },
  { label: "Uploads", value: "uploads" },
  { label: "Empty Return", value: "emptyReturn" },
];

const getComponent = (tab: string) => {
  switch (tab) {
    case "overview":
      return ShipmentOverviewTab;
    case "uploads":
      return ShipmentUploadsTab;
    case "emptyReturn":
      return ShipmentEmptyReturnTab;
    default:
      return ShipmentOverviewTab;
  }
};

const { data: carriersResponse } = useQuery({
  queryKey: ["shipper-contracted-carriers"],
  queryFn: () => fetch_shipper_carriers(),
});

const carrierColumns = [
  { key: "name", label: "Carrier Name", field: "name" },
  { key: "tradeName", label: "Trade Name", field: "tradeName" },
  { key: "phone", label: "Phone", field: "phone" },
];
</script>
