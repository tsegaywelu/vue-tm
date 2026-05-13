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

  <OrderTable
    :filters="shipperFilters"
    :base-path="basePath"
    @action="handleOrderAction"
  />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import OrderTable from "../components/OrderTable.vue";
import StatsCards from "@/components/common/StatsCards.vue";
import Button from "@/components/Button.vue";
import { icons } from "@/utils/icons";
import { raaz_icons } from "@/utils/raaz_icons";
import { openModal } from "@customizer/modal-x";
import {
  approve_order,
  cancel_order,
  cancel_order_shipper,
  fetch_order_status_count,
} from "../api/orders.api";
import { useToastStore } from "@/store/toastStore";

import { useAuthStore } from "@/store/authStore";
import { update_order_status } from "../api/operation.api";

const all_icons = { ...icons, ...raaz_icons };
const router = useRouter();
const toast = useToastStore();
const authStore = useAuthStore();
const queryClient = useQueryClient();

const basePath = computed(() =>
  authStore.is_shipper ? "/shipper/orders" : "/operation/orders",
);

const shipperFilters = computed(() =>
  authStore.is_shipper
    ? { shipper: authStore.current_user?.user?.shipper?._id }
    : undefined,
);

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
  router.push(`${basePath.value}/add`);
};

const invalidateOrderQueries = () => {
  queryClient.invalidateQueries({ queryKey: ["order-list"] });
  queryClient.invalidateQueries({ queryKey: ["orderStatusCount"] });
};

const handleOrderAction = async ({
  row,
  action,
}: {
  row: any;
  action: string;
}) => {
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
          const res = authStore.is_shipper
            ? await update_order_status(row._id, { status: "approved" })
            : await approve_order(row._id);
          if (res.success) {
            toast.success("Order approved successfully");
            invalidateOrderQueries();
          }
        }
      },
    );
  } else if (action === "cancel") {
    const res = await openModal("ReasonModal", {
      title: "Cancel Order",
      message: `Are you sure you want to cancel order ${row.orderCode}?`,
      confirmText: "Cancel Order",
    });

    if (res) {
      const response = await cancel_order_shipper(row._id, {
        cancelReason: res as string,
        status: "cancelled",
      });
      if (response.success) {
        toast.success("Order cancelled successfully");
        invalidateOrderQueries();
      } else {
        toast.error(response.error);
      }
    }
  } else if (action === "ship") {
    const shipPath = authStore.is_shipper
      ? "/shipper/shipments"
      : "/operation/shipments";
    router.push(`${shipPath}/add-from-order/${row._id}`);
  } else if (action === "edit") {
    router.push(`${basePath.value}/edit/${row._id}`);
  }
};
</script>
