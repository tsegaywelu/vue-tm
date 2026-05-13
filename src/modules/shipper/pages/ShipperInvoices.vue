<template>
  <Teleport to="#extra-page-data" defer>
    <StatsCards :stats="summaryCards" :loading="sumLoad" />
  </Teleport>

  <Teleport to="#page-actions" defer>
    <div class="flex items-center gap-4">
      <Dropdown
        contentParent="shadow-none! ring-0! ring-offset-0! p-0! bg-tras border-none! bg-none!"
      >
        <template #trigger>
          <div class="flex flex-row items-center gap-4">
            <span class="text-sm underline font-semibold pl-1">Date Range</span>
            <Button
              variant="secondary"
              class="rounded-2xl h-[46px] px-4 gap-2 border border-gray-100"
            >
              <i class="mdi mdi-calendar-range text-lg text-primary"></i>
              <span class="text-sm font-bold text-gray-700">
                {{ dateRange.start || "---" }} - to -
                {{ dateRange.end || "---" }}
              </span>
            </Button>
          </div>
        </template>
        <template #default>
          <DatePicker
            is-range
            calendar-type="english"
            :value="dateRange"
            @select="handleDateSelect"
          />
        </template>
      </Dropdown>
    </div>
  </Teleport>

  <div class="flex flex-col gap-6">
    <!-- Invoices Table -->
    <Table
      alignment="left"
      :columns="columns"
      :rows="response"
      @row-click="(row) => navigateToDetails(row._id)"
    >
      <template #cell-reference="{ row }">
        <span class="font-bold text-grey-900">{{ row.reference }}</span>
      </template>
      <template #cell-totalAmount="{ row }">
        <span>{{ currencyFormatter(row.totalAmount) }}</span>
      </template>
      <template #cell-paymentApprovedDate="{ row }">
        <span class="text-grey-600">{{
          row.paymentApprovedDate?.split("T")[0] || "-"
        }}</span>
      </template>
      <template #cell-paymentCollectedBy="{ row }">
        <span class="text-grey-600">{{
          row.paymentCollectedByShipper?.username || "-"
        }}</span>
      </template>
      <template #cell-shipperPaymentStatus="{ row }">
        <Status :variant="row.shipperPaymentStatus" type="wrapped">
          {{ formatType(row.shipperPaymentStatus) }}
        </Status>
      </template>
      <template #cell-actions="{ row }">
        <div class="flex items-center gap-2" @click.stop>
          <Dropdown>
            <template #default="{ close }">
              <DropDownItem
                label="Download Invoice"
                @click="
                  () => {
                    handleDownload(row._id);
                    close();
                  }
                "
              >
                <template #icon>
                  <i class="mdi mdi-download text-primary"></i>
                </template>
              </DropDownItem>
              <template v-if="row.shipperPaymentStatus === 'pending'">
                <DropDownItem
                  label="Pay"
                  @click="
                    () => {
                      openPayModal(row);
                      close();
                    }
                  "
                >
                  <template #icon>
                    <i class="mdi mdi-cash-check text-emerald-600"></i>
                  </template>
                </DropDownItem>
                <DropDownItem
                  label="Reject"
                  @click="
                    () => {
                      handleReject(row);
                      close();
                    }
                  "
                >
                  <template #icon>
                    <i class="mdi mdi-close-circle text-red-600"></i>
                  </template>
                </DropDownItem>
              </template>
            </template>
          </Dropdown>
        </div>
      </template>
    </Table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/authStore";
