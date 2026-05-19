<template>
  <Table
    id="payable-list"
    :columns="columns"
    :rows="response"
    v-model:search_value="searchTerm"
    :search_placeholder="dynamicSearchPlaceholder"
    @row_click="handleAction($event, 'view')"
  >
    <template #search-prefix>
      <div
        class="h-full flex items-center border-r border-gray-200 pr-2 mr-2 w-48"
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

    <template #cell-status="{ value }">
      <Status :variant="value" type="wrapped">
        {{ value?.replace(/_/g, " ") }}
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
      <span class="text-sm text-gray-600">
        {{ dateFormatter(value) }}
      </span>
    </template>

    <template #after-search>
      <div
        class="items-center gap-4 inline-flex border-l border-grey-100 overflow-x-auto px-3"
      >
        <i v-html="icons.filter" />
        <PayableFilters
          @change="handleFilterChange"
          pagination-id="payable-list"
        />
      </div>
    </template>

    <template #cell-actions="{ row }">
      <div class="flex items-center justify-end">
        <Dropdown>
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
              label="Pay"
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
  </Table>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import Table from "@/components/common/Table.vue";
import Dropdown from "@/components/common/Dropdown.vue";
import DropDownItem from "@/components/common/DropDownItem.vue";
import Status from "@/components/common/Status.vue";
import Select from "@/components/common/Select.vue";
import { icons } from "@/utils/icons";
import { usePagination } from "@/composables/usePagination";
import { openModal } from "@customizer/modal-x";
import type { TableColumn } from "@/components/common/Table.vue";
import PayableFilters from "./PayableFilters.vue";
import { formatType, getPaidTo } from "./payableUtils";
import { currencyFormatter, dateFormatter } from "@/utils/utils";

const emit = defineEmits(["action"]);

const props = defineProps<{
  filters?: Record<string, any>;
}>();

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

const dynamicSearchPlaceholder = computed(() => {
  const option = searchFieldOptions.find(
    (o) => o.value === selectedSearchField.value,
  );
  return option ? `Search by ${option.label}...` : "Search...";
});

const activeFilters = ref({ select: "all" });

const { response, refetch, fullResponse } = usePagination<any>({
  id: "payable-list",
  url: "/advance-payment/allPayables",
  params: computed(() => {
    const params: any = { ...activeFilters.value, ...props.filters };
    if (searchTerm.value) {
      params[`${selectedSearchField.value}`] = searchTerm.value;
      params.q = undefined;
    }
    return params;
  }),
});

const handleFilterChange = (newFilters: any) => {
  activeFilters.value = { ...newFilters };
};

const canAction = (row: any, action: string) => {
  const status = row.status || row.payableStatus;

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

defineExpose({ refetch, fullResponse, response });
</script>
