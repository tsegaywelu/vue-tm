<template>
  <!-- Mobile: filter icon next to page title -->
  <Teleport to="#page-title-actions" defer>
    <button
      class="size-8 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
      @click="mobileTypeOpen = true"
    >
      <i class="*:size-4" v-html="icons.filterOptions"></i>
    </button>
  </Teleport>

  <!-- Mobile: type picker sheet -->
  <BottomSheet v-model="mobileTypeOpen" title="Filter By">
    <div class="flex flex-col py-2 px-4 gap-1">
      <button
        v-for="opt in typeOptions"
        :key="opt.value"
        class="flex items-center justify-between py-3 px-2 hover:bg-gray-50 rounded-xl transition-colors"
        @click="
          selectedType = opt.value;
          mobileTypeOpen = false;
        "
      >
        <span class="font-medium">{{ opt.label }}</span>
        <i
          v-if="selectedType === opt.value"
          class="*:size-4 text-primary"
          v-html="icons.check"
        ></i>
      </button>
    </div>
  </BottomSheet>

  <Table
    id="approval-requests"
    :columns="columns"
    :rows="response"
    search_placeholder="Search by Ref. Number..."
    :on_sm_screen_column_span="{
      advanceNumber: 2,
      payableType: 2,
      paidTo: 2,
      route: 2,
      actions: 2,
    }"
  >
    <template #search-prefix>
      <div
        class="hidden sm:flex h-full items-center border-r border-gray-200 pr-2 mr-2 w-48"
      >
        <Select
          class="[&_.input-focus]:shadow-none! [&_.input-focus]:border-none [&_.input-focus]:min-h-full min-w-48"
          v-model="selectedType"
          :options="typeOptions"
          label_key="label"
          value_key="value"
          :clearable="false"
        />
      </div>
    </template>

    <template #after-search>
      <div
        class="[&_.input-focus]:bg-grey-25 min-h-16 flex-1 items-center gap-4 inline-flex overflow-x-auto px-3"
      >
        <Select
          label="Origin"
          size="xs"
          name="routeOrigin"
          v-model="origin"
          :url="`/route`"
          label_key="routeName"
          value_key="destination"
          searchable
          class="min-w-48"
          multiple
          :attributes="{
            placeholder: 'Origins',
          }"
        />
        <Select
          label="Destination"
          size="xs"
          name="routeDestination"
          v-model="destination"
          :url="`/route`"
          label_key="routeName"
          value_key="destination"
          :attributes="{
            placeholder: 'Destinations',
          }"
          class="min-w-48"
          searchable
          multiple
        />
      </div>
    </template>

    <!-- Custom Cells -->
    <template #cell-advanceNumber="{ value }">
      <span class="font-bold text-gray-900">{{ value || "-" }}</span>
    </template>

    <template #cell-payableType="{ value }">
      <div
        class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider w-fit"
        :class="typeClasses[value] || 'bg-gray-100 text-gray-500'"
      >
        {{ formatType(value) }}
      </div>
    </template>

    <template #cell-paidTo="{ row }">
      <div class="flex flex-col text-sm">
        <span class="font-semibold text-gray-900" v-if="row.driver">
          {{ getPaidTo(row) }}
        </span>
        <span v-else class="text-gray-400 italic">-</span>
      </div>
    </template>

    <template #cell-createdAt="{ value }">
      <span class="text-gray-600 text-sm">
        {{ formatDate(value) }}
      </span>
    </template>

    <template #cell-route="{ row }">
      <span class="text-sm">{{ row.route?.name || "-" }}</span>
    </template>

    <template #cell-totalFuelAdvances="{ value }">
      <span class="text-sm font-medium">
        {{ currencyFormatter(value || 0) }}
      </span>
    </template>

    <template #cell-totalPerDiemExpenses="{ value }">
      <span class="text-sm font-medium">
        {{ currencyFormatter(value || 0) }}
      </span>
    </template>

    <template #cell-totalOtherExpenses="{ value }">
      <span class="text-sm font-medium">
        {{ currencyFormatter(value || 0) }}
      </span>
    </template>

    <template #cell-total="{ value }">
      <span class="font-bold text-gray-900">
        {{ currencyFormatter(value || 0) }}
      </span>
    </template>

    <template #cell-actions="{ row }">
      <div class="flex justify-end">
        <Dropdown>
          <template #trigger>
            <button class="p-1 hover:bg-gray-100 rounded-lg transition-colors">
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
              <button
                @click="
                  handleRowClick(row);
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
                View Details
              </button>

              <div class="h-px bg-gray-100 my-1"></div>

              <button
                @click="
                  handleApproveClick(row);
                  close();
                "
                class="flex items-center w-full px-4 py-2 text-sm text-green-600 hover:bg-green-50 transition-colors"
              >
                Approve
              </button>
              <button
                @click="
                  handleRejectClick(row);
                  close();
                "
                class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                Reject
              </button>
              <template v-if="normalizeAttachments(row).length">
                <div class="h-px bg-gray-100 my-1"></div>
                <button
                  @click="
                    handlePhotosClick(row);
                    close();
                  "
                  class="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <i class="*:size-4" v-html="icons.file"></i>
                  Photos ({{ normalizeAttachments(row).length }})
                </button>
              </template>
            </div>
          </template>
        </Dropdown>
      </div>
    </template>
  </Table>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import Table from "@/components/common/Table.vue";
