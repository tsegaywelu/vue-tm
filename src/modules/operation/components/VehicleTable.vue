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
    :search_placeholder="`Search by ${selectedSearchFieldLabel}...`"
    :hide_on_sm_screen="['sideNumber', 'type', 'ownership', 'vehicleGroup', 'mileageSinceService', 'lastServiceDate']"
    :on_sm_screen_column_span="{ plateNumber: 2, vehicleType: 2, driver: 3, status: 2 }"
    @row_click="(row) => $router.push(`/vehicles/${row._id}`)"
  >
    <template #search-prefix>
      <div class="h-full hidden sm:flex items-center border-r border-gray-200 pr-2 mr-2 w-48">
        <Select
          v-model="selectedSearchField"
          class="[&_.input-focus]:shadow-none! [&_.input-focus]:border-none [&_.input-focus]:min-h-full min-w-48"
          :options="filterFieldOptions"
          label_key="label"
          value_key="value"
          :clearable="false"
        />
      </div>
    </template>

    <template #after-search>
      <div
        class="items-center gap-4 inline-flex sm:border-l sm:border-grey-100 overflow-x-auto sm:px-3"
      >
        <i class="hidden sm:block" v-html="icons.filter" />
        <VehicleFilters
          @change="handleFilterChange"
          pagination-id="vehicle-list"
        />
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
            v-permission="'VEHICLE:read'"
            :icon="icons.eye"
            label="View Details"
            @click.stop="
              emitAction(row, 'view');
              close();
            "
          />
          <DropDownItem
            v-permission="'VEHICLE:update'"
            :icon="icons.editIcon"
            label="Edit Details"
            @click.stop="
              emitAction(row, 'edit');
              close();
            "
          />
          <DropDownItem
            v-permission="'VEHICLE:update'"
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
import Select from "@/components/common/Select.vue";

const filterFieldOptions = [
  { label: "Plate Number", value: "vehiclePlateNumber" },
  { label: "First Name", value: "driverFirstName" },
  { label: "Middle Name", value: "driverMiddleName" },
  { label: "Last Name", value: "driverLastName" },
];
const props = defineProps<{
  filters?: any;
}>();

const emit = defineEmits(["action"]);
const selectedSearchField = ref("vehiclePlateNumber");
const selectedSearchFieldLabel = computed(
  () => filterFieldOptions.find((o) => o.value === selectedSearchField.value)?.label ?? "Plate Number"
);

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
  params: (state) => ({
    ...props.filters,
    [selectedSearchField.value]: state.search,
    ...activeFilters.value,
    q: undefined,
  }),
});

const emitAction = (row: any, action: string) => {
  emit("action", { row, action });
};

const handleFilterChange = (newFilters: any) => {
  activeFilters.value = { ...newFilters };
};

defineExpose({ refetch, selectedSearchField, filterFieldOptions });
</script>
