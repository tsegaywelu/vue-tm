<template>
  <Table
    id="carrier-setting-list"
    :columns="columns"
    :rows="response"
    :hide_on_sm_screen="['movementAlertEndHour', 'createdAt']"
    :on_sm_screen_column_span="{ movementAlertStartHour: 2, speedAlertThreshold: 2 }"
  >
    <template #cell-movementAlertStartHour="{ row }">
      {{ row.movementAlertStartHour }}:00
    </template>
    
    <template #cell-movementAlertEndHour="{ row }">
      {{ row.movementAlertEndHour }}:00
    </template>

    <template #cell-speedAlertThreshold="{ row }">
      {{ row.speedAlertThreshold }} km/h
    </template>

    <template #cell-createdAt="{ row }">
      {{ new Date(row.createdAt).toLocaleDateString() }}
    </template>

    <template #cell-actions="{ row }">
      <div class="flex items-center justify-center">
        <button
          type="button"
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
  id: "carrier-setting-list",
  url: "/carrier-settings",
});

const columns: TableColumn<any>[] = [
  { key: "movementAlertStartHour", label: "Movement Alert Start Hour", field: "movementAlertStartHour" },
  { key: "movementAlertEndHour", label: "Movement Alert End Hour", field: "movementAlertEndHour" },
  { key: "speedAlertThreshold", label: "Speed Alert Threshold", field: "speedAlertThreshold" },
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
