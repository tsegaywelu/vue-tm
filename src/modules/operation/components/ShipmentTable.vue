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
  >
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
        <span class="text-gray-400 font-medium">{{ row.agent.name }}</span>
      </div>
    </template>

    <template #cell-shipperIssueVoucher="{ value, row }">
      <div
        class="cursor-pointer hover:text-primary transition-colors flex items-center gap-2"
        @click.stop="openVouchersModal(row)"
      >
        <span class="font-medium">{{ value || "Add Voucher" }}</span>
        <i v-if="!value" class="mdi mdi-plus-circle-outline text-gray-400"></i>
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

    <template #tabs>
      <ShipmentFilters
        @change="handleFilterChange"
        calendar-type="english"
        output-calendar-type="english"
      />
    </template>

    <template #cell-status="{ value }">
      <Status :variant="value" type="wrapped">
        {{ value?.replace(/_/g, " ") }}
      </Status>
    </template>
    ````
    <template #cell-actions="{ row }">
      <div class="flex items-center justify-end">
        <Dropdown>
          <template #default="{ close }">
            <button
              class="w-full text-left px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              @click="
                handleAction(row, 'view');
                close();
              "
            >
              Details
            </button>
            <button
              class="w-full text-left px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-50 text-primary transition-colors"
              @click="
                openStatusModal(row);
                close();
              "
            >
              Update Status
            </button>
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

const handleFilterChange = (newFilters: ShipmentFilterParams) => {
  activeFilters.value = { ...newFilters };
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
