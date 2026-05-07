<template>
  <Teleport to="#page-actions" defer>
    <Button
      v-permission="'PURCHASE_ORDER:create'"
      variant="primary"
      size="md"
      class="flex items-center gap-2"
      @click="handleCreateOrder"
    >
      <i v-html="icons.plus" />
      Create Purchase Order
    </Button>
  </Teleport>

  <PurchaseOrderTable ref="tableRef" @action="handleOrderAction" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import PurchaseOrderTable from "../../components/inventory/PurchaseOrderTable.vue";
import Button from "@/components/Button.vue";
import { icons } from "@/utils/icons";
import { delete_purchase_order } from "../../api/inventory.api";
import { useToastStore } from "@/store/toastStore";
import { openModal } from "@customizer/modal-x";

const router = useRouter();
const toast = useToastStore();
const tableRef = ref();

const handleCreateOrder = () => {
  openModal("PurchaseOrderModal", {
    onSuccess: () => tableRef.value?.refetch(),
  });
};

const handleOrderAction = async ({ row, action }: any) => {
  if (action === "edit") {
    openModal("PurchaseOrderModal", {
      order: row,
      onSuccess: () => tableRef.value?.refetch(),
    });
  } else if (action === "view") {
    router.push(`/inventory/purchase-order/${row._id}`);
  } else if (action === "delete") {
    if (
      confirm(
        `Are you sure you want to delete purchase order "${row.referenceNumber}"?`,
      )
    ) {
      try {
        const res = await delete_purchase_order(row._id);
        if (res.success) {
          toast.success("Purchase order deleted successfully");
          tableRef.value?.refetch();
        } else {
          toast.error(res.error || "Failed to delete purchase order");
        }
      } catch (error: any) {
        toast.error(error.message || "An unexpected error occurred");
      }
    }
  }
};
</script>
