<template>
  <div class="rounded-3xl border border-grey-100 overflow-hidden">
    <Table
      id="vehicle-meter-entries-tab"
      :columns="columns"
      :rows="entries"
      :loading="isLoading"
      @row_click="router.push(`/fleet/meter-entries/${$event._id}`)"
    >
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
    </Table>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import Table from "@/components/common/Table.vue";
import type { TableColumn } from "@/components/common/Table.vue";
import type { Vehicle } from "../../operation.types";
import { fetch_meter_entries } from "@/modules/fleet/api/fleet.api";
import { dateFormatter } from "@/utils/utils";

const props = defineProps<{ vehicle: Vehicle }>();
const router = useRouter();

const { data: response, isLoading } = useQuery({
  queryKey: ["vehicle-meter-entries-tab", props.vehicle._id],
  queryFn: () => fetch_meter_entries({ vehicle: props.vehicle._id, limit: 100 }),
  enabled: !!props.vehicle._id,
});

const entries = computed(() => (response.value?.data as any)?.results ?? []);

const columns: TableColumn<any>[] = [
  { key: "meterType", label: "Type", field: "meterType" },
  { key: "reading", label: "Reading", field: "reading" },
  { key: "entryDate", label: "Entry Date", field: "entryDate" },
  { key: "entrySource", label: "Source", field: "entrySource" },
  { key: "isOverride", label: "Override", field: "isOverride" },
];
</script>
