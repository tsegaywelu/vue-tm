<template>
  <div class="bg-surface rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col">
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-semibold text-gray-800">Route Volume</h3>
      <button @click="refetch()" class="text-gray-400 hover:text-gray-600 transition-colors">
        <span class="mdi mdi-refresh text-lg" :class="isFetching ? 'animate-spin' : ''" />
      </button>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center py-10">
      <span class="mdi mdi-loading mdi-spin text-2xl text-indigo-400" />
    </div>

    <div v-else-if="!rows.length" class="text-sm text-gray-400 text-center py-8">
      No data for selected period
    </div>

    <div v-else class="overflow-y-auto flex-1 max-h-80">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-100">
            <th class="text-left text-xs font-semibold text-gray-500 pb-2">Route</th>
            <th class="text-right text-xs font-semibold text-gray-500 pb-2">Volume</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in rows"
            :key="row.route"
            class="border-b border-gray-50 last:border-0 hover:bg-surface-hover transition-colors"
          >
            <td class="py-2 text-xs text-gray-700">
              <div class="flex items-center gap-1.5">
                <span class="mdi mdi-map-marker-path text-indigo-400 text-sm" />
                {{ row.route }}
              </div>
            </td>
            <td class="py-2 text-xs font-semibold text-gray-800 text-right">
              {{ row.volume.toLocaleString() }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { fetchRoutesByVolume } from "../../api/dashboard.api";

const { data, isLoading, isFetching, refetch } = useQuery({
  queryKey: ["dashboard-route-volume"],
  queryFn: () => fetchRoutesByVolume(),
});

const rows = computed(() => {
  // API returns { summary: { totalRoutes, totalShipments }, routes: [{ routeId, routeName, shipmentCount }] }
  const payload = (data.value as any)?.data ?? {};
  const list: any[] = payload.routes ?? payload ?? [];
  return list.map((item: any) => ({
    route: item.routeName ?? "—",
    volume: Number(item.shipmentCount ?? 0),
  }));
});
</script>
