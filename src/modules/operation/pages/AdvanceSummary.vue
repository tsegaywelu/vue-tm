<template>
  <div class="flex flex-col gap-4">
    <Teleport to="#page-title-actions" defer>
      <button
        class="size-8 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
        @click="handlePrint"
      >
        <i class="*:size-4" v-html="icons.printer" />
      </button>
    </Teleport>

    <AdvanceTable
      url="/transaction/summary"
      pagination-id="advance-summary-list"
      :columns="columns"
      checkable
      v-model="selectedAdvances"
      :hide-on-sm-screen="['plateNumber', 'route', 'perDiemAdvance', 'otherAdvance', 'fuelAdvance', 'remark']"
      :column-span="{ shipment: 3, driver: 2, date: 1, type: 1, total: 2, status: 3 }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import AdvanceTable from "../components/AdvanceTable.vue";
import type { TableColumn } from "@/components/common/Table.vue";
import { printSummary } from "@/utils/print";
import { useAuthStore } from "@/store/authStore";
import { icons } from "@/utils/icons";

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
