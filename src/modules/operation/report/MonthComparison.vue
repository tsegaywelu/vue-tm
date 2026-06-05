<template>
  <div class="bg-surface rounded-2xl border border-line shadow-md p-8 @container">

    <div class="flex items-center justify-between mb-6">
      <h3 class="font-semibold text-base-text">Monthly Financial Comparison</h3>
      <span v-if="previousMonth && currentMonth" class="text-xs text-dim-text">
        {{ previousMonth.monthName }} {{ previousMonth.year }} vs
        {{ currentMonth.monthName }} {{ currentMonth.year }}
      </span>
    </div>

    <div v-if="loading" class="flex justify-center items-center py-10">
      <span class="mdi mdi-loading mdi-spin text-2xl text-indigo-400" />
    </div>

    <div v-else-if="!previousMonth || !currentMonth" class="text-sm text-dim-text text-center py-8">
      No comparison data available.
    </div>

    <div v-else class="grid grid-cols-1 @[640px]:grid-cols-3 gap-4">

      <!-- Previous Month -->
      <div class="rounded-xl border border-line overflow-hidden">
        <div class="flex items-center justify-between px-4 py-3 bg-surface-muted border-b border-line">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-gray-400 shrink-0"></span>
            <span class="text-xs font-semibold text-base-text">
              {{ previousMonth.monthName }} {{ previousMonth.year }}
            </span>
          </div>
          <span class="text-[10px] font-semibold text-dim-text">Previous</span>
        </div>
        <div class="p-4 space-y-4 bg-surface">
          <div class="grid grid-cols-3 gap-1 text-center">
            <div v-for="m in prevSummary" :key="m.label">
              <div class="text-[10px] text-dim-text mb-0.5">{{ m.label }}</div>
              <div class="text-xs font-bold" :class="m.class">{{ m.value }}</div>
            </div>
          </div>

          <div class="border-t border-line pt-3">
            <div class="text-[10px] font-semibold text-dim-text uppercase tracking-wide mb-2">Revenue</div>
            <div class="space-y-1.5">
              <div class="flex justify-between text-xs">
                <span class="text-dim-text">Shipment</span>
                <span class="font-medium text-base-text">{{ fmt(previousMonth.shipmentTotalPriceSum) }}</span>
              </div>
              <div class="flex justify-between text-xs">
                <span class="text-dim-text">Lease</span>
                <span class="font-medium text-base-text">{{ fmt(previousMonth.totalLeaseRevenueSum) }}</span>
              </div>
            </div>
          </div>

          <div class="border-t border-line pt-3">
            <div class="text-[10px] font-semibold text-dim-text uppercase tracking-wide mb-2">Expenses</div>
            <div class="space-y-1.5">
              <div v-for="exp in expenseCategories" :key="exp.key" class="flex justify-between text-xs">
                <span class="text-dim-text">{{ exp.label }}</span>
                <span class="font-medium text-base-text">{{ fmt(previousMonth[exp.key]) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Current Month -->
      <div class="rounded-xl border border-indigo-400 dark:border-indigo-500 overflow-hidden">
        <div class="flex items-center justify-between px-4 py-3 bg-indigo-500 border-b border-indigo-400">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-white/70 shrink-0"></span>
            <span class="text-xs font-semibold text-white">
              {{ currentMonth.monthName }} {{ currentMonth.year }}
            </span>
          </div>
          <span class="text-[10px] font-semibold bg-white/20 text-white px-2 py-0.5 rounded-full">Current</span>
        </div>
        <div class="p-4 space-y-4 bg-surface">
          <div class="grid grid-cols-3 gap-1 text-center">
            <div v-for="m in currSummary" :key="m.label">
              <div class="text-[10px] text-dim-text mb-0.5">{{ m.label }}</div>
              <div class="text-xs font-bold" :class="m.class">{{ m.value }}</div>
            </div>
          </div>

          <div class="border-t border-line pt-3">
            <div class="text-[10px] font-semibold text-dim-text uppercase tracking-wide mb-2">Revenue</div>
            <div class="space-y-1.5">
              <div class="flex justify-between text-xs">
                <span class="text-dim-text">Shipment</span>
                <span class="font-medium text-base-text">{{ fmt(currentMonth.shipmentTotalPriceSum) }}</span>
              </div>
              <div class="flex justify-between text-xs">
                <span class="text-dim-text">Lease</span>
                <span class="font-medium text-base-text">{{ fmt(currentMonth.totalLeaseRevenueSum) }}</span>
              </div>
            </div>
          </div>

          <div class="border-t border-line pt-3">
            <div class="text-[10px] font-semibold text-dim-text uppercase tracking-wide mb-2">Expenses</div>
            <div class="space-y-1.5">
              <div v-for="exp in expenseCategories" :key="exp.key" class="flex justify-between text-xs">
                <span class="text-dim-text">{{ exp.label }}</span>
                <span class="font-medium text-base-text">{{ fmt(currentMonth[exp.key]) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Comparison Insights -->
      <div class="rounded-xl border border-emerald-400 dark:border-emerald-500 overflow-hidden">
        <div class="flex items-center justify-between px-4 py-3 bg-emerald-500 border-b border-emerald-400">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-white/70 shrink-0"></span>
            <span class="text-xs font-semibold text-white">Comparison Insights</span>
          </div>
          <span class="text-[10px] font-semibold bg-white/20 text-white px-2 py-0.5 rounded-full">Trends</span>
        </div>
        <div class="p-4 space-y-4 bg-surface">

          <div v-if="hasComparison">
            <div class="text-[10px] font-semibold text-dim-text uppercase tracking-wide mb-2">Key Metrics</div>
            <div class="space-y-1.5">
              <div
                v-for="(comp, key) in comparisonData"
                :key="key"
                class="flex items-center justify-between text-xs border-b border-line last:border-0 pb-1.5 last:pb-0"
              >
                <span class="text-dim-text">{{ metricName(key as string) }}</span>
                <span
                  class="font-semibold tabular-nums"
                  :class="comp.isIncrease ? 'text-emerald-500' : comp.amount !== 0 ? 'text-red-500' : 'text-base-text'"
                >
                  {{ fmt(comp.amount) }}
                  <span class="text-[10px] text-dim-text font-normal ml-0.5">({{ comp.percentage?.toFixed(1) }}%)</span>
                </span>
              </div>
            </div>
          </div>

          <div class="border-t border-line pt-3">
            <div class="text-[10px] font-semibold text-dim-text uppercase tracking-wide mb-2">Performance Summary</div>
            <div class="space-y-1.5">
              <div
                v-for="row in performanceSummary"
                :key="row.label"
                class="flex items-center justify-between text-xs border-b border-line last:border-0 pb-1.5 last:pb-0"
              >
                <span class="text-dim-text">{{ row.label }}</span>
                <span class="font-semibold tabular-nums" :class="row.class">
                  {{ fmt(row.amount) }}
                  <span class="text-[10px] text-dim-text font-normal ml-0.5">({{ row.pct }}%)</span>
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  monthsData: any[] | null;
  loading?: boolean;
}>();

const expenseCategories = [
  { key: "totalFuelCostSum", label: "Fuel" },
  { key: "totalAdvanceCostSum", label: "Advance Payments" },
  { key: "totalPrePaymentCostSum", label: "Transporter Advances" },
  { key: "totalTransporterCostSum", label: "Transporter" },
  { key: "totalPurchaseCostSum", label: "Purchase" },
  { key: "totalInsuranceCostSum", label: "Insurance" },
  { key: "totalLeaseCostSum", label: "Lease" },
];

const metricNames: Record<string, string> = {
  shipmentTotalPrice: "Shipment Revenue",
  profit: "Profit",
  totalExpenses: "Total Expenses",
  fuelCost: "Fuel Costs",
  advanceCost: "Advance Payments",
  paymentRequests: "Payment Requests",
  purchaseCost: "Purchase Costs",
  leaseCost: "Lease Costs",
  leaseRevenue: "Lease Revenue",
  transporterCost: "Transporter Costs",
};

const previousMonth = computed(() => props.monthsData?.find((m) => !m.isCurrent) ?? null);
const currentMonth = computed(() => props.monthsData?.find((m) => m.isCurrent) ?? null);
const comparisonData = computed(() => currentMonth.value?.comparison ?? {});
const hasComparison = computed(() => Object.keys(comparisonData.value).length > 0);

function calcChange(current: number, prev: number) {
  const amount = current - prev;
  const pct = prev === 0 ? 0 : (amount / prev) * 100;
  return { amount, pct: pct.toFixed(1), isIncrease: amount > 0 };
}

const prevSummary = computed(() => {
  const m = previousMonth.value;
  if (!m) return [];
  return [
    { label: "Revenue", value: fmt(m.totalRevenueSum), class: "text-base-text" },
    { label: "Expenses", value: fmt(m.totalExpensesSum), class: "text-base-text" },
    { label: "Profit", value: fmt(m.profit), class: m.profit >= 0 ? "text-emerald-500" : "text-red-500" },
  ];
});

const currSummary = computed(() => {
  const m = currentMonth.value;
  if (!m) return [];
  return [
    { label: "Revenue", value: fmt(m.totalRevenueSum), class: "text-base-text" },
    { label: "Expenses", value: fmt(m.totalExpensesSum), class: "text-base-text" },
    { label: "Profit", value: fmt(m.profit), class: m.profit >= 0 ? "text-emerald-500" : "text-red-500" },
  ];
});

const performanceSummary = computed(() => {
  const cur = currentMonth.value;
  const prev = previousMonth.value;
  if (!cur || !prev) return [];
  const profit = calcChange(cur.profit ?? 0, prev.profit ?? 0);
  const expense = calcChange(cur.totalExpensesSum ?? 0, prev.totalExpensesSum ?? 0);
  const revenue = calcChange(cur.totalRevenueSum ?? 0, prev.totalRevenueSum ?? 0);
  return [
    { label: "Overall Profit", ...profit, class: profit.isIncrease ? "text-emerald-500" : "text-red-500" },
    { label: "Expense Change", ...expense, class: expense.amount < 0 ? "text-emerald-500" : "text-red-500" },
    { label: "Revenue Change", ...revenue, class: revenue.isIncrease ? "text-emerald-500" : "text-red-500" },
  ];
});

function fmt(value: any) {
  if (value == null || isNaN(value)) return "ETB 0";
  return `ETB ${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value)}`;
}

function metricName(key: string) {
  return metricNames[key] || key;
}
</script>
