<template>
  <Table
    id="announcement-list"
    :columns="columns"
    :rows="response"
    search_placeholder="Search by title..."
    :hide_on_sm_screen="['message', 'createdAt']"
    :on_sm_screen_column_span="{ title: 2, targetAudience: 2 }"
  >
    <template #cell-title="{ row }">
      <div class="font-medium text-gray-900">{{ row.title }}</div>
    </template>

    <template #cell-message="{ row }">
      <div class="truncate max-w-xs text-gray-500" :title="row.message">
        {{ row.message }}
      </div>
    </template>

    <template #cell-targetAudience="{ row }">
      <span
        class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
        :class="{
          'bg-blue-100 text-blue-800': row.targetAudience === 'ALL',
          'bg-green-100 text-green-800': row.targetAudience === 'DRIVER',
          'bg-yellow-100 text-yellow-800': row.targetAudience === 'MECHANIC',
        }"
      >
        {{ row.targetAudience }}
      </span>
    </template>

    <template #cell-createdAt="{ row }">
      {{ row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-" }}
    </template>

    <template #cell-actions="{ row }">
      <div class="flex items-center justify-center">
        <button
          type="button"
          class="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-primary"
          @click.stop="handleAction(row, 'delete')"
          title="Delete"
        >
          <i v-html="icons.delete"></i>
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
import type { Announcement } from "@/modules/operation/operation.types"; 

const emit = defineEmits(["action"]);

const { response, refetch } = usePagination<Announcement>({
  id: "announcement-list",
  url: "/announcements",
  searchKey: "title[regexAny]",
});

const columns: TableColumn<Announcement>[] = [
  { key: "title", label: "Title", field: "title" },
  { key: "message", label: "Message", field: "message" },
  { key: "targetAudience", label: "Target Audience", field: "targetAudience" },
  { key: "createdAt", label: "Created At", field: "createdAt" },
  { key: "actions", label: "Action", field: "", cellAlign: "center" },
];

const handleAction = (row: Announcement, action: string) => {
  emit("action", { row, action });
};

defineExpose({
  refetch,
});
</script>
