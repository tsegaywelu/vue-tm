<template>
  <Teleport to="#extra-page-data" defer>
    <StatsCards :stats="payableStats" :loading="isLoadingStats" />
  </Teleport>

  <PayableTable ref="tableRef" @action="handlePayableAction" />
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useQuery, useMutation } from "@tanstack/vue-query";
import PayableTable from "../../components/finance/PayableTable.vue";
import StatsCards from "@/components/common/StatsCards.vue";
import { 
  fetch_advance_status_count, 
  update_advance_status,
  update_transaction_status,
  update_prepayment_status,
  update_lease_status
} from "../../api/operation.api";
import { 
  update_purchase_order_payment_status 
} from "../../api/inventory.api";
import { useToastStore } from "@/store/toastStore";

const router = useRouter();
const toast = useToastStore();
const tableRef = ref();

const { data: statsResponse, isLoading: isLoadingStats, refetch: refetchStats } = useQuery({
  queryKey: ["payableStatusCount"],
  queryFn: () => fetch_advance_status_count(),
});

const payableStats = computed(() => {
  const tableData = (tableRef.value?.fullResponse || {}) as any;
  const statsData = (statsResponse.value?.data || {}) as any;
  
  // The totalSum from the main list is usually what matches the filtered results
  const total = tableData.totalSum ?? statsData.total ?? 0;
  
  console.log("Payable Stats Debug:", {
    tableFullResponse: tableRef.value?.fullResponse,
    statsApiResponse: statsResponse.value?.data,
    computedTotal: total
  });
  
  return [
    { label: "Total Payable", value: total, class: "text-primary" },
  ];
});

const mutation = useMutation({
  mutationFn: async ({ id, type, action, data }: any) => {
    switch (type) {
      case "advancePayment":
        return update_advance_status(id, action, data);
      case "transactions":
        return update_transaction_status(id, action, data);
      case "prePayments":
        return update_prepayment_status(id, action);
      case "vehicleLeaseAgreement":
        return update_lease_status(id, action);
      case "purchaseOrder":
        return update_purchase_order_payment_status(id, action);
      default:
        // For shipments or unknown types, try advance status update as fallback or add specific logic
        return update_advance_status(id, action, data);
    }
  },
  onSuccess: () => {
    toast.success("Action performed successfully");
    tableRef.value?.refetch();
    refetchStats();
  },
  onError: (error: any) => {
    toast.error(error.response?.data?.description || "An error occurred");
  },
});

const handlePayableAction = ({
  row,
  action,
}: {
  row: any;
  action: string;
}) => {
  if (action === "view") {
    const shipmentId = row.shipmentId || row.shipment?._id || row._id;
    router.push(`/operation/shipments/${shipmentId}`);
  } else if (["pay", "authorize", "cancel", "approve", "reject"].includes(action)) {
    const id = row._id || row.id;
    const type = row.payableType;
    
    // Map action if needed (e.g. pay -> paid)
    let apiAction = action;
    if (action === "pay") apiAction = "pay"; // Some APIs might expect 'paid'
    if (action === "authorize") apiAction = "authorize";
    
    mutation.mutate({ id, type, action: apiAction });
  } else {
    console.log(`Action: ${action} on Payable:`, row);
  }
};
</script>
