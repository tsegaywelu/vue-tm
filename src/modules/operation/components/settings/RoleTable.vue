<template>
  <Table
    id="roles-list"
    :columns="columns"
    :rows="response"
    search_placeholder="Search by role name..."
  >
    <template #cell-name="{ row }">
      {{ row.name }}
    </template>
    
    <template #cell-createdAt="{ row }">
      {{ new Date(row.createdAt).toLocaleDateString() }}
    </template>

    <template #cell-actions="{ row }">
      <div class="flex items-center justify-end gap-2">
        <span
          v-if="immutableRoles.includes(row.name)"
          class="px-3 py-1 rounded-xl bg-gray-100 text-gray-500 text-[10px] font-bold uppercase tracking-wider"
        >
          Immutable
        </span>
        <Dropdown v-else>
          <template #default="{ close }">
            <DropDownItem v-permission="'ROLE:update'"
              :icon="icons.edit"
              label="Edit"
              @click.stop="
                handleAction(row, 'edit');
                close();
              "
            />
            <!-- Delete action commented out temporarily -->
        <!-- <DropDownItem
              :icon="icons.delete"
              label="Delete"
              class="text-error-600"
              @click.stop="
                handleAction(row, 'delete');
                close();
              "
            /> -->
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

const immutableRoles = ["Driver", "Mechanic", "Maintenance-foreman", "Maintenance Foreman", "SUPER_ADMIN", "ADMIN"];

const { response, refetch } = usePagination<any>({
  id: "roles-list",
  url: "/role",
  searchKey: "name[regex]",
});

const columns: TableColumn<any>[] = [
  { key: "name", label: "Name", field: "name" },
  { key: "createdAt", label: "Created At", field: "createdAt" },
  { key: "actions", label: "Action", field: "", cellAlign: "right" },
];

const handleAction = (row: any, action: string) => {
  emit("action", { row, action });
};

defineExpose({
  refetch,
});
</script>
