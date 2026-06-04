<template>
  <div>
    <!-- Export: icon button on mobile -->
    <Teleport to="#page-title-actions" defer>
      <button
        class="sm:hidden size-10 rounded-lg bg-grey-75 border-line flex items-center justify-center text-faint-text hover:bg-surface-hover transition-colors"
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

    <Teleport to="#extra-page-data" defer>
      <StatsCards :stats="summaryStats" :loading="isLoading" />
    </Teleport>

    <Table :columns="columns" :rows="tableData" :show_pagination="false" client_sort client_search :on_sm_screen_column_span="{ plateNumber: 2, totalCost: 2 }">
      <template #after-search>
        <VehicleMetricsFilter
          show-vehicle-use
          :vehicle-use-options="[
            { label: 'Internal Use', value: 'INHOUSE' },
            { label: 'Lease Out', value: 'LEASE_OUT' },
          ]"
          pagination-id="/financial-kpi"
          @change="(val) => Object.assign(filters, val)"
        />
      </template>

      <template #cell-plateNumber="{ row }">
        <div class="flex flex-col text-xs">
          <span class="font-black text-gray-900">{{ row.plateNumber }}</span>
          <span class="text-[10px] text-gray-400 font-bold uppercase">{{
            row.ownership
          }}</span>
        </div>
      </template>
      <template #cell-revenue="{ row }">
        <span class="font-bold text-gray-900">{{
          currencyFormatter(row.totalRevenue)
        }}</span>
      </template>
      <template #cell-opMargin="{ row }">
        <div class="flex items-center gap-1.5">
          <div class="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              class="h-full bg-primary rounded-full"
              :style="{
                width: `${Math.min(100, Math.max(0, row.operatingMargin || 0))}%`,
              }"
            ></div>
          </div>
          <span class="font-bold text-xs"
            >{{ row.operatingMargin?.toFixed(1) || "0.0" }}%</span
          >
        </div>
      </template>
      <template #cell-netProfitMargin="{ row }">
        <span
          :class="[
            'font-bold',
            (row.netProfitMargin || 0) >= 0 ? 'text-green-600' : 'text-red-600',
          ]"
        >
          {{ row.netProfitMargin?.toFixed(1) || "0.0" }}%
        </span>
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
import StatsCards from "@/components/common/StatsCards.vue";
import VehicleMetricsFilter from "../../components/VehicleMetricsFilter.vue";
import {
  fetch_vehicle_financial_kpis,
  vehicle_api,
} from "../../api/operation.api";
import { currencyFormatter, numberFormatter } from "@/utils/utils";
import { exportFinancialKpis } from "../../utils/vehicleMetricsExport";

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

// Fetching Data
const {
  response: rawTableData,
  isLoading,
  fullResponse,
} = usePagination({
  url: "/financial-kpi",
  api: vehicle_api,
  params: computed(() => ({
    startDate: props.dateRange.start,
    endDate: props.dateRange.end,
    page: undefined,
    limit: undefined,
  })),
  queryKey: ["vehicleFinancialKpi"],
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
    label: "Revenue / Truck",
    value: numberFormatter(summary.value.revenuePerTruck),
    unit: "ETB",
  },
  {
    label: "Cost per Km",
    value: numberFormatter(summary.value.costPerKm),
    unit: "ETB",
  },
  {
    label: "Operating Margin",
    value: summary.value.operatingMargin?.toFixed(1) || "0.0",
    unit: "%",
  },
  {
    label: "Net Profit Margin",
    value: summary.value.netProfitMargin?.toFixed(1) || "0.0",
    unit: "%",
  },
  {
    label: "Fuel Cost %",
    value: summary.value.fuelCostAsPercentageOfRevenue?.toFixed(1) || "0.0",
    unit: "%",
  },
  {
    label: "Maint. Cost / Truck",
    value: numberFormatter(summary.value.maintenanceCostPerTruck),
    unit: "ETB",
  },
  {
    label: "Lease-Out Revenue",
    value: numberFormatter(summary.value.outwardLeaseRevenue),
    unit: "ETB",
  },
  {
    label: "Driver Cost / Km",
    value: numberFormatter(summary.value.driverCostPerKm),
    unit: "ETB",
  },
  {
    label: "Total Vehicles",
    value: summary.value.totalVehicles || 0,
    unit: "Units",
  },
]);

const columns: TableColumn[] = [
  { key: "plateNumber", label: "Plate Number", sortable: true },
  { key: "ownership", label: "Ownership", sortable: true },
  { key: "vehicleUseType", label: "Vehicle Use" },
  { key: "totalRevenue", label: "Revenue", sortable: true, cellAlign: "right" },
  { key: "outwardLeaseRevenue", label: "Lease Revenue", sortable: true, cellAlign: "right" },
  { key: "fuelCost", label: "Fuel Cost", sortable: true, cellAlign: "right" },
  { key: "maintenanceCost", label: "Maint. Cost", sortable: true, cellAlign: "right" },
  { key: "tyreCost", label: "Tyre Cost", sortable: true, cellAlign: "right" },
  { key: "inwardLeaseCost", label: "Inward Lease Cost", sortable: true, cellAlign: "right" },
  { key: "perDiemCost", label: "Per Diem", sortable: true, cellAlign: "right" },
  { key: "otherAdvancesCost", label: "Other Adv.", sortable: true, cellAlign: "right" },
  { key: "totalCost", label: "Total Cost", sortable: true, cellAlign: "right" },
  { key: "totalKilometers", label: "Total Km", sortable: true },
  { key: "numberOfTrips", label: "Trips", sortable: true },
  { key: "costPerKm", label: "Cost/Km", sortable: true, cellAlign: "right" },
  { key: "opMargin", label: "Op. Margin", sortable: true },
  { key: "netProfitMargin", label: "Net Profit %", sortable: true },
  { key: "fuelCostAsPercentageOfRevenue", label: "Fuel %", sortable: true },
  { key: "driverCostPerKm", label: "Driver/Km", sortable: true, cellAlign: "right" },
];

const handleExport = async () => {
  try {
    exportFinancialKpis(tableData.value || []);
  } catch (error) {
    console.error("Export failed", error);
  }
};

</script>
