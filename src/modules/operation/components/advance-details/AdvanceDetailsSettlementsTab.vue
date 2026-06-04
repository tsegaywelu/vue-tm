<template>
  <div class="p-4 flex flex-col gap-6">
    <!-- Settlement Metrics Summary -->
    <InfoWrapper title="Settlement Metrics">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-2">
        <ShipmentDataLabel
          label="Given to Driver"
          :value="currencyFormatter(metrics.totalGivenToDriver)"
        />
        <ShipmentDataLabel
          label="Approved Expenses"
          :value="currencyFormatter(metrics.totalApprovedExpenses)"
        />
        <ShipmentDataLabel
          label="Approved Returns"
          :value="currencyFormatter(metrics.totalApprovedReturns)"
        />
        <ShipmentDataLabel
          label="Settlement Delta"
          :value="currencyFormatter(metrics.delta)"
          :class="metrics.delta === 0 ? 'text-green-600' : 'text-red-600'"
          is-bold
        />
      </div>

      <div class="mt-4 flex items-center gap-2 px-2">
        <div
          class="w-2 h-2 rounded-full"
          :class="isEligibleForSettlement ? 'bg-green-500' : 'bg-red-500'"
        ></div>
        <p
          class="text-xs font-semibold uppercase tracking-wider"
          :class="isEligibleForSettlement ? 'text-green-700' : 'text-red-600'"
        >
          {{ settlementStatusMessage }}
        </p>
      </div>
    </InfoWrapper>

    <!-- Transactions Table -->
    <div
      class="bg-surface rounded-[20px] border border-gray-100 p-2 shadow-sm overflow-hidden flex flex-col min-h-0"
    >
      <Table
        id="advance-transactions-table"
        :columns="columns"
        :rows="advance.transactions || []"
        :hide_search="true"
        :hide_actions="true"
        :show_pagination="false"
        :clickable_rows="false"
      >
        <template #cell-type="{ value }">
          <span class="font-semibold text-gray-800 capitalize">{{
            value?.toLowerCase().replace(/_/g, " ") || "-"
          }}</span>
        </template>

        <template #cell-category="{ value }">
          <span class="text-gray-700 capitalize">{{
            value?.toLowerCase().replace(/_/g, " ") || "-"
          }}</span>
        </template>

        <template #cell-amount="{ value }">
          <span class="font-bold text-gray-900">{{
            currencyFormatter(value)
          }}</span>
        </template>

        <template #cell-approvedAmount="{ value, row }">
          <span
            v-if="value !== undefined && value !== null"
            class="font-bold text-green-600"
          >
            {{ currencyFormatter(value) }}
          </span>
          <span v-else class="text-gray-400 text-sm">Not yet approved</span>
        </template>

        <template #cell-status="{ value }">
          <Status class="w-auto! px-4!" :variant="value" type="wrapped">
            {{ value || "N/A" }}
          </Status>
        </template>

        <template #cell-photos="{ row }">
          <div
            v-if="hasPhotos(row)"
            class="flex justify-center items-center gap-2"
          >
            <button
              @click="openPhotos(row)"
              class="flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 hover:bg-primary/10 text-primary rounded-lg transition-all text-xs font-bold"
              title="View Attachments"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <span>View</span>
              <span
                v-if="getAttachmentsCount(row) > 1"
                class="bg-primary text-white size-4 flex items-center justify-center rounded-full text-[10px]"
              >
                {{ getAttachmentsCount(row) }}
              </span>
            </button>
          </div>
          <span v-else class="text-gray-300 text-xs flex justify-center"
            >----</span
          >
        </template>

        <template #cell-actions="{ row }">
          <div class="flex justify-end">
            <Dropdown>
              <template #trigger>
                <button
                  class="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </button>
              </template>
              <template #default="{ close }">
                <div class="py-1 min-w-[160px]">
                  <!-- Common Actions -->
                  <button
                    v-if="hasPhotos(row)"
                    @click="
                      openPhotos(row);
                      close();
                    "
                    class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    View Attachments
                  </button>

                  <div
                    v-if="hasPhotos(row)"
                    class="h-px bg-gray-100 my-1"
                  ></div>

                  <!-- PENDING Actions -->
                  <template v-if="row.status === 'PENDING'">
                    <button
                      @click="
                        handleAction(row, 'approve');
                        close();
                      "
                      class="flex items-center w-full px-4 py-2 text-sm text-green-600 hover:bg-green-50 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      @click="
                        handleAction(row, 'reject');
                        close();
                      "
                      class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Reject
                    </button>
                  </template>

                  <!-- APPROVED Actions -->
                  <template v-if="row.status === 'APPROVED'">
                    <button
                      @click="
                        handleAction(row, 'authorize');
                        close();
                      "
                      class="flex items-center w-full px-4 py-2 text-sm text-primary hover:bg-primary/5 transition-colors"
                    >
                      Authorize
                    </button>
                    <button
                      @click="
                        handleAction(row, 'cancel');
                        close();
                      "
                      class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </template>

                  <!-- AUTHORIZED Actions -->
                  <template v-if="row.status === 'AUTHORIZED'">
                    <button
                      @click="
                        handleAction(row, 'pay');
                        close();
                      "
                      class="flex items-center w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      Pay
                    </button>
                  </template>

                  <div
                    v-if="
                      !['PENDING', 'APPROVED', 'AUTHORIZED'].includes(
                        row.status,
                      ) && !hasPhotos(row)
                    "
                    class="px-4 py-2 text-xs text-gray-400 italic"
                  >
                    No actions available
                  </div>
                </div>
              </template>
            </Dropdown>
          </div>
        </template>
      </Table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Table from "@/components/common/Table.vue";
