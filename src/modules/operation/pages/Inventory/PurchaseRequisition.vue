<template>
  <Teleport to="#page-actions" defer>
    <Button
      v-permission="'PURCHASE_REQUISITION:create'"
      variant="primary"
      size="md"
      class="flex items-center gap-2"
      @click="handleCreateRequisition"
    >
      <i v-html="icons.plus" />
      Create Requisition
    </Button>
  </Teleport>

  <PurchaseRequisitionTable ref="tableRef" @action="handleRequisitionAction" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import PurchaseRequisitionTable from "../../components/inventory/PurchaseRequisitionTable.vue";
import Button from "@/components/Button.vue";
import { icons } from "@/utils/icons";
import { delete_purchase_requisition, update_purchase_requisition_status } from "../../api/inventory.api";
import { useToastStore } from "@/store/toastStore";
import { openModal } from "@customizer/modal-x";

const toast = useToastStore();
const tableRef = ref();
const router = useRouter();
const handleCreateRequisition = () => {
  openModal("PurchaseRequisitionModal", {
    onSuccess: () => tableRef.value?.refetch(),
  });
};

const handleRequisitionAction = async ({ row, action }: any) => {
  if (action === "edit") {
    openModal("PurchaseRequisitionModal", {
      requisition: row,
      onSuccess: () => tableRef.value?.refetch(),
    });
  } else if (action === "view") {
    router.push(`/inventory/purchase-requisition/${row._id}`);
  } else if (["approve", "reject", "authorize", "cancel"].includes(action)) {
    const isConfirmed = await openModal("ConfirmationModal", {
      title: `Confirm ${action.charAt(0).toUpperCase() + action.slice(1)}`,
      message: `Are you sure you want to ${action} requisition "${row.referenceNumber}"?`,
      action: action,
    });
    
    if (isConfirmed) {
      try {
        const res = await update_purchase_requisition_status(row._id, action.toUpperCase(), {});
        if (res.success) {
          toast.success(`Requisition ${action}d successfully`);
          tableRef.value?.refetch();
        } else {
          toast.error(res.error || `Failed to ${action} requisition`);
        }
      } catch (error: any) {
        toast.error(error.message || "An unexpected error occurred");
      }
    }
  } else if (action === "delete") {
    const isConfirmed = await openModal("ConfirmationModal", {
      title: "Confirm Delete",
      message: `Are you sure you want to delete requisition "${row.referenceNumber}"?`,
      action: "delete",
    });
    
    if (isConfirmed) {
      try {
        const res = await delete_purchase_requisition(row._id);
        if (res.success) {
          toast.success("Requisition deleted successfully");
          tableRef.value?.refetch();
        } else {
          toast.error(res.error || "Failed to delete requisition");
        }
      } catch (error: any) {
        toast.error(error.message || "An unexpected error occurred");
      }
    }
  }
};
</script>
