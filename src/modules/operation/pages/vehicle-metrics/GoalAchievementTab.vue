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

    <Teleport to="#extra-page-data" defer>
      <StatsCards :stats="summaryStats" :loading="isLoading" />
    </Teleport>

    <Table
      :columns="columns"
      :rows="tableData"
      :loading="isLoading"
      :show_pagination="false"
      client_sort
      client_search
    >
      <template #after-search>
        <VehicleMetricsFilter pagination-id="/goal-achievement" @change="(val) => Object.assign(filters, val)" />
      </template>

      <template #cell-plateNumber="{ row }">
        <div class="flex flex-col">
          <span class="font-black text-gray-900">{{ row.plateNumber }}</span>
          <span class="text-[10px] text-gray-400 font-bold uppercase">{{
            row.ownership
          }}</span>
        </div>
      </template>

      <!-- Goals -->
      <template #cell-kmGoal="{ row }">
        <span class="font-medium">{{ numberFormatter(row.kmGoal) }}</span>
      </template>

      <template #cell-shipmentGoal="{ row }">
        <span class="font-medium">{{ numberFormatter(row.shipmentGoal) }}</span>
      </template>

      <template #cell-fuelEfficiencyGoal="{ row }">
        <span class="font-medium">{{
          row.fuelEfficiencyGoal?.toFixed(2)
        }}</span>
      </template>

      <!-- Achievement Percentages -->
      <template #cell-distanceAchievementPct="{ row }">
        <div class="flex flex-col gap-1 min-w-[80px]">
          <div class="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
            <div
              :class="[
                'h-full rounded-full',
                getPercentageColor(row.distanceAchievementPct),
              ]"
              :style="{
                width: `${Math.min(100, row.distanceAchievementPct || 0)}%`,
              }"
            ></div>
          </div>
          <span
            :class="[
              'text-[10px] font-bold',
              getPercentageTextColor(row.distanceAchievementPct),
            ]"
            >{{ row.distanceAchievementPct?.toFixed(1) || "0.0" }}%</span
          >
        </div>
      </template>

      <template #cell-shipmentAchievementPct="{ row }">
        <div class="flex flex-col gap-1 min-w-[80px]">
          <div class="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
            <div
              :class="[
                'h-full rounded-full',
                getPercentageColor(row.shipmentAchievementPct),
              ]"
              :style="{
                width: `${Math.min(100, row.shipmentAchievementPct || 0)}%`,
              }"
            ></div>
          </div>
          <span
            :class="[
              'text-[10px] font-bold',
              getPercentageTextColor(row.shipmentAchievementPct),
            ]"
            >{{ row.shipmentAchievementPct?.toFixed(1) || "0.0" }}%</span
          >
        </div>
      </template>

      <template #cell-fuelEfficiencyAchievementPct="{ row }">
        <div class="flex flex-col gap-1 min-w-[80px]">
          <div class="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
            <div
              :class="[
                'h-full rounded-full',
                getPercentageColor(row.fuelEfficiencyAchievementPct),
              ]"
              :style="{
                width: `${Math.min(100, row.fuelEfficiencyAchievementPct || 0)}%`,
              }"
            ></div>
          </div>
          <span
            :class="[
              'text-[10px] font-bold',
              getPercentageTextColor(row.fuelEfficiencyAchievementPct),
            ]"
            >{{ row.fuelEfficiencyAchievementPct?.toFixed(1) || "0.0" }}%</span
          >
        </div>
      </template>

      <template #cell-actions="{ row }">
        <div class="flex items-center gap-2">
          <Button
            size="sm"
            class="truncate"
            variant="outline"
            @click="handleEditGoal(row)"
            >Override</Button
          >
        </div>
      </template>
    </Table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { icons } from "@/utils/icons";
import { usePagination } from "@/composables/usePagination";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import Table from "@/components/common/Table.vue";
import type { TableColumn } from "@/components/common/Table.vue";
import Button from "@/components/common/Button.vue";
import StatsCards from "@/components/common/StatsCards.vue";
import VehicleMetricsFilter from "../../components/VehicleMetricsFilter.vue";
import {
  fetch_vehicle_goal_achievement,
  upsert_vehicle_monthly_goal,
  vehicle_api,
} from "../../api/operation.api";
import { numberFormatter } from "@/utils/utils";
import { useToastStore } from "@/store/toastStore";
import { exportGoalAchievement } from "../../utils/vehicleMetricsExport";
import { openModal } from "@customizer/modal-x";

