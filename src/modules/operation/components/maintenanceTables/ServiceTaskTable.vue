<template>
  <Table
    :row_alignment="{
      name: 'left',
      code: 'left',
      requiredParts: 'left',
      estimatedDuration: 'left',
      estimatedCost: 'left',
      priority: 'left',
      description: 'left',
      actions: 'right',
    }"
    :head_alignment="{
      name: 'left',
      code: 'left',
      requiredParts: 'left',
      estimatedDuration: 'left',
      estimatedCost: 'left',
      priority: 'left',
      description: 'left',
      actions: 'right',
    }"
    id="service-tasks-list"
    :columns="columns"
    :rows="response"
  >
    <template #cell-name="{ row }">
      <span class="font-medium text-gray-900">{{ row.name }}</span>
    </template>

    <template #cell-code="{ row }">
      <span class="text-gray-600">{{ row.code || '-' }}</span>
    </template>

    <template #cell-requiredParts="{ row }">
      <span class="text-gray-600">{{ row.requiredParts?.length ? row.requiredParts.join(', ') : '-' }}</span>
    </template>

    <template #cell-estimatedDuration="{ row }">
      <span class="text-gray-600">{{ row.estimatedDuration ?? '-' }}</span>
    </template>

    <template #cell-estimatedCost="{ row }">
      <span class="text-gray-600">{{ row.estimatedCost ?? '-' }}</span>
    </template>

    <template #cell-priority="{ row }">
      <span class="text-gray-600">{{ row.priority || '-' }}</span>
    </template>

    <template #cell-description="{ row }">
      <span class="text-gray-600">{{ row.description || '-' }}</span>
    </template>

    <template #cell-actions="{ row }">
      <div class="flex items-center justify-end">
        <Dropdown>
          <template #default="{ close }">
            <button
              class="w-full text-left px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              @click="
                handleAction(row, 'view');
                close();
              "
            >
              Details
            </button>
            <button
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
import type { ServiceTask } from "../operation.types";
import type { TableColumn } from "@/components/common/Table.vue";

const emit = defineEmits(["action"]);

const columns: TableColumn<ServiceTask>[] = [
  { key: "name", label: "Name" },
  { key: "code", label: "Code" },
  { key: "requiredParts", label: "Required Parts" },
  { key: "estimatedDuration", label: "Estimated Day" },
  { key: "estimatedCost", label: "Estimated Cost" },
  { key: "priority", label: "Priority" },
  { key: "description", label: "Description" },
  { key: "actions", label: "Actions", cellAlign: "right" },
];

const activeFilters = ref({});
const { response, refetch } = usePagination<ServiceTask>({
  id: "service-tasks-list",
  url: "/service-task",
  params: computed(() => activeFilters.value),
});

const handleAction = (row: ServiceTask, action: string) => {
  emit("action", { row, action });
};

defineExpose({ refetch });
</script>
