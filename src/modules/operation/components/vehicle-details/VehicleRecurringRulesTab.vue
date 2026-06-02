<template>
  <div class="rounded-3xl border border-grey-100 overflow-hidden">
    <Table
      id="vehicle-recurring-rules-tab"
      :columns="columns"
      :rows="rules"
      :loading="isLoading"
      @row_click="router.push(`/fleet/recurring-rules/${$event._id}`)"
    >
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
import { fetch_recurring_rules } from "@/modules/fleet/api/fleet.api";
import { currencyFormatter, dateFormatter } from "@/utils/utils";

const props = defineProps<{ vehicle: Vehicle }>();
const router = useRouter();

const { data: response, isLoading } = useQuery({
  queryKey: ["vehicle-recurring-rules-tab", props.vehicle._id],
  queryFn: () => fetch_recurring_rules({ vehicle: props.vehicle._id, limit: 100 }),
  enabled: !!props.vehicle._id,
});

const rules = computed(() => (response.value?.data as any)?.results ?? []);

const columns: TableColumn<any>[] = [
  { key: "vehicleExpenseType", label: "Expense Type", field: "vehicleExpenseType" },
  { key: "amount", label: "Amount", field: "amount" },
  { key: "frequency", label: "Frequency", field: "frequency" },
  { key: "startDate", label: "Start Date", field: "startDate" },
  { key: "isActive", label: "Status", field: "isActive" },
];
</script>
