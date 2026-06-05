<template>
  <!-- Date range picker + loading spinner teleported into the page header action bar -->
  <Teleport to="#page-actions" defer>
    <div class="flex items-center gap-2">
      <Transition
        enter-active-class="transition-opacity duration-200"
        leave-active-class="transition-opacity duration-200"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
      >
        <i v-if="isLoading" v-html="icons.spinner" class="*:size-5 text-xl text-primary animate-spin" />
      </Transition>
      <DateRangePicker v-model="dateRange" />
    </div>
  </Teleport>

  <div class="flex flex-col gap-3 p-3 sm:gap-6 sm:p-6 min-h-full bg-gray-50">

    <!-- Metric Cards -->
    <div v-if="isLoading" class="grid grid-cols-1 @[560px]:grid-cols-2 @[900px]:grid-cols-4 gap-4">
      <div v-for="i in 4" :key="i" class="bg-surface rounded-2xl border border-gray-100 shadow-sm p-5 flex justify-center items-center h-28">
        <span class="mdi mdi-loading mdi-spin text-2xl text-indigo-400" />
      </div>
    </div>
    <ShipmentReportCounts v-else :counts="countsData" />

    <ExpenseRevenueChart
      :expense-revenue-data="financialData"
      :shipments-per-region="regionData"
      :loading="isLoading"
    />

    <PerformancePerRoute :performance-data="performanceData" :loading="isLoading" />

    <MonthComparison :months-data="comparisonData" :loading="isLoading" />

    <div class="grid grid-cols-1 @[560px]:grid-cols-2 gap-4">
      <AlertAvailableVehicles :alerts="vehiclesData" :loading="isLoading" />
      <AlertDelayedReceivable :alerts="receivableData" :loading="isLoading" />
      <AlertDelayedInvoices :alerts="invoiceData" :loading="isLoading" />
      <FuelAlert :fuel-alerts="fuelData" :loading="isLoading" />
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { icons } from "@/utils/icons";

import DateRangePicker from "@/components/common/DateRangePicker.vue";
import ShipmentReportCounts from "./ShipmentReportCounts.vue";
import ExpenseRevenueChart from "./ExpenseRevenueChart.vue";
import PerformancePerRoute from "./PerformancePerRoute.vue";
import MonthComparison from "./MonthComparison.vue";
import AlertDelayedReceivable from "./AlertDelayedReceivable.vue";
import AlertDelayedInvoices from "./AlertDelayedInvoices.vue";
import AlertAvailableVehicles from "./AlertAvailableVehicles.vue";
import FuelAlert from "./FuelAlert.vue";

import {
  fetch_expense_and_revenue_monthly,
  fetch_month_comparison,
  fetch_shipments_per_region,
  fetch_performance_per_route,
  fetch_delayed_receivable,
  fetch_delayed_invoice,
  fetch_shipment_report_counts,
  fetch_delayed_available_vehicles,
  fetch_fuel_alerts,
} from "./report.api";

// Default: first day of 3 months ago → today, as YYYY-MM-DD strings
function toYMD(d: Date) {
  return d.toISOString().slice(0, 10);
}
function defaultStart() {
  const d = new Date();
  d.setMonth(d.getMonth() - 3);
  d.setDate(1);
  return toYMD(d);
}

const dateRange = ref({ start: defaultStart(), end: toYMD(new Date()) });

// Convert YYYY-MM-DD → ISO string for the API
const dateParams = computed(() => ({
  startDate: dateRange.value.start ? new Date(dateRange.value.start).toISOString() : "",
  endDate: dateRange.value.end ? new Date(dateRange.value.end).toISOString() : "",
}));

const { data: allData, isLoading } = useQuery({
  queryKey: ["reports-all", dateParams],
  queryFn: () =>
    Promise.all([
      fetch_shipment_report_counts(dateParams.value),   // 0
      fetch_expense_and_revenue_monthly(dateParams.value), // 1
      fetch_shipments_per_region(dateParams.value),     // 2
      fetch_performance_per_route(dateParams.value),    // 3
      fetch_month_comparison(),                         // 4
      fetch_delayed_receivable(),                       // 5
      fetch_delayed_invoice(),                          // 6
      fetch_delayed_available_vehicles(),               // 7
      fetch_fuel_alerts(),                              // 8
    ]),
});

const d = (i: number) => (allData.value?.[i] as any)?.data;

const countsData      = computed(() => d(0));
const financialData   = computed(() => { const v = d(1); return Array.isArray(v) ? v : []; });
const regionData      = computed(() => d(2) ?? []);
const performanceData = computed(() => d(3) ?? null);
const comparisonData  = computed(() => d(4) ?? null);
const receivableData  = computed(() => d(5) ?? []);
const invoiceData     = computed(() => d(6) ?? []);
const vehiclesData    = computed(() => d(7) ?? []);
const fuelData        = computed(() => d(8)?.results ?? []);
</script>
