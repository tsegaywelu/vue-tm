<template>
  <Teleport to="#page-actions" defer>
    <div class="hidden sm:flex items-center gap-4">
      <DateRangePicker
        v-model="dateRange"
        pagination-id="payable-list"
        start-key="startDate"
        end-key="endDate"
      />

      <Button
        variant="secondary"
        :title="selectedPayables.length === 0 ? 'Select at least one payable to print' : 'Print selected payables'"
        @click="handlePrint"
      >
        <template #leading>
          <i class="mdi mdi-printer"></i>
        </template>
        Print Selected
        <span v-if="selectedPayables.length > 0" class="ml-2 text-xs font-semibold">({{ selectedPayables.length }})</span>
      </Button>

      <Button variant="secondary" @click="handleExport">
        <template #leading>
          <i v-html="icons.excell"></i>
        </template>
        Export Excel
      </Button>
    </div>
  </Teleport>

  <Teleport defer to="#page-title-actions">
     <button
      class="sm:hidden size-8 rounded-xl flex items-center justify-center text-faint-text hover:bg-surface-hover transition-colors"
      @click="handleExport"
    >
      <i v-html="icons.excell"></i>
    </button>
    <button
      class="sm:hidden size-8 rounded-xl flex items-center justify-center text-faint-text hover:bg-surface-hover transition-colors"
      @click="handlePrint"
      :title="selectedPayables.length === 0 ? 'Select at least one payable to print' : 'Print selected payables'"
    >
      <i v-html='icons.printer'></i>
    </button>
    <button
      class="sm:hidden size-8 rounded-xl flex items-center justify-center text-faint-text hover:bg-surface-hover transition-colors"
      @click="showFilterSheet = true"
    >
      <i v-html="icons.calender"></i>
    </button>
  </Teleport>

  <BottomSheet v-model="showFilterSheet" title="Date Range">
    <DatePicker
      is-range
      :value="dateRange"
      @select="(val) => { if (val?.start) { dateRange.start = val.start; dateRange.end = val.end || ''; if (val.end) showFilterSheet = false; } }"
    />
  </BottomSheet>
  <Teleport to="#extra-page-data" defer>
    <div v-if="isLoadingStats" class="flex justify-center items-center py-2">
      <i class="mdi mdi-loading mdi-spin text-xl text-primary"></i>
    </div>
    <div
      v-else
      class="my-2 ml-2 flex flex-row flex-nowrap items-center gap-3 overflow-x-auto scrollbar-none animate-fade-in py-1"
    >
      <div
        v-for="stat in payableStats"
        :key="stat.label"
        class="bg-surface border border-gray-100 rounded-2xl px-3 py-2 sm:px-5 sm:py-3 shadow-sm flex flex-row items-center gap-3 sm:min-w-[220px] transition-all hover:shadow-md cursor-pointer"
      >
        <i
          :class="['mdi', stat.icon || 'mdi-cash', 'text-primary text-lg shrink-0']"
        ></i>
        <div class="flex flex-row flex-nowrap items-baseline gap-2 min-w-0">
          <span
            class="text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap"
          >
            {{ stat.label }}
          </span>
          <span
            v-if="authStore.has_permission('REPORT', ['view'])"
            class="text-base sm:text-xl font-black text-gray-900 tracking-tight whitespace-nowrap"
          >
            {{ stat.value }}
          </span>
        </div>
      </div>
    </div>
  </Teleport>

  <PayableTable
    ref="tableRef"
    :filters="{ startDate: dateRange.start, endDate: dateRange.end }"
    @action="handlePayableAction"
    @selection-change="selectedPayables = $event"
  />
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useQuery, useMutation } from "@tanstack/vue-query";
import PayableTable from "../../components/finance/PayableTable.vue";
import { formatType, getPaidTo } from "../../components/finance/payableUtils";
import { printPayables } from "../../utils/printPayable";
import StatsCards from "@/components/common/StatsCards.vue";
import {
  fetch_advance_status_count,
  update_advance_status,
  update_transaction_status,
  update_prepayment_status,
  update_lease_status,
} from "../../api/operation.api";
import { update_purchase_order_payment_status } from "../../api/inventory.api";
import {
  set_payable_shipment_paid,
  set_payable_shipment_authorized,
  set_payable_shipment_cancelled,
} from "../../api/shipment.api";
import { useToastStore } from "@/store/toastStore";
import { useAuthStore } from "@/store/authStore";
import Button from "@/components/Button.vue";
import DateRangePicker from "@/components/common/DateRangePicker.vue";
import DatePicker from "@/components/DatePicker.vue";
import BottomSheet from "@/components/BottomSheet.vue";
import * as XLSX from "xlsx";
import { currencyFormatter, dateFormatter } from "@/utils/utils";
import { icons } from "@/utils/icons";

