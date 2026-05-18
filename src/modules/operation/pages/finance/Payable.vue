<template>
  <Teleport to="#page-actions" defer>
    <div class="flex items-center gap-4">
      <Dropdown
        contentParent="shadow-none! ring-0! ring-offset-0! p-0! bg-tras border-none! bg-none!"
      >
        <template #trigger>
          <Button
            variant="secondary"
            class="rounded-2xl h-[46px] px-4 gap-2 border border-gray-100"
          >
            <i class="mdi mdi-calendar-range text-lg text-primary"></i>
            <span class="text-sm font-bold text-gray-700">
              {{ dateRange.start || 'Start' }} - to - {{ dateRange.end || "End" }}
            </span>
          </Button>
        </template>
        <template #default>
          <DatePicker
            is-range
            :value="dateRange"
            @select="handleDateSelect"
          />
        </template>
      </Dropdown>

      <Button variant="secondary" @click="handleExport">
        <template #leading>
          <i class="mdi mdi-file-excel text-lg text-green-600"></i>
        </template>
        Export Excel
      </Button>
    </div>
  </Teleport>
  <Teleport to="#extra-page-data" defer>
    <div v-if="isLoadingStats" class="flex justify-center items-center py-2">
      <i class="mdi mdi-loading mdi-spin text-xl text-primary"></i>
    </div>
    <div v-else class="my-2 ml-2 flex flex-wrap items-center gap-3 overflow-x-auto scrollbar-none animate-fade-in py-1">
      <div
        v-for="stat in payableStats"
        :key="stat.label"
        class="bg-white border border-gray-100 rounded-2xl px-5 py-3 shadow-sm flex flex-col gap-1 min-w-[220px] transition-all hover:shadow-md cursor-pointer"
      >
        <div class="flex items-center gap-2">
          <i :class="['mdi', stat.icon || 'mdi-cash', 'text-primary text-lg']"></i>
          <span class="text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
            {{ stat.label }}
          </span>
        </div>
        <div class="mt-1">
          <span v-if="authStore.has_permission('REPORT', ['view'])" class="text-xl font-black text-gray-900 tracking-tight">
            {{ stat.value }}
          </span>
          <span v-else class="text-xl font-black text-gray-300 tracking-widest">
            ••••••
          </span>
        </div>
      </div>
    </div>
  </Teleport>

  <PayableTable ref="tableRef" :filters="{ startDate: dateRange.start, endDate: dateRange.end }" @action="handlePayableAction" />
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useQuery, useMutation } from "@tanstack/vue-query";
import PayableTable from "../../components/finance/PayableTable.vue";
import { formatType, getPaidTo } from "../../components/finance/payableUtils";
import StatsCards from "@/components/common/StatsCards.vue";
import { 
  fetch_advance_status_count, 
  update_advance_status,
  update_transaction_status,
  update_prepayment_status,
  update_lease_status
} from "../../api/operation.api";
import { 
  update_purchase_order_payment_status 
} from "../../api/inventory.api";
import { useToastStore } from "@/store/toastStore";
import { useAuthStore } from "@/store/authStore";
import Button from "@/components/Button.vue";
import DatePicker from "@/components/DatePicker.vue";
import Dropdown from "@/components/common/Dropdown.vue";
import * as XLSX from "xlsx";
import { currencyFormatter, dateFormatter } from "@/utils/utils";
import { icons } from "@/utils/icons";

const router = useRouter();
const toast = useToastStore();
const authStore = useAuthStore();
const tableRef = ref();

const dateRange = ref({
  start: new Date(new Date().setDate(new Date().getDate() - 30))
    .toISOString()
    .split("T")[0],
  end: new Date().toISOString().split("T")[0],
});

const handleDateSelect = (val: any) => {
  if (typeof val === "object" && val.start) {
    dateRange.value = val;
  }
};

