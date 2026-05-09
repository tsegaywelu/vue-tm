<template>
  <Teleport to="#page-actions" defer>
    <div class="items-center gap-4 inline-flex border-l border-grey-100 overflow-x-auto px-3">
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
    </div>
  </Teleport>

  <Teleport to="#extra-page-data" defer>
    <StatsCards v-permission="'REPORT:read'" :stats="invoiceStats" :loading="statsLoading">
      <template #value-total-amount="{ stat }">
        <span class="font-extrabold text-grey-800">
          {{ currencyFormatter(stat.value as any ) }}
          <span class="text-sm font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full ml-2">
            ({{ stat.count }} Invoices)
          </span>
        </span>
      </template>
    </StatsCards>
  </Teleport>

  <InvoiceReportTable 
    ref="tableRef" 
    :filters="{ startDate: dateRange.start, endDate: dateRange.end }"
    @action="handleInvoiceAction" 
  />
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useMutation, useQuery } from "@tanstack/vue-query";
import { useToastStore } from "@/store/toastStore";
import { useAuthStore } from "@/store/authStore";
import { openModal } from "@customizer/modal-x";
import { approve_invoice, cancel_invoice, fetch_requested_invoice_count } from "../../api/operation.api";
import InvoiceReportTable from "../../components/InvoiceReportTable.vue";
import StatsCards from "@/components/common/StatsCards.vue";
import { currencyFormatter } from "@/utils/utils";
import { useQueryClient } from "@tanstack/vue-query";

import Dropdown from "@/components/common/Dropdown.vue";
import DatePicker from "@/components/DatePicker.vue";
import Button from "@/components/Button.vue";

const router = useRouter();
const toast = useToastStore();
const authStore = useAuthStore();
const tableRef = ref<any>(null);
const queryClient = useQueryClient();

const dateRange = ref({
  start: "",
  end: "",
});

const handleDateSelect = (val: any) => {
  if (typeof val === "object" && val.start && val.end) {
    dateRange.value = val;
  }
};

const { data: statsResponse, isLoading: statsLoading, refetch: refetchStats } = useQuery({
  queryKey: ["invoice-report-list"],
  queryFn: () => fetch_requested_invoice_count(),
});

const invoiceStats = computed(() => {
  const data = (statsResponse.value?.data || {}) as any;
  return [
    { 
      label: "Total Amount", 
      value: data.totalApproved || 0, 
      count: data.totalApprovedCount || 0 
    }
  ];
});

const approveMutation = useMutation({
  mutationFn: ({ id, data }: any) => approve_invoice(id, data),
  onSuccess: () => {
    toast.success("Invoice Approved Successfully!");
    queryClient.invalidateQueries({ queryKey: ["invoice-report-list"] });
    tableRef.value?.refetch();
    refetchStats();
  },
  onError: (error: any) => {
    toast.error(error.response?.data?.message || "Failed to approve invoice");
  }
});

const cancelMutation = useMutation({
  mutationFn: ({ id, data }: any) => cancel_invoice(id, data),
  onSuccess: () => {
    toast.success("Invoice Cancelled Successfully!");
    //invalidate query here 
    queryClient.invalidateQueries({ queryKey: ["invoice-report-list"] });
    tableRef.value?.refetch();
    refetchStats();
  },
  onError: (error: any) => {
    toast.error(error.response?.data?.message || "Failed to cancel invoice");
  }
});

const handleInvoiceAction = async ({ row, action }: any) => {
  const id = row._id || row.id;
  const userId = authStore.current_user?._id || authStore.current_user?.user?._id;

  if (action === 'view') {
    router.push(`/finance/invoice-report/${id}`);
  } else if (action === 'edit') {
    router.push(`/finance/invoice-report/edit/${id}`);
  } else if (action === 'approve') {
    const confirmed = await openModal("ConfirmationModal", {
      title: "Approve Invoice",
      message: `Are you sure you want to approve invoice ${row.reference}?`,
      type: 'primary'
    });
    if (confirmed) {
      approveMutation.mutate({ 
        id, 
        data: { paymentApprovedBy: userId } 
      });
    }
  } else if (action === 'cancel') {
    const confirmed = await openModal("ConfirmationModal", {
      title: "Cancel Invoice",
      message: `Are you sure you want to cancel invoice ${row.reference}?`,
      type: 'danger'
    });
    if (confirmed) {
      cancelMutation.mutate({ 
        id, 
        data: { paymentCancelledBy: userId } 
      });
    }
  }
};
</script>
