<template>
  <Table
    id="bonus-history-list"
    :columns="columns"
    :rows="response"
    search_placeholder="Search by driver name..."
    @row_click="handleAction($event, 'view')"
  >
    <template #cell-driver="{ row }">
      <span class="font-medium text-gray-900">
        {{ row.driver?.firstName }} {{ row.driver?.middleName }} {{ row.driver?.lastName }}
      </span>
    </template>

    <template #cell-monthYear="{ row }">
      <span class="text-gray-700">{{ getMonthName(row.month) }} {{ row.year }}</span>
    </template>

    <template #cell-metricBreakdown="{ row }">
      <div class="space-y-1 text-xs py-2">
        <div v-if="row.metricBreakdown?.distanceCovered">
          <span class="text-gray-500">Distance:</span>
          {{ row.metricBreakdown.distanceCovered.total?.toFixed(1) }} km
          <span class="text-primary font-medium">(+{{ currencyFormatter(row.metricBreakdown.distanceCovered.bonus) }})</span>
        </div>
        <div v-if="row.metricBreakdown?.fuelUsage">
          <span class="text-gray-500">Fuel:</span>
          {{ row.metricBreakdown.fuelUsage.total?.toFixed(2) }} km/L
          <span class="text-primary font-medium">(+{{ currencyFormatter(row.metricBreakdown.fuelUsage.bonus) }})</span>
        </div>
        <div v-if="row.metricBreakdown?.totalTrips">
          <span class="text-gray-500">Trips:</span>
          {{ row.metricBreakdown.totalTrips.total }}
          <span class="text-primary font-medium">(+{{ currencyFormatter(row.metricBreakdown.totalTrips.bonus) }})</span>
        </div>
      </div>
    </template>

    <template #cell-routeBonus="{ value }">
      <span class="text-gray-900">{{ currencyFormatter(value || 0) }}</span>
    </template>

    <template #cell-totalAmount="{ value }">
      <span class="font-bold text-gray-900">{{ currencyFormatter(value || 0) }}</span>
    </template>

    <template #cell-status="{ value }">
      <Status :type="value==='pending'?'extended':value==='collected'?'warning':'completed'" :label="value" class="uppercase " />
    </template>

    <template #cell-collectedAt="{ value }">
      <span class="text-gray-700">{{ dateFormatter(value) }}</span>
    </template>
  </Table>
</template>

<script setup lang="ts">
import Table from "@/components/common/Table.vue";
import Status from "@/components/common/Status.vue";
import { usePagination } from "@/composables/usePagination";
import type { TableColumn } from "@/components/common/Table.vue";
import { currencyFormatter, dateFormatter } from "@/utils/utils";

const emit = defineEmits(["action"]);

const columns: TableColumn<any>[] = [
  { key: "driver", label: "Driver", field: "driver.firstName" },
  { key: "monthYear", label: "Month/Year", field: "month" },
  { key: "metricBreakdown", label: "Metric Breakdown", field: "metricBreakdown" },
  { key: "routeBonus", label: "Route Bonus", field: "routeBonusTotal" },
  { key: "totalAmount", label: "Total Amount", field: "amount" },
  { key: "status", label: "Status", field: "status" },
  { key: "collectedAt", label: "Collected At", field: "collectedAt" },
];

const { response, refetch } = usePagination<any>({
  id: "bonus-history-list",
  url: "/bonus/admin/history",
});

const getMonthName = (month: number) => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return months[month - 1] || "";
};

const handleAction = (row: any, action: string) => {
  emit("action", { row, action });
};

defineExpose({ refetch });
</script>
