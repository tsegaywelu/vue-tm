<template>
  <MobileTableOptions
    v-model="selectedSearchField"
    :options="searchFieldOptions"
    title="Search By"
  />
  <SelectModeToggle v-model="selectMode" />

  <!-- Mobile "Select all" — the card layout has no table header, so surface the
       select-all action in the Options sheet while in select mode (desktop uses
       the table header checkbox). -->
  <Teleport
    v-if="mobileOptions.mounted && mobileOptions.open && selectMode"
    :to="`#${mobileOptions.actionsId}`"
    defer
  >
    <button
      class="flex items-center gap-3 px-4 py-3.5 hover:bg-surface-hover transition-colors text-left"
      @click="toggleSelectAll"
    >
      <i class="*:size-5 shrink-0 text-gray-500" v-html="icons.duplicate"></i>
      <div class="flex flex-col flex-1">
        <span class="font-medium text-gray-900">
          {{ allLoadedSelected ? "Clear all" : "Select all" }}
        </span>
        <span class="text-xs text-gray-400 mt-0.5">
          {{ selectedPayables.length }} of {{ loadedRows.length }} selected
        </span>
      </div>
    </button>
  </Teleport>

  <CheckTable
    ref="checkTableRef"
    :key="`payable-${activeFilters.select}-${props.filters?.startDate}`"
    id="payable-list"
    v-model="selectedPayables"
    :columns="columns"
    :rows="response"
    :loading="isLoading || isFetching"
    :canBeSelected="!isMobile || selectMode"
    v-model:search_value="searchTerm"
    :search_placeholder="dynamicSearchPlaceholder"
    :on_sm_screen_column_span="{ advanceNumber: 2, shipmentCode: 2, status: 2, payableType: 3, paidTo: 3, route: 3, totalFuelAdvances: 3, totalPerDiemExpenses: 3, totalOtherExpenses: 3, transporterPrice: 3, purchaseCost: 3, total: 3 }"
    @selection-change="handleSelectionChange"
  >
    <template #search-prefix>
      <div
        class="hidden sm:flex h-full items-center border-r border-line pr-2 mr-2 w-48"
      >
        <Select
          class="[&_.input-focus]:shadow-none! [&_.input-focus]:border-none [&_.input-focus]:min-h-full min-w-48"
          v-model="selectedSearchField"
          :options="searchFieldOptions"
          label_key="label"
          value_key="value"
          :clearable="false"
        />
      </div>
    </template>
    <template #cell-advanceNumber="{ value }">
      <span class="font-bold">{{ value || "-" }}</span>
    </template>

    <template #cell-payableType="{ value }">
      <div
        class="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider w-fit"
        :class="typeClasses[value] || 'bg-gray-100 text-gray-500'"
      >
        {{ formatType(value) }}
      </div>
    </template>

    <template #cell-paidTo="{ row }">
      <span class="text-sm text-gray-700 font-medium">
        {{ getPaidTo(row) }}
      </span>
    </template>

    <template #cell-plateNumber="{ value }">
      <span class="text-sm text-gray-600">{{ value || "-" }}</span>
    </template>

    <template #cell-route="{ row }">
      <span class="font-medium text-gray-700">
        {{ row.route?.name || "-" }}
      </span>
    </template>

    <template #cell-shipmentCode="{ value }">
      <span class="text-sm text-gray-600">{{ value || "-" }}</span>
    </template>

    <template #cell-total="{ value }">
      <span class="font-bold text-gray-900">
        {{ currencyFormatter(value) }}
      </span>
    </template>

    <template #cell-status="{ value, row }">
      <Status :variant="row.payableType === 'shipments' ? row.payableStatus : value" type="wrapped">
        {{ (row.payableType === 'shipments' ? row.payableStatus : value)?.replace(/_/g, " ") }}
      </Status>
    </template>

    <template #cell-totalFuelAdvances="{ value }">
      <span class="text-sm text-gray-600">{{
        currencyFormatter(value || 0)
      }}</span>
    </template>

    <template #cell-totalPerDiemExpenses="{ value }">
      <span class="text-sm text-gray-600">{{
        currencyFormatter(value || 0)
      }}</span>
    </template>

    <template #cell-totalOtherExpenses="{ value }">
      <span class="text-sm text-gray-600">{{
        currencyFormatter(value || 0)
      }}</span>
    </template>

    <template #cell-transporterPrice="{ value }">
      <span class="text-sm text-gray-600">{{
        currencyFormatter(value || 0)
      }}</span>
    </template>

    <template #cell-purchaseCost="{ row }">
      <span class="text-sm text-gray-600">{{
        currencyFormatter(row.payableType === "purchaseOrder" ? row.total : 0)
      }}</span>
    </template>

    <template #cell-createdAt="{ value }">
      <div class="flex flex-col gap-1 *:truncate">
        <span class="text-sm text-gray-600">{{ isoDate(value) }}</span>
        <span class="text-xs text-gray-400">{{ isoTime(value) }}</span>
      </div>
    </template>

    <template #after-search>
      <div
        class="items-center gap-4 flex overflow-x-auto"
      >
        <PayableFilters
          @change="handleFilterChange"
          pagination-id="payable-list"
        />
      </div>
    </template>

    <template #cell-actions="{ row }">
      <div class="flex items-center justify-end">
        <Dropdown title="Actions">
          <template #default="{ close }">
            <!-- <DropDownItem
              v-if="canAction(row, 'reject')"
              :icon="icons.x"
              label="Reject"
              class="text-orange-600"
              @click.stop="
                handleAction(row, 'reject');
                close();
              "
            /> -->
            <DropDownItem
              v-permission="'TRANSACTION:read'"
              :icon="icons.eye"
              label="Details"
              @click.stop="
                handleAction(row, 'view');
                close();
              "
            />
            <DropDownItem
              v-permission="'ADVANCE_PAYMENT:pay'"
              v-if="canAction(row, 'pay')"
              class="text-green-600"
              :label="row.payableType === 'vehicleLeaseAgreement' || row.payableType === 'vehicleLeaseAgreements' ? 'Settle' : 'Pay'"
              @click.stop="
                handleAction(row, 'pay');
                close();
              "
            />
            <DropDownItem
              v-permission="'ADVANCE_PAYMENT:authorize'"
              v-if="canAction(row, 'authorize')"
              class="text-green-600"
              label="Authorize"
              @click.stop="
                handleAction(row, 'authorize');
                close();
              "
            />
            <DropDownItem
              v-permission="'ADVANCE_PAYMENT:update'"
              v-if="canAction(row, 'cancel')"
              :icon="icons.x"
              label="Cancel"
              class="text-red-600"
              @click.stop="
                handleAction(row, 'cancel');
                close();
              "
            />
          </template>
        </Dropdown>
      </div>
    </template>
  </CheckTable>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import CheckTable from "@/components/common/CheckTable.vue";
