<template>
  <Table
    id="vehicle-expense-list"
    :columns="columns"
    :rows="response"
    search_placeholder="Search by plate number..."
  >
    <template #cell-vehicle="{ value }">
      <span class="font-bold text-gray-900">{{ value?.plateNumber || value || '-' }}</span>
    </template>

    <template #cell-vehicleExpenseType="{ value }">
      <span class="text-gray-700">{{ value?.name || value || '-' }}</span>
    </template>

    <template #cell-amount="{ value }">
      <span class="font-medium">{{ value != null ? currencyFormatter(value) : '-' }}</span>
    </template>

    <template #cell-date="{ value }">
      <span class="text-sm text-gray-700">{{ dateFormatter(value) }}</span>
    </template>

    <template #cell-isVoided="{ value }">
      <span
        class="px-2 py-1 rounded-full text-xs font-bold uppercase"
        :class="value ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'"
      >{{ value ? 'Voided' : 'Active' }}</span>
    </template>

    <template #cell-actions="{ row }">
      <div class="flex items-center justify-center gap-1">
        <button
          v-if="!row.isVoided"
          type="button"
          class="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-primary"
          title="Edit"
          @click.stop="emit('action', { row, action: 'edit' })"
        >
          <i v-html="icons.edit"></i>
        </button>
        <button
          v-if="!row.isVoided"
          type="button"
          class="p-2 rounded-full hover:bg-red-50 transition-colors text-gray-500 hover:text-red-600"
          title="Void"
          @click.stop="emit('action', { row, action: 'void' })"
        >
          <i class="mdi mdi-cancel text-base"></i>
        </button>
      </div>
    </template>
  </Table>
</template>

<script setup lang="ts">
import Table from "@/components/common/Table.vue";
import type { TableColumn } from "@/components/common/Table.vue";
import { icons } from "@/utils/icons";
import { usePagination } from "@/composables/usePagination";
import { currencyFormatter, dateFormatter } from "@/utils/utils";

const emit = defineEmits(["action"]);

const columns: TableColumn<any>[] = [
  { key: "vehicle", label: "Vehicle", field: "vehicle" },
  { key: "vehicleExpenseType", label: "Expense Type", field: "vehicleExpenseType" },
  { key: "amount", label: "Amount", field: "amount" },
  { key: "date", label: "Date", field: "date" },
  { key: "vendor", label: "Vendor", field: "vendor" },
  { key: "isVoided", label: "Status", field: "isVoided" },
  { key: "actions", label: "Actions", field: "", cellAlign: "center" },
];

const { response, refetch } = usePagination<any>({
  id: "vehicle-expense-list",
  url: "/fleet/vehicle-expenses",
  params: (state) => ({
    vehiclePlateNumber: { regex: state.search },
    q: undefined,
  }),
});

defineExpose({ refetch });
</script>
