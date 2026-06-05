<template>
  <div class="bg-surface rounded-2xl border border-gray-100 shadow-sm p-5 @container">
    <!-- Header -->
    <div class="flex flex-col gap-2 @[480px]:flex-row @[480px]:items-center @[480px]:justify-between mb-4">
      <h3 class="font-semibold text-base-text shrink-0">{{ views[activeTab].title }}</h3>
      <!-- Tab pills -->
      <div class="flex items-center gap-1 bg-gray-100 dark:bg-surface-hover rounded-xl p-1 self-start @[480px]:self-auto">
        <button
          v-for="(view, i) in views"
          :key="i"
          @click="activeTab = i"
          class="px-3 py-1 rounded-lg text-xs font-semibold transition-all"
          :class="activeTab === i
            ? 'bg-surface text-indigo-600 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'"
        >
          {{ view.label }}
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center h-48 @[400px]:h-60 @[600px]:h-80">
      <i v-html="icons.spinner" class="text-2xl text-indigo-400 animate-spin" />
    </div>

    <!-- Chart -->
    <div v-else class="h-48 @[400px]:h-60 @[600px]:h-80">
      <apexchart
        :key="activeTab"
        :type="views[activeTab].type"
        :options="chartOptions"
        :series="chartSeries"
        height="100%"
      />
    </div>

    <!-- Custom legend -->
    <div v-if="!loading" class="flex flex-wrap justify-center gap-4 mt-4 pt-3 border-t border-gray-50">
      <div v-for="s in chartSeries" :key="s.name" class="flex items-center gap-1.5">
        <span class="inline-block w-2.5 h-2.5 rounded-full" :style="{ backgroundColor: s.color }"></span>
        <span class="text-xs text-gray-500">{{ s.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { icons } from "@/utils/icons";
import { useThemeStore } from "@/store/themeStore";

const props = defineProps<{
  expenseRevenueData: any;
  shipmentsPerRegion: any;
  loading?: boolean;
}>();

const themeStore = useThemeStore();
const isDark = computed(() => themeStore.mode === "dark" || themeStore.mode === "black");

const activeTab = ref(0);

const views = [
  { title: "Monthly Expenses vs Revenue", label: "Financial", type: "line" },
  { title: "Monthly Shipment Trends", label: "Shipments", type: "line" },
  { title: "Shipments by Region", label: "Regional", type: "bar" },
];

const sortedFinancial = computed(() => {
  const src = Array.isArray(props.expenseRevenueData) ? props.expenseRevenueData : [];
  return [...src].sort((a, b) => a.year !== b.year ? a.year - b.year : a.month - b.month);
});

const regionMonths = computed(() => Array.isArray(props.shipmentsPerRegion) ? props.shipmentsPerRegion : []);

const financialSeries = computed(() => [
  {
    name: "Expenses",
    color: "#f87171",
    data: sortedFinancial.value.map((d) => d.totalExpensesSum ?? 0),
  },
  {
    name: "Revenue",
    color: "#2388FF",
    data: sortedFinancial.value.map((d) => d.totalRevenueSum ?? d.shipmentTotalPriceSum ?? 0),
  },
  {
    name: "Profit",
    color: "#34d399",
    data: sortedFinancial.value.map((d) => d.profit ?? 0),
  },
]);

const shipmentSeries = computed(() => [
  { name: "Total", color: "#2388FF", data: regionMonths.value.map((d: any) => d.totalShipmentCount ?? 0) },
  { name: "Outbound", color: "#8b5cf6", data: regionMonths.value.map((d: any) => d.outboundShipmentCount ?? 0) },
  { name: "Inbound", color: "#f59e0b", data: regionMonths.value.map((d: any) => d.inboundShipmentCount ?? 0) },
  { name: "Site Transfer", color: "#34d399", data: regionMonths.value.map((d: any) => d.siteTransferShipmentCount ?? 0) },
]);

const REGION_COLORS = ["#2388FF", "#8b5cf6", "#f59e0b", "#34d399", "#f87171", "#a78bfa"];

const regionalSeries = computed(() => {
  const allNames = new Set<string>();
  regionMonths.value.forEach((m: any) => m.regions?.forEach((r: any) => allNames.add(r.regionName)));
  return [...allNames].flatMap((name, idx) => {
    const c = REGION_COLORS[idx % REGION_COLORS.length];
    return [
      {
        name: `${name} Out`,
        color: c,
        data: regionMonths.value.map((m: any) => m.regions?.find((r: any) => r.regionName === name)?.outBoundCount ?? 0),
      },
      {
        name: `${name} In`,
        color: c + "99",
        data: regionMonths.value.map((m: any) => m.regions?.find((r: any) => r.regionName === name)?.inBoundCount ?? 0),
      },
      {
        name: `${name} Transfer`,
        color: c + "55",
        data: regionMonths.value.map((m: any) => m.regions?.find((r: any) => r.regionName === name)?.siteTransferCount ?? 0),
      },
    ];
  });
});

const chartSeries = computed(() => {
  if (activeTab.value === 0) return financialSeries.value;
  if (activeTab.value === 1) return shipmentSeries.value;
  return regionalSeries.value;
});

const activeLabels = computed(() => {
  if (activeTab.value === 0) return sortedFinancial.value.map((d) => `${d.monthName} ${d.year}`);
  return regionMonths.value.map((d: any) => `${d.monthName} ${d.year}`);
});

const isFinancial = computed(() => activeTab.value === 0);
const isBar = computed(() => activeTab.value === 2);

const axisColor = computed(() => isDark.value ? "#6b7280" : "#9ca3af");
const gridColor = computed(() => isDark.value ? "#2a2a3f" : "#f3f4f6");

const chartOptions = computed(() => ({
  chart: {
    type: isBar.value ? "bar" : "line",
    toolbar: { show: false },
    stacked: isBar.value,
    animations: { speed: 350 },
    background: "transparent",
    foreColor: axisColor.value,
  },
  theme: {
    mode: isDark.value ? "dark" : "light",
  },
  colors: chartSeries.value.map((s) => s.color),
  stroke: isBar.value ? { width: 0 } : { curve: "smooth", width: 2.5 },
  xaxis: {
    categories: activeLabels.value,
    labels: { style: { colors: axisColor.value, fontSize: "11px" } },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    labels: {
      minWidth: 48,
      style: { color: axisColor.value, fontSize: "11px" },
      formatter: isFinancial.value
        ? (v: number) => new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 0 }).format(v)
        : (v: number) => v.toLocaleString(),
    },
  },
  tooltip: {
    theme: isDark.value ? "dark" : "light",
    y: {
      formatter: isFinancial.value
        ? (v: number) => `ETB ${new Intl.NumberFormat("en-US").format(v)}`
        : (v: number) => v.toLocaleString(),
    },
  },
  grid: { borderColor: gridColor.value, strokeDashArray: 4 },
  legend: { show: false },
  plotOptions: isBar.value ? { bar: { columnWidth: "60%", borderRadius: 3 } } : {},
  markers: isBar.value ? {} : { size: 3, hover: { size: 5 } },
  dataLabels: { enabled: false },
}));
</script>
