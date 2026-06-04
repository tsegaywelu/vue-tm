<template>
  <Table
    id="item-groups-list"
    :columns="columns"
    :rows="response"
    search_placeholder="Search by name..."
    :hide_on_sm_screen="['description', 'createdAt']"
    :on_sm_screen_column_span="{ name: 2, category: 2 }"
  >
    <template #cell-category="{ row }">
      <span class="font-medium text-gray-700">
        {{ row.category?.name || "-" }}
      </span>
    </template>

    <template #cell-createdAt="{ row }">
      {{ new Date(row.createdAt).toLocaleDateString() }}
    </template>

    <template #cell-actions="{ row }">
      <div class="flex items-center w-full justify-center">
        <button
          type="button"
          v-permission="'ITEM_GROUP:update'"
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

const { response, refetch } = usePagination<any>({
  id: "item-groups-list",
  url: "/item-groups",
  searchKey: "name[regex]",
});

const columns: TableColumn<any>[] = [
  { key: "name", label: "Name", field: "name" },
  { key: "category", label: "Category", field: "category" },
  { key: "description", label: "Description", field: "description" },
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
