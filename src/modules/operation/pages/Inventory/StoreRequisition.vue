<template>
  <!-- Mobile filter button -->
  <Teleport to="#page-title-actions" defer>
    <button
      class="sm:hidden size-8 rounded-xl border border-line flex items-center justify-center text-faint-text hover:bg-surface-hover transition-colors"
      @click="mobileSearchOpen = true"
    >
      <i class="*:size-4" v-html="icons.filterOptions"></i>
    </button>
  </Teleport>

  <!-- Mobile FAB -->
  <button
    v-permission="'STORE_REQUISITION_VOUCHER:create'"
    class="fixed bottom-6 right-6 sm:hidden z-50 w-14 h-14 rounded-full bg-primary text-white shadow-xl flex items-center justify-center active:scale-95 transition-transform"
    @click="handleCreateRequisition"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  </button>

  <!-- Search By bottom sheet -->
  <BottomSheet v-model="mobileSearchOpen" title="Search By">
    <div class="flex flex-col py-2 px-4 gap-1">
      <button
        v-for="opt in tableRef?.searchFieldOptions"
        :key="opt.value"
        class="flex items-center justify-between py-3 px-2 hover:bg-surface-hover rounded-xl transition-colors"
        @click="tableRef.selectedSearchField = opt.value; mobileSearchOpen = false"
      >
        <span class="font-medium">{{ opt.label }}</span>
        <i
          v-if="tableRef?.selectedSearchField === opt.value"
          class="*:size-4 text-primary"
          v-html="icons.check"
        ></i>
      </button>
    </div>
  </BottomSheet>

  <Teleport to="#page-actions" defer>
    <Button
      v-permission="'STORE_REQUISITION_VOUCHER:create'"
      variant="primary"
      size="md"
      class="hidden sm:flex items-center gap-2"
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
import BottomSheet from "@/components/BottomSheet.vue";
import { icons } from "@/utils/icons";
import { delete_store_requisition, update_store_requisition_status } from "../../api/inventory.api";
import { useToastStore } from "@/store/toastStore";
import { openModal } from "@customizer/modal-x";

const toast = useToastStore();
const tableRef = ref<any>(null);
const router = useRouter();
const mobileSearchOpen = ref(false);
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
