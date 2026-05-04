<template>
  <div class="flex flex-col gap-6">
    <div class="rounded-3xl p-6 border border-grey-100">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-bold text-grey-900">Fuel History</h3>

        <div class="flex items-center gap-4">
          <div
            class="flex items-center gap-2 bg-white rounded-2xl border border-grey-100 px-4 py-2 shadow-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="text-grey-400"
            >
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
            <span class="text-xs font-medium text-grey-600">{{
              formattedRange
            }}</span>
          </div>
          <!-- Date filter would go here -->
        </div>
      </div>

      <Table
        :columns="columns"
        :rows="fuelUsage?.data || []"
        :loading="isLoading"
      >
        <template #cell-driver="{ row }">
          <span class="font-bold text-grey-900">{{ row.driver }}</span>
        </template>
        <template #cell-shipment="{ row }">
          <span class="text-grey-900">{{ row.shipment }}</span>
        </template>
        <template #cell-distance="{ row }">
          <span class="text-grey-900"
            >{{ row.waypoint?.distance?.toLocaleString() || "0" }} km</span
          >
        </template>
        <template #cell-amount="{ row }">
          <span class="font-bold text-primary"
            >{{ row.amount?.toLocaleString() || "0" }} ETB</span
          >
        </template>
        <template #cell-liters="{ row }">
          <span class="text-grey-900"
            >{{ row.liters?.toLocaleString() || "0" }} L</span
          >
        </template>
        <template #cell-AFU="{ row }">
          <span class="text-grey-500"
            >{{ row.AFU?.toLocaleString() || "0" }} L</span
          >
        </template>
      </Table>
      <!-- Totals Footer -->
      <div
        v-if="fuelUsage?.data?.length"
        class="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <TotalCard label="Total Distance" :value="`${totalDistance} km`" />
        <TotalCard label="Total Amount" :value="`${totalAmount} ETB`" />
        <TotalCard label="Total Liters" :value="`${totalLiters} L`" />
        <TotalCard label="Total Standard" :value="`${totalAFU} L`" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useQuery } from "@tanstack/vue-query";
import type { Vehicle } from "../../operation.types";
import { fetch_vehicle_fuel_usage } from "../../api/operation.api";
import BaseTable from "@/components/common/Table.vue";
import TotalCard from "./TotalCard.vue";

const props = defineProps<{
  vehicle: Vehicle;
}>();

const startDate = ref<string>("");
const endDate = ref<string>("");

// Default to last month
const getDefaultDates = () => {
  const today = new Date();
  const lastMonth = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    today.getDate(),
  );
  return {
    start: lastMonth.toISOString(),
    end: today.toISOString(),
  };
};

const { data: fuelUsage, isLoading } = useQuery({
  queryKey: ["vehicle-fuel-usage", props.vehicle._id, startDate, endDate],
  queryFn: () => {
    const dates = getDefaultDates();
    return fetch_vehicle_fuel_usage({
      id: props.vehicle._id,
      startDate: startDate.value || dates.start,
      endDate: endDate.value || dates.end,
    });
  },
});

const columns = [
  { key: "number", label: "Number" },
  { key: "driver", label: "Driver" },
  { key: "shipment", label: "Shipment" },
  { key: "route", label: "Route" },
  { key: "distance", label: "Distance" },
  { key: "amount", label: "Amount" },
  { key: "liters", label: "Given Liters" },
  { key: "AFU", label: "Standard Liters" },
];

const totalDistance = computed(
  () =>
    fuelUsage.value?.data
      ?.reduce((sum: number, r: any) => sum + (r.waypoint?.distance || 0), 0)
      ?.toLocaleString() || "0",
);
const totalAmount = computed(
  () =>
    fuelUsage.value?.data
      ?.reduce((sum: number, r: any) => sum + (r.amount || 0), 0)
      ?.toLocaleString() || "0",
);
const totalLiters = computed(
  () =>
    fuelUsage.value?.data
      ?.reduce((sum: number, r: any) => sum + (r.liters || 0), 0)
      ?.toLocaleString() || "0",
);
const totalAFU = computed(
  () =>
    fuelUsage.value?.data
      ?.reduce((sum: number, r: any) => sum + (r.AFU || 0), 0)
      ?.toLocaleString() || "0",
);

const formattedRange = computed(() => {
  const dates = getDefaultDates();
  const start = new Date(startDate.value || dates.start).toLocaleDateString();
  const end = new Date(endDate.value || dates.end).toLocaleDateString();
  return `${start} - ${end}`;
});
</script>
