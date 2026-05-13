<template>
  <Table
    :row_alignment="{
      driver: 'left',
      route: 'left',
      total: 'left',
      shipperIssueVoucher: 'left',
      actions: 'center',
    }"
    :head_alignment="{
      driver: 'left',
      route: 'left',
      total: 'left',
      shipperIssueVoucher: 'left',
      actions: 'center',
    }"
    id="shipment-list"
    :columns="columns"
    :rows="response"
    :search_placeholder="dynamicSearchPlaceholder"
    @row_click="(row) => $router.push(`${shipmentBasePath}/${row._id}`)"
  >
    <template #search-prefix>
      <div
        class="h-full flex items-center border-r border-gray-200 pr-2 mr-2 w-48"
      >
        <Select
          class="[&_.input-focus]:shadow-none! [&_.input-focus]:border-none [&_.input-focus]:min-h-full min-w-48"
          v-model="selectedSearchField"
          :options="searchFieldOptions"
          label_key="label"
          value_key="value"
          :clearable="false"
        />
      </div>
    </template>
    <template #cell-shipmentCode="{ value }">
      <span class="font-bold">{{ value }}</span>
    </template>

    <template #cell-driver="{ row }">
      <div class="flex flex-col" v-if="row.vehicle">
        <button
          type="button"
          class="font-semibold text-base text-orange-600 hover:text-orange-700 hover:underline text-left cursor-pointer transition-colors"
          @click.stop="openMapModal(row?.vehicle?._id, row.vehicle.plateNumber)"
        >
          {{ row?.vehicle?.plateNumber }}
        </button>
        <span class="text-gray-400 font-medium" v-if="row.driver">
          {{ row.driver.firstName }} {{ row.driver.lastName }}
        </span>
      </div>
      <span v-else class="text-gray-400 italic text-sm">Not Assigned</span>
    </template>

    <template #cell-route="{ row }">
      <div class="flex flex-col items-start" v-if="row.vehicle">
        <span class="font-bold text-base text-gray-900">
          {{ row.route.routeName }}
        </span>
        <span class="text-gray-400 font-medium">{{
          row.agent?.name || "-"
        }}</span>
      </div>
    </template>

    <template #cell-shipperIssueVoucher="{ value }">
      <div class="flex items-center gap-2">
        <span class="font-medium text-gray-500">{{
          value || "No Voucher"
        }}</span>
      </div>
    </template>

    <template #cell-dispatchDate="{ value, row }">
      <div class="flex flex-col">
        <span class="text-base font-semibold text-gray-900">
          {{ dateFormatter(value) }}
        </span>
        <span class="text-xs text-gray-500">
          {{ getTimeDifference(row) || "N/A" }}
        </span>
      </div>
    </template>

    <template #cell-total="{ row }">
      <div class="flex flex-col">
        <span class="text-base"
          >{{ numberFormatter(row?.waypointDistance) }} km</span
        >
        <span class="text-gray-400 font-medium" v-if="row.pricingType">
          {{ (row.pricingType as PricingTypeObject).type }} ({{
            currencyFormatter(+(row.pricingType as PricingTypeObject).amount)
          }})
        </span>
      </div>
    </template>

    <template #after-search>
      <div
        class="items-center gap-4 inline-flex border-l border-grey-100 overflow-x-auto px-3"
      >
        <i v-html="icons.filter" />
        <ShipmentFilters
          @change="handleFilterChange"
          calendar-type="english"
          output-calendar-type="english"
        />
      </div>
    </template>

    <template #cell-status="{ value }">
      <Status :variant="value" type="wrapped">
        {{ value?.replace(/_/g, " ") }}
      </Status>
    </template>
    <template #cell-actions="{ row }">
      <div class="flex items-center justify-end">
        <ShipmentDropdown :shipment="row" :on-action-complete="refetch" />
      </div>
    </template>
  </Table>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import Table from "@/components/common/Table.vue";
import Select from "@/components/common/Select.vue";
import ShipmentDropdown from "./ShipmentDropdown.vue";
import { icons } from "@/utils/icons";
import { usePagination } from "@/composables/usePagination";
import { openModal } from "@customizer/modal-x";
import type {
  ShipmentFilterParams,
  Shipment,
  PricingTypeObject,
  Vehicle,
} from "../operation.types";
import type { TableColumn } from "@/components/common/Table.vue";
import ShipmentFilters from "./ShipmentFilters.vue";
import Status from "@/components/common/Status.vue";
import {
  currencyFormatter,
  dateFormatter,
  numberFormatter,
} from "@/utils/utils";
import { useAuthStore } from "@/store/authStore";
const props = defineProps<{
  filters?: any;
}>();

const authStore = useAuthStore();
const shipmentBasePath = computed(() =>
  authStore.is_shipper ? "/shipper/shipments" : "/operation/shipments",
);

