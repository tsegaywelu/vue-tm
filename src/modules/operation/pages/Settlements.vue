<template>
  <AdvanceTable
    url="/advance-payment"
    pagination-id="settlement-list"
    :extra-params="{ status: 'PAID' }"
    :columns="columns"
    :column-span="{ advanceNumber: 2, driver: 2, route: 2, plateNumber: 2, total: 2, status: 2 }"
  />
</template>

<script setup lang="ts">
import AdvanceTable from "../components/AdvanceTable.vue";
import type { TableColumn } from "@/components/common/Table.vue";

const columns: TableColumn[] = [
  { key: "advanceNumber", label: "Ref. Number", field: "advanceNumber" },
  { key: "createdAt", label: "Date", field: "createdAt" },
  { key: "shipment", label: "Shipment", field: "shipmentCode" },
  { key: "route", label: "Route", field: "route" },
  { key: "driver", label: "Driver", field: "driver" },
  { key: "plateNumber", label: "Vehicle", field: "plateNumber" },
  { key: "fuelAdvance", label: "Fuel", field: "fuelAdvances" },
  { key: "perDiemAdvance", label: "Perdiem", field: "perDiemExpenses" },
  { key: "otherAdvance", label: "Other", field: "otherExpenses" },
  { key: "total", label: "Total", field: "amount" },
  { key: "status", label: "Status", field: "status" },
];
</script>
