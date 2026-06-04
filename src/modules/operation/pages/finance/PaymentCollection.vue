<template>
  <Teleport to="#page-actions" defer>
    <div class="hidden sm:flex items-center gap-2">
      <DateRangePicker
        v-model="dateRange"
        pagination-id="payment-collection-list"
        start-key="startDate"
        end-key="endDate"
      />
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
      class="sm:hidden size-8 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
      @click="handleExport"
    >
      <i v-html="icons.excell"></i>
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

  <Teleport to="#extra-page-data" defer>
    <div v-if="statsLoading" class="flex justify-center items-center py-2">
      <i class="mdi mdi-loading mdi-spin text-xl text-primary"></i>
    </div>
    <div
      v-else
      class="my-2 ml-2 flex flex-row flex-nowrap items-center gap-3 overflow-x-auto scrollbar-none animate-fade-in py-1"
    >
      <div
        v-for="stat in collectionStats"
        :key="stat.label"
        class="bg-white border border-gray-100 rounded-2xl px-3 py-2 sm:px-5 sm:py-3 shadow-sm flex flex-row items-center gap-3 sm:min-w-[280px] transition-all hover:shadow-md cursor-pointer"
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
            {{ stat.amount }}
          </span>
          <span
            class="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full whitespace-nowrap"
          >
            ({{ stat.count }})
          </span>
        </div>
      </div>
    </div>
  </Teleport>

  <PaymentCollectionTable
    ref="tableRef"
    :filters="{
      startDate: dateRange.start || undefined,
      endDate: dateRange.end || undefined,
    }"
    @action="handlePaymentCollectionAction"
  />
</template>

<script setup lang="ts">
import { ref, computed, markRaw } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/authStore";
import { useQuery } from "@tanstack/vue-query";
import { openModal } from "@customizer/modal-x";
import PaymentCollectionTable from "../../components/finance/PaymentCollectionTable.vue";
import PaymentCollectionDownloadToast from "../../components/finance/PaymentCollectionDownloadToast.vue";
import StatsCards from "@/components/common/StatsCards.vue";
import { fetch_approved_and_collected_invoice_count } from "../../api/operation.api";
import { currencyFormatter } from "@/utils/utils";
import { useToastStore } from "@/store/toastStore";
import DateRangePicker from "@/components/common/DateRangePicker.vue";
import DatePicker from "@/components/DatePicker.vue";
import Button from "@/components/Button.vue";
import BottomSheet from "@/components/BottomSheet.vue";
import { icons } from "@/utils/icons";

const router = useRouter();
const authStore = useAuthStore();
const toastStore = useToastStore();
const tableRef = ref<any>(null);
const showFilterSheet = ref(false);

const dateRange = ref({
  start: "",
  end: "",
});

const {
  data: statsResponse,
  isLoading: statsLoading,
  refetch: refetchStats,
} = useQuery({
  queryKey: ["payment-collection-stats", dateRange],
  queryFn: () =>
    fetch_approved_and_collected_invoice_count({
      startDate: dateRange.value.start,
      endDate: dateRange.value.end,
    }),
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

const handleExport = () => {
  const filters = {
    ...(tableRef.value?.activeFilters ?? {}),
    ...(dateRange.value.start ? { "createdAt[gte]": dateRange.value.start } : {}),
    ...(dateRange.value.end ? { "createdAt[lte]": dateRange.value.end } : {}),
  };
  toastStore.addCustomToast(markRaw(PaymentCollectionDownloadToast), { filters });
};

const handlePaymentCollectionAction = async ({ row, action }: any) => {
  const id = row._id || row.id;

  if (action === "view") {
    router.push(`/finance/payment-collection/${id}`);
  } else if (action === "edit") {
    router.push(`/finance/payment-collection/edit/${id}`);
  } else if (action === "collect") {
    const confirmed = await openModal("CollectModal", { invoice: row });
    if (confirmed) {
      tableRef.value?.refetch();
      refetchStats();
    }
  }
};
</script>
