<template>
  <Table
    :row_alignment="{
      name: 'left',
      description: 'left',
      taskCount: 'left',
      actions: 'right',
    }"
    :head_alignment="{
      name: 'left',
      description: 'left',
      taskCount: 'left',
      actions: 'right',
    }"
    id="service-types-list"
    :columns="columns"
    :rows="response"
  >
    <template #cell-name="{ row }">
      <span class="font-medium text-gray-900">{{ row.name }}</span>
    </template>

    <template #cell-description="{ row }">
      <span class="text-gray-600">{{ row.description || '-' }}</span>
    </template>

    <template #cell-taskCount="{ row }">
      <span class="text-gray-600">{{ row.serviceTasks?.length || 0 }}</span>
    </template>

    <template #cell-actions="{ row }">
      <div class="flex items-center justify-end">
        <Dropdown>
          <template #default="{ close }">
            <button v-permission="'TYPE:read'"
              class="w-full text-left px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              @click="
                handleAction(row, 'view');
                close();
              "
            >
              Details
            </button>
            <button v-permission="'TYPE:update'"
              class="w-full text-left px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors text-brightBlue-dark"
              @click="
                handleAction(row, 'edit');
                close();
              "
            >
              Edit
            </button>
          </template>
        </Dropdown>
      </div>
    </template>
  </Table>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import Table from "@/components/common/Table.vue";
import Dropdown from "@/components/common/Dropdown.vue";
import { usePagination } from "@/composables/usePagination";
import type { ServiceType } from "../operation.types";
import type { TableColumn } from "@/components/common/Table.vue";

const emit = defineEmits(["action"]);

const columns: TableColumn<ServiceType>[] = [
  { key: "name", label: "Name" },
  { key: "description", label: "Description" },
  { key: "taskCount", label: "Task Count" },
  { key: "actions", label: "Actions", cellAlign: "right" },
];

const activeFilters = ref({});
const { response, refetch } = usePagination<ServiceType>({
  id: "service-types-list",
  url: "/service-type",
  params: computed(() => activeFilters.value),
});

const handleAction = (row: ServiceType, action: string) => {
  emit("action", { row, action });
};

defineExpose({ refetch });
</script>
