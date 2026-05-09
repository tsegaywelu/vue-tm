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
    <StatsCards v-permission="'TRANSACTION:read'" :stats="collectionStats" :loading="statsLoading" />
  </Teleport>

  <PaymentCollectionTable 
    ref="tableRef" 
    :filters="{ startDate: dateRange.start, endDate: dateRange.end }"
    @action="handlePaymentCollectionAction" 
  />
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import { openModal } from "@customizer/modal-x";
import PaymentCollectionTable from "../../components/finance/PaymentCollectionTable.vue";
import StatsCards from "@/components/common/StatsCards.vue";
import { fetch_approved_and_collected_invoice_count } from "../../api/operation.api";
import { currencyFormatter } from "@/utils/utils";
import Button from "@/components/Button.vue";
import DatePicker from "@/components/DatePicker.vue";
import Dropdown from "@/components/common/Dropdown.vue";

const router = useRouter();
const tableRef = ref<any>(null);

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
  queryKey: ["payment-collection-stats"],
  queryFn: () => fetch_approved_and_collected_invoice_count(),
});

const collectionStats = computed(() => {
  const data = (statsResponse.value?.data || {}) as any;
  return [
    { 
      label: "Total Invoices", 
      value: `${currencyFormatter(data.completeTotal || 0)} (${data.completeTotalCount || 0} Invoices)`,
      class: "text-gray-900" 
    },
    { 
      label: "Collected Invoices", 
      value: `${currencyFormatter(data.totalCollected || 0)} (${data.totalCollectedCount || 0} Invoices)`,
      class: "text-green-600" 
    },
    { 
      label: "Remaining Invoices", 
      value: `${currencyFormatter(data.totalApproved || 0)} (${data.totalApprovedCount || 0} Invoices)`,
      class: "text-amber-600" 
    },
  ];
});

const handlePaymentCollectionAction = async ({ row, action }: any) => {
  const id = row._id || row.id;

  if (action === 'view') {
    router.push(`/finance/payment-collection/${id}`);
  } else if (action === 'edit') {
    router.push(`/finance/payment-collection/edit/${id}`);
  } else if (action === 'collect') {
    const confirmed = await openModal("CollectModal", { invoice: row });
    if (confirmed) {
      tableRef.value?.refetch();
      refetchStats();
    }
  }
};
</script>
