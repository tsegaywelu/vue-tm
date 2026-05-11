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
      <div class="flex items-center justify-end">
        <Dropdown>
          <template #default="{ close }">
            <DropDownItem v-permission="'EXPENSE_TYPE:update'"
              :icon="icons.edit"
              label="Edit"
              @click.stop="
                handleAction(row, 'edit');
                close();
              "
            />
            <!-- Delete action commented out temporarily -->
        <!-- <DropDownItem
              :icon="icons.trash"
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
  { key: "actions", label: "Actions", field: "", cellAlign: "right" },
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
