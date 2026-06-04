<template>
  <div class="bg-surface rounded-2xl border border-gray-100 shadow-sm p-5 @container">
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-semibold text-gray-800">Driver Status</h3>
      <button @click="refetch()" class="text-gray-400 hover:text-gray-600 transition-colors">
        <span class="mdi mdi-refresh text-lg" :class="isFetching ? 'animate-spin' : ''" />
      </button>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center h-48">
      <span class="mdi mdi-loading mdi-spin text-2xl text-indigo-400" />
    </div>

    <div v-else class="flex flex-col @[380px]:flex-row items-center gap-4">
      <!-- donut -->
      <div class="shrink-0 flex justify-center">
        <apexchart
          type="donut"
          width="220"
          :options="chartOptions"
          :series="series"
        />
      </div>

      <!-- custom legend -->
      <div class="flex flex-col gap-1.5 flex-1 min-w-0 w-full @[380px]:w-auto">
        <button
          v-for="(item, i) in legendItems"
          :key="item.label"
          class="flex items-center gap-2 rounded-lg px-2 py-1 text-left transition-all w-full"
          :class="activeIndex === i
            ? 'bg-blue-50 ring-1 ring-blue-200'
            : 'hover:bg-surface-hover'"
          @click="toggleSegment(i)"
        >
          <span
            class="w-3 h-3 rounded-full shrink-0 transition-all"
            :style="{ background: colors[i], opacity: activeIndex !== null && activeIndex !== i ? 0.3 : 1 }"
          />
          <span
            class="text-xs truncate flex-1 transition-colors"
            :class="activeIndex === i ? 'text-blue-700 font-semibold' : 'text-gray-600'"
          >{{ item.label }}</span>
          <span class="text-xs font-bold shrink-0" :class="activeIndex === i ? 'text-blue-700' : 'text-gray-400'">
            {{ item.count.toLocaleString() }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useQuery } from "@tanstack/vue-query";
import ApexCharts from "apexcharts";
import { fetchDriverStatusCount } from "../../api/dashboard.api";

const CHART_ID = "driver-status-donut";

const { data, isLoading, isFetching, refetch } = useQuery({
  queryKey: ["dashboard-driver-status"],
  queryFn: fetchDriverStatusCount,
});

const colors = ["#2388FF", "#4E9FFF", "#8DC1FF", "#C3DDFF", "#E3EFFF", "#dbeafe", "#bfdbfe", "#93c5fd"];

const STATUSES = [
  { key: "readyToDispatch",    label: "Ready to Dispatch" },
  { key: "dispatched",         label: "Dispatched" },
  { key: "vehicleNotAssigned", label: "Vehicle not Assigned" },
  { key: "waitingToDispatch",  label: "Waiting to Dispatch" },
  { key: "fired",              label: "Fired" },
  { key: "terminated",         label: "Terminated" },
  { key: "suspended",          label: "Suspended" },
  { key: "unavailable",        label: "Unavailable" },
];

const legendItems = computed(() => {
  const raw = (data.value as any)?.data ?? {};
  return STATUSES.map(({ key, label }) => ({
    label,
    count: Number(raw[key] ?? 0),
  }));
});

const series = computed(() => legendItems.value.map((i) => i.count));
const total  = computed(() => series.value.reduce((a, b) => a + b, 0));

const activeIndex = ref<number | null>(null);

function toggleSegment(i: number) {
  ApexCharts.exec(CHART_ID, "toggleDataPointSelection", i);
  activeIndex.value = activeIndex.value === i ? null : i;
}

const chartOptions = computed(() => ({
  chart: {
    id: CHART_ID,
    type: "donut",
    animations: { speed: 400 },
    events: {
      dataPointSelection(_e: any, _ctx: any, config: any) {
        const i = config.dataPointIndex;
        activeIndex.value = activeIndex.value === i ? null : i;
      },
    },
  },
  colors,
  labels: legendItems.value.map((i) => i.label),
  legend: { show: false },
  dataLabels: {
    enabled: true,
    formatter: (_val: number, opts: any) =>
      opts.w.globals.series[opts.seriesIndex].toLocaleString(),
    style: { fontSize: "11px", fontWeight: 600, colors: ["#fff"] },
    dropShadow: { enabled: false },
  },
  plotOptions: {
    pie: {
      donut: {
        size: "65%",
        labels: {
          show: true,
          total: {
            show: true,
            label: "Total Drivers",
            fontSize: "11px",
            color: "#6b7280",
            formatter: () => total.value.toLocaleString(),
          },
          value: {
            show: true,
            fontSize: "18px",
            fontWeight: 700,
            color: "#1e3a8a",
            formatter: (v: string) => Number(v).toLocaleString(),
          },
        },
      },
      expandOnClick: true,
    },
  },
  tooltip: {
    enabled: true,
    fillSeriesColor: false,
    style: { fontSize: "13px" },
    y: { formatter: (v: number) => `${v.toLocaleString()} drivers` },
  },
  stroke: { width: 2, colors: ["#fff"] },
  states: {
    hover:  { filter: { type: "lighten", value: 0.1 } },
    active: { filter: { type: "darken",  value: 0.2 } },
  },
}));
</script>
