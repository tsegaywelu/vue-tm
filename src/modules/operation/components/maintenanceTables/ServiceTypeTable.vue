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
    :on_sm_screen_column_span="{ name: 2, description: 3 }"
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
      <div class="flex items-center justify-center">
        <Dropdown>
          <template #default="{ close }">
            <DropDownItem v-permission="'TYPE:read'"
              :icon="icons.eye"
              label="View Details"
              @click.stop="
                handleAction(row, 'view');
                close();
              "
            />
            <DropDownItem v-permission="'TYPE:update'"
              :icon="icons.edit"
              label="Edit"
              @click.stop="
                handleAction(row, 'edit');
                close();
              "
            />
            <DropDownItem v-permission="'TYPE:delete'"
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
import { computed, ref } from "vue";
import Table from "@/components/common/Table.vue";
import Dropdown from "@/components/common/Dropdown.vue";
import DropDownItem from "@/components/common/DropDownItem.vue";
import { icons } from "@/utils/icons";
import { usePagination } from "@/composables/usePagination";
import type { ServiceType } from "../operation.types";
import type { TableColumn } from "@/components/common/Table.vue";

const emit = defineEmits(["action"]);

const columns: TableColumn<ServiceType>[] = [
  { key: "name", label: "Name" },
  { key: "description", label: "Description" },
  { key: "taskCount", label: "Task Count" },
  { key: "actions", label: "Actions", cellAlign: "center" },
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
