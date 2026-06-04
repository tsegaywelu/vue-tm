<template>
  <Table
    id="bonus-multiplier-list"
    :columns="columns"
    :rows="response"
    search_placeholder="Search multipliers..."
    :hide_on_sm_screen="['minValue', 'maxValue', 'description', 'createdAt']"
    :on_sm_screen_column_span="{ metric: 2, multiplier: 2 }"
  >
    <template #cell-metric="{ row }">
      {{ formatMetric(row.metric) }}
    </template>

    <template #cell-minValue="{ row }">
      {{ row.minValue ?? 0 }}
    </template>

    <template #cell-maxValue="{ row }">
      {{ row.maxValue ?? "-" }}
    </template>

    <template #cell-multiplier="{ row }">
      {{ row.multiplier }}
    </template>

    <template #cell-description="{ row }">
      {{ row.description || "-" }}
    </template>

    <template #cell-createdAt="{ row }">
      {{ row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-" }}
    </template>

    <template #cell-actions="{ row }">
      <div class="flex items-center justify-center">
        <button
          type="button"
          v-permission="'DRIVER_BONUS:update'"
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
import type { BonusMultiplier } from "@/modules/operation/operation.types"; 

const emit = defineEmits(["action"]);

const { response, refetch } = usePagination<BonusMultiplier>({
  id: "bonus-multiplier-list",
  url: "/bonus/config/multiplier",
  searchKey: "description[regex]", // Searching by description as fallback
});

const columns: TableColumn<BonusMultiplier>[] = [
  { key: "metric", label: "Metric", field: "metric" },
  { key: "minValue", label: "Min Value", field: "minValue" },
  { key: "maxValue", label: "Max Value", field: "maxValue" },
  { key: "multiplier", label: "Multiplier", field: "multiplier" },
  { key: "description", label: "Description", field: "description" },
  { key: "createdAt", label: "Created At", field: "createdAt" },
  { key: "actions", label: "Action", field: "", cellAlign: "center" },
];

const formatMetric = (metric: string) => {
  const metricLabels: Record<string, string> = {
    totalTrips: "Trip Count",
    distanceCovered: "Distance (KM)",
    fuelUsage: "Fuel Usage (KM/L)",
  };
  return metricLabels[metric] || metric;
};

const handleAction = (row: BonusMultiplier, action: string) => {
  emit("action", { row, action });
};

defineExpose({
  refetch,
});
</script>