const router = useRouter();
const toast = useToastStore();
const authStore = useAuthStore();
const tableRef = ref();
const showFilterSheet = ref(false);
const selectedPayables = ref<any[]>([]);

const dateRange = ref({
  start: "",
  end: "",
});

watch(dateRange, () => {
  // Clear selections when date range changes
  selectedPayables.value = [];
}, { deep: true });

const handlePrint = () => {
  console.log("Print button clicked, selected payables:", selectedPayables.value.length);

  if (selectedPayables.value.length === 0) {
    toast.error("Please select at least one payable to print. Use the checkboxes to select rows.");
    return;
  }

  try {
    console.log("Calling printPayables with", selectedPayables.value.length, "items");
    printPayables(selectedPayables.value, authStore.current_user, {
      groupByType: true,
    });
    console.log("printPayables called successfully");
    toast.success(`Printing ${selectedPayables.value.length} payable(s)...`);
  } catch (error) {
    console.error("Print error:", error);
    toast.error("Error opening print dialog. Please try again.");
  }
};

const handleExport = () => {
  const rows = tableRef.value?.response || [];
  if (rows.length === 0) {
    toast.error("No data to export");
    return;
  }

  const headers = [
    "Date of Request",
    "Advance Number",
    "Plate Number",
    "Driver Name",
    "Route",
    "Origin",
    "Destination",
    "Shipment Code",
    "Payable Type",
    "Status",
    "Fuel Advances",
    "Per Diem Expenses",
    "Other Expenses",
    "Total",
    "Total Revenues",
    "Transporter",
  ];

  const formattedData = rows.map((row: any) => ({
    "Date of Request": dateFormatter(row.createdAt),
    "Advance Number": row.advanceNumber || "N/A",
    "Plate Number": row.plateNumber || "N/A",
    "Driver Name":
      `${row.driver?.firstName || ""} ${row.driver?.middleName || ""} ${row.driver?.lastName || ""}`.trim() ||
      "N/A",
    Route: row.route?.name || "N/A",
    Origin: row.route?.origin || "N/A",
    Destination: row.route?.destination || "N/A",
    "Shipment Code": row.shipmentCode || "N/A",
    "Payable Type": formatType(row.payableType),
    Status: row.status || "N/A",
    "Fuel Advances": row.totalFuelAdvances || 0,
    "Per Diem Expenses": row.totalPerDiemExpenses || 0,
    "Other Expenses": row.totalOtherExpenses || 0,
    Total: row.total || 0,
    "Total Revenues": row.totalRevenues || 0,
    Transporter: row.transporter?.name || row.transporter || "N/A",
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  worksheet["!cols"] = headers.map((h) => ({ wch: Math.max(h.length, 15) }));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Advances");
  XLSX.writeFile(workbook, `Advances_${new Date().toISOString().split("T")[0]}.xlsx`);
};

const {
  data: statsResponse,
  isLoading: isLoadingStats,
  refetch: refetchStats,
} = useQuery({
  queryKey: ["payableStatusCount", dateRange],
  queryFn: () =>
    fetch_advance_status_count({
      startDate: dateRange.value.start,
      endDate: dateRange.value.end,
    }),
});

const payableStats = computed(() => {
  const tableData = (tableRef.value?.fullResponse || {}) as any;
  const statsData = (statsResponse.value?.data || {}) as any;

  const total = tableData.totalSum ?? statsData.total ?? 0;
  const authorized = statsData.authorized ?? 0;
  const pending = statsData.pending ?? 0;

  return [
    {
      label: "Total Payable",
      value: currencyFormatter(total),
      icon: "mdi-cash-multiple",
    },
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
      case "shipments":
        if (action === "pay") return set_payable_shipment_paid(id);
        if (action === "authorize") return set_payable_shipment_authorized(id);
        if (action === "cancel") return set_payable_shipment_cancelled(id);
        break;
      default:
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

const handlePayableAction = ({ row, action }: { row: any; action: string }) => {
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
      router.push(
        `/inventory/purchase-order/${row.purchaseOrderId || row.purchaseOrder?._id || id}`,
      );
    } else {
      // Default fallback
      router.push(`/operation/advance-details/${id}`);
    }
  } else if (
    ["pay", "authorize", "cancel", "approve", "reject"].includes(action)
  ) {
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