import Button from "@/components/common/Button.vue";
import Select from "@/components/common/Select.vue";
import Dropdown from "@/components/common/Dropdown.vue";
import BottomSheet from "@/components/BottomSheet.vue";
import { usePagination } from "@/composables/usePagination";
import { currencyFormatter } from "@/utils/utils";
import { icons } from "@/utils/icons";
import { openModal } from "@customizer/modal-x";
import type { ApprovalRequest } from "../operation.types";
import type { TableColumn } from "@/components/common/Table.vue";
import { getPaidTo } from "./finance/payableUtils";

function resolveFileUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://"))
    return encodeURI(path);
  const base = (import.meta.env.v_STATIC_PATH || "").replace(/\/+$/, "");
  const normalized = path.replace(/\\/g, "/").replace(/^\/+/, "");
  return `${base}/${encodeURI(normalized)}`;
}

function normalizeAttachments(row: any): string[] {
  if (!row) return [];
  const files: string[] = [];
  if (Array.isArray(row.attachments))
    files.push(...row.attachments.filter(Boolean));
  if (row.attachment) files.push(row.attachment);
  return [...new Set(files)].map(resolveFileUrl);
}

const props = defineProps<{}>();
const router = useRouter();

const emit = defineEmits(["action"]);

// --- Handlers ---
const handleRowClick = (row: any) => {
  if (row.advancePaymentId) {
    router.push(`/operation/advance-details/${row.advancePaymentId}`);
  }
};

const handleApproveClick = async (row: any) => {
  const res = await openModal("ApprovalModal", {
    row,
  });

  if (res?.amount) {
    emit("action", { row, action: "approve", amount: res.amount });
  }
};

const handlePhotosClick = (row: any) => {
  const files = normalizeAttachments(row);
  if (!files.length) return;
  openModal("FileViewerModal", { files });
};

const handleRejectClick = async (row: any) => {
  const res = await openModal("ConfirmationModal", {
    title: "Confirm Rejection",
    message: `Are you sure you want to reject the request ${row.advanceNumber}?`,
    confirmText: "Yes, Reject",
    action: "reject",
  });

  if (res) {
    emit("action", { row, action: "reject" });
  }
};

// --- Filters State ---
const typeOptions = [
  { label: "All", value: "all" },
  { label: "Advance", value: "advance" },
  { label: "Pre Payment", value: "prePayment" },
  { label: "Transaction", value: "transaction" },
];

const mobileTypeOpen = ref(false);
const selectedType = ref("all");
const origin = ref("");
const destination = ref("");

const activeFilters = computed(() => ({
  select: selectedType.value || undefined,
  routeOrigin: origin.value || undefined,
  routeDestination: destination.value || undefined,
}));

// --- Columns Definition ---
const columns: TableColumn<ApprovalRequest>[] = [
  { key: "advanceNumber", label: "Ref. Number", field: "advanceNumber" },
  { key: "payableType", label: "Type of Payment", field: "payableType" },
  { key: "paidTo", label: "Paid To", field: "driver" },
  { key: "createdAt", label: "Date", field: "createdAt" },
  { key: "shipmentCode", label: "Shipment", field: "shipmentCode" },
  { key: "route", label: "Route", field: "route" },
  { key: "plateNumber", label: "Vehicle", field: "plateNumber" },
  {
    key: "totalFuelAdvances",
    label: "Fuel Advance",
    field: "totalFuelAdvances",
  },
  {
    key: "totalPerDiemExpenses",
    label: "Perdiem Advance",
    field: "totalPerDiemExpenses",
  },
  {
    key: "totalOtherExpenses",
    label: "Other Advance",
    field: "totalOtherExpenses",
  },
  { key: "total", label: "Total", field: "total" },
  { key: "actions", label: "Action", field: "", cellAlign: "right" },
];

// --- Pagination & Data Fetching ---
const { response, setPage, refetch } = usePagination<ApprovalRequest>({
  id: "approval-requests",
  url: "/advance-payment/allApprovalRequests",
  params: (state) => {
    return {
      ...activeFilters.value,
      vehiclePlateNumber: state.search || undefined,
      q: undefined,
    };
  },
});

const formatDate = (val: string) => {
  return val ? val.split("T")[0] : "-";
};

const formatType = (val: string) => {
  if (!val) return "-";
  return val.replace(/([A-Z])/g, " $1").trim();
};

const typeClasses: Record<string, string> = {
  advancePayment: "bg-blue-50 text-blue-600",
  transactions: "bg-purple-50 text-purple-600",
  prePayments: "bg-orange-50 text-orange-600",
  vehicleLeaseAgreement: "bg-teal-50 text-teal-600",
};

// Expose refetch for the parent container
defineExpose({
  refetch,
});
</script>
