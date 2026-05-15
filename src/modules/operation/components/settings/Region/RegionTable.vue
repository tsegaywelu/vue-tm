<template>
  <Table
    id="region-list"
    :columns="columns"
    :rows="response"
    search_placeholder="Search regions..."
  >
    <template #cell-name="{ row }">
      {{ row.name }}
    </template>

    

    <template #cell-actions="{ row }">
      <div class="flex items-center justify-center">
        <button
          type="button"
          v-permission="'REGION:update'"
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
  id: "region-list",
  url: "/region",
  searchKey: "name[regex]",
});

const columns: TableColumn<any>[] = [
  { key: "name", label: "Name", field: "name" },

  { key: "actions", label: "Action", field: "",  },
];

const handleAction = (row: any, action: string) => {
  emit("action", { row, action });
};

defineExpose({
  refetch,
});
</script>
