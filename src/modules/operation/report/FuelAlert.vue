<template>
  <div class="bg-surface rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <span class="mdi mdi-fuel text-amber-500 text-lg"></span>
        <h3 class="font-semibold text-gray-800">Fuel Alerts</h3>
      </div>
      <span class="text-xs font-semibold bg-amber-50 text-amber-600 px-2.5 py-1 rounded-full">
        {{ fuelAlerts.length }}
      </span>
    </div>

    <div v-if="loading" class="flex justify-center items-center py-10">
      <span class="mdi mdi-loading mdi-spin text-2xl text-indigo-400" />
    </div>

    <div v-else-if="fuelAlerts.length === 0" class="flex flex-col items-center justify-center py-8 text-center">
      <span class="mdi mdi-check-circle-outline text-3xl text-gray-300 mb-2"></span>
      <p class="text-sm text-gray-400">No fuel alerts</p>
    </div>

    <div v-else class="overflow-y-auto max-h-80 -mx-1 px-1 space-y-2">
      <div
        v-for="alert in fuelAlerts"
        :key="alert._id"
        class="border border-gray-100 rounded-xl p-3 hover:bg-surface-hover transition-colors cursor-pointer"
        @click="viewDetails(alert)"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-1.5 mb-0.5">
              <span class="mdi mdi-truck text-gray-400 text-sm"></span>
              <p class="text-sm font-medium text-gray-800">{{ alert.shipment?.vehiclePlateNumber || "N/A" }}</p>
            </div>
            <p class="text-xs text-gray-400 ml-5">{{ alert.shipment?.shipmentCode || "—" }} · {{ formatTitle(alert.shipment?.routeName) || "—" }}</p>
            <p class="text-xs text-gray-400 ml-5">Driver: {{ alert.shipment?.driverName || "—" }}</p>
          </div>
          <div class="text-right shrink-0 ml-2">
            <span
              class="text-xs font-semibold px-2 py-0.5 rounded-full"
              :class="alert.excessLiters >= 500 ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'"
            >
              +{{ alert.excessLiters }} L
            </span>
            <p class="text-xs text-gray-400 mt-0.5">{{ getSeverity(alert.excessLiters) }}</p>
          </div>
        </div>
        <!-- Fuel excess bar -->
        <div class="mt-2 h-1 rounded-full bg-gray-100">
          <div
            class="h-full rounded-full"
            :class="alert.excessLiters >= 500 ? 'bg-red-400' : 'bg-amber-400'"
            :style="{ width: `${Math.round(Math.min((alert.excessLiters / 1000) * 100, 100))}%` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

defineProps<{
  fuelAlerts: Array<{
    _id: string;
    excessLiters: number;
    createdAt: string;
    shipment?: { _id: string; vehiclePlateNumber?: string; shipmentCode?: string; routeName?: string; driverName?: string };
    advancePayment?: { advanceNumber?: string };
  }>;
  loading?: boolean;
}>();

const router = useRouter();

function viewDetails(alert: any) {
  if (alert.shipment?._id) {
    router.push({ path: `/operation/shipments/${alert.shipment._id}`, query: { tab: 'settlements' } });
  }
}
function formatTitle(text?: string) {
  if (!text) return "";
  return text.toLowerCase().split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}
function getSeverity(liters: number) {
  if (liters >= 800) return "Critical";
  if (liters >= 500) return "High";
  return "Moderate";
}
</script>