import type { TableColumn } from "@/components/common/Table.vue";
import Status from "@/components/common/Status.vue";
import Dropdown from "@/components/common/Dropdown.vue";
import InfoWrapper from "../shipment-details/InfoWrapper.vue";
import ShipmentDataLabel from "../shipment-details/ShipmentDataLabel.vue";
import { currencyFormatter, getStaticUrl } from "@/utils/utils";
import { useMutation } from "@tanstack/vue-query";
import { update_transaction_status } from "../../api/operation.api";
import { useToastStore } from "@/store/toastStore";
import { openModal } from "@customizer/modal-x";

const props = defineProps<{
  advance: Record<string, any>;
}>();

const emit = defineEmits(["refresh"]);
const toast = useToastStore();

// --- Metrics Calculation ---
const metrics = computed(() => {
  const transactions = props.advance.transactions || [];
  const paidTransactions = transactions.filter(
    (tx: any) => tx?.status === "PAID",
  );

  const totalGivenToDriver = paidTransactions
    .filter(
      (tx: any) =>
        ["INITIAL", "ADDITIONAL"].includes(tx?.type) &&
        tx?.category === "OTHER",
    )
    .reduce(
      (sum: number, tx: any) => sum + (tx.approvedAmount ?? tx.amount ?? 0),
      0,
    );

  const totalApprovedExpenses = paidTransactions
    .filter((tx: any) => tx?.type === "EXPENSE")
    .reduce(
      (sum: number, tx: any) => sum + (tx.approvedAmount ?? tx.amount ?? 0),
      0,
    );

  const totalApprovedReturns = paidTransactions
    .filter((tx: any) => tx?.type === "RETURN")
    .reduce(
      (sum: number, tx: any) =>
        sum + Math.abs(tx.approvedAmount ?? tx.amount ?? 0),
      0,
    );

  const delta = Number(
    (
      totalGivenToDriver -
      (totalApprovedExpenses + totalApprovedReturns)
    ).toFixed(2),
  );

  return {
    totalGivenToDriver,
    totalApprovedExpenses,
    totalApprovedReturns,
    delta,
  };
});

const hasNonTerminalTransactions = computed(() => {
  const transactions = props.advance.transactions || [];
  return transactions.some(
    (tx: any) => !["PAID", "REJECTED", "CANCELLED"].includes(tx?.status),
  );
});

const isEligibleForSettlement = computed(() => {
  return (
    props.advance?.status === "PAID" &&
    (props.advance.transactions || []).length > 0 &&
    !hasNonTerminalTransactions.value &&
    metrics.value.delta === 0
  );
});

