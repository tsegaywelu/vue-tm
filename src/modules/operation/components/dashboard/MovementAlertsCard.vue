<template>
  <div class="bg-surface rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <span class="mdi mdi-map-marker-path text-indigo-400 text-lg"></span>
        <h3 class="font-semibold text-gray-800">Movement Alerts</h3>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-xs font-semibold bg-indigo-50 text-indigo-500 px-2 py-0.5 rounded-full">{{ rows.length }}</span>
        <button @click="refetch()" class="text-gray-400 hover:text-gray-600 transition-colors">
          <span class="mdi mdi-refresh text-lg" :class="isFetching ? 'animate-spin' : ''" />
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center py-10">
      <span class="mdi mdi-loading mdi-spin text-2xl text-indigo-400" />
    </div>

    <div v-else-if="!rows.length" class="text-sm text-gray-400 text-center py-8">
      No movement alerts
    </div>

    <div v-else class="overflow-y-auto flex-1 max-h-72">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-100">
            <th class="text-left text-xs font-semibold text-gray-500 pb-2">Plate</th>
            <th class="text-right text-xs font-semibold text-gray-500 pb-2">Time</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in rows"
            :key="row.id"
            class="border-b border-gray-50 last:border-0 hover:bg-surface-hover transition-colors cursor-pointer"
            @click="row.vehicleId ? router.push(`/vehicles/${row.vehicleId}`) : undefined"
          >
            <td class="py-2 text-xs text-gray-700 flex items-center gap-1">
              <span
                class="text-[10px] font-bold px-1 py-0.5 rounded"
                :class="row.isLive ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'"
              >{{ row.isLive ? '⚡' : '◾' }}</span>
              {{ row.plate }}
            </td>
            <td class="py-2 text-xs text-gray-400 text-right">{{ row.time }}</td>
          </tr>
        </tbody>
      </table>
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

const rows = computed(() => {
  const raw = (data.value as any)?.data;
  const list: any[] = Array.isArray(raw) ? raw
    : Array.isArray(raw?.data) ? raw.data
    : Array.isArray(raw?.results) ? raw.results
    : [];
  return [...list]
    .filter((a: any) => a.alertType === "MOVEMENT")
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 20)
    .map((a: any) => ({
      id: a._id,
      plate: a.vehiclePlateNumber ?? "—",
      vehicleId: a.vehicle?._id,
      time: a.createdAt ? new Date(a.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }) : "—",
      isLive: false,
    }));
});
</script>
