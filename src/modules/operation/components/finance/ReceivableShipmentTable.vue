<template>
  <div class="flex flex-col gap-4">
    <!-- Summary Cards -->
    <!-- <div v-if="summary" class="grid grid-cols-1 md:grid-cols-3 gap-4 px-2">
      <div 
        v-for="item in summaryItems" 
        :key="item.label"
        class="bg-white p-4 rounded-xl border border-grey-100 shadow-sm flex flex-col gap-1"
      >
        <span class="text-xs font-medium text-grey-500">{{ item.label }}</span>
        <div class="flex items-baseline gap-2">
          <span class="text-xl font-bold text-grey-900">{{ item.value }}</span>
          <span class="text-xs text-grey-400">{{ item.count }} Trips</span>
        </div>
      </div>
    </div> -->
    <CheckTable
      id="receivable-shipment-list"
      :columns="columns"
      :rows="response"
      url="/shipment/receivableShipment"
      v-model="selectionModel"
      :loading="isLoading"
      @row_click="handleAction($event, 'view')"
      :search_placeholder="dynamicSearchPlaceholder"
    >
      <template #search-prefix>
        <div
          class="h-full flex items-center border-r border-gray-200 pr-2 mr-2"
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
      <template #cell-shipmentCode="{ value }">
        <span class="font-bold text-primary">{{ value || "-" }}</span>
      </template>

      <template #cell-dispatchDate="{ value }">
        <span class="text-sm text-gray-600">
          {{ dateFormatter(value) }}
        </span>
      </template>

      <template #cell-route="{ row }">
        <span class="font-medium text-gray-700">
          {{ row.route?.routeName || "-" }}
        </span>
      </template>

      <template #cell-agent="{ row }">
        <span class="font-medium text-gray-700">
          {{ row.agent?.name || "-" }}
        </span>
      </template>

      <template #cell-vehicle="{ row }">
        <span class="font-medium text-gray-700">
          {{ row.vehicle?.plateNumber || "-" }}
        </span>
      </template>

      <template #cell-driver="{ row }">
        <span class="font-medium text-gray-700" v-if="row.driver">
          {{ row.driver.firstName }} {{ row.driver.lastName }}
        </span>
        <span v-else>-</span>
      </template>

      <template #cell-totalPrice="{ value }">
        <span class="font-bold text-gray-900">
          {{ currencyFormatter(value) }}
        </span>
      </template>

      <template #cell-areDocumentsUploaded="{ value }">
        <Status :variant="value ? 'uploaded' : 'pending'" type="wrapped">
          {{ value ? "Uploaded" : "Pending" }}
        </Status>
      </template>

      <template #after-search>
        <div
          class="items-center gap-4 inline-flex border-l border-grey-100 overflow-x-auto px-3"
        >
          <i v-html="icons.filter" />
          <!-- <ReceivableShipmentFilters @change="handleFilterChange" /> -->
          <ShipmentFilters @change="handleFilterChange" />
        </div>
      </template>

      <template #cell-actions="{ row }">
        <div class="flex items-center justify-center">
          <button
            type="button"
            v-permission="'TRANSACTION:read'"
            class="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-primary"
            @click.stop="handleAction(row, 'view')"
            title="Details"
          >
            <i v-html="icons.eye"></i>
          </button>
        </div>
      </template>
    </CheckTable>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import CheckTable from "@/components/common/CheckTable.vue";
import Status from "@/components/common/Status.vue";
import { icons } from "@/utils/icons";
import { usePagination } from "@/composables/usePagination";
import type { TableColumn } from "@/components/common/Table.vue";
import ShipmentFilters from "../ShipmentFilters.vue";
// import ReceivableShipmentFilters from "./ReceivableShipmentFilters.vue";
import Select from "@/components/common/Select.vue";
import { currencyFormatter, dateFormatter } from "@/utils/utils";

