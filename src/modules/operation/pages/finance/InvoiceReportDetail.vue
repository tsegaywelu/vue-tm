<template>
  <div class="h-full flex flex-col gap-4">
    <div v-if="isLoading" class="flex justify-center py-20">
      <i class="mdi mdi-loading mdi-spin text-4xl text-primary"></i>
    </div>

    <template v-else-if="invoice">
      <!-- Header Section -->
      <div
        class="bg-white flex flex-col md:flex-row md:items-center justify-between px-3 md:px-4 py-4 md:py-3 rounded-[20px] gap-4 shadow-sm border border-gray-100"
      >
        <div class="flex flex-col gap-2 flex-1">
          <div class="flex items-center gap-4">
            <div class="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <i class="mdi mdi-file-document-outline text-2xl"></i>
            </div>
            <div>
              <h1 class="font-bold text-2xl leading-tight text-gray-900">
                Invoice #{{ invoice.reference || invoice.shipments?.[0]?.paymentDetail?.reference || '-------' }}
              </h1>
              <div class="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                <span class="text-sm text-gray-600">
                  Requested By:
                  <span class="font-bold text-black text-sm ml-1">
                    {{ invoice.paymentRequestedBy?.username || invoice.shipments?.[0]?.paymentDetail?.paymentRequestedBy?.username || '-' }}
                  </span>
                </span>
                <span class="text-sm text-gray-600">
                  Date:
                  <span class="font-bold text-black text-sm ml-1">
                    {{ dateFormatter(invoice.paymentRequestedDate || invoice.shipments?.[0]?.paymentDetail?.paymentRequestedDate) }}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-row items-center justify-between md:justify-end gap-3 md:gap-4">
          <div class="flex flex-row lg:flex-col items-start md:items-end gap-1 md:gap-2">
            <Status :variant="invoice.status || 'pending'" type="wrapped">
              {{ (invoice.status || 'PENDING').replace(/_/g, " ") }}
            </Status>
          </div>
          <div class="flex gap-2">
            <Button
              v-if="invoice.status === 'PENDING'"
              variant="primary"
              size="md"
              @click="handleApprove"
            >
              Approve
            </Button>
            <Button
              variant="outline"
              size="md"
              @click="handleExport"
            >
              <template #leading>
                <i class="mdi mdi-microsoft-excel text-lg text-green-600"></i>
              </template>
              Export
            </Button>
            <Button
              variant="outline"
              size="md"
              @click="handlePrint"
            >
              <template #leading>
                <i class="mdi mdi-printer text-lg"></i>
              </template>
              Print
            </Button>
          </div>
        </div>
      </div>

      <div id="invoice-report-details-tabs" class="w-full mt-2"></div>

      <div class="flex-1 min-h-0 overflow-y-auto">
        <component
          :is="activeTabComponent"
          :invoice="invoice"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import { fetch_invoice_details, approve_invoice } from "../../api/invoice.api";
import Status from "@/components/common/Status.vue";
import Button from "@/components/Button.vue";
import { dateFormatter } from "@/utils/utils";
import { exportToExcel, mapShipmentsForExcel } from "@/utils/excel";
import { useToastStore } from "@/store/toastStore";
import { useAuthStore } from "@/store/authStore";

// Tabs
import InvoiceReportOverviewTab from "../../components/finance/InvoiceReportOverviewTab.vue";

const route = useRoute();
const queryClient = useQueryClient();
const toast = useToastStore();
const auth = useAuthStore();
const invoiceId = route.params.id as string;

const tabs = computed(() => (route.meta.tabs || []) as any[]);
const activeTab = computed(
  () => (route.query.tab as string) || (tabs.value?.[0]?.value as string) || "overview",
);

const { data: response, isLoading } = useQuery({
  queryKey: ["invoice-report", invoiceId],
  queryFn: () => fetch_invoice_details(invoiceId),
  enabled: !!invoiceId,
});

const invoice = computed(() => response.value?.data);

const activeTabComponent = computed(() => {
  switch (activeTab.value) {
    case "overview":
      return InvoiceReportOverviewTab;
    default:
      return InvoiceReportOverviewTab;
  }
});

const approveMutation = useMutation({
  mutationFn: (data: any) => approve_invoice(invoiceId, data),
  onSuccess: () => {
    toast.success("Invoice approved successfully");
    queryClient.invalidateQueries({ queryKey: ["invoice-report", invoiceId] });
  },
  onError: (error: any) => {
    toast.error(error.response?.data?.description || "Failed to approve invoice");
  },
});

const handleApprove = () => {
  approveMutation.mutate({
    paymentApprovedBy: auth.user?._id,
  });
};

const handlePrint = () => {
  window.print();
};

const handleExport = () => {
  if (!invoice.value?.shipments) return;
  const data = mapShipmentsForExcel(invoice.value.shipments);
  exportToExcel(data, `Invoice_${invoice.value.reference || 'Details'}`, "Shipments");
};
</script>