const handleExport = () => {
  const rows = tableRef.value?.response || [];
  if (rows.length === 0) {
    toast.error("No data to export");
    return;
  }

  const formattedData = rows.map((row: any) => ({
    "Date of Request": dateFormatter(row.createdAt),
    "Code": row.advanceNumber || "N/A",
    "Paid To": getPaidTo(row),
    "Type": formatType(row.payableType),
    "Status": row.status || "N/A",
    "Fuel": row.totalFuelAdvances || 0,
    "Per Diem": row.totalPerDiemExpenses || 0,
    "Other": row.totalOtherExpenses || 0,
    "Total": row.total || 0,
    "Shipment": row.shipmentCode || "N/A",
    "Plate Number": row.plateNumber || "N/A",
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Payables");
  XLSX.writeFile(workbook, `Payables_${new Date().toISOString().split('T')[0]}.xlsx`);
};

const { data: statsResponse, isLoading: isLoadingStats, refetch: refetchStats } = useQuery({
  queryKey: ["payableStatusCount", dateRange],
  queryFn: () => fetch_advance_status_count({ startDate: dateRange.value.start, endDate: dateRange.value.end }),
});

const payableStats = computed(() => {
  const tableData = (tableRef.value?.fullResponse || {}) as any;
  const statsData = (statsResponse.value?.data || {}) as any;
  
  const total = tableData.totalSum ?? statsData.total ?? 0;
  const authorized = statsData.authorized ?? 0;
  const pending = statsData.pending ?? 0;
  
  return [
    { label: "Total Payable", value: currencyFormatter(total), icon: "mdi-cash-multiple" },
  
  ];
});

const mutation = useMutation({
  mutationFn: async ({ id, type, action, data }: any) => {
    switch (type) {
      case "advancePayment":
        return update_advance_status(id, action, data);
      case "transactions":
        return update_transaction_status(id, action, data);
      case "prePayments":
        return update_prepayment_status(id, action);
      case "vehicleLeaseAgreement":
        return update_lease_status(id, action);
      case "purchaseOrder":
        return update_purchase_order_payment_status(id, action);
      default:
        // For shipments or unknown types, try advance status update as fallback or add specific logic
        return update_advance_status(id, action, data);
    }
  },
  onSuccess: () => {
    toast.success("Action performed successfully");
    tableRef.value?.refetch();
    refetchStats();
  },
  onError: (error: any) => {
    toast.error(error.response?.data?.description || "An error occurred");
  },
});

const handlePayableAction = ({
  row,
  action,
}: {
  row: any;
  action: string;
}) => {
  if (action === "view") {
    const type = row.payableType;
    const id = row._id || row.id;

    if (type === "shipment" || type === "shipments") {
      router.push(`/operation/shipments/${row.shipmentId || id}`);
    } else if (type === "advance" || type === "advancePayment") {
      router.push(`/operation/advance-details/${id}`);
    } else if (type === "transaction" || type === "transactions") {
      // For transactions, we can either go to the driver or the advance details
      // Based on user request "if driver advance then go to the driver detail /drivers/..."
      if (row.driver?._id) {
        router.push(`/drivers/${row.driver._id}`);
      } else {
        router.push(`/operation/advance-details/${row.advancePaymentId || id}`);
      }
    } else if (type === "purchaseOrders" || type === "purchaseOrder") {
      router.push(`/inventory/purchase-order/${row.purchaseOrderId || row.purchaseOrder?._id || id}`);
    } else {
      // Default fallback
      router.push(`/operation/advance-details/${id}`);
    }
  } else if (["pay", "authorize", "cancel", "approve", "reject"].includes(action)) {
    const id = row._id || row.id;
    const type = row.payableType;
    
    // Map action if needed (e.g. pay -> paid)
    let apiAction = action;
    if (action === "pay") apiAction = "pay"; // Some APIs might expect 'paid'
    if (action === "authorize") apiAction = "authorize";
    
    mutation.mutate({ id, type, action: apiAction });
  } else {
    console.log(`Action: ${action} on Payable:`, row);
  }
};
</script>