const props = defineProps<{
  dateRange: { start: string; end: string | null };
}>();

const toast = useToastStore();
const queryClient = useQueryClient();

const filters = ref({
  region: "",
  vehicleType: "",
  search: "",
});

const handleExport = async () => {
  try {
    exportGoalAchievement(tableData.value || []);
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
  url: "/goal-achievement",
  api: vehicle_api,
  params: computed(() => {
    const date = new Date(props.dateRange.start);
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      page: undefined,
      limit: undefined,
    };
  }),
  queryKey: ["vehicleGoalAchievement"],
});

const tableData = computed(() => {
  let data = (rawTableData.value ?? []) as any[];
  const f = filters.value;
  if (f.region) data = data.filter((r) => (r.region?._id ?? r.region ?? r.regionId) === f.region);
  if (f.vehicleType) data = data.filter((r) => (r.vehicleType?._id ?? r.vehicleType) === f.vehicleType);
  return data;
});

const totalRows = computed(() => fullResponse.value?.total || 0);
const summary = computed(() => fullResponse.value?.summary || {});

const summaryStats = computed(() => [
  {
    label: "Avg Revenue",
    value: numberFormatter(summary.value.avgRevenue),
    unit: "ETB",
  },
  {
    label: "Avg Distance",
    value: numberFormatter(summary.value.avgDistanceKm),
    unit: "Km",
  },
  {
    label: "Avg Shipment Count",
    value: summary.value.avgShipmentCount?.toFixed(1) || "0.0",
    unit: "Ships",
  },
  {
    label: "Avg Fuel Efficiency",
    value: summary.value.avgFuelEfficiency?.toFixed(2) || "0.00",
    unit: "Km/L",
  },
]);

const columns: TableColumn[] = [
  { key: "plateNumber", label: "Plate", sortable: true },
  { key: "regionName", label: "Region" },
  { key: "ownership", label: "Ownership" },
  { key: "vehicleUseType", label: "Vehicle Use" },
  { key: "totalRevenue", label: "Revenue", sortable: true },
  { key: "goalDistanceKm", label: "Km Goal", sortable: true },
  { key: "actualDistanceKm", label: "Km Actual", sortable: true },
  { key: "distanceAchievementPct", label: "Km %", sortable: true },
  { key: "goalShipmentCount", label: "Ship Goal", sortable: true },
  { key: "actualShipmentCount", label: "Ship Actual", sortable: true },
  { key: "shipmentAchievementPct", label: "Ship %", sortable: true },
  { key: "goalFuelEfficiency", label: "Fuel Goal", sortable: true },
  { key: "actualFuelEfficiency", label: "Fuel Actual", sortable: true },
  { key: "fuelEfficiencyAchievementPct", label: "Fuel %", sortable: true },
  { key: "actions", label: "", cellAlign: "right" },
];

const handleEditGoal = (row: any) => {
  const startDate = new Date(props.dateRange.start);
  openModal("VehicleGoalModal", {
    vehicleId: row._id,
    plateNumber: row.plateNumber,
    goals: {
      targetDistanceKm: row.goalDistanceKm || 0,
      targetShipmentCount: row.goalShipmentCount || 0,
      targetFuelEfficiency: row.goalFuelEfficiency || 0,
      month: startDate.getMonth() + 1,
      year: startDate.getFullYear(),
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicleGoalAchievement"] });
    },
  });
};

const getPercentageColor = (val: number) => {
  if (!val) return "bg-gray-200";
  if (val >= 90) return "bg-green-500";
  if (val >= 70) return "bg-yellow-500";
  return "bg-red-500";
};

const getPercentageTextColor = (val: number) => {
  if (!val) return "text-gray-400";
  if (val >= 90) return "text-green-600";
  if (val >= 70) return "text-yellow-600";
  return "text-red-600";
};

</script>
