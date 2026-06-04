<template>
  <!-- Mobile FAB -->
  <button
    v-permission="'SUPPLIER:create'"
    class="fixed bottom-6 right-6 sm:hidden z-50 w-14 h-14 rounded-full bg-primary text-white shadow-xl flex items-center justify-center active:scale-95 transition-transform"
    @click="handleAddVendor"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  </button>
  <Teleport to="#page-actions" defer>
    <Button
      v-permission="'SUPPLIER:create'"
      variant="primary"
      size="md"
      class="hidden sm:flex items-center gap-2"
      @click="handleAddVendor"
    >
      <i v-html="icons.plus" />
      Add Vendor
    </Button>
  </Teleport>

  <VendorTable
    ref="tableRef"
    @action="handleVendorAction"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import VendorTable from "../../components/inventory/VendorTable.vue";
import Button from "@/components/Button.vue";
import { icons } from "@/utils/icons";
import { delete_vendor } from "../../api/inventory.api";
import { useToastStore } from "@/store/toastStore";
import { openModal } from "@customizer/modal-x";

const toast = useToastStore();
const tableRef = ref();

const handleAddVendor = () => {
  openModal("InventoryVendorModal", {
    onSuccess: () => tableRef.value?.refetch(),
  });
};

const handleVendorAction = async ({ row, action }: any) => {
  if (action === 'edit') {
    openModal("InventoryVendorModal", {
      vendor: row,
      onSuccess: () => tableRef.value?.refetch(),
    });
  } else if (action === 'delete') {
    if (confirm(`Are you sure you want to delete vendor "${row.name}"?`)) {
      try {
        const res = await delete_vendor(row._id);
        if (res.success) {
          toast.success("Vendor deleted successfully");
          tableRef.value?.refetch();
        } else {
          toast.error(res.error || "Failed to delete vendor");
        }
      } catch (error: any) {
        toast.error(error.message || "An unexpected error occurred");
      }
    }
  }
};
</script>
