<template>
  <div class="bg-surface rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col">
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-semibold text-gray-800">Lease Expiry</h3>
      <div class="flex items-center gap-2">
        <label class="text-xs text-gray-400">Days</label>
        <input
          v-model.number="days"
          type="number"
          min="1"
          max="365"
          class="w-14 text-xs text-center border border-gray-200 rounded-lg px-1.5 py-1 bg-surface text-gray-700 outline-none focus:border-indigo-400"
        />
      </div>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center py-10">
      <span class="mdi mdi-loading mdi-spin text-2xl text-indigo-400" />
    </div>

    <div v-else-if="!rows.length" class="text-sm text-gray-400 text-center py-8">
      No expiring leases in {{ days }} days
    </div>

    <div v-else class="overflow-y-auto flex-1 max-h-72">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-100">
            <th class="text-left text-xs font-semibold text-gray-500 pb-2">Plate</th>
            <th class="text-left text-xs font-semibold text-gray-500 pb-2">End Date</th>
            <th class="text-right text-xs font-semibold text-gray-500 pb-2">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in rows"
            :key="row.id"
            class="border-b border-gray-50 last:border-0 hover:bg-surface-hover transition-colors cursor-pointer"
            @click="router.push('/vehicles/leased')"
          >
            <td class="py-2 text-xs text-gray-700 flex items-center gap-1.5">
              <span class="mdi mdi-truck text-gray-400 text-sm" />
              {{ row.plate }}
            </td>
            <td class="py-2 text-xs text-gray-500">{{ row.endDate }}</td>
            <td class="py-2 text-right">
              <span class="text-xs font-semibold px-2 py-0.5 rounded-full" :class="row.expired ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'">
                {{ row.expired ? 'Expired' : 'Expiring Soon' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import { fetchLeaseExpiryAlerts } from "../../api/dashboard.api";

const router = useRouter();
const days = ref(7);
const today = new Date();
today.setHours(0, 0, 0, 0);

const { data, isLoading } = useQuery({
  queryKey: ["dashboard-lease-expiry", days],
  queryFn: () => fetchLeaseExpiryAlerts(days.value),
});

const rows = computed(() => {
  const list: any[] = (data.value as any)?.data ?? [];
  return list.map((l: any) => {
    const end = l.endDate ? new Date(l.endDate) : null;
    if (end) end.setHours(0, 0, 0, 0);
    return {
      id: l._id,
      plate: l.vehicle?.plateNumber ?? "—",
      endDate: end ? end.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—",
      expired: end ? end < today : false,
    };
  });
});
</script>
