<template>
  <Teleport to="#page-actions" defer>
    <Button v-permission="'ORDER:create'" @click="navigateToAddOrder">
      <template #leading>
        <div class="size-5" v-html="all_icons.plus"></div>
      </template>
      Add Order
    </Button>
  </Teleport>

  <!-- Order Statistics Cards -->
  <Teleport to="#extra-page-data" defer>
    <StatsCards :stats="orderStats" :loading="isLoadingStats" />
  </Teleport>

  <OrderTable @action="handleOrderAction" />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import OrderTable from "../components/OrderTable.vue";
import StatsCards from "@/components/common/StatsCards.vue";
import Button from "@/components/Button.vue";
import { icons } from "@/utils/icons";
import { raaz_icons } from "@/utils/raaz_icons";
import { openModal } from "@customizer/modal-x";
import { approve_order, cancel_order, fetch_order_status_count } from "../api/orders.api";
import { useToastStore } from "@/store/toastStore";

const all_icons = { ...icons, ...raaz_icons };
const router = useRouter();
const toast = useToastStore();

const { data: statsResponse, isLoading: isLoadingStats } = useQuery({
  queryKey: ["orderStatusCount"],
  queryFn: () => fetch_order_status_count(),
});

const orderStats = computed(() => {
  const data = statsResponse.value?.data || {};
  return [
    { label: "Pending", value: data.pending, class: "text-primary" },
    { label: "Approved", value: data.approved },
    { label: "Overdue", value: data.overdue, class: "text-red-600" },
    { label: "In Bound", value: data.IN_BOUND },
    { label: "Out Bound", value: data.OUT_BOUND },
    { label: "Site Transfer", value: data.SITE_TRANSFER },
  ];
});

const navigateToAddOrder = () => {
  router.push("/operation/orders/add");
};

const handleOrderAction = ({ row, action }: { row: any; action: string }) => {
  if (action === "approve") {
    openModal(
      "ConfirmationModal",
      {
        title: "Approve Order",
        message: `Are you sure you want to approve order ${row.orderCode}?`,
        confirmText: "Approve",
        type: "primary",
      },
      async (confirmed) => {
        if (confirmed) {
          const res = await approve_order(row._id);
          if (res.success) {
            toast.success("Order approved successfully");
          }
        }
      },
    );
  } else if (action === "cancel") {
    openModal(
      "ConfirmationModal",
      {
        title: "Cancel Order",
        message: `Are you sure you want to cancel order ${row.orderCode}?`,
        confirmText: "Cancel",
        type: "danger",
      },
      async (confirmed) => {
        if (confirmed) {
          const res = await cancel_order(row._id);
          if (res.success) {
            toast.success("Order cancelled successfully");
          }
        }
      },
    );
  } else if (action === "ship") {
    router.push(`/operation/shipments/add-from-order/${row._id}`);
  } else if (action === "edit") {
    router.push(`/operation/orders/edit/${row._id}`);
  }
};
</script>
