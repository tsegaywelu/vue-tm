<template>
  <div class="rounded-3xl border border-grey-100 overflow-hidden">
    <Table
      id="vehicle-expenses-tab"
      :columns="columns"
      :rows="entries"
      :loading="isLoading"
      @row_click="router.push(`/fleet/vehicle-expenses/${$event._id}`)"
    >
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
import { fetch_vehicle_expenses } from "@/modules/fleet/api/fleet.api";
import { currencyFormatter, dateFormatter } from "@/utils/utils";

const props = defineProps<{ vehicle: Vehicle }>();
const router = useRouter();

const { data: response, isLoading } = useQuery({
  queryKey: ["vehicle-expenses-tab", props.vehicle._id],
  queryFn: () => fetch_vehicle_expenses({ vehicle: props.vehicle._id, limit: 100 }),
  enabled: !!props.vehicle._id,
});

const entries = computed(() => (response.value?.data as any)?.results ?? []);

const columns: TableColumn<any>[] = [
  { key: "vehicleExpenseType", label: "Expense Type", field: "vehicleExpenseType" },
  { key: "amount", label: "Amount", field: "amount" },
  { key: "date", label: "Date", field: "date" },
  { key: "vendor", label: "Vendor", field: "vendor" },
  { key: "isVoided", label: "Status", field: "isVoided" },
];
</script>
