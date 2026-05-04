<template>
  <div class="flex flex-col gap-6">
    <div class="bg-grey-25 rounded-3xl p-6 border border-grey-100">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-bold text-grey-900">Settlements (Paid Advances)</h3>
      </div>

      <Table
        :id="`driver-settlements-${driver._id}`"
        :columns="columns"
        :rows="response"
        :loading="isLoading"
        hide_search
        show_pagination
        @row_click="handleRowClick"
        :head_alignment="{
          advanceNumber: 'left',
          driver: 'left',
          plateNumber: 'left',
          status: 'center',
          createdAt: 'left',
          shipment: 'left',
          route: 'left',
          fuelAdvance: 'right',
          perDiemAdvance: 'right',
          otherAdvance: 'right',
          total: 'right',
        }"
        :row_alignment="{
          advanceNumber: 'left',
          driver: 'left',
          plateNumber: 'left',
          status: 'center',
          createdAt: 'left',
          shipment: 'left',
          route: 'left',
          fuelAdvance: 'right',
          perDiemAdvance: 'right',
          otherAdvance: 'right',
          total: 'right',
        }"
      >
        <template #cell-advanceNumber="{ value }">
          <span class="font-bold text-grey-900">{{ value }}</span>
        </template>

        <template #cell-driver="{ row }">
          <span class="text-base" v-if="row.driver">
            {{ row.driver?.firstName }} {{ row.driver?.middleName || "" }} {{ row.driver?.lastName || "" }}
          </span>
          <span v-else class="text-grey-400 italic text-sm">-</span>
        </template>

        <template #cell-plateNumber="{ row }">
          <span class="text-base">
            {{ row.shipment?.vehicle?.plateNumber || row.vehicle?.plateNumber || "-" }}
          </span>
        </template>

        <template #cell-status="{ value }">
          <Status :variant="value" type="wrapped">
            {{ value?.toLowerCase()?.replace(/_/g, " ")?.replace(/\b\w/g, (c) => c.toUpperCase()) }}
          </Status>
        </template>

        <template #cell-createdAt="{ value }">
          <span class="text-base">{{ value?.split("T")[0] }}</span>
        </template>

        <template #cell-shipment="{ row }">
          <span class="text-base">
            {{ row.shipment?.shipmentCode || row.shipmentCode || "-" }}
          </span>
        </template>

        <template #cell-route="{ row }">
          <span class="text-base">
            {{ row.shipment?.route?.routeName || row.route?.name || "-" }}
          </span>
        </template>

        <template #cell-fuelAdvance="{ row }">
          <span class="text-base">
            {{ currencyFormatter(
              Array.isArray(row.fuelAdvances)
                ? row.fuelAdvances.reduce((acc, item) => acc + (item.amount || 0), 0).toFixed(2)
                : "0.00"
            ) }}
          </span>
        </template>

        <template #cell-perDiemAdvance="{ row }">
          <span class="text-base">
            {{ currencyFormatter(
              Array.isArray(row.perDiemExpenses)
                ? row.perDiemExpenses.reduce((acc, item) => acc + (item.amount || 0), 0)
                : 0
            ) }}
          </span>
        </template>

        <template #cell-otherAdvance="{ row }">
          <span class="text-base">
            {{ currencyFormatter(
              Array.isArray(row.otherExpenses)
                ? row.otherExpenses.reduce((acc, item) => acc + (item.amount || 0), 0)
                : 0
            ) }}
          </span>
        </template>

        <template #cell-total="{ row }">
          <span class="text-base font-semibold text-grey-900">
            {{ currencyFormatter(
              row.amount || (
                (Array.isArray(row.fuelAdvances) ? row.fuelAdvances.reduce((acc, item) => acc + (item.amount || 0), 0) : 0) +
                (Array.isArray(row.perDiemExpenses) ? row.perDiemExpenses.reduce((acc, item) => acc + (item.amount || 0), 0) : 0) +
                (Array.isArray(row.otherExpenses) ? row.otherExpenses.reduce((acc, item) => acc + (item.amount || 0), 0) : 0)
              )
            ) }}
          </span>
        </template>
      </Table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import Table from "@/components/common/Table.vue";
import Status from "@/components/common/Status.vue";
import type { TableColumn } from "@/components/common/Table.vue";
import { usePagination } from "@/composables/usePagination";
import { currencyFormatter } from "@/utils/utils";

const props = defineProps<{
  driver: any;
}>();

const router = useRouter();

const columns: TableColumn[] = [
  { key: "advanceNumber", label: "Advance Number", field: "advanceNumber" },
  { key: "driver", label: "Driver" },
  { key: "plateNumber", label: "Plate Number" },
  { key: "status", label: "Status", field: "status" },
  { key: "createdAt", label: "Date", field: "createdAt" },
  { key: "shipment", label: "Shipment" },
  { key: "route", label: "Route" },
  { key: "fuelAdvance", label: "Fuel Advance" },
  { key: "perDiemAdvance", label: "Perdiem Advance" },
  { key: "otherAdvance", label: "Other Advance" },
  { key: "total", label: "Total" },
];

const { response, refetch, isLoading } = usePagination({
  id: `driver-settlements-${props.driver._id}`,
  url: "/advance-payment",
  params: computed(() => ({ driver: props.driver._id })),
});

const handleRowClick = (row: any) => {
  if (row._id) {
    router.push(`/operation/advance-details/${row._id}`);
  }
};
</script>
