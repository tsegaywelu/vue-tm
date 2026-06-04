<template>
  <Teleport
    to="#page-actions"
    defer
    v-if="currentTab === 'shipment' || currentTab === 'settlement'"
  >
    <div class="hidden sm:flex items-center gap-4">
      <DateRangePicker v-model="dateRange" />
      <template v-if="currentTab === 'shipment'">
        <Dropdown>
          <template #trigger>
            <Button variant="secondary" class="gap-2" size="md">
              <i class="mdi mdi-download text-lg"></i>
              Download
            </Button>
          </template>
          <template #default="{ close }">
            <DropDownItem
              label="Raw Material"
              :icon="icons.excel"
              @click="
                handleExport('raw');
                close();
              "
            />
            <DropDownItem
              label="Full Product"
              :icon="icons.excel"
              @click="
                handleExport('full');
                close();
              "
            />
            <DropDownItem
              label="All"
              :icon="icons.excel"
              @click="
                handleExport('all');
                close();
              "
            />
          </template>
        </Dropdown>

        <Button
          :disabled="selectedRows.length === 0"
          @click="handleGenerateInvoice"
          class="gap-2"
          size="md"
        >
          <i class="mdi mdi-file-document-plus text-lg"></i>
          Generate Invoice
        </Button>
      </template>
    </div>
  </Teleport>

  <Teleport defer to="#page-title-actions" v-if="currentTab === 'shipment' || currentTab === 'settlement'">
    <button
      v-if="currentTab === 'shipment'"
      class="sm:hidden size-8 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
      @click="showActionsSheet = true"
    >
      <i v-html="icons.export"></i>
    </button>
    <button
      class="sm:hidden size-8 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
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

  <BottomSheet v-model="showActionsSheet" title="Actions">
    <div class="flex flex-col">
      <template v-if="currentTab === 'shipment'">
        <button
          class="flex items-center gap-3 px-5 py-4 text-base font-medium text-gray-700 hover:bg-gray-50 border-b border-gray-100 text-left w-full"
          @click="() => { handleExport('raw'); showActionsSheet = false; }"
        >
          <i v-html="icons.excell" class="shrink-0 *:size-5"></i>
          Export Raw Material
        </button>
        <button
          class="flex items-center gap-3 px-5 py-4 text-base font-medium text-gray-700 hover:bg-gray-50 border-b border-gray-100 text-left w-full"
          @click="() => { handleExport('full'); showActionsSheet = false; }"
        >
          <i v-html="icons.excell" class="shrink-0 *:size-5"></i>
          Export Full Product
        </button>
        <button
          class="flex items-center gap-3 px-5 py-4 text-base font-medium text-gray-700 hover:bg-gray-50 border-b border-gray-100 text-left w-full"
          @click="() => { handleExport('all'); showActionsSheet = false; }"
        >
          <i v-html="icons.excell" class="shrink-0 *:size-5"></i>
          Export All
        </button>
        <button
          :disabled="selectedRows.length === 0"
          class="flex items-center gap-3 px-5 py-4 text-base font-medium text-left w-full disabled:opacity-40"
          :class="selectedRows.length === 0 ? 'text-gray-400' : 'text-primary hover:bg-primary/5'"
          @click="handleGenerateInvoice"
        >
          <i class="mdi mdi-file-document-plus text-xl shrink-0"></i>
          Generate Invoice
        </button>
      </template>
    </div>
  </BottomSheet>

  <Teleport
    to="#extra-page-data"
    defer
    v-if="currentTab === 'shipment' && tableRef?.summaryItems"
  >
    <div
      v-if="!tableRef?.summaryItems"
      class="flex justify-center items-center py-2"
    >
      <i class="mdi mdi-loading mdi-spin text-xl text-primary"></i>
    </div>
    <div
      v-else
      class="my-2 ml-2 flex flex-row flex-nowrap items-center gap-3 overflow-x-auto scrollbar-none animate-fade-in py-1"
    >
      <div
        v-for="stat in tableRef.summaryItems"
        :key="stat.label"
        class="bg-white border border-gray-100 rounded-2xl px-3 py-2 sm:px-5 sm:py-3 shadow-sm flex flex-row items-center gap-3 sm:min-w-[220px] transition-all hover:shadow-md cursor-pointer"
      >
        <i
          :class="['mdi', stat.icon || 'mdi-cash', 'text-primary text-lg shrink-0']"
        ></i>
        <div class="flex flex-row flex-nowrap items-baseline gap-2 min-w-0">
          <span
            class="text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap"
          >
            {{ stat.fullLabel }}
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

  <div class="flex flex-col h-full">
    <div class="flex-1 min-h-0">
      <ReceivableShipmentTable
        v-if="currentTab === 'shipment'"
        ref="tableRef"
        v-model:selection="selectedRows"
        :date-range="dateRange"
        @action="handleAction"
      />
      <ReceivableSettlementTable
        v-else-if="currentTab === 'settlement'"
        ref="tableRef"
        :date-range="dateRange"
        @action="handleAction"
      />
      <ReceivableLeaseTable
        v-else-if="currentTab === 'lease'"
        ref="tableRef"
        @action="handleAction"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { useToastStore } from "@/store/toastStore";
