<template>
  <div class="bg-surface rounded-2xl border border-gray-100 shadow-sm p-5 @container">
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-semibold text-gray-800">Vehicle Status</h3>
      <button @click="refetch()" class="text-gray-400 hover:text-gray-600 transition-colors">
        <span class="mdi mdi-refresh text-lg" :class="isFetching ? 'animate-spin' : ''" />
      </button>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center h-48">
      <span class="mdi mdi-loading mdi-spin text-2xl text-indigo-400" />
    </div>

    <div v-else>
      <!-- semi-donut -->
      <div class="flex justify-center -mb-6">
        <apexchart
          type="donut"
          width="240"
          :options="chartOptions"
          :series="series"
        />
      </div>

      <!-- custom legend with counts -->
      <div class="grid grid-cols-2 gap-x-3 gap-y-1 mt-6">
        <button
          v-for="(item, i) in legendItems"
          :key="item.label"
          class="flex items-center justify-between gap-1.5 rounded-lg px-2 py-1 text-left transition-all"
          :class="activeIndex === i
            ? 'bg-blue-50 ring-1 ring-blue-200'
            : 'hover:bg-gray-50'"
          @click="toggleSegment(i)"
        >
          <div class="flex items-center gap-1.5 min-w-0">
            <span
              class="w-2.5 h-2.5 rounded-full shrink-0 transition-all"
              :style="{ background: colors[i], opacity: activeIndex !== null && activeIndex !== i ? 0.3 : 1 }"
            />
            <span
              class="text-xs truncate transition-colors"
              :class="activeIndex === i ? 'text-blue-700 font-semibold' : 'text-gray-600'"
            >{{ item.label }}</span>
          </div>
          <span
            class="text-xs font-bold shrink-0 ml-1"
            :class="activeIndex === i ? 'text-blue-700' : 'text-gray-800'"
          >{{ item.count.toLocaleString() }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useQuery } from "@tanstack/vue-query";
import ApexCharts from "apexcharts";
import { fetchVehicleStatusCount } from "../../api/dashboard.api";

const CHART_ID = "vehicle-status-donut";

const { data, isLoading, isFetching, refetch } = useQuery({
  queryKey: ["dashboard-vehicle-status"],
  queryFn: fetchVehicleStatusCount,
});

const colors = ["#2388FF", "#4E9FFF", "#8DC1FF", "#C3DDFF", "#E3EFFF", "#F7F9FE", "#dbeafe"];

const STATUSES = [
  { key: "available",   label: "Available" },
  { key: "assigned",    label: "Assigned" },
  { key: "maintenance", label: "Maintainance" },
  { key: "inactive",    label: "Inactive" },
  { key: "accident",    label: "Accident" },
  { key: "retired",     label: "Retired" },
  { key: "sold",        label: "Sold" },
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
      startAngle: -90,
      endAngle: 90,
      expandOnClick: true,
      donut: {
        size: "70%",
        labels: {
          show: true,
          total: {
            show: true,
            label: "Total Vehicles",
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
    },
  },
  tooltip: {
    enabled: true,
    fillSeriesColor: false,
    style: { fontSize: "13px" },
    y: { formatter: (v: number) => `${v.toLocaleString()} vehicles` },
  },
  stroke: { width: 2, colors: ["#fff"] },
  states: {
    hover:  { filter: { type: "lighten", value: 0.1 } },
    active: { filter: { type: "darken",  value: 0.2 } },
  },
}));
</script>
