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
      url="/transaction/summary"
      pagination-id="advance-summary-list"
      :columns="columns"
      checkable
      v-model="selectedAdvances"
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
const selectedAdvances = ref([]);

const handlePrint = () => {
  if (selectedAdvances.value.length === 0) {
    alert("Please select at least one advance to print.");
    return;
  }
  const firstItem = selectedAdvances.value[0];
  printSummary(
    "Drivers Advance Payment Summary",
    columns,
    selectedAdvances.value,
    authStore.current_user?.user?.carrier?.name,
    {
      approvedBy: firstItem?.transactionApprovedBy,
      authorizedBy: firstItem?.transactionAuthorizedBy,
    },
  );
};

const columns: TableColumn[] = [
  { key: "shipment", label: "Shipment Code", field: "shipmentCode" },
  { key: "driver", label: "Driver", field: "driver" },
  { key: "plateNumber", label: "Plate Number", field: "plateNumber" },
  { key: "date", label: "Date", field: "date" },
  { key: "route", label: "Route", field: "route" },
  { key: "type", label: "Type", field: "type" },
  { key: "perDiemAdvance", label: "PERDIEM (ETB)", field: "PERDIEM" },
  { key: "otherAdvance", label: "OTHER (ETB)", field: "OTHER" },
  { key: "fuelAdvance", label: "FUEL (ETB)", field: "FUEL" },
  { key: "total", label: "TOTAL (ETB)", field: "TOTAL" },
  { key: "status", label: "Status", field: "status" },
  { key: "remark", label: "Remark", field: "remark" },
];
</script>