import { useAuthStore } from "@/store/authStore";
import ReceivableShipmentTable from "../../components/finance/ReceivableShipmentTable.vue";
import ReceivableSettlementTable from "../../components/finance/ReceivableSettlementTable.vue";
import ReceivableLeaseTable from "../../components/finance/ReceivableLeaseTable.vue";

import Button from "@/components/common/Button.vue";
import Dropdown from "@/components/common/Dropdown.vue";
import DropDownItem from "@/components/common/DropDownItem.vue";
import DateRangePicker from "@/components/common/DateRangePicker.vue";
import DatePicker from "@/components/DatePicker.vue";
import BottomSheet from "@/components/BottomSheet.vue";
import { icons } from "@/utils/icons";
import * as XLSX from "xlsx";
import { openModal } from "@customizer/modal-x";
import {
  generate_invoice,
  update_transaction_status,
  update_lease_status,
  collect_lease,
} from "../../api/operation.api";

const route = useRoute();
const router = useRouter();
const toast = useToastStore();
const authStore = useAuthStore();
const queryClient = useQueryClient();
const tableRef = ref<any>(null);
const selectedRows = ref<any[]>([]);
const showFilterSheet = ref(false);
const showActionsSheet = ref(false);

// Date Filter
const dateRange = ref({
  start: "",
  end: "",
});

const currentTab = computed(() => (route.query.tab as string) || "shipment");

watch(currentTab, () => {
  selectedRows.value = [];
});

// Mutations
const generateInvoiceMutation = useMutation({
  mutationFn: ({ formData }: any) => generate_invoice(formData),
});

const updateStatusMutation = useMutation({
  mutationFn: ({
    id,
    status,
    type,
  }: {
    id: string;
    status: any;
    type: string;
  }) => {
    if (type === "lease") {
      if (status === "authorize") return update_lease_status(id, status);
      if (status === "pay") return collect_lease(id);
    }
    return update_transaction_status(id, status);
  },
  onSuccess: () => {
    toast.success("Status updated successfully");
    tableRef.value?.refetch();
  },
  onError: (error: any) => {
    toast.error(error.response?.data?.message || "Failed to update status");
  },
});

const handleGenerateInvoice = async () => {
  if (selectedRows.value.length === 0) return;

  const confirmed = await openModal("ConfirmationModal", {
    title: "Generate Invoice",
    message: `Are you sure you want to generate an invoice for ${selectedRows.value.length} shipments?`,
    type: "primary",
  });

  if (confirmed) {
    const totalAmount = selectedRows.value.reduce(
      (sum, row) => sum + (row.totalPrice || 0),
      0,
    );
    const userId =
      authStore.current_user?._id || authStore.current_user?.user?._id;

    if (!userId) {
      toast.error("User session not found. Please log in again.");
      return;
    }

    const res = await generateInvoiceMutation.mutateAsync({
      formData: {
        shipmentIds: selectedRows.value.map((row) => row._id),
        paymentRequestedBy: userId,
        totalAmount,
      },
    });

    if (res.success) {
      toast.success("Invoice generated successfully! Waiting for Approval...");
      selectedRows.value = [];
      sessionStorage.removeItem("/shipment/receivableShipment");
      queryClient.invalidateQueries({ queryKey: ["invoice-report-list"] });
      router.push("/finance/invoice-report");
    } else {
      toast.error(res.error || "Failed to generate invoice");
    }
  }
};

