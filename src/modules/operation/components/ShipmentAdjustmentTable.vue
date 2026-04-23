<template>
  <Table
    id="shipment-adjustment-list"
    :columns="columns"
    :rows="response"
  >
    <template #cell-shipmentCode="{ row }">
      <span class="font-bold">{{ row.shipment?.shipmentCode }}</span>
    </template>

    <template #cell-dispatchDate="{ row }">
      <span class="text-base">
        {{ row.shipment?.dispatchDate?.split("T")[0] || "-" }}
      </span>
    </template>

    <template #cell-route="{ row }">
      <span class="text-base">
        {{ row.shipment?.route?.routeName || "-" }}
      </span>
    </template>

    <template #cell-freightOrder="{ row }">
      <span class="text-base truncate max-w-[15ch] block">
        {{ row.shipment?.freightOrder || "-" }}
      </span>
    </template>

    <template #cell-issueVoucher="{ row }">
      <span class="text-base truncate max-w-[15ch] block">
        {{ row.shipment?.shipperIssueVoucher || "-" }}
      </span>
    </template>

    <template #cell-vehicle="{ row }">
      <span class="text-base">
        {{ row.shipment?.vehicle?.plateNumber || "-" }}
      </span>
    </template>

    <template #cell-driver="{ row }">
      <span class="text-base" v-if="row.shipment?.driver">
        {{ row.shipment.driver.firstName }}
        {{ row.shipment.driver.middleName || "" }}
        {{ row.shipment.driver.lastName || "" }}
      </span>
      <span v-else class="text-gray-400 italic text-sm">-</span>
    </template>
  </Table>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Table from "@/components/common/Table.vue";
import type { TableColumn } from "@/components/common/Table.vue";
import { usePagination } from "@/composables/usePagination";

const columns: TableColumn[] = [
  { key: "shipmentCode", label: "Shipment Code", field: "shipment.shipmentCode" },
  { key: "dispatchDate", label: "Dispatch Date", field: "shipment.dispatchDate" },
  { key: "route", label: "Route", field: "shipment.route.routeName" },
  { key: "freightOrder", label: "Freight Order", field: "shipment.freightOrder" },
  { key: "issueVoucher", label: "Issue Voucher", field: "shipment.shipperIssueVoucher" },
  { key: "vehicle", label: "Vehicle", field: "shipment.vehicle.plateNumber" },
  { key: "driver", label: "Driver", field: "shipment.driver" },
];

const { response, refetch } = usePagination({
  id: "shipment-adjustment-list",
  url: "/shipment/shipmentAdjustments",
});

defineExpose({ refetch });
</script>
