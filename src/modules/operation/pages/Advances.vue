<template>
  <div class="flex flex-col gap-4">
    <!-- Mobile: summary icon button next to title -->
    <Teleport to="#page-title-actions" defer>
      <button
        v-if="activeTab === 'driverAdvances'"
        class="sm:hidden size-8 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
        @click="$router.push('/operation/advance-summary')"
      >
        <i class="*:size-4" v-html="icons.file"></i>
      </button>
      <button
        v-else-if="activeTab === 'transporterAdvances'"
        class="sm:hidden size-8 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
        @click="$router.push('/operation/prepayment-summary')"
      >
        <i class="*:size-4" v-html="icons.file"></i>
      </button>
    </Teleport>

    <!-- Mobile FAB -->
    <button
      v-if="activeTab === 'driverAdvances'"
      v-permission="'ADVANCE_PAYMENT:create'"
      @click="openAddAdvanceModal"
      class="sm:hidden fixed bottom-6 right-6 z-40 size-14 rounded-full bg-primary text-white shadow-xl flex items-center justify-center"
    >
      <div class="size-6" v-html="icons.plus"></div>
    </button>
    <button
      v-else-if="activeTab === 'transporterAdvances'"
      v-permission="{ subject: 'PRE_PAYMENT', actions: ['create'] }"
      @click="openAddTransporterAdvanceModal"
      class="sm:hidden fixed bottom-6 right-6 z-40 size-14 rounded-full bg-primary text-white shadow-xl flex items-center justify-center"
    >
      <div class="size-6" v-html="icons.plus"></div>
    </button>

    <Teleport to="#page-actions" defer>
      <div class="hidden sm:flex items-center gap-3">
        <Button
          v-if="activeTab === 'driverAdvances'"
          v-permission="'ADVANCE_PAYMENT:create'"
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
      :column-span="{ advanceNumber: 2, driver: 2, shipment: 2, route: 2, fuelAdvance: 2, perDiemAdvance: 2, otherAdvance: 2, total: 2, status: 2 }"
    />
    <AdvanceTable
      v-if="activeTab === 'transporterAdvances'"
      url="/pre-payment"
      pagination-id="transporter-advance-list"
      :columns="transporterColumns"
      :checkable="false"
      :column-span="{ advanceNumber: 2, transporter: 2, shipment: 2, route: 2, total: 2, status: 2 }"
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
import { icons } from "@/utils/icons";

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
