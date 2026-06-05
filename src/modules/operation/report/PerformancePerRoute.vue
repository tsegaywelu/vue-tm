<template>
  <div class="bg-surface rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-5">
    <div class="flex items-center justify-between">
      <h3 class="font-semibold text-gray-800">Performance Per Route</h3>
    </div>

    <div v-if="loading" class="flex justify-center items-center py-10">
      <span class="mdi mdi-loading mdi-spin text-2xl text-indigo-400" />
    </div>

    <template v-else>
      <!-- Top Performing -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Top Performing</span>
          <span class="text-xs font-semibold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">High Profit</span>
        </div>
        <div v-if="!topRoutes.length" class="text-sm text-gray-400 text-center py-4">No data</div>
        <div class="space-y-3">
          <div v-for="route in topRoutes" :key="route.routeId" class="border-b border-gray-50 last:border-0 pb-3 last:pb-0">
            <div class="flex justify-between mb-1.5">
              <span class="text-sm font-medium text-gray-800">{{ route.routeName }}</span>
              <span class="text-sm font-bold text-emerald-600">{{ (route.profitMargin ?? 0).toFixed(1) }}%</span>
            </div>
            <div class="flex justify-between text-xs text-gray-400 mb-1.5">
              <span>Revenue: {{ fmt(route.totalRevenue) }}</span>
              <span>Cost: {{ fmt(route.totalCost) }}</span>
            </div>
            <div class="w-full bg-gray-100 rounded-full h-1.5">
              <div
                class="bg-emerald-500 h-1.5 rounded-full transition-all"
                :style="{ width: `${Math.min(100, route.profitMargin ?? 0)}%` }"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Most Efficient -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Most Efficient</span>
          <span class="text-xs font-semibold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">Low Cost</span>
        </div>
        <div v-if="!efficientRoutes.length" class="text-sm text-gray-400 text-center py-4">No data</div>
        <div class="grid grid-cols-1 @[420px]:grid-cols-2 gap-3">
          <div v-for="route in efficientRoutes" :key="route.routeId" class="border border-gray-100 rounded-xl p-3">
            <div class="text-sm font-medium text-gray-800 mb-2 truncate">{{ route.routeName }}</div>
            <div class="flex items-center justify-between">
              <div class="text-center">
                <div class="text-xs text-gray-400">Cost/km</div>
                <div class="text-xs font-bold text-blue-600">{{ fmt(route.costPerKm) }}</div>
              </div>
              <!-- Circular progress -->
              <div class="relative w-12 h-12">
                <svg class="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#f3f4f6" stroke-width="3" />
                  <circle
                    cx="18" cy="18" r="14" fill="none" stroke="#6366f1" stroke-width="3"
                    stroke-linecap="round"
                    :stroke-dasharray="`${(route.profitMargin ?? 0) * 0.879} 87.9`"
                  />
                </svg>
                <div class="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-indigo-600">
                  {{ (route.profitMargin ?? 0).toFixed(0) }}%
                </div>
              </div>
              <div class="text-center">
                <div class="text-xs text-gray-400">Rev/km</div>
                <div class="text-xs font-bold text-emerald-600">{{ fmt(route.revenuePerKm) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Declining Routes -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Declining Routes</span>
          <span class="text-xs font-semibold bg-red-50 text-red-500 px-2 py-0.5 rounded-full">Needs Attention</span>
        </div>
        <div v-if="!decliningRoutes.length" class="text-sm text-gray-400 text-center py-4">No declining routes</div>
        <div v-else class="overflow-y-auto max-h-48">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-100">
                <th class="text-left text-xs font-semibold text-gray-500 pb-2">Route</th>
                <th class="text-right text-xs font-semibold text-gray-500 pb-2">Revenue</th>
                <th class="text-right text-xs font-semibold text-gray-500 pb-2">Margin</th>
                <th class="text-right text-xs font-semibold text-gray-500 pb-2">Trips</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="route in decliningRoutes"
                :key="route.routeId"
                class="border-b border-gray-50 last:border-0 hover:bg-surface-hover transition-colors"
              >
                <td class="py-2 text-xs text-gray-700">{{ route.routeName }}</td>
                <td class="py-2 text-xs text-gray-500 text-right">{{ fmt(route.totalRevenue) }}</td>
                <td class="py-2 text-xs font-semibold text-red-500 text-right">{{ (route.profitMargin ?? 0).toFixed(1) }}%</td>
                <td class="py-2 text-xs text-gray-500 text-right">{{ route.totalShipments }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  performanceData: any | null;
  loading?: boolean;
}>();

const topRoutes = computed(() => props.performanceData?.topRoutes ?? []);
const efficientRoutes = computed(() => props.performanceData?.efficientRoutes ?? []);
const decliningRoutes = computed(() => props.performanceData?.decliningRoutes ?? []);

function fmt(value: any) {
  if (value === undefined || value === null) return "ETB 0";
  return `ETB ${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value)}`;
}
</script>
