<template>
  <Teleport to="#page-actions" defer>
    <div class="flex items-center gap-4">
      <DateRangePicker
        v-model="dateRange"
        pagination-id="paid-sub-contracts-list"
        start-key="startDate"
        end-key="endDate"
      />
      <Button variant="secondary" @click="handleExport">
        <template #leading>
          <i class="mdi mdi-file-excel text-lg text-green-600"></i>
        </template>
        Export Excel
      </Button>
    </div>
  </Teleport>

  <Teleport to="#extra-page-data" defer>
    <div v-if="!tableRef?.fullResponse" class="flex justify-center items-center py-2">
      <i class="mdi mdi-loading mdi-spin text-xl text-primary"></i>
    </div>
    <div v-else class="my-2 ml-2 flex flex-wrap items-center gap-3 overflow-x-auto scrollbar-none animate-fade-in py-1">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="bg-white border border-gray-100 rounded-2xl px-5 py-3 shadow-sm flex flex-col gap-1 min-w-[240px] transition-all hover:shadow-md cursor-pointer"
      >
        <div class="flex items-center gap-2">
          <i :class="['mdi', stat.icon || 'mdi-cash', 'text-primary text-lg']"></i>
          <span class="text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
            {{ stat.label }}
          </span>
        </div>
        <div class="mt-1">
          <span :class="['text-xl font-black tracking-tight', stat.colorClass || 'text-gray-900']">
            {{ stat.value }}
          </span>
        </div>
      </div>
    </div>
  </Teleport>

  <PaidSubContractsTable
    ref="tableRef"
    :date-range="dateRange"
    @action="handleAction"
  />
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import PaidSubContractsTable from "../../components/finance/PaidSubContractsTable.vue";
import DateRangePicker from "@/components/common/DateRangePicker.vue";
import Button from "@/components/Button.vue";
import { currencyFormatter, dateFormatter } from "@/utils/utils";
import { useToastStore } from "@/store/toastStore";
import * as XLSX from "xlsx";

const router = useRouter();
const toast = useToastStore();
const tableRef = ref<any>(null);

const dateRange = ref({ start: "", end: "" });

const handleExport = () => {
  const rows = tableRef.value?.response || [];
  if (rows.length === 0) {
    toast.error("No data to export");
    return;
  }

  const headers = [
    "Shipment Code",
    "Transporter",
    "Dispatch Date",
    "Plate Number",
    "Driver",
    "Route",
    "Total Price",
    "Transporter Price",
    "Advance",
    "Gross Profit",
  ];

  const formattedData = rows.map((row: any) => ({
    "Shipment Code": row.shipmentCode || "N/A",
    Transporter: row.transporter?.name || "N/A",
    "Dispatch Date": dateFormatter(row.dispatchDate),
    "Plate Number": row.vehicle?.plateNumber || "N/A",
    Driver:
      `${row.driver?.firstName || ""} ${row.driver?.lastName || ""}`.trim() ||
      "N/A",
    Route: row.route?.routeName || "N/A",
    "Total Price": row.totalPrice || 0,
    "Transporter Price": row.transporterPrice || 0,
    Advance: row.advanceAmount ?? row.prePayments ?? 0,
    "Gross Profit": row.grossProfit || 0,
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  worksheet["!cols"] = headers.map((h) => ({ wch: Math.max(h.length, 15) }));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Paid Sub-Contracts");
  XLSX.writeFile(
    workbook,
    `PaidSubContracts_${new Date().toISOString().split("T")[0]}.xlsx`,
  );
};

const stats = computed(() => {
  const summary = tableRef.value?.fullResponse?.result?.summary || {};
  
  const totalShipmentsPrice = summary.totalShipmentsPrice || 0;
  const totalTransportersPrice = (summary.totalTransportersPrice || 0) + (summary.totalPrePaymentsAmount || 0);
  const grossProfit = totalShipmentsPrice - totalTransportersPrice;
  const profitMargin = totalShipmentsPrice > 0 ? (grossProfit / totalShipmentsPrice) * 100 : 0;

  return [
    {
      label: "Total Shipment Price",
      value: currencyFormatter(totalShipmentsPrice),
      icon: "mdi-currency-usd"
    },
    {
      label: "Total Transporter Price",
      value: currencyFormatter(totalTransportersPrice),
      icon: "mdi-truck-delivery-outline"
    },
    {
      label: "Gross Profit",
      value: currencyFormatter(grossProfit),
      icon: "mdi-trending-up",
      colorClass: grossProfit >= 0 ? "text-green-600" : "text-red-600"
    },
    {
      label: "Profit Margin %",
      value: `${profitMargin.toFixed(2)}%`,
      icon: "mdi-percent-outline",
      colorClass: profitMargin >= 0 ? "text-primary" : "text-red-600"
    },
  ];
});

const handleAction = ({ row, action }: any) => {
  const id = row._id || row.id;
  if (action === 'view') {
    router.push(`/operation/shipments/${id}`);
  }
};
</script>
