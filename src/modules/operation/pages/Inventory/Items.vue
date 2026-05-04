<template>
  <Teleport to="#page-actions" defer>
    <Button
      variant="primary"
      size="md"
      class="flex items-center gap-2"
      @click="router.push('/inventory/items/add')"
    >
      <i v-html="icons.plus" />
      Add Inventory Item
    </Button>
  </Teleport>

  <ItemTable
    ref="tableRef"
    @action="handleItemAction"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import ItemTable from "../../components/inventory/ItemTable.vue";
import Button from "@/components/Button.vue";
import { icons } from "@/utils/icons";
import { delete_inventory_item } from "../../api/inventory.api";
import { useToastStore } from "@/store/toastStore";

const router = useRouter();
const toast = useToastStore();
const tableRef = ref();

const handleItemAction = async ({ row, action }: any) => {
  if (action === 'edit') {
    router.push(`/inventory/items/edit/${row._id}`);
  } else if (action === 'delete') {
    if (confirm(`Are you sure you want to delete item "${row.name}"?`)) {
      try {
        const res = await delete_inventory_item(row._id);
        if (res.success) {
          toast.success("Item deleted successfully");
          tableRef.value?.refetch();
        } else {
          toast.error(res.error || "Failed to delete item");
        }
      } catch (error: any) {
        toast.error(error.message || "An unexpected error occurred");
      }
    }
  }
};
</script>
