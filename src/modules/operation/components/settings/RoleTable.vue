<template>
  <Table
    id="roles-list"
    :columns="columns"
    :rows="response"
    search_placeholder="Search by role name..."
    :hide_on_sm_screen="['createdAt']"
    :on_sm_screen_column_span="{ name: 2 }"
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
        <button
          v-else
          type="button"
          v-permission="'ROLE:update'"
          class="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-primary"
          @click.stop="handleAction(row, 'edit')"
          title="Edit"
        >
          <i v-html="icons.edit"></i>
        </button>
      </div>
    </template>
  </Table>
</template>

<script setup lang="ts">
import Table from "@/components/common/Table.vue";
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
  { key: "actions", label: "Action", field: "", cellAlign: "center" },
];

const handleAction = (row: any, action: string) => {
  emit("action", { row, action });
};

defineExpose({
  refetch,
});
</script>
