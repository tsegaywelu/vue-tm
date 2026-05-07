<template>
  <Teleport to="#page-actions" defer>
    <Button
      variant="primary"
      size="md"
      class="flex items-center gap-2"
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
