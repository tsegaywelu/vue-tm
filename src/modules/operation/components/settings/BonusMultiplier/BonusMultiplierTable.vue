<template>
  <Table
    id="bonus-multiplier-list"
    :columns="columns"
    :rows="response"
    search_placeholder="Search multipliers..."
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
      <div class="flex items-center justify-end gap-2">
        <Dropdown>
          <template #default="{ close }">
            <DropDownItem
              :icon="icons.edit"
              label="Edit"
              @click.stop="
                handleAction(row, 'edit');
                close();
              "
            />
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
  { key: "actions", label: "Action", field: "" },
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
