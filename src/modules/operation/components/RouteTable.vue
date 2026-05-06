<template>
  <Table
    id="route-list"
    :columns="columns"
    :rows="response"
    @row_click="(row) => $router.push(`/operation/routes/${row._id}`)"
  >
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

    <template #cell-actions="{ row }">
      <Dropdown>
        <template #default="{ close }">
          <DropDownItem
            :icon="icons.eye"
            label="View Details"
            @click.stop="
              router.push(`/operation/routes/${row._id}`);
              close();
            "
          />
          <DropDownItem
            :icon="icons.editIcon"
            label="Edit Route"
            @click.stop="
              router.push(`/operation/routes/edit/${row._id}`);
              close();
            "
          />
        </template>
      </Dropdown>
    </template>
  </Table>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import Table from "@/components/common/Table.vue";
import type { TableColumn } from "@/components/common/Table.vue";
import { usePagination } from "@/composables/usePagination";
import Dropdown from "@/components/common/Dropdown.vue";
import DropDownItem from "@/components/common/DropDownItem.vue";
import { icons } from "@/utils/icons";

const router = useRouter();

const columns: TableColumn[] = [
  { key: "origin", label: "Origin", field: "origin" },
  { key: "destination", label: "Destination", field: "destination" },
  { key: "routeName", label: "Route Name", field: "routeName" },
  { key: "shipmentCount", label: "Shipment Count", field: "shipmentCount" },
  { key: "waypoints", label: "Waypoints", field: "waypoints" },
  { key: "actions", label: "Actions", field: "actions" },
];

const { response, refetch } = usePagination({
  id: "route-list",
  url: "/route",
});

defineExpose({ refetch, response });
</script>
