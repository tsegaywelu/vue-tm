<template>
  <div
    class="relative flex flex-col justify-between p-5 rounded-2xl overflow-hidden min-w-[220px] flex-1 cursor-pointer transition-all duration-200"
    :class="isActive ? 'text-white shadow-lg' : 'bg-surface text-gray-800 border border-gray-100 shadow-sm hover:shadow-md'"
    :style="isActive ? activeStyle : ''"
  >
    <!-- background pattern for active card -->
    <div v-if="isActive" class="absolute inset-0 opacity-10 pointer-events-none">
      <svg width="100%" height="100%" viewBox="0 0 200 120" fill="none">
        <circle cx="160" cy="20" r="60" fill="white" />
        <circle cx="180" cy="100" r="40" fill="white" />
      </svg>
    </div>

    <!-- header -->
    <div class="flex items-center justify-between mb-3 relative z-10">
      <div
        class="flex items-center justify-center w-9 h-9 rounded-full"
        :class="isActive ? 'bg-surface/20' : 'bg-indigo-50'"
      >
        <span class="mdi mdi-package-variant-closed text-lg" :class="isActive ? 'text-white' : 'text-indigo-600'" />
      </div>
      <span
        class="text-xs font-semibold px-2 py-0.5 rounded-full"
        :class="isActive ? 'bg-green-400/30 text-green-100' : 'bg-green-50 text-green-600'"
      >
        +24%
      </span>
    </div>

    <!-- value + sparkline row -->
    <div class="flex items-end justify-between gap-2 relative z-10">
      <div>
        <div class="text-2xl font-extrabold leading-none">
          {{ loading ? '—' : formatNumber(value) }}
        </div>
        <div class="text-xs mt-1 font-medium" :class="isActive ? 'text-white/70' : 'text-gray-400'">
          {{ title }}
        </div>
      </div>
      <div class="w-20 h-10 flex-shrink-0">
        <apexchart
          type="bar"
          height="40"
          :options="sparklineOptions"
          :series="sparklineSeries"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  title: string;
  value: number;
  isActive?: boolean;
  loading?: boolean;
}>();

const activeStyle =
  "background: linear-gradient(135deg, #312e81 0%, #1e40af 60%, #1d4ed8 100%);";

const sparklineData = [18, 22, 14, 30, 25, 35, 28, 40, 32, 45];

const sparklineSeries = [{ name: "", data: sparklineData }];

const sparklineOptions = computed(() => ({
  chart: {
    type: "bar",
    sparkline: { enabled: true },
    animations: { enabled: false },
  },
  plotOptions: {
    bar: { columnWidth: "60%", borderRadius: 2 },
  },
  colors: [props.isActive ? "#86efac" : "#6366f1"],
  tooltip: { enabled: false },
}));

function formatNumber(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return n.toLocaleString();
  return String(n);
}
</script>
