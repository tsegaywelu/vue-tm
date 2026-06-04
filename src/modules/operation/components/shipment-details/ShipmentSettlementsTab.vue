<template>
  <div class="flex flex-col gap-6 p-4">
    <div
      v-if="(!transactions || transactions.length === 0) && !isLoading"
      class="flex flex-col items-center justify-center p-12 min-h-[300px] bg-surface rounded-2xl border border-gray-100 shadow-sm gap-4 text-center"
    >
      <div
        class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 border border-gray-100/80"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v1m0 8v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <div class="flex flex-col gap-1">
        <h3 class="text-base font-semibold text-gray-900">
          No Transactions Recorded
        </h3>
        <p class="text-sm text-gray-500 max-w-sm">
          There are no settlement transactions for this shipment yet.
        </p>
      </div>
    </div>

    <div
      v-else
      class="bg-surface rounded-2xl border border-gray-100 p-2 shadow-sm overflow-hidden flex flex-col min-h-0"
    >
      <Table
        id="settlement-transactions-table"
        :columns="columns"
        :rows="transactions"
        :hide_search="true"
        :hide_actions="true"
        :show_pagination="false"
        :clickable_rows="true"
        @row_click="handleRowClick"
      >
        <template #cell-type="{ value }">
          <span class="font-semibold text-gray-800 capitalize">{{
            value?.toLowerCase().replace(/_/g, " ") || "-"
          }}</span>
        </template>

        <template #cell-category="{ value }">
          <span class="text-gray-700 capitalize">{{
            value?.toLowerCase().replace(/_/g, " ") || "-"
          }}</span>
        </template>

        <template #cell-advanceType="{ value }">
          <span class="text-gray-700 capitalize">{{
            value?.toLowerCase().replace(/_/g, " ") || "-"
          }}</span>
        </template>

        <template #cell-liters="{ value }">
          <span class="font-medium text-gray-900" v-if="value"
            >{{ value }} L</span
          >
          <span class="text-gray-400 italic" v-else>-</span>
        </template>

        <template #cell-amount="{ value }">
          <span class="font-bold text-gray-900">{{
            currencyFormatter(value)
          }}</span>
        </template>

        <template #cell-status="{ value }">
          <Status class="w-auto! px-4!" :variant="value" type="wrapped">
            {{ value || "N/A" }}
          </Status>
        </template>

        <template #cell-createdAt="{ value }">
          <span class="text-sm font-medium text-gray-600">
            {{ dateTimeFormatter(value) || "-" }}
          </span>
        </template>
      </Table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Table from "@/components/common/Table.vue";
import type { TableColumn } from "@/components/common/Table.vue";
import Status from "@/components/common/Status.vue";
import { usePagination } from "@/composables/usePagination";
import { currencyFormatter, dateTimeFormatter } from "@/utils/utils";
import type { Shipment } from "@/utils/type";
import type { ShipmentTransaction } from "../../operation.types";
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps<{
  shipment: Shipment;
}>();

const shipmentId = computed(() => props.shipment._id);

console.log(props.shipment);
// Data Query
const { response: transactions, isLoading } =
  usePagination<ShipmentTransaction>({
    id: `settlements-transactions-${shipmentId.value}`,
    url: `/transaction/shipments/${shipmentId.value}`,
    autofetch: !!shipmentId.value,
  });

const columns: TableColumn<any>[] = [
  { key: "type", label: "Type", field: "type" },
  { key: "category", label: "Category", field: "category" },
  { key: "advanceType", label: "Advance Type", field: "advanceType" },
  { key: "liters", label: "Liters", field: "liters" },
  { key: "amount", label: "Amount", field: "amount" },
  { key: "status", label: "Status", field: "status" },
  { key: "createdAt", label: "Created At", field: "createdAt" },
];

const handleRowClick = (row: ShipmentTransaction) => {
  if (row.advancePayment) {
    router.push(`/operation/advance-details/${row.advancePayment}`);
  } else if (row.advanceId) {
    router.push(`/operation/advance-details/${row.advanceId}`);
  } else if (row._id) {
    // Fallback just in case
    router.push(`/operation/advance-details/${row._id}`);
  }
};
</script>