const props = defineProps<{
  selection?: any[];
  dateRange?: { start: string; end: string };
}>();

const emit = defineEmits(["action", "update:selection"]);

const columns: TableColumn<any>[] = [
  { key: "shipmentCode", label: "Shipment Code", field: "shipmentCode" },
  { key: "dispatchDate", label: "Dispatch Date", field: "dispatchDate" },
  { key: "route", label: "Route", field: "route" },
  { key: "agent", label: "Agent", field: "agent" },
  {
    key: "shipperIssueVoucher",
    label: "Issue Voucher",
    field: "shipperIssueVoucher",
  },
  { key: "vehicle", label: "Vehicle", field: "vehicle" },
  { key: "driver", label: "Driver", field: "driver" },
  { key: "totalPrice", label: "Total", field: "totalPrice" },
  {
    key: "areDocumentsUploaded",
    label: "Documents",
    field: "areDocumentsUploaded",
  },
  { key: "actions", label: "Actions", field: "", cellAlign: "right" },
];

const searchFieldOptions = [
  { label: "Issue Voucher", value: "shipperIssueVoucher" },
  { label: "Shipper Receive Voucher", value: "agentReceiveVoucher" },
  { label: "Plate Number", value: "vehiclePlateNumber" },
  { label: "Shipment Code", value: "shipmentCode" },
  { label: "First Name", value: "driverFirstName" },
  { label: "Middle Name", value: "driverMiddleName" },
];

const selectedSearchField = ref("shipperIssueVoucher");

const dynamicSearchPlaceholder = computed(() => {
  const option = searchFieldOptions.find(
    (o) => o.value === selectedSearchField.value,
  );
  return option ? `Search by ${option.label}...` : "Search...";
});

const activeFilters = ref<Record<string, any>>({});

// activeFilters.value.searchField = selectedSearchField.value;

watch(selectedSearchField, (newField) => {
  activeFilters.value = { ...activeFilters.value };
});

const selectionModel = computed({
  get: () => props.selection || [],
  set: (val) => emit("update:selection", val),
});

const { response, fullResponse, refetch, isLoading } = usePagination<any>({
  id: "receivable-shipment-list",
  url: "/shipment/receivableShipment",
  params: (state) => ({
    [selectedSearchField.value]: state.search || "",
    ...activeFilters.value,
    ...(props.dateRange?.start
      ? { dispatchStartDate: props.dateRange.start }
      : {}),
    ...(props.dateRange?.end ? { dispatchEndDate: props.dateRange.end } : {}),
    q: undefined,
  }),
});

watch(
  () => props.dateRange,
  () => {
    refetch();
  },
  { deep: true },
);

const summary = computed(() => fullResponse.value?.result?.summary);

const summaryItems = computed(() => {
  if (!summary.value) return [];
  return [
    {
      label: "Total Receivable",
      fullLabel: `Total Receivable - ${summary.value.countAll} Trips`,
      value: currencyFormatter(summary.value.totalAll),
      rawValue: summary.value.totalAll,
      icon: "mdi-cash",
    },
    {
      label: "Uploaded",
      fullLabel: `Uploaded - ${summary.value.countWithDocuments} Trips`,
      value: currencyFormatter(summary.value.totalWithDocuments),
      rawValue: summary.value.totalWithDocuments,
      icon: "mdi-cash-check",
    },
    {
      label: "Not Uploaded",
      fullLabel: `Not Uploaded - ${summary.value.countWithoutDocuments} Trips`,
      value: currencyFormatter(summary.value.totalWithoutDocuments),
      rawValue: summary.value.totalWithoutDocuments,
      icon: "mdi-cash-remove",
    },
  ];
});

const handleFilterChange = (newFilters: any) => {
  activeFilters.value = { ...newFilters };
};

const handleAction = (row: any, action: string) => {
  emit("action", { row, action });
};

defineExpose({ refetch, summaryItems, response });
</script>
