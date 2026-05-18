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
    <div v-if="statsLoading" class="flex justify-center items-center py-2">
      <i class="mdi mdi-loading mdi-spin text-xl text-primary"></i>
    </div>
    <div v-else class="my-2 ml-2 flex flex-wrap items-center gap-3 overflow-x-auto scrollbar-none animate-fade-in py-1">
      <div
        v-for="stat in collectionStats"
        :key="stat.label"
        class="bg-white border border-gray-100 rounded-2xl px-5 py-3 shadow-sm flex flex-col gap-1 min-w-[280px] transition-all hover:shadow-md cursor-pointer"
      >
        <div class="flex items-center gap-2">
          <i :class="['mdi', stat.icon || 'mdi-cash', 'text-primary text-lg']"></i>
          <span class="text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
            {{ stat.label }}
          </span>
        </div>
        <div class="mt-1 flex items-center gap-2 flex-wrap">
          <span v-if="authStore.has_permission('REPORT', ['view'])" class="text-xl font-black text-gray-900 tracking-tight">
            {{ stat.amount }}
          </span>
          <span class="text-sm font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
            ({{ stat.count }} Invoices)
          </span>
        </div>
      </div>
    </div>
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
import { useAuthStore } from "@/store/authStore";
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
const authStore = useAuthStore();
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
  queryKey: ["payment-collection-stats", dateRange],
  queryFn: () => fetch_approved_and_collected_invoice_count({ startDate: dateRange.value.start, endDate: dateRange.value.end }),
});

const collectionStats = computed(() => {
  const data = (statsResponse.value?.data || {}) as any;
  return [
    {
      label: "Total Invoices",
      amount: currencyFormatter(data.completeTotal || 0),
      count: data.completeTotalCount || 0,
      icon: "mdi-file-document-multiple",
    },
    {
      label: "Collected Invoices",
      amount: currencyFormatter(data.totalCollected || 0),
      count: data.totalCollectedCount || 0,
      icon: "mdi-cash-check",
    },
    {
      label: "Remaining Invoices",
      amount: currencyFormatter(data.totalApproved || 0),
      count: data.totalApprovedCount || 0,
      icon: "mdi-cash-clock",
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
