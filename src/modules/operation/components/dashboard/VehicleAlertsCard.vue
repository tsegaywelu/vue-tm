<template>
  <div class="bg-surface rounded-2xl border border-gray-100 shadow-sm p-5">
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-semibold text-gray-800">Vehicle Alerts</h3>
      <button @click="refetch()" class="text-gray-400 hover:text-gray-600 transition-colors">
        <span class="mdi mdi-refresh text-lg" :class="isFetching ? 'animate-spin' : ''" />
      </button>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center py-10">
      <span class="mdi mdi-loading mdi-spin text-2xl text-indigo-400" />
    </div>

    <div v-else class="grid grid-cols-1 @[560px]:grid-cols-2 gap-4">
      <!-- Speeding Alerts -->
      <div class="flex flex-col">
        <div class="flex items-center gap-1.5 mb-2">
          <span class="mdi mdi-speedometer text-red-400 text-sm"></span>
          <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Speeding</span>
          <span class="ml-auto text-xs font-semibold bg-red-50 text-red-500 px-1.5 py-0.5 rounded-full">{{ speedRows.length }}</span>
        </div>
        <div v-if="!speedRows.length" class="text-xs text-gray-400 text-center py-6">No speeding alerts</div>
        <div v-else class="overflow-y-auto max-h-64">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-100">
                <th class="text-left text-xs font-semibold text-gray-500 pb-2">Plate</th>
                <th class="text-left text-xs font-semibold text-gray-500 pb-2">Speed</th>
                <th class="text-right text-xs font-semibold text-gray-500 pb-2">Time</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="row in speedRows"
                :key="row.id"
                class="border-b border-gray-50 last:border-0 hover:bg-surface-hover transition-colors cursor-pointer"
                @click="row.vehicleId ? router.push(`/vehicles/${row.vehicleId}`) : undefined"
              >
                <td class="py-2 text-xs text-gray-700">
                  <div class="flex items-center gap-1">
                    <span class="text-[10px] font-bold px-1 py-0.5 rounded" :class="row.isLive ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'">
                      {{ row.isLive ? '⚡' : '◾' }}
                    </span>
                    {{ row.plate }}
                  </div>
                </td>
                <td class="py-2 text-xs font-semibold text-red-500">{{ row.speed }} kph</td>
                <td class="py-2 text-xs text-gray-400 text-right">{{ row.time }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Movement Alerts -->
      <div class="flex flex-col">
        <div class="flex items-center gap-1.5 mb-2">
          <span class="mdi mdi-map-marker-path text-indigo-400 text-sm"></span>
          <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Movement</span>
          <span class="ml-auto text-xs font-semibold bg-indigo-50 text-indigo-500 px-1.5 py-0.5 rounded-full">{{ movementRows.length }}</span>
        </div>
        <div v-if="!movementRows.length" class="text-xs text-gray-400 text-center py-6">No movement alerts</div>
        <div v-else class="overflow-y-auto max-h-64">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-100">
                <th class="text-left text-xs font-semibold text-gray-500 pb-2">Plate</th>
                <th class="text-right text-xs font-semibold text-gray-500 pb-2">Time</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="row in movementRows"
                :key="row.id"
                class="border-b border-gray-50 last:border-0 hover:bg-surface-hover transition-colors cursor-pointer"
                @click="row.vehicleId ? router.push(`/vehicles/${row.vehicleId}`) : undefined"
              >
                <td class="py-2 text-xs text-gray-700">
                  <div class="flex items-center gap-1">
                    <span class="text-[10px] font-bold px-1 py-0.5 rounded" :class="row.isLive ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'">
                      {{ row.isLive ? '⚡' : '◾' }}
                    </span>
                    {{ row.plate }}
                  </div>
                </td>
                <td class="py-2 text-xs text-gray-400 text-right">{{ row.time }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import { fetchVehicleAlerts } from "../../api/dashboard.api";

const router = useRouter();

const { data, isLoading, isFetching, refetch } = useQuery({
  queryKey: ["dashboard-vehicle-alerts"],
  queryFn: fetchVehicleAlerts,
  refetchInterval: 30_000,
});

const allAlerts = computed(() => {
  const raw = (data.value as any)?.data;
  const list: any[] = Array.isArray(raw)
    ? raw
    : Array.isArray(raw?.data) ? raw.data
    : Array.isArray(raw?.results) ? raw.results
    : [];
  return [...list]
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 40)
    .map((a: any) => ({
      id: a._id,
      alertType: a.alertType,
      plate: a.vehiclePlateNumber ?? "—",
      vehicleId: a.vehicle?._id,
      speed: a.speed ?? "—",
      time: a.createdAt
        ? new Date(a.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })
        : "—",
      isLive: false,
    }));
});

const speedRows    = computed(() => allAlerts.value.filter((a) => a.alertType === "SPEED").slice(0, 20));
const movementRows = computed(() => allAlerts.value.filter((a) => a.alertType === "MOVEMENT").slice(0, 20));
</script>
