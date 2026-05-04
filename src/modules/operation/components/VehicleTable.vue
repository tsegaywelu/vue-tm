<template>
  <Table
    :row_alignment="{
      plateNumber: 'left',
      sideNumber: 'left',
      type: 'left',
      ownership: 'left',
      vehicleType: 'left',
      vehicleGroup: 'left',
      driver: 'left',
      lastServiceDate: 'left',
      status: 'center',
      actions: 'center',
    }"
    :head_alignment="{
      plateNumber: 'left',
      sideNumber: 'left',
      type: 'left',
      ownership: 'left',
      vehicleType: 'left',
      vehicleGroup: 'left',
      driver: 'left',
      lastServiceDate: 'left',
      status: 'center',
      actions: 'center',
    }"
    id="vehicle-list"
    :columns="columns"
    :rows="response"
    @row_click="(row) => $router.push(`/vehicles/${row._id}`)"
  >
    <template #after-search>
      <div
        class="items-center gap-4 inline-flex border-l border-grey-100 overflow-x-auto px-3"
      >
        <i v-html="icons.filter" />
        <VehicleFilters @change="handleFilterChange" />
      </div>
    </template>

    <template #cell-plateNumber="{ row }">
      <div class="flex flex-col">
        <span class="font-bold text-gray-900">{{ row.plateNumber }}</span>
        <span
          v-if="row.trailerPlate"
          class="text-[10px] text-gray-400 font-medium uppercase tracking-tighter"
        >
          Trailer: {{ row.trailerPlate }}
        </span>
      </div>
    </template>

    <template #cell-type="{ row }">
      <span class="text-sm font-medium text-gray-700">{{
        row.maker?.name || "-"
      }}</span>
    </template>

    <template #cell-vehicleType="{ row }">
      <div class="flex flex-col">
        <span class="text-sm font-semibold text-gray-900">{{
          row.vehicleType?.name || "-"
        }}</span>
        <span
          v-if="row.vehicleModel?.name"
          class="text-[10px] text-gray-400 font-bold uppercase tracking-wider"
        >
          {{ row.vehicleModel.name }}
        </span>
      </div>
    </template>

    <template #cell-vehicleGroup="{ row }">
      <span class="text-sm text-gray-600">{{ row.region?.name || "-" }}</span>
    </template>

    <template #cell-driver="{ row }">
      <div v-if="row.driver" class="flex flex-col">
        <span class="text-sm font-medium text-gray-900">
          {{ row.driver.firstName }} {{ row.driver.middleName || "" }}
        </span>
        <span class="text-[10px] text-gray-400 font-bold uppercase"
          >Primary Driver</span
        >
      </div>
      <span v-else class="text-gray-300 italic text-xs">Unassigned</span>
    </template>

    <template #cell-mileageSinceService="{ value }">
      <span class="text-sm font-mono font-bold text-blue-600">
        {{ value?.toLocaleString() || "0" }}
        <span class="text-[10px] text-gray-400 font-normal">KM</span>
      </span>
    </template>

    <template #cell-lastServiceDate="{ value }">
      <span class="text-sm text-gray-600">{{
        value ? value.split("T")[0] : "-"
      }}</span>
    </template>

    <template #cell-status="{ value }">
      <Status :variant="value" type="wrapped">
        {{ value }}
      </Status>
    </template>

    <template #cell-actions="{ row }">
      <Dropdown>
        <template #default="{ close }">
          <DropDownItem
            :icon="icons.eye"
            label="View Details"
            @click.stop="
              emitAction(row, 'view');
              close();
            "
          />
          <DropDownItem
            :icon="icons.editIcon"
            label="Edit Details"
            @click.stop="
              emitAction(row, 'edit');
              close();
            "
          />
          <DropDownItem
            :icon="icons.shield"
            label="Change Status"
            @click.stop="
              emitAction(row, 'edit-status');
              close();
            "
          />
          <DropDownItem
            :icon="icons.eye"
            label="Track Location"
            @click.stop="
              emitAction(row, 'track');
              close();
            "
          />
        </template>
      </Dropdown>
    </template>
  </Table>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import Table from "@/components/common/Table.vue";
import type { TableColumn } from "@/components/common/Table.vue";
import Status from "@/components/common/Status.vue";
import Dropdown from "@/components/common/Dropdown.vue";
import DropDownItem from "@/components/common/DropDownItem.vue";
import VehicleFilters from "./VehicleFilters.vue";
import { icons } from "@/utils/icons";
import { usePagination } from "@/composables/usePagination";

const props = defineProps<{
  filters?: any;
}>();

const emit = defineEmits(["action"]);

const columns: TableColumn[] = [
  { key: "plateNumber", label: "Plate Number", field: "plateNumber" },
  { key: "sideNumber", label: "Side Number", field: "sideNumber" },
  { key: "type", label: "Type", field: "maker" },
  { key: "ownership", label: "Ownership", field: "ownership" },
  { key: "vehicleType", label: "Vehicle Type", field: "vehicleType" },
  { key: "vehicleGroup", label: "Vehicle Group", field: "region" },
  { key: "driver", label: "Driver", field: "driver" },
  {
    key: "mileageSinceService",
    label: "Mileage Since Service",
    field: "mileageSinceService",
  },
  {
    key: "lastServiceDate",
    label: "Last Service Date",
    field: "lastServiceDate",
  },
  { key: "status", label: "Status", field: "status" },
  { key: "actions", label: "Actions", field: "", cellAlign: "right" },
];

const activeFilters = ref<any>({});

const { response, refetch } = usePagination({
  id: "vehicle-list",
  url: "/vehicle",
  params: computed(() => ({ ...props.filters, ...activeFilters.value })),
});

const emitAction = (row: any, action: string) => {
  emit("action", { row, action });
};

const handleFilterChange = (newFilters: any) => {
  activeFilters.value = { ...newFilters };
};

defineExpose({ refetch });
</script>
