<template>
  <div>
    <Teleport to="#page-actions" defer>
      <Button size="md" variant="secondary" @click="handleExport">
        <i class="mdi mdi-file-excel-outline text-lg"></i>
        <span>Export</span>
      </Button>
    </Teleport>
    <Table :show_pagination="false" :columns="columns" :rows="metricsData">
      <template #after-search>
        <VehicleMetricsFilter
          show-vehicle-use
          :vehicle-use-options="[
            { label: 'In Bound', value: 'IN_BOUND' },
            { label: 'Out Bound', value: 'OUT_BOUND' },
            { label: 'Site Transfer', value: 'SITE_TRANSFER' },
          ]"
          @change="(val) => Object.assign(filters, val)"
        />
      </template>

      <template #cell-plateNumber="{ row }">
        <span class="font-bold text-gray-900">{{ row.plateNumber }}</span>
      </template>
      <template #cell-totalRevenue="{ row }">
        <span class="font-semibold">{{
          currencyFormatter(row.totalRevenue)
        }}</span>
      </template>
      <template #cell-totalCost="{ row }">
        <span class="font-semibold text-red-600">{{
          currencyFormatter(row.totalCost)
        }}</span>
      </template>
    </Table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { usePagination } from "@/composables/usePagination";
import Table from "@/components/common/Table.vue";
import type { TableColumn } from "@/components/common/Table.vue";
import Button from "@/components/common/Button.vue";
import VehicleMetricsFilter from "../../components/VehicleMetricsFilter.vue";
import { fetch_vehicle_metrics, vehicle_api } from "../../api/operation.api";
import { currencyFormatter } from "@/utils/utils";
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
    region: filters.value.region,
    vehicleType: filters.value.vehicleType,
    ownership: filters.value.ownership,
    productType: filters.value.vehicleUse,
    page: undefined,
    limit: undefined,
  })),
  queryKey: ["vehicleMetrics"],
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
  { key: "lastFuelReading", label: "Last Fuel Reading" },
  { key: "totalDistance", label: "Total Distance (Route)", sortable: true },
  {
    key: "totalDistanceTwo",
    label: "Total Distance (Covered)",
    sortable: true,
  },
  { key: "fuelConsumption", label: "Fuel Consumption (Route)" },
  { key: "fuelConsumptionTwo", label: "Fuel Consumption (Covered)" },
  { key: "totalTyreCost", label: "Tyre Cost", cellAlign: "right" },
  {
    key: "totalMaintenanceCost",
    label: "Maintenance Cost",
    cellAlign: "right",
  },
  { key: "leaseCost", label: "Lease Cost", cellAlign: "right" },
  { key: "perDiemCost", label: "Per Diem Cost", cellAlign: "right" },
  { key: "otherAdvancesCost", label: "Other Advances", cellAlign: "right" },
  { key: "totalCost", label: "Total Cost", sortable: true, cellAlign: "right" },
  { key: "totalCompletedTrips", label: "Completed Trips" },
  { key: "availableDays", label: "Available Days" },
  { key: "totalGarageDays", label: "Garage Days" },
];

watch(
  filters,
  () => {
    // page.value = 1;
  },
  { deep: true },
);
</script>
