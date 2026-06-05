<template>
  <div class="bg-surface rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <span class="mdi mdi-clock-alert-outline text-blue-500 text-lg"></span>
        <h3 class="font-semibold text-gray-800">Delayed Receivables</h3>
      </div>
      <span class="text-xs font-semibold bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full">
        {{ filteredAlerts.length }}
      </span>
    </div>

    <div v-if="loading" class="flex justify-center items-center py-10">
      <span class="mdi mdi-loading mdi-spin text-2xl text-indigo-400" />
    </div>

    <div v-else-if="filteredAlerts.length === 0" class="flex flex-col items-center justify-center py-8 text-center">
      <span class="mdi mdi-check-circle-outline text-3xl text-gray-300 mb-2"></span>
      <p class="text-sm text-gray-400">No active alerts</p>
    </div>

    <div v-else class="overflow-y-auto max-h-80 -mx-1 px-1 space-y-2">
      <RouterLink
        v-for="(alert, index) in filteredAlerts"
        :key="alert.id || index"
        :to="`/operation/shipments/${alert.shipmentId || ''}`"
        class="block border border-gray-100 rounded-xl p-3 hover:bg-surface-hover transition-colors"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-1.5 mb-0.5">
              <span
                class="mdi text-sm"
                :class="alert.isCritical ? 'mdi-alert-octagon text-red-500' : 'mdi-alert-circle-outline text-amber-500'"
              ></span>
              <p class="text-sm font-medium text-gray-800 truncate">{{ alert.message }}</p>
            </div>
            <p class="text-xs text-gray-400 ml-5">{{ formatDate(alert.completedTime) }}</p>
          </div>
          <div class="flex items-center gap-2 shrink-0 ml-2">
            <span
              class="text-xs font-semibold px-2 py-0.5 rounded-full"
              :class="alert.isCritical ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'"
            >
              {{ alert.isCritical ? "Critical" : "Warning" }}
            </span>
            <button
              @click.prevent="dismiss(index)"
              class="text-gray-300 hover:text-gray-500 transition-colors"
            >
              <span class="mdi mdi-close text-sm"></span>
            </button>
          </div>
        </div>
        <!-- Severity bar -->
        <div class="mt-2 h-1 rounded-full bg-gray-100">
          <div
            class="h-full rounded-full transition-all"
            :class="alert.isCritical ? 'bg-red-400' : 'bg-amber-400'"
            :style="{ width: `${alert.isCritical ? 100 : 70}%` }"
          ></div>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const props = defineProps<{
  alerts: Array<{ id?: string; shipmentId?: string; message: string; completedTime: string; isCritical: boolean }>;
  loading?: boolean;
}>();

const dismissed = ref(new Set<number>());
const filteredAlerts = computed(() => props.alerts.filter((_, i) => !dismissed.value.has(i)));

function dismiss(i: number) {
  dismissed.value = new Set([...dismissed.value, i]);
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}
</script>
