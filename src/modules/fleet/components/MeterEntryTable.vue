<template>
  <Table
    id="meter-entry-list"
    :columns="columns"
    :rows="response"
    search_placeholder="Search by plate number..."
  >
    <template #cell-vehicle="{ value }">
      <span class="font-bold text-gray-900">{{ value?.plateNumber || value || '-' }}</span>
    </template>

    <template #cell-meterType="{ value }">
      <span
        class="px-2 py-1 rounded-full text-xs font-bold uppercase"
        :class="{
          'bg-blue-100 text-blue-700': value === 'ODOMETER',
          'bg-orange-100 text-orange-700': value === 'ENGINE_HOURS',
          'bg-gray-100 text-gray-600': !value,
        }"
      >{{ value || '-' }}</span>
    </template>

    <template #cell-reading="{ value }">
      <span class="font-medium text-gray-900">{{ value != null ? value.toLocaleString() : '-' }}</span>
    </template>

    <template #cell-entryDate="{ value }">
      <span class="text-sm text-gray-700">{{ dateFormatter(value) }}</span>
    </template>

    <template #cell-entrySource="{ value }">
      <span class="text-gray-600 text-sm">{{ value ? value.replace(/_/g, ' ') : '-' }}</span>
    </template>

    <template #cell-isOverride="{ value }">
      <span v-if="value" class="px-2 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">Override</span>
      <span v-else class="text-gray-400 text-xs">—</span>
    </template>

    <template #cell-actions="{ row }">
      <div class="flex items-center justify-center">
        <button
          type="button"
          class="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-primary"
          title="Edit"
          @click.stop="emit('action', { row, action: 'edit' })"
        >
          <i v-html="icons.edit"></i>
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
import { dateFormatter } from "@/utils/utils";

const emit = defineEmits(["action"]);

const columns: TableColumn<any>[] = [
  { key: "vehicle", label: "Vehicle", field: "vehicle" },
  { key: "meterType", label: "Type", field: "meterType" },
  { key: "reading", label: "Reading", field: "reading" },
  { key: "entryDate", label: "Entry Date", field: "entryDate" },
  { key: "entrySource", label: "Source", field: "entrySource" },
  { key: "isOverride", label: "Override", field: "isOverride" },
  { key: "actions", label: "Actions", field: "", cellAlign: "center" },
];

const { response, refetch } = usePagination<any>({
  id: "meter-entry-list",
  url: "/fleet/meter-entries",
  params: (state) => ({
    vehiclePlateNumber: { regex: state.search },
    q: undefined,
  }),
});

defineExpose({ refetch });
</script>
