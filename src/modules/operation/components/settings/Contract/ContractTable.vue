<template>
  <Table
    id="contract-list"
    :columns="columns"
    :rows="response"
    search_placeholder="Search contracts..."
  >
    <template #cell-shipper="{ row }">
      {{ row.shipper?.name || '-' }}
    </template>
    
    <template #cell-carrier="{ row }">
      {{ row.carrier?.name || '-' }}
    </template>

    <template #cell-createdAt="{ row }">
      {{ new Date(row.createdAt).toLocaleDateString() }}
    </template>

    <template #cell-actions="{ row }">
      <div class="flex items-center justify-end gap-2">
        <Dropdown>
          <template #default="{ close }">
            <DropDownItem
              :icon="icons.eye"
              label="View Details"
              @click.stop="
                handleAction(row, 'view');
                close();
              "
            />
            <DropDownItem
              v-if="canDelete"
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

const { response, refetch } = usePagination<any>({
  id: "contract-list",
  url: "/contract",
});

const columns: TableColumn<any>[] = [
  { key: "shipper", label: "Shipper", field: "shipper.name" },
  { key: "carrier", label: "Carrier", field: "carrier.name" },
  { key: "createdAt", label: "Date Created", field: "createdAt" },
  { key: "actions", label: "Action", field: "", cellAlign: "right" },
];

const canDelete = true; // Add logic if needed based on roles

const handleAction = (row: any, action: string) => {
  emit("action", { row, action });
};

defineExpose({
  refetch,
});
</script>
