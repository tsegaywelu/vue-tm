<template>
  <div
    class="flex flex-col gap-8 px-5 py-4 bg-white rounded-3xl max-w-[1600px] mx-auto min-h-screen animate-fade-in"
  >
    <!-- Header Area -->
    <div class="flex justify-between items-center">
      <div class="flex flex-col gap-2">
        <h1 class="text-3xl font-extrabold text-primary tracking-tight">
          Approval Requests
        </h1>
        <p class="text-gray-500 font-medium text-lg">
          Manage and process operational payment approvals from one central hub.
        </p>
      </div>
    </div>
    <ApprovalFilters
      @change="handleFilterChange"
      calendar-type="english"
      output-calendar-type="english"
    />
    <ApprovalTable :filters="activeFilters" @action="handleApprovalAction" />
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useQueryClient, useMutation } from "@tanstack/vue-query";
import ApprovalFilters from "../components/ApprovalFilters.vue";
import ApprovalTable from "../components/ApprovalTable.vue";
import { useTablePagination } from "@/composables/usePagination";
import {
  update_advance_status,
  update_transaction_status,
  update_prepayment_status,
  update_lease_status,
} from "../api/operation.api";
import type {
  ApprovalFilterParams,
  ApprovalRequest,
  ApprovalAction,
} from "../operation.types";

const queryClient = useQueryClient();

// Sync with global pagination store for the approval-requests table
const { setPage } = useTablePagination("approval-requests");

const activeFilters = reactive<ApprovalFilterParams>({
  page: 1,
  limit: 10,
});

const handleFilterChange = (newFilters: ApprovalFilterParams) => {
  Object.assign(activeFilters, newFilters);
  // Ensure we head back to the first page when filters change
  setPage(1);
};

// Mutations for handling approval actions
const approvalMutation = useMutation({
  mutationFn: async ({
    row,
    action,
  }: {
    row: ApprovalRequest;
    action: ApprovalAction;
  }) => {
    switch (row.payableType) {
      case "advancePayment":
        return await update_advance_status(
          row.advancePaymentId || row._id,
          action,
        );
      case "transactions":
        return await update_transaction_status(row._id, action);
      case "prePayments":
        return await update_prepayment_status(row._id, action);
      case "vehicleLeaseAgreement":
        return await update_lease_status(row._id, action);
      default:
        throw new Error(`Unknown payable type: ${row.payableType}`);
    }
  },
  onSuccess: (response) => {
    if (response.success) {
      // Invalidate the approval requests query to trigger a refetch
      // This is the Raaz way of handling state updates after mutations
      queryClient.invalidateQueries({ queryKey: ["approval-requests"] });
      queryClient.invalidateQueries({ queryKey: ["/allApprovalRequests"] });
      // Typically we would trigger a toast notification here
      console.log("Action processed successfully");
    } else {
      alert(`Error: ${response.error || "Failed to update status"}`);
    }
  },
  onError: (error: any) => {
    console.error("Approval action failed:", error);
    alert("An unexpected error occurred. Please try again.");
  },
});

const handleApprovalAction = ({
  row,
  action,
}: {
  row: ApprovalRequest;
  action: ApprovalAction;
}) => {
  const confirmMessage = `Are you sure you want to ${action} this ${row.payableType}?`;
  if (!window.confirm(confirmMessage)) return;

  approvalMutation.mutate({ row, action });
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
