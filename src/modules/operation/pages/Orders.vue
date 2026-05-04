<template>
  <Teleport to="#page-actions" defer>
    <Button @click="navigateToAddOrder">
      <template #leading>
        <div class="size-5" v-html="all_icons.plus"></div>
      </template>
      Add Order
    </Button>
  </Teleport>
  <OrderTable @action="handleOrderAction" />
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import OrderTable from "../components/OrderTable.vue";
import Button from "@/components/Button.vue";
import { icons } from "@/utils/icons";
import { raaz_icons } from "@/utils/raaz_icons";
import { openModal } from "@customizer/modal-x";
import { approve_order, cancel_order } from "../api/orders.api";
import { useToastStore } from "@/store/toastStore";

const all_icons = { ...icons, ...raaz_icons };
const router = useRouter();
const toast = useToastStore();

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
