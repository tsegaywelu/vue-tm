<template>
  <!-- Mobile: filter icon next to page title -->
  <Teleport to="#page-title-actions" defer>
    <button
      class="sm:hidden size-8 rounded-xl border border-line flex items-center justify-center text-faint-text hover:bg-surface-hover transition-colors"
      @click="mobileSearchOpen = true"
    >
      <i class="*:size-4" v-html="icons.filterOptions"></i>
    </button>
  </Teleport>

  <!-- Mobile: search field picker sheet -->
  <BottomSheet v-model="mobileSearchOpen" title="Search By">
    <div class="flex flex-col py-2 px-4 gap-1">
      <button
        v-for="opt in searchFieldOptions"
        :key="opt.value"
        class="flex items-center justify-between py-3 px-2 hover:bg-surface-hover rounded-xl transition-colors"
        @click="selectedSearchField = opt.value; mobileSearchOpen = false"
      >
        <span class="font-medium">{{ opt.label }}</span>
        <i
          v-if="selectedSearchField === opt.value"
          class="*:size-4 text-primary"
          v-html="icons.check"
        ></i>
      </button>
    </div>
  </BottomSheet>

  <Table
    id="shipment-adjustment-list"
    :columns="columns"
    :rows="response"
    :search_placeholder="dynamicSearchPlaceholder"
    :on_sm_screen_column_span="{ shipmentCode: 2, route: 2, issueVoucher: 3, driver: 2 }"
    @row_click="
      (row) => $router.push(`/operation/shipments/${row.shipment?._id}`)
    "
  >
    <template #search-prefix>
      <div
        class="hidden sm:flex h-full items-center border-r border-line pr-2 mr-2 w-40 md:w-48"
      >
        <SearchFieldSelect
          v-model="selectedSearchField"
          pagination-id="shipment-adjustment-list"
          :options="searchFieldOptions"
          select-class="[&_.input-focus]:shadow-none! [&_.input-focus]:border-none [&_.input-focus]:min-h-full min-w-48"
        />
      </div>
    </template>
    <template #cell-shipmentCode="{ row }">
      <span class="font-bold">{{ row.shipment?.shipmentCode }}</span>
    </template>

    <template #cell-dispatchDate="{ row }">
      <span class="text-base">
        {{ row.shipment?.dispatchDate?.split("T")[0] || "-" }}
      </span>
    </template>

    <template #cell-route="{ row }">
      <span class="text-base">
        {{ row.shipment?.route?.routeName || "-" }}
      </span>
    </template>

    <template #cell-freightOrder="{ row }">
      <span class="text-base truncate max-w-[15ch] block">
        {{ row.shipment?.freightOrder || "-" }}
      </span>
    </template>

    <template #cell-issueVoucher="{ row }">
      <span class="text-base truncate max-w-[15ch] block">
        {{ row.shipment?.shipperIssueVoucher || "-" }}
      </span>
    </template>

    <template #cell-vehicle="{ row }">
      <span class="text-base">
        {{ row.shipment?.vehicle?.plateNumber || "-" }}
      </span>
    </template>

    <template #cell-driver="{ row }">
      <span class="text-base" v-if="row.shipment?.driver">
        {{ row.shipment.driver.firstName }}
        {{ row.shipment.driver.middleName || "" }}
        {{ row.shipment.driver.lastName || "" }}
      </span>
      <span v-else class="text-gray-400 italic text-sm">-</span>
    </template>
  </Table>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import Table from "@/components/common/Table.vue";
import type { TableColumn } from "@/components/common/Table.vue";
import { usePagination, useTableLastMeta } from "@/composables/usePagination";
import SearchFieldSelect from "@/components/common/SearchFieldSelect.vue";
import BottomSheet from "@/components/BottomSheet.vue";
import { icons } from "@/utils/icons";

const mobileSearchOpen = ref(false);

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
const lastMeta = useTableLastMeta("shipment-adjustment-list");
const selectedSearchField = ref(
  (lastMeta.value.searchField as string | undefined) || "vehiclePlateNumber",
);

const dynamicSearchPlaceholder = computed(() => {
  const option = searchFieldOptions.find((o) => o.value === selectedSearchField.value);
  return option ? `Search by ${option.label}...` : "Search...";
});

const columns: TableColumn[] = [
  {
    key: "shipmentCode",
    label: "Shipment Code",
    field: "shipment.shipmentCode",
  },
  {
    key: "dispatchDate",
    label: "Dispatch Date",
    field: "shipment.dispatchDate",
  },
  { key: "route", label: "Route", field: "shipment.route.routeName" },
  {
    key: "freightOrder",
    label: "Freight Order",
    field: "shipment.freightOrder",
  },
  {
    key: "issueVoucher",
    label: "Issue Voucher",
    field: "shipment.shipperIssueVoucher",
  },
  { key: "vehicle", label: "Vehicle", field: "shipment.vehicle.plateNumber" },
  { key: "driver", label: "Driver", field: "shipment.driver" },
];

const { response, refetch } = usePagination({
  id: "shipment-adjustment-list",
  url: "/shipment/shipmentAdjustments",
  params(state) {
    return {
      ...(state.search
        ? {
            [selectedSearchField.value]: state.search,
          }
        : {}),
      q: undefined,
    };
  },
});

defineExpose({ refetch });
</script>
