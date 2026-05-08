<template>
  <Teleport to="#page-actions" defer>
    <Button
      v-permission="'STORE_REQUISITION_VOUCHER:create'"
      variant="primary"
      size="md"
      class="flex items-center gap-2"
      @click="handleCreateRequisition"
    >
      <i v-html="icons.plus" />
      Create Requisition
    </Button>
  </Teleport>

  <StoreRequisitionTable ref="tableRef" @action="handleRequisitionAction" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import StoreRequisitionTable from "../../components/inventory/StoreRequisitionTable.vue";
import Button from "@/components/Button.vue";
import { icons } from "@/utils/icons";
import { delete_store_requisition, update_store_requisition_status } from "../../api/inventory.api";
import { useToastStore } from "@/store/toastStore";
import { openModal } from "@customizer/modal-x";

const toast = useToastStore();
const tableRef = ref();
const router = useRouter();
const handleCreateRequisition = () => {
  openModal("StoreRequisitionModal", {
    onSuccess: () => tableRef.value?.refetch(),
  });
};

const handleRequisitionAction = async ({ row, action }: any) => {
  if (action === "edit") {
    openModal("StoreRequisitionModal", {
      requisition: row,
      onSuccess: () => tableRef.value?.refetch(),
    });
  } else if (action === "view") {
    router.push(`/inventory/store-requisition/${row._id}`);
  } else if (action === "approve") {
    openModal("ApproveStoreRequisitionModal", {
      requisition: row,
      onSuccess: () => tableRef.value?.refetch(),
    });
  } else if (["reject", "authorize", "cancel"].includes(action)) {
    const isConfirmed = await openModal("ConfirmationModal", {
      title: `Confirm ${action.charAt(0).toUpperCase() + action.slice(1)}`,
      message: `Are you sure you want to ${action} requisition "${row.referenceNumber}"?`,
      action: action,
    });
    
    if (isConfirmed) {
      try {
        const res = await update_store_requisition_status(row._id, action.toUpperCase(), {});
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
        const res = await delete_store_requisition(row._id);
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
