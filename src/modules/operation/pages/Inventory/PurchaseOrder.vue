<template>
  <!-- Mobile FAB -->
  <button
    v-permission="'PURCHASE_ORDER:create'"
    class="fixed bottom-6 right-6 sm:hidden z-50 w-14 h-14 rounded-full bg-primary text-white shadow-xl flex items-center justify-center active:scale-95 transition-transform"
    @click="handleCreateOrder"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  </button>
  <Teleport to="#page-actions" defer>
    <Button
      v-permission="'PURCHASE_ORDER:create'"
      variant="primary"
      size="md"
      class="hidden sm:flex items-center gap-2"
      @click="handleCreateOrder"
    >
      <i v-html="icons.plus" />
      Create Purchase Order
    </Button>
  </Teleport>

  <Teleport to="#page-title-actions" defer>
    <button
      class="sm:hidden size-8 rounded-xl border border-line flex items-center justify-center text-faint-text hover:bg-surface-hover transition-colors"
      @click="mobileSearchOpen = true"
    >
      <i class="*:size-4" v-html="icons.filterOptions"></i>
    </button>
  </Teleport>

  <BottomSheet v-model="mobileSearchOpen" title="Search By">
    <div class="flex flex-col py-2 px-4 gap-1">
      <button
        v-for="opt in tableRef?.searchFieldOptions"
        :key="opt.value"
        class="flex items-center justify-between py-3 px-2 hover:bg-surface-hover rounded-xl transition-colors"
        @click="tableRef.selectedSearchField = opt.value; mobileSearchOpen = false"
      >
        <span class="font-medium">{{ opt.label }}</span>
        <i v-if="tableRef?.selectedSearchField === opt.value" class="*:size-4 text-primary" v-html="icons.check"></i>
      </button>
    </div>
  </BottomSheet>

  <PurchaseOrderTable ref="tableRef" @action="handleOrderAction" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import PurchaseOrderTable from "../../components/inventory/PurchaseOrderTable.vue";
import Button from "@/components/Button.vue";
import BottomSheet from "@/components/BottomSheet.vue";
import { icons } from "@/utils/icons";
import { delete_purchase_order, update_purchase_order_status } from "../../api/inventory.api";
import { useToastStore } from "@/store/toastStore";
import { openModal } from "@customizer/modal-x";

const router = useRouter();
const toast = useToastStore();
const tableRef = ref<any>(null);
const mobileSearchOpen = ref(false);

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
  } else if (action === "approve") {
    try {
      const res = await update_purchase_order_status(row._id, "approve");
      if (res.success) {
        toast.success("Purchase order approved");
        tableRef.value?.refetch();
      } else {
        toast.error(res.error || "Failed to approve purchase order");
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
    }
  } else if (action === "authorize") {
    try {
      const res = await update_purchase_order_status(row._id, "authorize");
      if (res.success) {
        toast.success("Purchase order authorized");
        tableRef.value?.refetch();
      } else {
        toast.error(res.error || "Failed to authorize purchase order");
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
    }
  } else if (action === "cancel") {
    if (confirm(`Are you sure you want to cancel purchase order "${row.referenceNumber}"?`)) {
      try {
        const res = await update_purchase_order_status(row._id, "cancel");
        if (res.success) {
          toast.success("Purchase order cancelled");
          tableRef.value?.refetch();
        } else {
          toast.error(res.error || "Failed to cancel purchase order");
        }
      } catch (error: any) {
        toast.error(error.message || "An unexpected error occurred");
      }
    }
  } else if (action === "delete") {
    if (confirm(`Are you sure you want to delete purchase order "${row.referenceNumber}"?`)) {
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
