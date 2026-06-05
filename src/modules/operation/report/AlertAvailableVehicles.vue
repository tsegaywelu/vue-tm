<template>
  <div class="bg-surface rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <span class="mdi mdi-truck-outline text-red-400 text-lg"></span>
        <h3 class="font-semibold text-gray-800">Available Vehicles</h3>
      </div>
      <span class="text-xs font-semibold bg-red-50 text-red-500 px-2.5 py-1 rounded-full">
        {{ alerts.length }}
      </span>
    </div>

    <div v-if="loading" class="flex justify-center items-center py-10">
      <span class="mdi mdi-loading mdi-spin text-2xl text-indigo-400" />
    </div>

    <div v-else-if="alerts.length === 0" class="flex flex-col items-center justify-center py-8 text-center">
      <span class="mdi mdi-check-circle-outline text-3xl text-gray-300 mb-2"></span>
      <p class="text-sm text-gray-400">All vehicles are utilized</p>
    </div>

    <div v-else class="overflow-y-auto max-h-80 -mx-1 px-1 space-y-2">
      <RouterLink
        v-for="alert in alerts"
        :key="alert.vehicleId"
        :to="`/vehicles/${alert.vehicleId}`"
        class="block border border-gray-100 rounded-xl p-3 hover:bg-surface-hover transition-colors"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-1.5 mb-0.5">
              <span class="mdi mdi-truck text-gray-400 text-sm"></span>
              <p class="text-sm font-medium text-gray-800">{{ alert.plateNumber }}</p>
            </div>
            <p class="text-xs text-gray-400 ml-5">Since {{ formatDate(alert.startTime) }}</p>
          </div>
          <div class="text-right shrink-0 ml-2">
            <span
              class="text-xs font-semibold px-2 py-0.5 rounded-full"
              :class="(alert.duration?.days ?? 0) >= 3 ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'"
            >
              {{ alert.duration?.days }}d {{ alert.duration?.hours }}h
            </span>
            <p class="text-xs text-gray-400 mt-0.5">{{ getStatus(alert.duration?.days) }}</p>
          </div>
        </div>
        <!-- Duration bar -->
        <div class="mt-2 h-1 rounded-full bg-gray-100">
          <div
            class="h-full rounded-full"
            :class="(alert.duration?.days ?? 0) >= 3 ? 'bg-red-400' : 'bg-amber-400'"
            :style="{ width: `${getPct(alert.duration?.totalMilliseconds)}%` }"
          ></div>
        </div>
        <p class="text-xs text-gray-400 mt-1.5">{{ alert.alertMessage }}</p>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  alerts: Array<{
    vehicleId: string;
    plateNumber: string;
    startTime: string;
    alertMessage: string;
    duration?: { days: number; hours: number; totalMilliseconds: number };
  }>;
  loading?: boolean;
}>();

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
function getPct(ms?: number) {
  if (!ms) return 0;
  return Math.round(Math.min((ms / (7 * 24 * 60 * 60 * 1000)) * 100, 100));
}
function getStatus(days?: number) {
  if (!days) return "Needs Attention";
  if (days >= 5) return "Critical";
  if (days >= 3) return "High Priority";
  return "Needs Attention";
}
</script>
