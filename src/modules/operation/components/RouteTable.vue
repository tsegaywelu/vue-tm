<template>
  <Table id="route-list" :columns="columns" :rows="response">
    <template #cell-origin="{ value }">
      <span class="text-base">{{ value }}</span>
    </template>

    <template #cell-destination="{ value }">
      <span class="text-base">{{ value }}</span>
    </template>

    <template #cell-routeName="{ value }">
      <span class="text-base font-semibold">{{ value }}</span>
    </template>

    <template #cell-shipmentCount="{ value }">
      <span class="text-base">{{ value || 0 }}</span>
    </template>

    <template #cell-waypoints="{ row }">
      <span class="text-base">{{ row.waypoints?.length || 0 }}</span>
    </template>
  </Table>
</template>

<script setup lang="ts">
import Table from "@/components/common/Table.vue";
import type { TableColumn } from "@/components/common/Table.vue";
import { usePagination } from "@/composables/usePagination";

const columns: TableColumn[] = [
  { key: "origin", label: "Origin", field: "origin" },
  { key: "destination", label: "Destination", field: "destination" },
  { key: "routeName", label: "Route Name", field: "routeName" },
  { key: "shipmentCount", label: "Shipment Count", field: "shipmentCount" },
  { key: "waypoints", label: "Waypoints", field: "waypoints" },
];

const { response, refetch } = usePagination({
  id: "route-list",
  url: "/route",
});

defineExpose({ refetch });
</script>
