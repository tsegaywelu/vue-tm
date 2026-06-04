<template>
  <div class="flex flex-col gap-6">
    <div class="bg-surface-muted rounded-3xl p-6 border border-line">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-bold text-base-text">Shipment History</h3>
      </div>

      <Table
        :id="`driver-shipments-${driver._id}`"
        :columns="columns"
        :rows="response"
        :loading="isLoading"
        hide_search
        show_pagination
        @row_click="handleRowClick"
        :head_alignment="{
          shipmentCode: 'left',
          status: 'center',
          statusDuration: 'left',
          dispatchDate: 'left',
          route: 'left',
          agent: 'left',
          shipperIssueVoucher: 'left',
          vehicle: 'left',
          driver: 'left',
          total: 'right',
          voucher: 'left',
        }"
        :row_alignment="{
          shipmentCode: 'left',
          status: 'center',
          statusDuration: 'left',
          dispatchDate: 'left',
          route: 'left',
          agent: 'left',
          shipperIssueVoucher: 'left',
          vehicle: 'left',
          driver: 'left',
          total: 'right',
          voucher: 'left',
        }"
      >
        <template #cell-shipmentCode="{ value }">
          <span class="font-bold text-base-text">{{ value }}</span>
        </template>

        <template #cell-status="{ value }">
          <Status :variant="value" type="wrapped">
            {{ value?.replace(/_/g, " ") }}
          </Status>
        </template>

        <template #cell-statusDuration="{ row }">
          <span class="text-base">
            {{ row.statusDuration || "-" }}
          </span>
        </template>

        <template #cell-dispatchDate="{ value }">
          <span class="text-base">
            {{ value ? dateFormatter(value) : "-" }}
          </span>
        </template>

        <template #cell-route="{ row }">
          <span class="text-base">
            {{ row.route?.routeName || "-" }}
          </span>
        </template>

        <template #cell-agent="{ row }">
          <span class="text-base">
            {{ row.agent?.name || "-" }}
          </span>
        </template>

        <template #cell-shipperIssueVoucher="{ row }">
          <span class="text-base">
            {{ row.shipperIssueVoucher || row.shipperIssueVoucherNumber || "No Voucher" }}
          </span>
        </template>

        <template #cell-vehicle="{ row }">
          <span class="text-base">
            {{ row.vehicle?.plateNumber || "-" }}
          </span>
        </template>

        <template #cell-driver="{ row }">
          <span class="text-base" v-if="row.driver">
            {{ row.driver.firstName }} {{ row.driver.lastName }}
          </span>
          <span v-else class="text-faint-text italic text-sm">Not Assigned</span>
        </template>

        <template #cell-total="{ row }">
          <div class="flex flex-col text-right">
            <span class="text-base font-semibold text-base-text">
              {{ numberFormatter(row.waypointDistance) }} km
            </span>
            <span class="text-xs text-dim-text" v-if="row.pricingType">
              {{ row.pricingType?.type }} ({{ currencyFormatter(+row.pricingType?.amount) }})
            </span>
          </div>
        </template>

        <template #cell-voucher="{ row }">
          <span class="text-base">
            {{ row.voucherNumber || row.voucher || "-" }}
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
import {
  currencyFormatter,
  dateFormatter,
  numberFormatter,
} from "@/utils/utils";

const props = defineProps<{
  driver: any;
}>();

const router = useRouter();

const columns: TableColumn[] = [
  { key: "shipmentCode", label: "Shipment Code", field: "shipmentCode" },
  { key: "status", label: "Status", field: "status" },
  { key: "statusDuration", label: "Status Duration" },
  { key: "dispatchDate", label: "Dispatch Date", field: "dispatchDate" },
  { key: "route", label: "Route" },
  { key: "agent", label: "Agent" },
  { key: "shipperIssueVoucher", label: "Issue Voucher" },
  { key: "vehicle", label: "Vehicle" },
  { key: "driver", label: "Driver" },
  { key: "total", label: "Total" },
  { key: "voucher", label: "Voucher" },
];

const { response, refetch, isLoading } = usePagination({
  id: `driver-shipments-${props.driver._id}`,
  url: "/shipment",
  params: computed(() => ({ driver: props.driver._id })),
});

const handleRowClick = (row: any) => {
  if (row._id) {
    router.push(`/operation/shipments/${row._id}`);
  }
};
</script>
