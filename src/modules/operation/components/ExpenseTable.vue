<template>
  <Table
    id="expense-list"
    :columns="columns"
    :rows="response"
    search_placeholder="Search by plate number..."
    @row_click="handleAction($event, 'view')"
    
  >
    <template #cell-plateNumber="{ value }">
      <span class="font-bold">{{ value || '-' }}</span>
    </template>

    <template #cell-totalFuelCost="{ value }">
      <span class="text-gray-900">{{ currencyFormatter(value || 0) }}</span>
    </template>

    <template #cell-totalMaintenanceCost="{ value }">
      <span class="text-gray-900">{{ currencyFormatter(value || 0) }}</span>
    </template>

    <template #cell-totalTyreCost="{ value }">
      <span class="text-gray-900">{{ currencyFormatter(value || 0) }}</span>
    </template>

    <template #cell-totalInsuranceCost="{ value }">
      <span class="text-gray-900">{{ currencyFormatter(value || 0) }}</span>
    </template>

    <template #cell-totalExpenses="{ value }">
      <span class="font-bold text-gray-900">{{ currencyFormatter(value || 0) }}</span>
    </template>

    <template #cell-actions="{ row }">
      <div class="flex items-center justify-end">
        <Dropdown>
          <template #default="{ close }">
            <DropDownItem
              :icon="icons.eye"
              label="Details"
              @click.stop="
                handleAction(row, 'view');
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
import { icons } from "@/utils/icons";
import { usePagination } from "@/composables/usePagination";
import type { TableColumn } from "@/components/common/Table.vue";
import { currencyFormatter } from "@/utils/utils";

const emit = defineEmits(["action"]);

const columns: TableColumn<any>[] = [
  { key: "plateNumber", label: "Vehicle", field: "plateNumber" },
  { key: "totalFuelCost", label: "Fuel Cost", field: "totalFuelCost" },
  { key: "totalMaintenanceCost", label: "Maintenance Cost", field: "totalMaintenanceCost" },
  { key: "totalTyreCost", label: "Tyre Cost", field: "totalTyreCost" },
  { key: "totalInsuranceCost", label: "Insurance Cost", field: "totalInsuranceCost" },
  { key: "totalExpenses", label: "Total Cost", field: "totalExpenses" },
  { key: "actions", label: "Actions", field: "", cellAlign: "right" },
];

const today = new Date();
const oneMonthAgo = new Date();
oneMonthAgo.setMonth(today.getMonth() - 1);

const { response, refetch } = usePagination<any>({
  id: "expense-list",
  url: "/expense",
  method: "POST", // API expects a POST for fetching expenses
  paginate: false, // This endpoint does not support page/limit
  params: {
    startDate: oneMonthAgo.toISOString(),
    endDate: today.toISOString(),
  },
});

const handleAction = (row: any, action: string) => {
  emit("action", { row, action });
};

defineExpose({ refetch });
</script>
