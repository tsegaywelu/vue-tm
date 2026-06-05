<template>
  <div class="bg-surface rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <span class="mdi mdi-clipboard-list-outline text-red-400 text-lg"></span>
        <h3 class="font-semibold text-gray-800">Order Requests</h3>
      </div>
      <button @click="refetch()" class="text-gray-400 hover:text-gray-600 transition-colors">
        <span class="mdi mdi-refresh text-lg" :class="isFetching ? 'animate-spin' : ''" />
      </button>
    </div>

    <!-- Search -->
    <div class="relative mb-3">
      <span class="mdi mdi-magnify absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></span>
      <input
        v-model="search"
        type="text"
        placeholder="Search by order code, shipper, route…"
        class="w-full pl-8 pr-3 py-2 text-xs border border-gray-100 rounded-xl bg-surface text-gray-700 outline-none focus:border-indigo-400 placeholder:text-gray-400"
      />
    </div>

    <div v-if="isLoading" class="flex justify-center items-center py-10">
      <span class="mdi mdi-loading mdi-spin text-2xl text-indigo-400" />
    </div>

    <div v-else-if="!filtered.length" class="text-sm text-gray-400 text-center py-8">
      No pending or approved orders
    </div>

    <div v-else class="overflow-y-auto flex-1 max-h-125 space-y-3 pr-0.5">
      <div
        v-for="order in filtered"
        :key="order._id"
        class="border border-gray-100 rounded-xl p-3 hover:bg-surface-hover transition-colors cursor-pointer"
        @click="router.push(`/operation/orders/${order._id}`)"
      >
        <!-- Top row: code + status -->
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-1.5">
            <span class="mdi mdi-pound text-indigo-400 text-sm"></span>
            <span class="text-xs font-semibold text-gray-800">{{ order.orderCode }}</span>
          </div>
          <span
            class="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            :class="order.status === 'approved'
              ? 'bg-emerald-50 text-emerald-600'
              : 'bg-amber-50 text-amber-600'"
          >
            {{ order.status === 'approved' ? 'Approved' : 'Pending' }}
          </span>
        </div>

        <!-- Date -->
        <div class="text-[10px] text-gray-400 mb-2">{{ formatDate(order.createdAt) }}</div>

        <!-- Route -->
        <div v-if="order.route" class="flex items-center gap-2 text-xs text-gray-600 mb-2">
          <span class="w-2 h-2 rounded-full bg-indigo-400 shrink-0"></span>
          <span class="truncate">{{ order.route.origin }}</span>
          <span class="mdi mdi-arrow-right text-gray-300 text-xs shrink-0"></span>
          <span class="truncate">{{ order.route.destination }}</span>
        </div>

        <!-- Shipper -->
        <div v-if="order.shipper" class="flex items-center gap-1.5 text-[10px] text-gray-500">
          <span class="mdi mdi-account-outline text-gray-400 text-xs"></span>
          {{ order.shipper.name ?? order.shipper.tradeName }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import { fetchPendingOrders } from "../../api/dashboard.api";

const router = useRouter();
const search = ref("");

const { data, isLoading, isFetching, refetch } = useQuery({
  queryKey: ["dashboard-order-requests"],
  queryFn: fetchPendingOrders,
});

const orders = computed(() => {
  const body = (data.value as any)?.data;
  // Match usePagination extraction: body.result || body.data || body
  const inner = body?.result ?? body?.data ?? body;
  const list: any[] = Array.isArray(inner) ? inner
    : Array.isArray(inner?.results) ? inner.results
    : Array.isArray(inner?.items)   ? inner.items
    : Array.isArray(inner?.docs)    ? inner.docs
    : [];
  return list.filter((o: any) => o.status === "pending" || o.status === "approved");
});

const filtered = computed(() => {
  const q = search.value.toLowerCase().trim();
  if (!q) return orders.value;
  return orders.value.filter((o: any) =>
    o.orderCode?.toString().toLowerCase().includes(q) ||
    o.shipper?.name?.toLowerCase().includes(q) ||
    o.shipper?.tradeName?.toLowerCase().includes(q) ||
    o.route?.routeName?.toLowerCase().includes(q) ||
    o.route?.origin?.toLowerCase().includes(q) ||
    o.route?.destination?.toLowerCase().includes(q) ||
    o.commodity?.name?.toLowerCase().includes(q)
  );
});

function formatDate(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}
</script>
