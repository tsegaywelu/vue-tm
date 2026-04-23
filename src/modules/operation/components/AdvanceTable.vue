<template>
  <Table
    :row_alignment="{ driver: 'left', route: 'left' }"
    :head_alignment="{ driver: 'left', route: 'left' }"
    :id="tableId"
    :columns="columns"
    :rows="response"
  >
    <template #cell-advanceNumber="{ value }">
      <span class="font-bold">{{ value }}</span>
    </template>

    <template #cell-driver="{ row }">
      <span class="text-base" v-if="row.driver">
        {{ row.driver?.firstName }} {{ row.driver?.middleName || "" }}
        {{ row.driver?.lastName || "" }}
      </span>
      <span v-else class="text-gray-400 italic text-sm">-</span>
    </template>

    <template #cell-plateNumber="{ row }">
      <span class="text-base">
        {{ row.shipment?.vehicle?.plateNumber || "-" }}
      </span>
    </template>

    <template #cell-status="{ value }">
      <span
        :class="{
          'text-red-500': ['CANCELLED', 'REJECTED'].includes(value),
          'text-blue-600': ['PAID', 'AUTHORIZED', 'APPROVED'].includes(value),
          'text-yellow-500': value === 'PENDING',
        }"
        class="text-xs font-semibold uppercase"
      >
        {{ value }}
      </span>
    </template>

    <template #cell-createdAt="{ value }">
      <span class="text-base">{{ value?.split("T")[0] }}</span>
    </template>

    <template #cell-shipment="{ row }">
      <span class="text-base">
        {{ row.shipment?.shipmentCode || "-" }}
      </span>
    </template>

    <template #cell-route="{ row }">
      <span class="text-base">
        {{ row.shipment?.route?.routeName || "-" }}
      </span>
    </template>

    <template #cell-fuelAdvance="{ row }">
      <span class="text-base">
        {{
          currencyFormatter(
            Array.isArray(row.fuelAdvances)
              ? row.fuelAdvances
                  .reduce(
                    (acc: number, item: any) => acc + (item.amount || 0),
                    0,
                  )
                  .toFixed(2)
              : "0.00",
          )
        }}
      </span>
    </template>

    <template #cell-perDiemAdvance="{ row }">
      <span class="text-base">
        {{
          currencyFormatter(
            Array.isArray(row.perDiemExpenses)
              ? row.perDiemExpenses.reduce(
                  (acc: number, item: any) => acc + (item.amount || 0),
                  0,
                )
              : 0,
          )
        }}
      </span>
    </template>

    <template #cell-otherAdvance="{ row }">
      <span class="text-base">
        {{
          currencyFormatter(
            Array.isArray(row.otherExpenses)
              ? row.otherExpenses.reduce(
                  (acc: number, item: any) => acc + (item.amount || 0),
                  0,
                )
              : 0,
          )
        }}
      </span>
    </template>

    <template #cell-total="{ row }">
      <span class="text-base font-semibold">
        {{
          currencyFormatter(
            (Array.isArray(row.fuelAdvances)
              ? row.fuelAdvances.reduce(
                  (acc: number, item: any) => acc + (item.amount || 0),
                  0,
                )
              : 0) +
              (Array.isArray(row.perDiemExpenses)
                ? row.perDiemExpenses.reduce(
                    (acc: number, item: any) => acc + (item.amount || 0),
                    0,
                  )
                : 0) +
              (Array.isArray(row.otherExpenses)
                ? row.otherExpenses.reduce(
                    (acc: number, item: any) => acc + (item.amount || 0),
                    0,
                  )
                : 0),
          )
        }}
      </span>
    </template>
  </Table>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Table from "@/components/common/Table.vue";
import type { TableColumn } from "@/components/common/Table.vue";
import { usePagination } from "@/composables/usePagination";
import { currencyFormatter } from "@/utils/utils";

const props = withDefaults(
  defineProps<{
    /** API URL — changes depending on page context */
    url?: string;
    /** Unique pagination store id */
    paginationId?: string;
    /** Extra params merged into the request */
    extraParams?: Record<string, any>;
  }>(),
  {
    url: "/advance-payment",
    paginationId: "advance-list",
    extraParams: () => ({}),
  },
);

const tableId = computed(() => props.paginationId);

const columns: TableColumn[] = [
  { key: "advanceNumber", label: "Advance Number", field: "advanceNumber" },
  { key: "driver", label: "Driver", field: "driver" },
  {
    key: "plateNumber",
    label: "Plate Number",
    field: "shipment.vehicle.plateNumber",
  },
  { key: "createdAt", label: "Date", field: "createdAt" },
  { key: "shipment", label: "Shipment", field: "shipment.shipmentCode" },
  { key: "route", label: "Route", field: "shipment.route.routeName" },
  { key: "fuelAdvance", label: "Fuel Advance", field: "fuelAdvances" },
  { key: "perDiemAdvance", label: "Perdiem Advance", field: "perDiemExpenses" },
  { key: "otherAdvance", label: "Other Advance", field: "otherExpenses" },
  { key: "total", label: "Total", field: "total" },
  { key: "status", label: "Status", field: "status" },
];

const { response, refetch } = usePagination({
  id: props.paginationId,
  url: props.url,
  params: computed(() => ({ ...props.extraParams })),
});

defineExpose({ refetch });
</script>
