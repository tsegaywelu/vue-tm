<template>
  <div class="flex flex-col gap-6">
    <!-- Welcome Header -->
    <div
      class="bg-gradient-to-br from-primary-50 to-primary-100/50 rounded-[32px] p-8 md:p-10 border border-primary-100"
    >
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div class="flex flex-col gap-2">
          <h1 class="text-3xl md:text-4xl font-black text-grey-900 tracking-tight">
            Welcome back, {{ shipperName }}
          </h1>
          <p class="text-grey-500 text-base">
            Here's an overview of your logistics operations.
          </p>
        </div>
        <div class="flex items-center gap-2">
          <span class="px-4 py-2 bg-primary/10 text-primary text-sm font-bold rounded-full uppercase">
            Shipper Portal
          </span>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="bg-white rounded-2xl p-6 border border-grey-100 flex flex-col gap-3 hover:shadow-lg transition-shadow duration-200"
      >
        <div class="flex items-center gap-3">
          <div
            class="size-10 rounded-xl flex items-center justify-center text-lg"
            :class="stat.iconBg"
          >
            <i :class="stat.icon" class="text-lg"></i>
          </div>
          <span class="text-xs font-bold text-grey-500 uppercase tracking-wider">
            {{ stat.label }}
          </span>
        </div>
        <div class="text-2xl font-black text-grey-900">
          {{ stat.value }}
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Recent Shipments -->
      <div class="bg-white rounded-[32px] p-6 border border-grey-100">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-grey-900">Recent Shipments</h3>
          <router-link
            to="/shipper/shipments"
            class="text-sm text-primary font-semibold hover:underline"
          >
            View All
          </router-link>
        </div>
        <div v-if="recentShipmentsLoading" class="flex justify-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        <div v-else-if="recentShipments.length === 0" class="text-center py-8 text-grey-400">
          No recent shipments
        </div>
        <div v-else class="flex flex-col gap-2">
          <div
            v-for="shipment in recentShipments.slice(0, 5)"
            :key="shipment._id"
            class="flex items-center justify-between p-3 bg-grey-25 rounded-xl hover:bg-grey-50 transition-colors"
          >
            <div class="flex flex-col gap-0.5">
              <span class="text-sm font-bold text-grey-900">{{ shipment.shipmentCode }}</span>
              <span class="text-xs text-grey-500">{{ shipment.route?.routeName || '-' }}</span>
            </div>
            <span
              class="px-2 py-1 text-xs font-bold rounded-full"
              :class="getStatusClass(shipment.status)"
            >
              {{ shipment.status }}
            </span>
          </div>
        </div>
      </div>

      <!-- Recent Orders -->
      <div class="bg-white rounded-[32px] p-6 border border-grey-100">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-grey-900">Recent Orders</h3>
          <router-link
            to="/shipper/orders"
            class="text-sm text-primary font-semibold hover:underline"
          >
            View All
          </router-link>
        </div>
        <div v-if="recentOrdersLoading" class="flex justify-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        <div v-else-if="recentOrders.length === 0" class="text-center py-8 text-grey-400">
          No recent orders
        </div>
        <div v-else class="flex flex-col gap-2">
          <div
            v-for="order in recentOrders.slice(0, 5)"
            :key="order._id"
            class="flex items-center justify-between p-3 bg-grey-25 rounded-xl hover:bg-grey-50 transition-colors"
          >
            <div class="flex flex-col gap-0.5">
              <span class="text-sm font-bold text-grey-900">{{ order.orderCode }}</span>
              <span class="text-xs text-grey-500">{{ order.route?.routeName || '-' }}</span>
            </div>
            <span
              class="px-2 py-1 text-xs font-bold rounded-full"
              :class="getStatusClass(order.status)"
            >
              {{ order.status }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useAuthStore } from "@/store/authStore";
import { usePagination } from "@/composables/usePagination";

const authStore = useAuthStore();

const shipperName = computed(() => {
  const user = authStore.current_user?.user;
  return user?.shipper?.name || user?.username || "Shipper";
});

const shipperId = computed(() => {
  return authStore.current_user?.user?.shipper?._id || "";
});

// Recent Shipments
const { response: recentShipments, isLoading: recentShipmentsLoading } = usePagination({
  id: "shipper-dashboard-shipments",
  url: "/shipment",
  params: computed(() => ({ shipper: shipperId.value, limit: 5 })),
});

// Recent Orders
const { response: recentOrders, isLoading: recentOrdersLoading } = usePagination({
  id: "shipper-dashboard-orders",
  url: "/order",
  params: computed(() => ({ shipper: shipperId.value, limit: 5 })),
});

// Stats cards
const stats = computed(() => [
  {
    label: "Shipments",
    value: recentShipments.value?.length ?? 0,
    icon: "mdi mdi-truck-delivery",
    iconBg: "bg-blue-50 text-blue-600",
  },
  {
    label: "Orders",
    value: recentOrders.value?.length ?? 0,
    icon: "mdi mdi-clipboard-list",
    iconBg: "bg-emerald-50 text-emerald-600",
  },
  {
    label: "Active Routes",
    value: "—",
    icon: "mdi mdi-map-marker-path",
    iconBg: "bg-amber-50 text-amber-600",
  },
  {
    label: "Carriers",
    value: "—",
    icon: "mdi mdi-domain",
    iconBg: "bg-purple-50 text-purple-600",
  },
]);

const getStatusClass = (status: string) => {
  const map: Record<string, string> = {
    completed: "bg-emerald-100 text-emerald-700",
    dispatched: "bg-blue-100 text-blue-700",
    pending: "bg-amber-100 text-amber-700",
    cancelled: "bg-red-100 text-red-700",
    approved: "bg-green-100 text-green-700",
  };
  return map[status?.toLowerCase()] || "bg-grey-100 text-grey-600";
};
</script>
