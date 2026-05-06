<template>
  <div class="h-full flex flex-col gap-4">
    <!-- Header Section -->
    <div
      class="bg-white flex flex-col md:flex-row md:items-center justify-between px-3 md:px-4 py-4 md:py-3 rounded-[20px] gap-4 shadow-sm border border-gray-100"
    >
      <div class="flex flex-col gap-2 flex-1">
        <h1 class="font-bold text-2xl leading-tight text-gray-900">
          {{ order?.route?.origin || "-------" }} →
          {{ order?.route?.destination || "-------" }}
        </h1>
        <div class="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
          <span class="text-sm text-gray-600">
            Order Reference
            <span class="font-bold text-black text-sm ml-1">
              {{ order?.orderCode }}
            </span>
          </span>
          <div
            class="mt-2 lg:mt-0 md:hidden flex items-center justify-between w-full"
          >
            <Status :variant="order?.status" type="wrapped">
              {{ formatStatus(order?.status) }}
            </Status>
          </div>
        </div>
      </div>

      <div
        class="flex flex-row items-center justify-between md:justify-end gap-3 md:gap-4"
      >
        <div
          class="flex flex-row lg:flex-col items-start md:items-end gap-1 md:gap-2"
        >
          <div class="hidden md:block">
            <Status :variant="order?.status" type="wrapped">
              {{ formatStatus(order?.status) }}
            </Status>
          </div>
          <span
            class="text-xs md:text-sm text-gray-600"
            v-if="order?.createdAt"
          >
            Created At
            <span class="font-bold text-black ml-1">
              {{ dateFormatter(order?.createdAt) }}
            </span>
          </span>
        </div>
        <div class="flex-1 md:flex-none justify-end flex">
          <Dropdown>
            <template #default="{ close }">
              <DropDownItem
                v-if="order?.status === 'approved'"
                :icon="icons.truck"
                label="Ship"
                @click.stop="
                  handleOrderAction(order!, 'ship');
                  close();
                "
              />
              <DropDownItem
                :icon="icons.editIcon"
                label="Edit Order"
                @click.stop="
                  handleOrderAction(order!, 'edit');
                  close();
                "
              />
            </template>
          </Dropdown>
        </div>
      </div>
    </div>
    
    <!-- Tabs Navigation Teleport Target -->
    <div id="order-details-tabs" class="w-full mt-2"></div>

    <div v-if="order" class="flex-1 min-h-0 overflow-y-auto">
      <component
        :is="activeTabComponent"
        :order="order"
        @refresh="refetch"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import { fetch_order_by_id } from "../api/orders.api";
import type { Order } from "../operation.types";
import Status from "@/components/common/Status.vue";
import Dropdown from "@/components/common/Dropdown.vue";
import DropDownItem from "@/components/common/DropDownItem.vue";
import { icons } from "@/utils/icons";
import { dateFormatter } from "@/utils/utils";

// Tabs
import OrderOverviewTab from "../components/order-details/OrderOverviewTab.vue";

const route = useRoute();
const router = useRouter();
const orderId = route.params.id as string;

const tabs = computed(() => route.meta.tabs as any[]);
const activeTab = computed(
  () => (route.query.tab as string) || (tabs.value?.[0]?.value as string),
);

const { data: orderResponse, refetch } = useQuery({
  queryKey: ["order", orderId],
  queryFn: () => fetch_order_by_id(orderId),
});

const order = computed(
  () => orderResponse.value?.data as Order | undefined,
);

const formatStatus = (status?: string) => {
  if (!status) return "-";
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

const activeTabComponent = computed(() => {
  switch (activeTab.value) {
    case "overview":
      return OrderOverviewTab;
    default:
      return OrderOverviewTab;
  }
});

const handleOrderAction = (order: Order, action: string) => {
  if (action === 'edit') {
    router.push(`/operation/orders/edit/${order._id}`);
  } else if (action === 'ship') {
    router.push(`/operation/shipments/add-from-order/${order._id}`);
  }
};
</script>
