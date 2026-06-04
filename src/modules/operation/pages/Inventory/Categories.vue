<template>
  <!-- Mobile FAB -->
  <button
    v-permission="'CATEGORY:create'"
    class="fixed bottom-6 right-6 sm:hidden z-50 w-14 h-14 rounded-full bg-primary text-white shadow-xl flex items-center justify-center active:scale-95 transition-transform"
    @click="handleAddCategory"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  </button>
  <Teleport to="#page-actions" defer>
    <Button
      v-permission="'CATEGORY:create'"
      variant="primary"
      size="md"
      class="hidden sm:flex items-center gap-2"
      @click="handleAddCategory"
    >
      <i v-html="icons.plus" />
      Add Inventory Category
    </Button>
  </Teleport>

  <InventoryCategoryTable
    ref="tableRef"
    @action="handleCategoryAction"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import InventoryCategoryTable from "../../components/inventory/InventoryCategoryTable.vue";
import Button from "@/components/Button.vue";
import { icons } from "@/utils/icons";
import { delete_inventory_category } from "../../api/inventory.api";
import { useToastStore } from "@/store/toastStore";
import { openModal } from "@customizer/modal-x";

const toast = useToastStore();
const tableRef = ref();

const handleAddCategory = () => {
  openModal("InventoryCategoryModal", {
    onSuccess: () => tableRef.value?.refetch(),
  });
};

const handleCategoryAction = async ({ row, action }: any) => {
  if (action === 'edit') {
    openModal("InventoryCategoryModal", {
      category: row,
      onSuccess: () => tableRef.value?.refetch(),
    });
  } else if (action === 'delete') {
    if (confirm(`Are you sure you want to delete category "${row.name}"?`)) {
      try {
        const res = await delete_inventory_category(row._id);
        if (res.success) {
          toast.success("Category deleted successfully");
          tableRef.value?.refetch();
        } else {
          toast.error(res.error || "Failed to delete category");
        }
      } catch (error: any) {
        toast.error(error.message || "An unexpected error occurred");
      }
    }
  }
};
</script>
