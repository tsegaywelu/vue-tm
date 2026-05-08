<template>
  <Teleport to="#extra-page-data" defer>
    <StatsCards v-permission="'TRANSACTION:read'" :stats="stats" />
  </Teleport>
  <PaidSubContractsTable ref="tableRef" @action="handleAction" />
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import PaidSubContractsTable from "../../components/finance/PaidSubContractsTable.vue";
import StatsCards from "@/components/common/StatsCards.vue";
import { currencyFormatter } from "@/utils/utils";

const router = useRouter();
const tableRef = ref<any>(null);

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
      class: "text-gray-900",
    },
    {
      label: "Total Transporter Price",
      value: currencyFormatter(totalTransportersPrice),
      class: "text-gray-900",
    },
    {
      label: "Gross Profit",
      value: currencyFormatter(grossProfit),
      class: grossProfit >= 0 ? "text-green-600" : "text-red-600",
    },
    {
      label: "Profit Margin %",
      value: `${profitMargin.toFixed(2)}%`,
      class: profitMargin >= 0 ? "text-primary" : "text-red-600",
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
