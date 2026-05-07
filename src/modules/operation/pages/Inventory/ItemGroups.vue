<template>
  <Teleport to="#page-actions" defer>
    <Button
      variant="primary"
      size="md"
      class="flex items-center gap-2"
      @click="handleAddItemGroup"
    >
      <i v-html="icons.plus" />
      Add Item Group
    </Button>
  </Teleport>

  <ItemGroupTable
    ref="tableRef"
    @action="handleItemGroupAction"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import ItemGroupTable from "../../components/inventory/ItemGroupTable.vue";
import Button from "@/components/Button.vue";
import { icons } from "@/utils/icons";
import { delete_item_group } from "../../api/inventory.api";
import { useToastStore } from "@/store/toastStore";
import { openModal } from "@customizer/modal-x";

const toast = useToastStore();
const tableRef = ref();

const handleAddItemGroup = () => {
  openModal("ItemGroupModal", {
    onSuccess: () => tableRef.value?.refetch(),
  });
};

const handleItemGroupAction = async ({ row, action }: any) => {
  if (action === 'edit') {
    openModal("ItemGroupModal", {
      group: row,
      onSuccess: () => tableRef.value?.refetch(),
    });
  } else if (action === 'delete') {
    if (confirm(`Are you sure you want to delete item group "${row.name}"?`)) {
      try {
        const res = await delete_item_group(row._id);
        if (res.success) {
          toast.success("Item group deleted successfully");
          tableRef.value?.refetch();
        } else {
          toast.error(res.error || "Failed to delete item group");
        }
      } catch (error: any) {
        toast.error(error.message || "An unexpected error occurred");
      }
    }
  }
};
</script>
