<template>
  <ApprovalTable @action="handleApprovalAction" />
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useQueryClient, useMutation } from "@tanstack/vue-query";
import ApprovalTable from "../components/ApprovalTable.vue";
import { useToastStore } from "@/store/toastStore";
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
const toast = useToastStore();

const activeFilters = reactive<ApprovalFilterParams>({
  page: 1,
  limit: 10,
});

// Mutations for handling approval actions
const approvalMutation = useMutation({
  mutationFn: async ({
    row,
    action,
    amount,
  }: {
    row: ApprovalRequest;
    action: ApprovalAction;
    amount?: number;
  }) => {
    switch (row.payableType) {
      case "advancePayment":
        return await update_advance_status(row._id, action, amount ? { amount } : {});
      case "prePayments":
        return await update_prepayment_status(row._id, action);
      case "vehicleLeaseAgreement":
        return await update_lease_status(row._id, action);
      default:
        return await update_transaction_status(row._id, action);
    }
  },
  onSuccess: (response, variables) => {
    if (response.success) {
      // Invalidate the approval requests query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ["approval-requests"] });

      toast.success(`Successfully ${variables.action}ed the request.`);
    } else {
      toast.error(response.error || "Failed to update status");
    }
  },
  onError: (error: any) => {
    toast.error(
      error.message || "An unexpected error occurred. Please try again.",
    );
  },
});

const handleApprovalAction = ({
  row,
  action,
  amount,
}: {
  row: ApprovalRequest;
  action: ApprovalAction;
  amount?: number;
}) => {
  approvalMutation.mutate({ row, action, amount });
};
</script>
