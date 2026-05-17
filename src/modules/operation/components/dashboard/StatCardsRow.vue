<template>
  <div class="flex gap-4 overflow-x-auto pb-1">
    <StatCard
      v-for="(card, i) in cards"
      :key="card.title"
      :title="card.title"
      :value="card.value"
      :is-active="i === 0"
      :loading="isLoading"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useQuery } from "@tanstack/vue-query";
import StatCard from "./StatCard.vue";
import { fetchShipmentStatusCount, fetchOrderStats } from "../../api/dashboard.api";

const { data: shipmentData, isLoading: shipmentLoading } = useQuery({
  queryKey: ["dashboard-shipment-status"],
  queryFn: fetchShipmentStatusCount,
});

const { data: orderData, isLoading: orderLoading } = useQuery({
  queryKey: ["dashboard-order-stats"],
  queryFn: fetchOrderStats,
});

const isLoading = computed(() => shipmentLoading.value || orderLoading.value);

const cards = computed(() => {
  const s = (shipmentData.value as any)?.data ?? {};
  const orders: any[] = (orderData.value as any)?.data ?? [];

  const pending  = orders.filter((o: any) => o.status === "pending").length;
  const approved = orders.filter((o: any) => o.status === "approved").length;
  const rejected = orders.filter((o: any) => o.status === "rejected").length;

  return [
    { title: "Shipments Completed",   value: s.completed  ?? 0 },
    { title: "Shipments In Progress", value: s.InProgress ?? 0 },
    { title: "Pending Orders",        value: pending },
    { title: "Approved Orders",       value: approved },
    { title: "Rejected Orders",       value: rejected },
  ];
});
</script>
