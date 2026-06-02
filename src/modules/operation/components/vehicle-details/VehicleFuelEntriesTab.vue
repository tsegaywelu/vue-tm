<template>
  <div class="rounded-3xl border border-grey-100 overflow-hidden">
    <Table
      id="vehicle-fuel-entries-tab"
      :columns="columns"
      :rows="entries"
      :loading="isLoading"
      @row_click="router.push(`/fleet/fuel-entries/${$event._id}`)"
    >
      <template #cell-date="{ value }">
        <span class="text-sm text-gray-700">{{ dateFormatter(value) }}</span>
      </template>
      <template #cell-quantity="{ value }">
        <span>{{ value != null ? `${value} L` : '-' }}</span>
      </template>
      <template #cell-amount="{ value }">
        <span class="font-medium">{{ value != null ? currencyFormatter(value) : '-' }}</span>
      </template>
      <template #cell-usageType="{ value }">
        <span
          class="px-2 py-1 rounded-full text-xs font-bold uppercase"
          :class="{
            'bg-blue-100 text-blue-700': value === 'BUSINESS',
            'bg-gray-100 text-gray-600': value === 'PERSONAL' || !value,
          }"
        >{{ value || '-' }}</span>
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
import { fetch_fuel_entries } from "@/modules/fleet/api/fleet.api";
import { currencyFormatter, dateFormatter } from "@/utils/utils";

const props = defineProps<{ vehicle: Vehicle }>();
const router = useRouter();

const { data: response, isLoading } = useQuery({
  queryKey: ["vehicle-fuel-entries-tab", props.vehicle._id],
  queryFn: () => fetch_fuel_entries({ vehicle: props.vehicle._id, limit: 100 }),
  enabled: !!props.vehicle._id,
});

const entries = computed(() => (response.value?.data as any)?.results ?? []);

const columns: TableColumn<any>[] = [
  { key: "date", label: "Date", field: "date" },
  { key: "quantity", label: "Quantity", field: "quantity" },
  { key: "unitPrice", label: "Unit Price", field: "unitPrice" },
  { key: "amount", label: "Amount", field: "amount" },
  { key: "usageType", label: "Usage", field: "usageType" },
  { key: "vendor", label: "Vendor", field: "vendor" },
  { key: "isVoided", label: "Status", field: "isVoided" },
];
</script>
