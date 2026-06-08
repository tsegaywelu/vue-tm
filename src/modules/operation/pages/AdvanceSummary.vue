<template>
  <div class="flex flex-col gap-4">
    <Teleport to="#page-actions" defer>
      <div class="flex items-center gap-2">
        <span
          v-if="selectedAdvances.length > 0"
          class="inline-flex items-center justify-center rounded-full bg-primary text-white text-xs font-bold px-2 py-0.5 min-w-6"
        >
          {{ selectedAdvances.length }}
        </span>
        <Button size="md" variant="outline" @click="handlePrint">
          <i class="mdi mdi-printer" />
          <span class="hidden sm:inline ml-2">Print</span>
        </Button>
      </div>
    </Teleport>

    <Teleport to="#extra-page-data" defer>
      <StatsCards
        :stats="[
          { label: 'Selected', value: String(selectedAdvances.length) },
          { label: 'Selected Total (ETB)', value: currencyFormatter(selectedTotal) },
        ]"
      />
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
import { ref, computed } from "vue";
import AdvanceTable from "../components/AdvanceTable.vue";
import Button from "@/components/common/Button.vue";
import StatsCards from "@/components/common/StatsCards.vue";
import type { TableColumn } from "@/components/common/Table.vue";
import { printSummary } from "@/utils/print";
import { useAuthStore } from "@/store/authStore";
import { useToastStore } from "@/store/toastStore";
import { currencyFormatter } from "@/utils/utils";

const authStore = useAuthStore();
const toast = useToastStore();
const selectedAdvances = ref<any[]>([]);

const selectedTotal = computed(() =>
  selectedAdvances.value.reduce((sum, item) => sum + (Number(item.TOTAL || item.amount) || 0), 0),
);

const handlePrint = () => {
  if (selectedAdvances.value.length === 0) {
    toast.error("Please select at least one advance to print.");
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
