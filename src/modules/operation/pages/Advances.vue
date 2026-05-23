<template>
  <div class="flex flex-col gap-4">
    <Teleport to="#page-actions" defer>
      <div class="flex items-center gap-3">
        <Button
          v-if="activeTab === 'driverAdvances'"
          size="md"
          @click="openAddAdvanceModal"
        >
          + Add Advance
        </Button>
        <Button
          v-if="activeTab === 'driverAdvances'"
          size="md"
          variant="outline"
          @click="$router.push('/operation/advance-summary')"
        >
          View Advance Summary
        </Button>
        <Button
          v-else-if="activeTab === 'transporterAdvances'"
          v-permission="{ subject: 'PRE_PAYMENT', actions: ['create'] }"
          size="md"
          @click="openAddTransporterAdvanceModal"
        >
          + Add Transporter Advance
        </Button>
        <Button
          v-if="activeTab === 'transporterAdvances'"
          size="md"
          variant="outline"
          @click="$router.push('/operation/prepayment-summary')"
        >
          View Pre-Payment Summary
        </Button>
      </div>
    </Teleport>

    <!-- Tab Content -->
    <AdvanceTable
      v-if="activeTab === 'driverAdvances'"
      url="/advance-payment"
      pagination-id="driver-advance-list"
      :columns="driverColumns"
      :checkable="false"
    />
    <AdvanceTable
      v-if="activeTab === 'transporterAdvances'"
      url="/pre-payment"
      pagination-id="transporter-advance-list"
      :columns="transporterColumns"
      :checkable="false"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { openModal } from "@customizer/modal-x";
import AdvanceTable from "../components/AdvanceTable.vue";
import Button from "@/components/common/Button.vue";
import type { TableColumn } from "@/components/common/Table.vue";

const route = useRoute();

function openAddAdvanceModal() {
  openModal("AddAdvanceStandaloneModal", {});
}

function openAddTransporterAdvanceModal() {
  openModal("AddPrePaymentStandaloneModal", {});
}

const tabs = computed(() => route.meta.tabs as any[]);
const activeTab = computed(
  () => (route.query.tab as string) || (tabs.value?.[0]?.value as string),
);

const driverColumns: TableColumn[] = [
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

const transporterColumns: TableColumn[] = [
  { key: "advanceNumber", label: "Advance Number", field: "advanceNumber" },
  {
    key: "transporter",
    label: "Transporter",
    field: "shipment.transporter.name",
  },
  {
    key: "plateNumber",
    label: "Vehicle",
    field: "shipment.vehicle.plateNumber",
  },
  { key: "createdAt", label: "Date", field: "createdAt" },
  { key: "shipment", label: "Shipment", field: "shipment.shipmentCode" },
  { key: "route", label: "Route", field: "shipment.route.routeName" },
  { key: "paidBy", label: "Paid By", field: "paidBy" },
  { key: "total", label: "Amount", field: "amount" },
  { key: "status", label: "Status", field: "status" },
];
</script>
