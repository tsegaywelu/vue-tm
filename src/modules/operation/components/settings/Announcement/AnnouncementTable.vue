<template>
  <Table
    id="announcement-list"
    :columns="columns"
    :rows="response"
    search_placeholder="Search by title..."
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
      <div class="flex items-center justify-end gap-2">
        <Dropdown>
          <template #default="{ close }">
            
            <!-- Delete action commented out temporarily -->
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
  { key: "actions", label: "Action", field: "", cellAlign: "right" },
];

const handleAction = (row: Announcement, action: string) => {
  emit("action", { row, action });
};

defineExpose({
  refetch,
});
</script>
