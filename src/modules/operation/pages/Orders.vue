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
const all_icons = { ...icons, ...raaz_icons };

const router = useRouter();

const navigateToAddOrder = () => {
  router.push("/order/addOrder");
};

const handleOrderAction = ({ row, action }: { row: any; action: string }) => {
  if (action === "ship") {
    // Open a confirmation or form modal for shipping
    openModal(
      "ConfirmationModal",
      {
        title: "Ship Order",
        message: `Are you sure you want to ship order ${row.orderCode}?`,
        confirmText: "Ship",
        type: "primary",
      },
      (confirmed) => {
        if (confirmed) {
          console.log("Shipping order:", row.orderCode);
        }
      },
    );
  } else if (action === "reject") {
    openModal(
      "ConfirmationModal",
      {
        title: "Reject Order",
        message: `Are you sure you want to reject order ${row.orderCode}?`,
        confirmText: "Reject",
        type: "danger",
      },
      (confirmed) => {
        if (confirmed) {
          console.log("Rejecting order:", row.orderCode);
        }
      },
    );
  }
};
</script>
