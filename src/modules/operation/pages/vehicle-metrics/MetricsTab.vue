<template>
  <div>
    <!-- Export: icon button on mobile -->
    <Teleport to="#page-title-actions" defer>
      <button
        class="sm:hidden size-10 rounded-lg bg-grey-75 border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
        @click="handleExport"
      >
        <i class="*:size-6" v-html="icons.excell"></i>
        <i class="*:size-3" v-html="icons.longArrow"></i>
      </button>
    </Teleport>
    <!-- Export: full button on desktop -->
    <Teleport to="#page-actions" defer>
      <div class="hidden sm:flex">
        <Button size="md" variant="secondary" @click="handleExport">
          <i class="mdi mdi-file-excel-outline text-lg"></i>
          <span>Export</span>
        </Button>
      </div>
    </Teleport>
    <Table :show_pagination="false" :columns="columns" :rows="filteredMetricsData" client_sort client_search :on_sm_screen_column_span="{ plateNumber: 2, totalCost: 2 }">
      <template #after-search>
        <VehicleMetricsFilter
          show-vehicle-use
          :vehicle-use-options="[
            { label: 'In Bound', value: 'IN_BOUND' },
            { label: 'Out Bound', value: 'OUT_BOUND' },
            { label: 'Site Transfer', value: 'SITE_TRANSFER' },
          ]"
          pagination-id="/metrics"
          @change="(val) => Object.assign(filters, val)"
        />
      </template>

      <template #cell-plateNumber="{ row }">
        <span class="font-bold text-gray-900">{{ row.plateNumber }}</span>
      </template>
      <template #cell-productType="{ value }">
        <span>{{
          { IN_BOUND: "In Bound", OUT_BOUND: "Out Bound", SITE_TRANSFER: "Site Transfer", INHOUSE: "Internal Use", LEASE_OUT: "Lease Out" }[value] ?? value ?? "-"
        }}</span>
      </template>
      <template #cell-totalRevenue="{ value }">
        <span class="font-semibold">{{ currencyFormatter(value) }}</span>
      </template>
      <template #cell-totalFuelCost="{ value }">
        <span>{{ currencyFormatter(value) }}</span>
      </template>
      <template #cell-totalFuelUsed="{ value }">
        <span>{{ numberFormatter(value) }}</span>
      </template>
      <template #cell-lastFuelReading="{ value }">
        <span>{{ numberFormatter(value) }}</span>
      </template>
      <template #cell-totalDistance="{ value }">
        <span>{{ numberFormatter(value) }}</span>
      </template>
      <template #cell-totalDistanceTwo="{ value }">
        <span>{{ numberFormatter(value) }}</span>
      </template>
      <template #cell-fuelConsumption="{ value }">
        <span>{{ value != null ? Number(value).toFixed(3) : "-" }}</span>
      </template>
      <template #cell-fuelConsumptionTwo="{ value }">
        <span>{{ value != null ? Number(value).toFixed(3) : "-" }}</span>
      </template>
      <template #cell-totalTyreCost="{ value }">
        <span>{{ currencyFormatter(value) }}</span>
      </template>
      <template #cell-totalMaintenanceCost="{ value }">
        <span>{{ currencyFormatter(value) }}</span>
      </template>
      <template #cell-leaseCost="{ value }">
        <span>{{ currencyFormatter(value) }}</span>
      </template>
      <template #cell-perDiemCost="{ value }">
        <span>{{ currencyFormatter(value) }}</span>
      </template>
      <template #cell-otherAdvancesCost="{ value }">
        <span>{{ currencyFormatter(value) }}</span>
      </template>
      <template #cell-totalCost="{ value }">
        <span class="font-semibold text-red-600">{{ currencyFormatter(value) }}</span>
      </template>
      <template #cell-totalCompletedTrips="{ value }">
        <span>{{ numberFormatter(value) }}</span>
      </template>
      <template #cell-availableDays="{ value }">
        <span>{{ numberFormatter(value) }}</span>
      </template>
      <template #cell-totalGarageDays="{ value }">
        <span>{{ numberFormatter(value) }}</span>
      </template>
    </Table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { icons } from "@/utils/icons";
import { usePagination } from "@/composables/usePagination";
import Table from "@/components/common/Table.vue";
import type { TableColumn } from "@/components/common/Table.vue";
import Button from "@/components/common/Button.vue";
import VehicleMetricsFilter from "../../components/VehicleMetricsFilter.vue";
import { fetch_vehicle_metrics, vehicle_api } from "../../api/operation.api";
import { currencyFormatter, numberFormatter } from "@/utils/utils";
import { exportVehicleMetrics } from "../../utils/vehicleMetricsExport";
const props = defineProps<{
  dateRange: { start: string; end: string | null };
}>();

const filters = ref({
  region: "",
  vehicleType: "",
  ownership: "",
  vehicleUse: "",
  search: "",
});

const { response: metricsData } = usePagination({
  url: "/metrics",
  api: vehicle_api,
  params: computed(() => ({
    startDate: props.dateRange.start,
    endDate: props.dateRange.end,
    page: undefined,
    limit: undefined,
  })),
  queryKey: ["vehicleMetrics"],
});

const filteredMetricsData = computed(() => {
  let data = (metricsData.value ?? []) as any[];
  const f = filters.value;
  if (f.vehicleUse) data = data.filter((r) => r.productType === f.vehicleUse);
  if (f.ownership) data = data.filter((r) => r.ownership === f.ownership);
  if (f.region) data = data.filter((r) => (r.region?._id ?? r.region) === f.region);
  if (f.vehicleType) data = data.filter((r) => (r.vehicleType?._id ?? r.vehicleType) === f.vehicleType);
  return data;
});

const handleExport = async () => {
  try {
    exportVehicleMetrics(metricsData.value);
  } catch (error) {
    console.error("Export failed", error);
  }
};
const columns: TableColumn[] = [
  { key: "plateNumber", label: "Plate Number", sortable: true },
  {
    key: "totalRevenue",
    label: "Total Revenue",
    sortable: true,
    cellAlign: "right",
  },
  { key: "productType", label: "Vehicle Use" },
  {
    key: "totalFuelCost",
    label: "Total Fuel Cost",
    sortable: true,
    cellAlign: "right",
  },
  { key: "totalFuelUsed", label: "Total Fuel Used", sortable: true },
  { key: "lastFuelReading", label: "Last Fuel Reading", sortable: true },
  { key: "totalDistance", label: "Total Distance (Route)", sortable: true },
  {
    key: "totalDistanceTwo",
    label: "Total Distance (Covered)",
    sortable: true,
  },
  { key: "fuelConsumption", label: "Fuel Consumption (Route)", sortable: true },
  { key: "fuelConsumptionTwo", label: "Fuel Consumption (Covered)", sortable: true },
  { key: "totalTyreCost", label: "Tyre Cost", sortable: true, cellAlign: "right" },
  {
    key: "totalMaintenanceCost",
    label: "Maintenance Cost",
    sortable: true,
    cellAlign: "right",
  },
  { key: "leaseCost", label: "Lease Cost", sortable: true, cellAlign: "right" },
  { key: "perDiemCost", label: "Per Diem Cost", sortable: true, cellAlign: "right" },
  { key: "otherAdvancesCost", label: "Other Advances", sortable: true, cellAlign: "right" },
  { key: "totalCost", label: "Total Cost", sortable: true, cellAlign: "right" },
  { key: "totalCompletedTrips", label: "Completed Trips", sortable: true },
  { key: "availableDays", label: "Available Days", sortable: true },
  { key: "totalGarageDays", label: "Garage Days", sortable: true },
];

</script>
