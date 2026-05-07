<template>
  <Table
    id="paid-sub-contracts-list"
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
    <template #cell-shipmentCode="{ value }">
      <span class="font-bold">{{ value || '-' }}</span>
    </template>

    <template #cell-transporter="{ row }">
      <span class="font-medium text-gray-700">
        {{ row.transporter?.name || '-' }}
      </span>
    </template>

    <template #cell-dispatchDate="{ value }">
      <span class="text-sm text-gray-600">
        {{ dateFormatter(value) }}
      </span>
    </template>

    <template #cell-plateNumber="{ row }">
      <span class="font-medium text-gray-700">
        {{ row.vehicle?.plateNumber || '-' }}
      </span>
    </template>

    <template #cell-driverName="{ row }">
      <span class="font-medium text-gray-700">
        {{ row.driver?.firstName || '-' }} {{ row.driver?.lastName || '' }}
      </span>
    </template>

    <template #cell-routeName="{ row }">
      <span class="text-sm text-gray-600">
        {{ row.route?.routeName || '-' }}
      </span>
    </template>

    <template #cell-totalPrice="{ value }">
      <span class="text-gray-900">{{ currencyFormatter(value) }}</span>
    </template>

    <template #cell-transporterPrice="{ value }">
      <span class="text-gray-900">{{ currencyFormatter(value) }}</span>
    </template>

    <template #cell-advanceAmount="{ value }">
      <span class="text-gray-900">{{ currencyFormatter(value) }}</span>
    </template>

    <template #cell-grossProfit="{ value }">
      <span class="font-bold text-gray-900">{{ currencyFormatter(value) }}</span>
    </template>

    <template #extra-actions>
      <div class="items-center gap-4 inline-flex border-l border-grey-100 overflow-x-auto px-3">
        <i v-html="icons.filter" />
        <PaidSubContractsFilters @change="handleFilterChange" />
      </div>
    </template>

    <template #cell-actions="{ row }">
      <div class="flex items-center justify-end">
        <Dropdown>
          <template #default="{ close }">
            <DropDownItem v-permission="'TRANSACTION:read'"
              :icon="icons.eye"
              label="Details"
              @click.stop="
                handleAction(row, 'view');
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
import Select from "@/components/common/Select.vue";
import Dropdown from "@/components/common/Dropdown.vue";
import DropDownItem from "@/components/common/DropDownItem.vue";
import { icons } from "@/utils/icons";
import { usePagination } from "@/composables/usePagination";
import type { TableColumn } from "@/components/common/Table.vue";
import PaidSubContractsFilters from "./PaidSubContractsFilters.vue";
import { currencyFormatter, dateFormatter } from "@/utils/utils";

const emit = defineEmits(["action"]);

const columns: TableColumn<any>[] = [
  { key: "shipmentCode", label: "Shipment", field: "shipmentCode" },
  { key: "transporter", label: "Transporter", field: "transporter" },
  { key: "dispatchDate", label: "Dispatch Date", field: "dispatchDate" },
  { key: "plateNumber", label: "Plate Number", field: "vehicle" },
  { key: "driverName", label: "Driver", field: "driver" },
  { key: "routeName", label: "Route", field: "route" },
  { key: "totalPrice", label: "Total Price", field: "totalPrice" },
  { key: "transporterPrice", label: "Transporter Price", field: "transporterPrice" },
  { key: "advanceAmount", label: "Advance", field: "prePayments" },
  { key: "grossProfit", label: "Gross Profit", field: "grossProfit" },
  { key: "actions", label: "Actions", field: "", cellAlign: "right" },
];

const searchFieldOptions = [
  { label: "Shipment Code", value: "shipmentCode" },
  { label: "Plate Number", value: "vehiclePlateNumber" },
  { label: "First Name", value: "driverFirstName" },
  { label: "Middle Name", value: "driverMiddleName" },
  { label: "Issue Voucher", value: "shipperIssueVoucher" },
  { label: "Transporter", value: "transporterName" },
];

const selectedSearchField = ref("shipmentCode");
const searchTerm = ref("");

const dynamicSearchPlaceholder = computed(() => {
  const option = searchFieldOptions.find(
    (o) => o.value === selectedSearchField.value,
  );
  return option ? `Search by ${option.label}...` : "Search...";
});

const activeFilters = ref<any>({});

const { response, refetch } = usePagination<any>({
  id: "paid-sub-contracts-list",
  url: "/shipment/payableShipmentsPaid",
  params: computed(() => {
    const params: any = { ...activeFilters.value };
    if (searchTerm.value) {
      params[`${selectedSearchField.value}[regexAny]`] = searchTerm.value;
      params.q = undefined;
    }
    return params;
  }),
});

const handleFilterChange = (newFilters: any) => {
  activeFilters.value = newFilters;
};

const handleAction = (row: any, action: string) => {
  emit("action", { row, action });
};

defineExpose({ refetch });
</script>