const settlementStatusMessage = computed(() => {
  if (props.advance?.status === "SETTLED") return "Advance already settled.";
  if (props.advance?.status !== "PAID")
    return "Advance must be in PAID status before settlement.";
  if (!(props.advance.transactions || []).length)
    return "No transactions found for this advance.";
  if (hasNonTerminalTransactions.value)
    return "All transactions must be terminal (PAID/REJECTED/CANCELLED) before settlement.";
  if (metrics.value.delta !== 0)
    return "Settlement is unbalanced. Delta must be zero.";
  return "Settlement is eligible.";
});

// --- Table Configuration ---
const columns: TableColumn<any>[] = [
  { key: "type", label: "Type", field: "type" },
  { key: "category", label: "Category", field: "category" },
  { key: "amount", label: "Amount", field: "amount" },
  { key: "approvedAmount", label: "Approved Amt", field: "approvedAmount" },
  { key: "status", label: "Status", field: "status" },
  { key: "photos", label: "Photos", field: "photos" },
  { key: "actions", label: "", field: "actions" },
];

// --- Photo Handling ---
const hasPhotos = (row: any) => {
  return (row.attachments && row.attachments.length > 0) || row.attachment;
};

const getAttachmentsCount = (row: any) => {
  let count = 0;
  if (row.attachments) count += row.attachments.length;
  if (row.attachment) count += 1;
  return count - 1;
};

const openPhotos = (row: any) => {
  const attachments = [...(row.attachments || [])];
  if (row.attachment) attachments.push(row.attachment);

  const fileURL = attachments[0];
  if (fileURL) {
    openModal("FileViewerModal", { fileURL: resolveFileUrl(fileURL) });
  }
};

const resolveFileUrl = (path: any) => {
  if (!path) return "";
  if (path instanceof File) return URL.createObjectURL(path);
  if (typeof path !== "string") return "";

  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const apiBase = (
    import.meta.env.v_STATIC_PATH ||
    import.meta.env.v_API_URL ||
    ""
  ).replace(/\/+$/, "");

  const normalized = path.replace(/\\/g, "/").replace(/^\/+/, "");
  return `${apiBase}/${normalized}`;
};

// --- Action Handling ---
const mutation = useMutation({
  mutationFn: ({ id, status, data }: { id: string; status: any; data?: any }) =>
    update_transaction_status(id, status, data),
  onSuccess: () => {
    toast.success("Transaction updated successfully");
    emit("refresh");
  },
  onError: (error: any) => {
    toast.error(
      error.response?.data?.description || "Failed to update transaction",
    );
  },
});

const handleAction = async (row: any, action: string) => {
  if (action === "approve") {
    const res = await openModal("ApprovalModal", {
      row: {
        ...row,
        advanceNumber: props.advance.advanceNumber,
        total: row.amount,
      },
    });

    if (res?.amount) {
      mutation.mutate({
        id: row._id,
        status: "approve",
        data: { approvedAmount: res.amount },
      });
    }
  } else if (action === "reject") {
    const confirm = await openModal("ConfirmationModal", {
      title: "Confirm Rejection",
      message: "Are you sure you want to reject this transaction?",
      confirmText: "Yes, Reject",
      action: "reject",
    });

    if (confirm) {
      mutation.mutate({ id: row._id, status: "reject" });
    }
  } else if (action === "authorize") {
    const confirm = await openModal("ConfirmationModal", {
      title: "Authorize Transaction",
      message:
        "Are you sure you want to authorize this transaction for payment?",
      confirmText: "Authorize",
      action: "authorize",
    });

    if (confirm) {
      mutation.mutate({ id: row._id, status: "authorize" });
    }
  } else if (action === "pay") {
    const confirm = await openModal("ConfirmationModal", {
      title: "Confirm Payment",
      message: "Are you sure you want to mark this transaction as paid?",
      confirmText: "Confirm Payment",
      action: "pay",
    });

    if (confirm) {
      mutation.mutate({ id: row._id, status: "pay" });
    }
  } else {
    mutation.mutate({ id: row._id, status: action });
  }
};
</script>
