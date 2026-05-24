<template>
  <div>
    <Teleport to="#page-actions" defer>
      <Button size="md" variant="secondary" @click="handleExport">
        <i class="mdi mdi-file-excel-outline text-lg"></i>
        <span>Export</span>
      </Button>
    </Teleport>

    <Teleport to="#extra-page-data" defer>
      <StatsCards :stats="summaryStats" :loading="isLoading" />
    </Teleport>

    <Table :columns="columns" :rows="tableData" :show_pagination="false" client_sort client_search>
      <template #after-search>
        <VehicleMetricsFilter
          show-vehicle-use
          :vehicle-use-options="[
            { label: 'In Bound', value: 'IN_BOUND' },
            { label: 'Out Bound', value: 'OUT_BOUND' },
            { label: 'Site Transfer', value: 'SITE_TRANSFER' },
          ]"
          pagination-id="/productivity/vehicles"
          @change="(val) => Object.assign(filters, val)"
        />
      </template>

      <template #cell-index="{ row, index }">
        <span class="text-gray-400 font-medium">{{ index + 1 }}</span>
      </template>

      <template #cell-plateNumber="{ row }">
        <span class="font-black text-gray-900">{{ row.plateNumber }}</span>
      </template>

      <template #cell-utilizationRate="{ row }">
        <div class="flex items-center gap-2">
          <div class="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              class="h-full bg-primary rounded-full"
              :style="{
                width: `${Math.min(100, Math.max(0, row.utilizationRate || 0))}%`,
              }"
            ></div>
          </div>
          <span class="font-bold text-xs"
            >{{ row.utilizationRate?.toFixed(1) || "0.0" }}%</span
          >
        </div>
      </template>

      <template #cell-loadFactor="{ row }">
        <div class="flex items-center gap-2">
          <div class="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              class="h-full bg-secondary rounded-full"
              :style="{
                width: `${Math.min(100, Math.max(0, row.loadFactor || 0))}%`,
              }"
            ></div>
          </div>
          <span class="font-bold text-xs"
            >{{ row.loadFactor?.toFixed(1) || "0.0" }}%</span
          >
        </div>
      </template>
    </Table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { usePagination } from "@/composables/usePagination";
import Table from "@/components/common/Table.vue";
import type { TableColumn } from "@/components/common/Table.vue";
import Button from "@/components/common/Button.vue";
import StatsCards from "@/components/common/StatsCards.vue";
import VehicleMetricsFilter from "../../components/VehicleMetricsFilter.vue";
import {
  fetch_vehicle_productivity_vehicles,
  vehicle_api,
} from "../../api/operation.api";
import { numberFormatter } from "@/utils/utils";
import { exportProductivityKpis } from "../../utils/vehicleMetricsExport";

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

const handleExport = async () => {
  try {
    exportProductivityKpis(tableData.value || []);
  } catch (error) {
    console.error("Export failed", error);
  }
};

// Fetching Data
const {
  response: rawTableData,
  isLoading,
  fullResponse,
} = usePagination({
  url: "/productivity/vehicles",
  api: vehicle_api,
  params: computed(() => ({
    startDate: props.dateRange.start,
    endDate: props.dateRange.end,
    page: undefined,
    limit: undefined,
  })),
  queryKey: ["vehicleProductivity"],
});

const tableData = computed(() => {
  let data = (rawTableData.value ?? []) as any[];
  const f = filters.value;
  if (f.vehicleUse) data = data.filter((r) => (r.vehicleUseType ?? r.productType) === f.vehicleUse);
  if (f.ownership) data = data.filter((r) => r.ownership === f.ownership);
  if (f.region) data = data.filter((r) => (r.region?._id ?? r.region) === f.region);
  if (f.vehicleType) data = data.filter((r) => (r.vehicleType?._id ?? r.vehicleType) === f.vehicleType);
  return data;
});

const totalRows = computed(() => fullResponse.value?.total || 0);
const summary = computed(() => fullResponse.value?.summary || {});

const summaryStats = computed(() => [
  {
    label: "Total Vehicles",
    value: summary.value.totalVehicles || 0,
    unit: "Units",
  },
  {
    label: "Avg Utilization",
    value: summary.value.avgUtilizationRate?.toFixed(1) || "0.0",
    unit: "%",
  },
  {
    label: "Avg ERR",
    value: summary.value.avgEmptyReturnRatio?.toFixed(1) || "0.0",
    unit: "%",
  },
  {
    label: "Avg TAT",
    value: summary.value.avgTurnaroundTime?.toFixed(2) || "0.00",
    unit: "Days",
  },
  {
    label: "Avg Load Factor",
    value: summary.value.avgLoadFactor?.toFixed(1) || "0.0",
    unit: "%",
  },
  {
    label: "Avg Km / Day",
    value: numberFormatter(summary.value.avgKmPerDay),
    unit: "Km",
  },
  {
    label: "Avg Idle Days",
    value: summary.value.avgIdleDays?.toFixed(1) || "0.0",
    unit: "Days",
  },
]);

const columns: TableColumn[] = [
  { key: "plateNumber", label: "Plate Number", sortable: true },
  { key: "driverName", label: "Driver", sortable: true },
  { key: "ownership", label: "Ownership", sortable: true },
  { key: "vehicleUseType", label: "Vehicle Use" },
  { key: "utilizationRate", label: "Utilization", sortable: true },
  { key: "emptyReturnRatio", label: "ERR", sortable: true },
  { key: "averageTurnaroundTime", label: "TAT (Days)", sortable: true },
  { key: "loadFactor", label: "Load Factor", sortable: true },
  { key: "kmPerDay", label: "Km/Day", sortable: true },
  { key: "idleDays", label: "Idle Days", sortable: true },
  { key: "totalDistance", label: "Total Km", sortable: true },
  { key: "numberOfTrips", label: "Trips", sortable: true },
];

</script>