import Dropdown from "@/components/common/Dropdown.vue";
import DropDownItem from "@/components/common/DropDownItem.vue";
import Status from "@/components/common/Status.vue";
import Select from "@/components/common/Select.vue";
import MobileTableOptions from "@/components/common/MobileTableOptions.vue";
import SelectModeToggle from "@/components/common/SelectModeToggle.vue";
import { icons } from "@/utils/icons";
import { usePagination } from "@/composables/usePagination";
import { useIsMobile } from "@/composables/useIsMobile";
import { useMobileTableOptions } from "@/composables/useMobileTableOptions";
import { openModal } from "@customizer/modal-x";
import type { TableColumn } from "@/components/common/Table.vue";
import PayableFilters from "./PayableFilters.vue";
import { formatType, getPaidTo } from "./payableUtils";
import { currencyFormatter } from "@/utils/utils";

const isoDate = (val: string | Date) => {
  if (!val) return "-";
  const d = typeof val === "string" ? new Date(val) : val;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const isoTime = (val: string | Date) => {
  if (!val) return "";
  const d = typeof val === "string" ? new Date(val) : val;
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

const emit = defineEmits(["action", "selection-change"]);

const props = defineProps<{
  filters?: Record<string, any>;
}>();

const selectedPayables = ref<any[]>([]);

const handleSelectionChange = (selected: any[]) => {
  selectedPayables.value = selected;
  emit("selection-change", selected);
};

const columns: TableColumn<any>[] = [
  { key: "advanceNumber", label: "Code", field: "advanceNumber" },
  { key: "payableType", label: "Type of Payment", field: "payableType" },
  { key: "paidTo", label: "Paid To", field: "paidTo" },
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
  {
    key: "transporterPrice",
    label: "Transporter Price",
    field: "transporterPrice",
  },
  { key: "purchaseCost", label: "Purchase Cost", field: "purchaseCost" },
  { key: "total", label: "Total", field: "total" },
  { key: "status", label: "Status", field: "status" },
  { key: "actions", label: "Action", field: "", cellAlign: "right" },
];

const searchFieldOptions = [
  { label: "Plate Number", value: "vehiclePlateNumber" },
  { label: "Advance Number", value: "advanceNumber" },
  { label: "First Name", value: "driverFirstName" },
  { label: "Middle Name", value: "driverMiddleName" },
  { label: "Transporter Name", value: "transporterName" },
  { label: "Supplier Name", value: "supplier" },
];

const selectedSearchField = ref("vehiclePlateNumber");
const searchTerm = ref("");

// Mobile selection mode: below the `xl` breakpoint the card layout can only show
// the actions dropdown OR the checkbox in the card's top-right slot (CheckTable's
// canBeSelected swap). Desktop keeps both columns; mobile defaults to actions and
// flips to checkboxes when the user enters select mode.
const { isMobile } = useIsMobile(1280);
const selectMode = ref(false);
const mobileOptions = useMobileTableOptions();

watch(selectMode, (on) => {
  if (!on) {
    selectedPayables.value = [];
    emit("selection-change", []);
  }
});

// Mobile select-all: the card layout has no header checkbox, so this drives the
// "Select all / Clear all" action row in the Options sheet. It operates on every
// row loaded so far (mobile accumulates across infinite-scroll pages — `response`
// only holds the latest page), matched by `_id` (CheckTable's unique_key).
const checkTableRef = ref<any>(null);
const loadedRows = computed<any[]>(
  () => checkTableRef.value?.accumulatedRows ?? response.value,
);

const allLoadedSelected = computed(
  () =>
    loadedRows.value.length > 0 &&
    loadedRows.value.every((r: any) =>
      selectedPayables.value.some((s: any) => s._id === r._id),
    ),
);

const toggleSelectAll = () => {
  const next = allLoadedSelected.value ? [] : [...loadedRows.value];
  selectedPayables.value = next;
  emit("selection-change", next);
};

const dynamicSearchPlaceholder = computed(() => {
  const option = searchFieldOptions.find(
    (o) => o.value === selectedSearchField.value,
  );
  return option ? `Search by ${option.label}...` : "Search...";
});

const activeFilters = ref({ select: "all" });

const { response, refetch, fullResponse, isLoading, isFetching } = usePagination<any>({
  id: "payable-list",
  url: "/advance-payment/allPayables",
  params: (state) => {
    const params: any = { ...activeFilters.value, ...props.filters };
    if (state.search) {
      params[`${selectedSearchField.value}`] = state.search;
      params.q = undefined;
    }
    return params;
  },
});

const handleFilterChange = (newFilters: any) => {
  activeFilters.value = { ...newFilters };
  // Clear selections when filters change
  selectedPayables.value = [];
  emit("selection-change", []);
};

const canAction = (row: any, action: string) => {
  const status = row.payableType === "shipments" ? row.payableStatus : (row.status || row.payableStatus);

  if (action === "pay") {
    return status === "AUTHORIZED";
  }

  if (action === "authorize") {
    const pendingStatus =
      row.payableType === "shipments" || row.payableType === "purchaseOrder"
        ? "PENDING"
        : "APPROVED";
    return status === pendingStatus;
  }

  if (action === "cancel") {
    return status === "APPROVED" || status === "PENDING";
  }

  if (action === "approve") {
    return status === "PENDING";
  }

  if (action === "reject") {
    return status === "PENDING" || status === "APPROVED";
  }

  return false;
};

const handleAction = async (row: any, action: string) => {
  if (["authorize", "cancel", "pay", "approve"].includes(action)) {
    const displayId =
      row.advanceNumber || row.shipmentCode || row._id || "this item";
    const confirmed = await openModal("ConfirmationModal", {
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} Payable`,
      message: `Are you sure you want to ${action} this payable (${displayId})?`,
      action: action,
      confirmText: `Yes, ${action}`,
    });

    if (!confirmed) return;
  }

  emit("action", { row, action });
};

const typeClasses: Record<string, string> = {
  advance: "bg-blue-50 text-blue-600",
  transaction: "bg-purple-50 text-purple-600",
  prePayment: "bg-orange-50 text-orange-600",
  vehicleLeaseAgreements: "bg-teal-50 text-teal-600",
  shipment: "bg-green-50 text-green-600",
  purchaseOrders: "bg-indigo-50 text-indigo-600",
  // Fallbacks
  advancePayment: "bg-blue-50 text-blue-600",
  transactions: "bg-purple-50 text-purple-600",
  prePayments: "bg-orange-50 text-orange-600",
  vehicleLeaseAgreement: "bg-teal-50 text-teal-600",
  shipments: "bg-green-50 text-green-600",
  purchaseOrder: "bg-indigo-50 text-indigo-600",
};

defineExpose({ refetch, fullResponse, response, selectedPayables, isLoading, isFetching });
</script>
