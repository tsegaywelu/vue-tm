<template>
  <Teleport to="#page-actions" defer>
    <div class="hidden sm:flex items-center gap-4">
      <DateRangePicker
        v-model="dateRange"
        pagination-id="paid-sub-contracts-list"
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
    <div v-if="!tableRef?.fullResponse" class="flex justify-center items-center py-2">
      <i class="mdi mdi-loading mdi-spin text-xl text-primary"></i>
    </div>
    <div v-else class="my-2 ml-2 flex flex-row flex-nowrap items-center gap-3 overflow-x-auto scrollbar-none animate-fade-in py-1">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="bg-white border border-gray-100 rounded-2xl px-3 py-2 sm:px-5 sm:py-3 shadow-sm flex flex-row items-center gap-3 sm:min-w-[240px] transition-all hover:shadow-md cursor-pointer"
      >
        <i :class="['mdi', stat.icon || 'mdi-cash', 'text-primary text-lg shrink-0']"></i>
        <div class="flex flex-row flex-nowrap items-baseline gap-2 min-w-0">
          <span
            class="text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap"
          >
            {{ stat.label }}
          </span>
          <span :class="['text-base sm:text-xl font-black tracking-tight whitespace-nowrap', stat.colorClass || 'text-gray-900']">
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
import PaidSubContractsDownloadToast from "../../components/finance/PaidSubContractsDownloadToast.vue";
import DateRangePicker from "@/components/common/DateRangePicker.vue";
import DatePicker from "@/components/DatePicker.vue";
import Button from "@/components/Button.vue";
import BottomSheet from "@/components/BottomSheet.vue";
import { currencyFormatter } from "@/utils/utils";
import { useToastStore } from "@/store/toastStore";
import { icons } from "@/utils/icons";

const router = useRouter();
const toast = useToastStore();
const tableRef = ref<any>(null);
const showFilterSheet = ref(false);

const dateRange = ref({ start: "", end: "" });

const handleExport = () => {
  const raw = tableRef.value?.activeParams ?? {};
  const filters = Object.fromEntries(
    Object.entries(raw).filter(([, v]) => v !== "" && v !== null && v !== undefined),
  );
  toast.addCustomToast(PaidSubContractsDownloadToast, { filters });
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