import { usePagination } from "@/composables/usePagination";
import { useQuery, useMutation } from "@tanstack/vue-query";
import Table, { type TableColumn } from "@/components/common/Table.vue";
import Status from "@/components/common/Status.vue";
import Dropdown from "@/components/common/Dropdown.vue";
import DropDownItem from "@/components/common/DropDownItem.vue";
import Button from "@/components/common/Button.vue";
import DatePicker from "@/components/DatePicker.vue";
import { useToastStore } from "@/store/toastStore";
import { openModal } from "@customizer/modal-x";
import {
  fetch_shipper_invoices,
  fetch_shipper_invoices_count,
  reject_shipper_invoice,
} from "../api/shipper.api";
import StatsCards from "@/components/common/StatsCards.vue";
import { currencyFormatter } from "@/utils/utils";
import { fetch_invoice_details } from "@/modules/operation/api/invoice.api";
import { exportInvoiceToExcel } from "@/modules/operation/utils/invoiceExcelExport";

const router = useRouter();
const authStore = useAuthStore();
const toast = useToastStore();

const dateRange = ref({
  start: null,
  end: null,
});

const apiParams = computed(() => ({
  createdAt: {
    gte: dateRange.value.start,
    lte: dateRange.value.end,
  },
}));

const { response, refetch } = usePagination({
  id: "shipper-invoices-list",
  url: "/shipment/approvedAndCollectedInvoices",
  params: apiParams,
});

const {
  data: countRes,
  refetch: refetchCount,
  isLoading: sumLoad,
} = useQuery({
  queryKey: ["shipper-invoices-count", dateRange],
  queryFn: () =>
    fetch_shipper_invoices_count({
      startDate: dateRange.value.start,
      endDate: dateRange.value.end,
    }),
});

const summaryCards = computed(() => {
  const count = countRes.value?.data || {};
  return [
    {
      label: "Total Invoices",
      value: formatNumber(count.completeTotal || 0),
      icon: "mdi mdi-receipt text-primary",
    },
    {
      label: "Paid Invoices",
      value: formatNumber(count.totalCollected || 0),
      icon: "mdi mdi-check-circle text-emerald-600",
    },
    {
      label: "Remaining",
      value: formatNumber(count.totalApproved || 0),
      icon: "mdi mdi-clock-outline text-amber-600",
    },
  ];
});

const columns: TableColumn<any>[] = [
  { key: "reference", label: "Name", field: "reference" },
  { key: "carrierName", label: "Carrier", field: "carrier.name" },
  {
    key: "paymentApprovedDate",
    label: "Request Date",
    field: "paymentApprovedDate",
  },
  {
    key: "paymentCollectedBy",
    label: "Collected By",
    field: "paymentCollectedByShipper.username",
  },
  { key: "totalAmount", label: "Total Amount", field: "totalAmount" },
  {
    key: "shipperPaymentStatus",
    label: "Payment Status",
    field: "shipperPaymentStatus",
  },
  { key: "actions", label: "Action", field: "" },
];

const handleDateSelect = (val: any) => {
  if (typeof val === "object" && val.start) {
    dateRange.value = val;
  }
};

const navigateToDetails = (id: string) => {
  router.push(`/finance/generateInvoice/${id}`);
};

const handleDownload = async (id: string) => {
  toast.info("Preparing your invoice download...");
  try {
    const res = await fetch_invoice_details(id);
    if (res.data) {
      exportInvoiceToExcel(res.data);
      toast.success("Invoice downloaded successfully!");
    } else {
      toast.error("Failed to fetch invoice details");
    }
  } catch (error) {
    toast.error("An error occurred during download");
  }
};

const openPayModal = async (invoice: any) => {
  const res = await openModal("PayInvoiceModal", { invoice });
  if (res) {
    refetch();
    refetchCount();
  }
};

const handleReject = async (invoice: any) => {
  const res = await openModal("ConfirmationModal", {
    title: "Reject Invoice",
    message: "Are you sure you want to reject this invoice?",
    confirmText: "Reject",
    confirmVariant: "danger",
  });

  if (res) {
    const response = await reject_shipper_invoice(invoice._id);
    if (response.success) {
      toast.success("Invoice rejected!");
      refetch();
      refetchCount();
    }
  }
};

const formatNumber = (value: number) => new Intl.NumberFormat().format(value);

const formatType = (type: string) => {
  if (!type) return "-";
  return type
    .replace(/_/g, " ")
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};
</script>