const emit = defineEmits(["action"]);

const getTimeDifference = (shipment: any) => {
  if (!shipment || !shipment.status || !shipment.statusTime) return null;
  
  const camelCase = (str: string) => str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
  const timeProp = `${camelCase(shipment.status)}Time`;
  const timeString = shipment.statusTime[timeProp];
  
  if (!timeString) return null;
  
  const timeToCompare = new Date(timeString);
  if (isNaN(timeToCompare.getTime())) return null;

  const currentTime = new Date();
  const diffMs = Math.abs(currentTime.getTime() - timeToCompare.getTime());
  
  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);
  const totalWeeks = Math.floor(totalDays / 7);
  const totalMonths = Math.floor(totalDays / 30);
  const totalYears = Math.floor(totalDays / 365);

  let formattedTime = [];

  if (totalYears > 0) {
    formattedTime.push(`${totalYears} year${totalYears > 1 ? "s" : ""}`);
    if (totalMonths % 12 > 0) {
      formattedTime.push(`${totalMonths % 12} month${totalMonths % 12 > 1 ? "s" : ""}`);
    }
  } else if (totalWeeks > 0) {
    formattedTime.push(`${totalWeeks} week${totalWeeks > 1 ? "s" : ""}`);
    if (totalDays % 7 > 0) {
      formattedTime.push(`${totalDays % 7} day${totalDays % 7 > 1 ? "s" : ""}`);
    }
  } else if (totalDays > 0) {
    formattedTime.push(`${totalDays} day${totalDays > 1 ? "s" : ""}`);
    if (totalHours % 24 > 0) {
      formattedTime.push(`${totalHours % 24} hour${totalHours % 24 > 1 ? "s" : ""}`);
    }
  } else if (totalHours > 0) {
    formattedTime.push(`${totalHours} hour${totalHours > 1 ? "s" : ""}`);
    if (totalMinutes % 60 > 0) {
      formattedTime.push(`${totalMinutes % 60} minute${totalMinutes % 60 > 1 ? "s" : ""}`);
    }
  } else if (totalMinutes > 0) {
    formattedTime.push(`${totalMinutes} minute${totalMinutes > 1 ? "s" : ""}`);
  }

  return formattedTime.join(", ") || "0 minute";
};

function openMapModal(vehicleId: string, plateNumber: string) {
  openModal("VehicleMapModal", { vehicleId, plateNumber });
}

const columns: TableColumn<Shipment>[] = [
  { key: "driver", label: "Driver / Vehicle", field: "driver" },
  { key: "route", label: "Route & Agent", field: "shipmentCode" },
  { key: "total", label: "Details", field: "detail" },
  {
    key: "shipperIssueVoucher",
    label: "Issue Voucher",
    field: "shipperIssueVoucher",
  },
  { key: "shipmentCode", label: "Shipment Code" },
  {
    key: "dispatchDate",
    label: "Dispatch Info",
    field: "dispatchDate",
  },
  { key: "status", label: "Status", field: "status" },
  { key: "actions", label: "Actions", field: "", cellAlign: "right" },
];
const selectedSearchField = ref("shipmentCode");

const activeFilters = ref<ShipmentFilterParams>({});
const { response, refetch } = usePagination<Shipment>({
  id: "shipment-list",
  url: "/shipment",
  params: (state) => ({
    [selectedSearchField.value]: state.search || "",
    ...props.filters,
    ...activeFilters.value,
  }),
});

const searchFieldOptions = [
  { label: "Plate Number", value: "vehiclePlateNumber" },
  { label: "Shipment Code", value: "shipmentCode" },
  { label: "Driver Name", value: "driverName" },
  { label: "Shipper Issue Voucher", value: "shipperIssueVoucher" },
  { label: "Agent Receive Voucher", value: "agentReceiveVoucher" },
  { label: "Agent Issue Voucher", value: "agentIssueVoucher" },
  { label: "Shipper Receive Voucher", value: "shipperReceiveVoucher" },
  { label: "Transporter Name", value: "transporterName" },
];

watch(selectedSearchField, (newField) => {
  activeFilters.value = { ...activeFilters.value, searchField: newField };
});

// Initialize the filter
activeFilters.value.searchField = selectedSearchField.value;

const dynamicSearchPlaceholder = computed(() => {
  const option = searchFieldOptions.find(
    (o) => o.value === selectedSearchField.value,
  );
  return option ? `Search by ${option.label}...` : "Search Shipments...";
});

const handleFilterChange = (newFilters: ShipmentFilterParams) => {
  activeFilters.value = {
    ...newFilters,
    selectedFilterOption: {
      value: selectedSearchField.value,
    },
  };
};

defineExpose({ refetch });
</script>
