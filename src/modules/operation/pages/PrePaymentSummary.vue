<template>
  <div class="flex flex-col gap-4">
    <Teleport to="#page-actions" defer>
      <div class="flex items-center gap-3">
        <Button size="md" variant="outline" @click="handlePrint">
          <i class="mdi mdi-printer mr-2" />
          Print
        </Button>
      </div>
    </Teleport>

    <AdvanceTable
      url="/pre-payment"
      pagination-id="prepayment-summary-list"
      :columns="columns"
      checkable
      v-model="selectedPrePayments"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import AdvanceTable from "../components/AdvanceTable.vue";
import Button from "@/components/common/Button.vue";
import type { TableColumn } from "@/components/common/Table.vue";
import { printSummary } from "@/utils/print";
import { useAuthStore } from "@/store/authStore";

const authStore = useAuthStore();
const selectedPrePayments = ref([]);

const handlePrint = () => {
  if (selectedPrePayments.value.length === 0) {
    alert("Please select at least one pre-payment to print.");
    return;
  }
  printSummary(
    "Transporter Advance Payment Summary",
    columns,
    selectedPrePayments.value,
    authStore.current_user?.user?.carrier?.name,
    {
      approvedBy: "____________________",
      authorizedBy: "____________________",
    },
  );
};

const columns: TableColumn[] = [
  { key: "shipment", label: "Shipment Code", field: "shipment.shipmentCode" },
  {
    key: "transporter",
    label: "Transporter Name",
    field: "shipment.transporter.name",
  },
  { key: "createdAt", label: "Date", field: "createdAt" },
  { key: "route", label: "Route", field: "shipment.route.routeName" },
  { key: "type", label: "Type", field: "vehicle.plateNumber" },
  { key: "bankAccount", label: "Bank Account", field: "depositedBankAccount" },
  { key: "amount", label: "Amount", field: "amount" },
  { key: "status", label: "Status", field: "status" },
  { key: "remark", label: "Remark", field: "remark" },
];
</script>
