<template>
  <div class="bg-surface rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col">
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-semibold text-gray-800">Vehicle Service</h3>
      <button @click="refetch()" class="text-gray-400 hover:text-gray-600 transition-colors">
        <span class="mdi mdi-refresh text-lg" :class="isFetching ? 'animate-spin' : ''" />
      </button>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center py-10">
      <span class="mdi mdi-loading mdi-spin text-2xl text-indigo-400" />
    </div>

    <div v-else-if="!rows.length" class="text-sm text-gray-400 text-center py-8">
      No service reminders due
    </div>

    <div v-else class="overflow-y-auto flex-1 max-h-72">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-100">
            <th class="text-left text-xs font-semibold text-gray-500 pb-2">Plate</th>
            <th class="text-left text-xs font-semibold text-gray-500 pb-2">Due Date</th>
            <th class="text-left text-xs font-semibold text-gray-500 pb-2">Next Due km</th>
            <th class="text-left text-xs font-semibold text-gray-500 pb-2">Current km</th>
            <th class="text-right text-xs font-semibold text-gray-500 pb-2">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in rows"
            :key="row.id"
            class="border-b border-gray-50 last:border-0 hover:bg-surface-hover transition-colors cursor-pointer"
            @click="router.push(`/vehicles/${row.id}`)"
          >
            <td class="py-2 text-xs text-gray-700 flex items-center gap-1.5">
              <span class="mdi mdi-truck text-gray-400 text-sm" />
              {{ row.plate }}
            </td>
            <td class="py-2 text-xs text-gray-500">{{ row.dueDate }}</td>
            <td class="py-2 text-xs text-gray-500">{{ row.dueMileage !== '—' ? row.dueMileage.toLocaleString() : '—' }}</td>
            <td class="py-2 text-xs text-gray-500">{{ row.currentMileage !== '—' ? row.currentMileage.toLocaleString() : '—' }}</td>
            <td class="py-2 text-right">
              <span
                class="text-xs font-semibold px-2 py-0.5 rounded-full"
                :class="row.status === 'OVERDUE'
                  ? 'bg-red-50 text-red-600'
                  : 'bg-amber-50 text-amber-600'"
              >
                {{ row.status === 'OVERDUE' ? 'Overdue' : 'Due' }}
              </span>
            </td>
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
import { fetchServiceReminders } from "../../api/dashboard.api";

const router = useRouter();

const { data, isLoading, isFetching, refetch } = useQuery({
  queryKey: ["dashboard-service-reminders"],
  queryFn: fetchServiceReminders,
});

const rows = computed(() => {
  const result: any[] = (data.value as any)?.data?.result ?? [];
  return result
    .filter((r: any) => r.status === "DUE" || r.status === "OVERDUE")
    .map((r: any) => ({
      id: r.vehicle?._id,
      plate: r.vehicle?.plateNumber ?? "—",
      dueDate: r.nextDueDate ? new Date(r.nextDueDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—",
      dueMileage: r.nextDueMileage ?? "—",
      currentMileage: r.vehicle?.mileage ?? "—",
      status: r.status,
    }));
});
</script>
