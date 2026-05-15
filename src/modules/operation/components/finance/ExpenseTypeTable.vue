<template>
  <Table
    id="expense-type-list"
    :columns="columns"
    :rows="response"
    search_placeholder="Search by name..."
    @row_click="handleAction($event, 'view')"
  >
    <template #cell-name="{ value }">
      <span class="font-bold text-gray-900">{{ value || '-' }}</span>
    </template>

    <template #cell-typicalPrice="{ value }">
      <span class="text-gray-900">{{ currencyFormatter(value || 0) }}</span>
    </template>

    <template #cell-description="{ value }">
      <span class="text-gray-600 line-clamp-1">{{ value || '-' }}</span>
    </template>

    <template #cell-createdAt="{ value }">
      <span class="text-sm text-gray-500">{{ dateFormatter(value) }}</span>
    </template>

    <template #cell-actions="{ row }">
      <div class="flex items-center justify-center">
        <button
          type="button"
          v-permission="'EXPENSE_TYPE:update'"
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
import { icons } from "@/utils/icons";
import { usePagination } from "@/composables/usePagination";
import type { TableColumn } from "@/components/common/Table.vue";
import { currencyFormatter, dateFormatter } from "@/utils/utils";

const emit = defineEmits(["action"]);

const columns: TableColumn<any>[] = [
  { key: "name", label: "Name", field: "name" },
  { key: "typicalPrice", label: "Typical Price", field: "typicalPrice" },
  { key: "description", label: "Description", field: "description" },
  { key: "createdAt", label: "Created At", field: "createdAt" },
  { key: "actions", label: "Actions", field: "", cellAlign: "center" },
];

const { response, refetch } = usePagination<any>({
  id: "expense-type-list",
  url: "/expense-type",
  params: (state) => {
    return (
      {
        name: {
          regex: state.search
        },
        q: undefined
      }
    )
  }
});

const handleAction = (row: any, action: string) => {
  emit("action", { row, action });
};

defineExpose({ refetch });
</script>
