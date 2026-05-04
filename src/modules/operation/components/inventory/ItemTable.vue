<template>
  <Table
    id="inventory-items-list"
    :columns="columns"
    :rows="response"
    search_placeholder="Search by name..."
  >
    <template #cell-itemGroup="{ row }">
      <span class="font-medium text-gray-700">
        {{ row.itemGroup?.name || '-' }}
      </span>
    </template>
    
    <template #cell-createdAt="{ row }">
      {{ new Date(row.createdAt).toLocaleDateString() }}
    </template>

    <template #cell-actions="{ row }">
      <div class="flex items-center justify-end">
        <span
          v-if="immutableItems.includes(row.name)"
          class="px-2 py-1 rounded bg-gray-100 text-gray-500 text-xs font-medium"
        >
          Immutable
        </span>
        <Dropdown v-else>
          <template #default="{ close }">
            <DropDownItem
              :icon="icons.edit"
              label="Edit"
              @click.stop="
                handleAction(row, 'edit');
                close();
              "
            />
            <DropDownItem
              :icon="icons.delete"
              label="Delete"
              class="text-error-600"
              @click.stop="
                handleAction(row, 'delete');
                close();
              "
            />
          </template>
        </Dropdown>
      </div>
    </template>
  </Table>
</template>

<script setup lang="ts">
import Table from "@/components/common/Table.vue";
import Dropdown from "@/components/common/Dropdown.vue";
import DropDownItem from "@/components/common/DropDownItem.vue";
import { usePagination } from "@/composables/usePagination";
import { icons } from "@/utils/icons";
import type { TableColumn } from "@/components/common/Table.vue";

const emit = defineEmits(["action"]);

const immutableItems = ["Fuel"];

const { response, refetch } = usePagination<any>({
  id: "inventory-items-list",
  url: "/inventory-items",
  searchKey: "name[regex]",
});

const columns: TableColumn<any>[] = [
  { key: "name", label: "Name", field: "name" },
  { key: "itemGroup", label: "Item Group", field: "itemGroup" },
  { key: "inventoryType", label: "Type", field: "inventoryType" },
  { key: "uom", label: "UoM", field: "uom" },
  { key: "quantity", label: "Quantity", field: "quantity" },
  { key: "createdAt", label: "Created At", field: "createdAt" },
  { key: "actions", label: "Actions", field: "", cellAlign: "right" },
];

const handleAction = (row: any, action: string) => {
  emit("action", { row, action });
};

defineExpose({
  refetch,
});
</script>
