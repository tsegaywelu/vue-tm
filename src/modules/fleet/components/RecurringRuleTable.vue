<template>
  <Table
    id="recurring-rule-list"
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

    <template #cell-frequency="{ value }">
      <span
        class="px-2 py-1 rounded-full text-xs font-bold uppercase"
        :class="{
          'bg-blue-100 text-blue-700': value === 'DAILY',
          'bg-purple-100 text-purple-700': value === 'WEEKLY',
          'bg-orange-100 text-orange-700': value === 'MONTHLY',
        }"
      >{{ value || '-' }}</span>
    </template>

    <template #cell-startDate="{ value }">
      <span class="text-sm text-gray-700">{{ dateFormatter(value) }}</span>
    </template>

    <template #cell-isActive="{ value }">
      <span
        class="px-2 py-1 rounded-full text-xs font-bold uppercase"
        :class="value ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'"
      >{{ value ? 'Active' : 'Paused' }}</span>
    </template>

    <template #cell-actions="{ row }">
      <div class="flex items-center justify-center">
        <Dropdown>
          <template #default="{ close }">
            <DropDownItem
              :icon="icons.eye"
              label="View Details"
              @click.stop="emit('action', { row, action: 'view' }); close()"
            />
            <DropDownItem
              :icon="icons.edit"
              label="Edit"
              @click.stop="emit('action', { row, action: 'edit' }); close()"
            />
            <DropDownItem
              v-if="row.isActive"
              :icon="icons.deactivate"
              label="Pause"
              variant="danger"
              @click.stop="emit('action', { row, action: 'pause' }); close()"
            />
            <DropDownItem
              v-else
              label="Resume"
              @click.stop="emit('action', { row, action: 'resume' }); close()"
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
import type { TableColumn } from "@/components/common/Table.vue";
import { icons } from "@/utils/icons";
import { usePagination } from "@/composables/usePagination";
import { currencyFormatter, dateFormatter } from "@/utils/utils";

const emit = defineEmits(["action"]);

const columns: TableColumn<any>[] = [
  { key: "vehicle", label: "Vehicle", field: "vehicle" },
  { key: "vehicleExpenseType", label: "Expense Type", field: "vehicleExpenseType" },
  { key: "amount", label: "Amount", field: "amount" },
  { key: "frequency", label: "Frequency", field: "frequency" },
  { key: "startDate", label: "Start Date", field: "startDate" },
  { key: "isActive", label: "Status", field: "isActive" },
  { key: "actions", label: "Actions", field: "", cellAlign: "center" },
];

const { response, refetch } = usePagination<any>({
  id: "recurring-rule-list",
  url: "/fleet/recurring-expense-rules",
  params: (state) => ({
    ...(state.search ? { vehiclePlateNumber: state.search } : {}),
    q: undefined,
  }),
});

defineExpose({ refetch });
</script>