const handleAction = async ({ row, action }: any) => {
  const id = row._id || row.id;

  if (action === "view") {
    if (currentTab.value === "shipment") {
      router.push(`/finance/receivable/${id}`);
    } else if (currentTab.value === "settlement") {
      router.push(`/operation/advance-details/${id}`);
    } else if (currentTab.value === "lease") {
      const vehicleId = row.vehicle?._id || row.vehicle?.id;
      if (vehicleId) {
        router.push(`/vehicles/${vehicleId}`);
      }
    }
  } else if (["pay", "authorize", "cancel"].includes(action)) {
    const actionLabels: Record<string, string> = {
      pay: "Collect",
      authorize: "Authorize",
      cancel: "Cancel",
    };

    const confirmed = await openModal("ConfirmationModal", {
      title: `${actionLabels[action]} Confirmation`,
      message: `Are you sure you want to ${actionLabels[action].toLowerCase()} this item?`,
      type: action === "cancel" ? "danger" : "primary",
    });

    if (confirmed) {
      updateStatusMutation.mutate({
        id,
        status: action,
        type: currentTab.value === "lease" ? "lease" : "transaction",
      });
    }
  }
};

const handleExport = (type: "raw" | "full" | "all") => {
  const data = selectedRows.value.length > 0 ? selectedRows.value : (tableRef.value?.response || []);
  if (data.length === 0) {
    toast.warning("No data to export");
    return;
  }

  let filteredData = data;
  if (type === "raw") {
    filteredData = data.filter(
      (s: any) =>
        s.productType === "IN_BOUND" || s.productType === "SITE_TRANSFER",
    );
  } else if (type === "full") {
    filteredData = data.filter((s: any) => s.productType === "OUT_BOUND");
  }

  if (filteredData.length === 0) {
    toast.warning(
      type === "raw" ? "No Raw Material data found to export"
      : type === "full" ? "No Full Product data found to export"
      : "No data found to export",
    );
    return;
  }

  const columns = [
    "Date of Request",
    "Supplier Name",
    "Origin",
    "Destination",
    "Plate Number",
    "Driver Name",
    "Issue Voucher",
    "Receive Voucher",
    "Document Uploaded",
    "Product Type",
  ];

  const formattedData = filteredData.map((s: any) => ({
    "Date of Request": s.dispatchDate?.split("T")[0] || "N/A",
    "Supplier Name": s.order?.agent?.name || s.agent?.name || "N/A",
    Origin: s.route?.origin || "N/A",
    Destination: s.route?.destination || "N/A",
    "Plate Number": `${s.vehicle?.plateNumber || "N/A"}/${s.vehicle?.trailerPlate || "N/A"}`,
    "Driver Name": `${s.driver?.firstName || ""} ${s.driver?.lastName || ""}`.trim() || "N/A",
    "Issue Voucher": s.shipperIssueVoucher || "N/A",
    "Receive Voucher": s.agentReceiveVoucher || "N/A",
    "Document Uploaded": s.areDocumentsUploaded ? "Yes" : "No",
    "Product Type": s.productType || "N/A",
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  worksheet["!cols"] = columns.map((h) => ({ wch: Math.max(h.length + 4, 20) }));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Receivables");
  XLSX.writeFile(
    workbook,
    `Receivable_${type === "raw" ? "Raw_Material" : type === "full" ? "Full_Product" : "All"}_${new Date().toISOString().split("T")[0]}.xlsx`,
  );
};
</script>
