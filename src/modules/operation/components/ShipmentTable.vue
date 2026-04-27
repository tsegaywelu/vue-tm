<template>
  <Table
    :row_alignment="{
      driver: 'left',
      route: 'left',
      total: 'left',
      shipperIssueVoucher: 'left',
      actions: 'center',
    }"
    :head_alignment="{
      driver: 'left',
      route: 'left',
      total: 'left',
      shipperIssueVoucher: 'left',
      actions: 'center',
    }"
    id="shipment-list"
    :columns="columns"
    :rows="response"
    :search_placeholder="dynamicSearchPlaceholder"
    @row_click="handleAction($event, 'view')"
  >
    <template #search-prefix>
      <div
        class="h-full flex items-center border-r border-gray-200 pr-2 mr-2 w-48"
      >
        <Select
          class="[&_.custom-input]:border-none [&_.custom-input]:min-h-full min-w-48"
          v-model="selectedSearchField"
          :options="searchFieldOptions"
          label_key="label"
          value_key="value"
          :clearable="false"
        />
      </div>
    </template>
    <template #cell-shipmentCode="{ value }">
      <span class="font-bold">{{ value }}</span>
    </template>

    <template #cell-driver="{ row }">
      <div class="flex flex-col" v-if="row.vehicle">
        <span class="font-semibold text-base text-gray-900">
          {{ row?.vehicle?.plateNumber }}
        </span>
        <span class="text-gray-400 font-medium" v-if="row.driver">
          {{ row.driver.firstName }} {{ row.driver.lastName }}
        </span>
      </div>
      <span v-else class="text-gray-400 italic text-sm">Not Assigned</span>
    </template>

    <template #cell-route="{ row }">
      <div class="flex flex-col items-start" v-if="row.vehicle">
        <span class="font-bold text-base text-gray-900">
          {{ row.route.routeName }}
        </span>
        <span class="text-gray-400 font-medium">{{
          row.agent?.name || "-"
        }}</span>
      </div>
    </template>

    <template #cell-shipperIssueVoucher="{ value }">
      <div class="flex items-center gap-2">
        <span class="font-medium text-gray-500">{{
          value || "No Voucher"
        }}</span>
      </div>
    </template>

    <template #cell-dispatchDate="{ value }">
      <span class="text-base">
        {{ dateFormatter(value) }}
      </span>
    </template>

    <template #cell-total="{ row }">
      <div class="flex flex-col">
        <span class="text-base"
          >{{ numberFormatter(row?.waypointDistance) }} km</span
        >
        <span class="text-gray-400 font-medium" v-if="row.pricingType">
          {{ row.pricingType.type }} ({{
            currencyFormatter(row.pricingType.amount)
          }})
        </span>
      </div>
    </template>

    <template #after-search>
      <div
        class="items-center gap-4 inline-flex border-l border-grey-100 overflow-x-auto px-3"
      >
        <i v-html="icons.filter" />
        <ShipmentFilters
          @change="handleFilterChange"
          calendar-type="english"
          output-calendar-type="english"
        />
      </div>
    </template>

    <template #cell-status="{ value }">
      <Status :variant="value" type="wrapped">
        {{ value?.replace(/_/g, " ") }}
      </Status>
    </template>
    <template #cell-actions="{ row }">
      <div class="flex items-center justify-end">
        <Dropdown>
          <template #default="{ close }">
            <DropDownItem
              :icon="icons.eye"
              label="Details"
              @click.stop="
                handleAction(row, 'view');
                close();
              "
            />
            <DropDownItem
              :icon="icons.editIcon"
              label="Update Status"
              @click.stop="
                openStatusModal(row);
                close();
              "
            />
            <DropDownItem
              :icon="icons.plusIcon"
              label="Add Voucher"
              @click.stop="
                openVouchersModal(row);
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
import { computed, ref, watch } from "vue";
import Table from "@/components/common/Table.vue";
import Select from "@/components/common/Select.vue";
import Dropdown from "@/components/common/Dropdown.vue";
import DropDownItem from "@/components/common/DropDownItem.vue";
import { icons } from "@/utils/icons";
import { usePagination } from "@/composables/usePagination";
import type { ShipmentFilterParams, Shipment } from "../operation.types";
import type { TableColumn } from "@/components/common/Table.vue";
import ShipmentFilters from "./ShipmentFilters.vue";
import Status from "@/components/common/Status.vue";
import {
  currencyFormatter,
  dateFormatter,
  numberFormatter,
  ShipmentStatus,
} from "@/utils/utils";
import { openModal } from "@customizer/modal-x";
const props = defineProps<{
  filters?: ShipmentFilterParams;
}>();

const emit = defineEmits(["action"]);

const columns: TableColumn<Shipment>[] = [
  { key: "driver", label: "Driver / Vehicle", field: "driver" },
  { key: "route", label: "Route & Agent", field: "shipmentCode" },
  { key: "total", label: "Details", field: "detail" },
  {
    key: "shipperIssueVoucher",
    label: "Issue Voucher",
    field: "shipperIssueVoucher",
  },
  { key: "shipmentCode", label: "Shipment Code" },
  {
    key: "dispatchDate",
    label: "Dispatch Info",
    field: "dispatchDate",
  },
  { key: "status", label: "Status", field: "status" },
  { key: "actions", label: "Actions", field: "", cellAlign: "right" },
];

const activeFilters = ref<ShipmentFilterParams>({});
const { response, refetch } = usePagination<Shipment>({
  id: "shipment-list",
  url: "/shipment",
  params: computed(() => activeFilters.value),
});

const searchFieldOptions = [
  { label: "Plate Number", value: "vehiclePlateNumber" },
  { label: "Shipment Code", value: "shipmentCode" },
  { label: "Driver Name", value: "driverName" },
  { label: "Shipper Issue Voucher", value: "shipperIssueVoucher" },
  { label: "Agent Receive Voucher", value: "agentReceiveVoucher" },
  { label: "Agent Issue Voucher", value: "agentIssueVoucher" },
  { label: "Shipper Receive Voucher", value: "shipperReceiveVoucher" },
  { label: "Transporter Name", value: "transporterName" },
];

const selectedSearchField = ref("shipmentCode");

watch(selectedSearchField, (newField) => {
  activeFilters.value = { ...activeFilters.value, searchField: newField };
});

// Initialize the filter
activeFilters.value.searchField = selectedSearchField.value;

const dynamicSearchPlaceholder = computed(() => {
  const option = searchFieldOptions.find(
    (o) => o.value === selectedSearchField.value,
  );
  return option ? `Search by ${option.label}...` : "Search Shipments...";
});

const handleFilterChange = (newFilters: ShipmentFilterParams) => {
  activeFilters.value = {
    ...newFilters,
    selectedFilterOption: {
      value: selectedSearchField.value,
    },
  };
};

const handleAction = (row: Shipment, action: string) => {
  emit("action", { row, action });
};

const openStatusModal = (shipment: Shipment) => {
  openModal(
    "StatusChangeModal",
    {
      shipment,
      statusList: ShipmentStatus,
      statusListRaw: ShipmentStatus,
    },
    (res) => {
      if (res) refetch();
    },
  );
};

const openVouchersModal = (shipment: Shipment) => {
  openModal("VoucherModal", { shipment }, (res) => {
    if (res) refetch();
  });
};

defineExpose({ refetch });
</script>
