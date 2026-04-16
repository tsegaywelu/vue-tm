<template>
  <div class="flex flex-col gap-6">
    <Table
      id="approval-requests"
      :columns="columns"
      :rows="response"
      class="bg-white rounded-4xl shadow-sm overflow-hidden"
    >
      <!-- Custom Cells -->
      <template #cell-driver="{ row }">
        <div class="flex flex-col">
          <span class="font-semibold text-gray-900">
            {{ row.driver?.firstName }} {{ row.driver?.middleName }}
          </span>
          <span class="text-xs text-gray-400 font-medium">{{
            row.plateNumber
          }}</span>
        </div>
      </template>

      <template #cell-total="{ value }">
        <span class="font-bold text-gray-900">
          {{ formatCurrency(value) }}
        </span>
      </template>

      <template #cell-createdAt="{ value }">
        <span class="text-gray-500 text-xs">
          {{ formatDate(value) }}
        </span>
      </template>

      <template #cell-actions="{ row }">
        <div class="flex items-center gap-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            class="h-9 px-4 border-gray-200 text-gray-600 hover:border-error hover:text-error transition-all"
            @click="handleAction(row, 'reject')"
          >
            Reject
          </Button>
          <Button
            variant="primary"
            size="sm"
            class="h-9 px-4"
            @click="handleAction(row, 'approve')"
          >
            Approve
          </Button>
        </div>
      </template>

      <template #cell-payableType="{ value }">
        <div
          class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider w-fit mx-auto"
          :class="typeClasses[value] || 'bg-gray-100 text-gray-500'"
        >
          {{ formatType(value) }}
        </div>
      </template>
    </Table>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import Table from "@/components/common/Table.vue";
import Button from "@/components/Button.vue";
import { usePagination } from "@/composables/usePagination";
import type {
  ApprovalFilterParams,
  ApprovalRequest,
  ApprovalAction,
} from "../operation.types";
import type { TableColumn } from "@/components/common/Table.vue";

const props = defineProps<{
  filters: ApprovalFilterParams;
}>();

const emit = defineEmits(["action"]);

// --- Columns Definition ---
const columns: TableColumn<ApprovalRequest>[] = [
  { key: "advanceNumber", label: "Advance No.", field: "advanceNumber" },
  { key: "payableType", label: "Type", field: "payableType" },
  { key: "driver", label: "Driver / Plate", field: "driver" },
  { key: "shipmentCode", label: "Shipment", field: "shipmentCode" },
  {
    key: "route",
    label: "Route",
    field: (row: ApprovalRequest) => row.route?.name || "N/A",
  },
  { key: "total", label: "Amount", field: "total" },
  { key: "createdAt", label: "Date", field: "createdAt" },
  { key: "actions", label: "Actions", field: "", cellAlign: "right" },
];

// --- Pagination & Data Fetching ---
// Integrating with TanStack Query and global tablePaginationStore
const { response, state, setPage, setLimit, refetch } =
  usePagination<ApprovalRequest>({
    id: "approval-requests", // Explicit ID for global state management
    url: "/advance-payment/allApprovalRequests",
    params: computed(() => props.filters),
  });

// Refetch whenever filters change externally
// usePagination handles refetching automatically via queryKey,
// but we reset the page to 1 here for external filter changes.
watch(
  () => props.filters,
  () => {
    setPage(1);
  },
  { deep: true },
);

// --- Helpers ---

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
  }).format(val || 0);
};

const formatDate = (val: string) => {
  if (!val) return "N/A";
  return new Date(val).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatType = (val: string) => {
  return val.replace(/([A-Z])/g, " $1").trim();
};

const typeClasses: Record<string, string> = {
  advancePayment: "bg-blue-50 text-blue-600",
  transactions: "bg-purple-50 text-purple-600",
  prePayments: "bg-orange-50 text-orange-600",
  vehicleLeaseAgreement: "bg-teal-50 text-teal-600",
};

const handleAction = (row: ApprovalRequest, action: ApprovalAction) => {
  emit("action", { row, action });
};

// Expose refetch for the parent container (ApprovalRequests.vue)
defineExpose({
  refetch,
});
</script>
