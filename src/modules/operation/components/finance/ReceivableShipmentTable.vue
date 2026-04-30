<template>
  <Table
    id="receivable-shipment-list"
    :columns="columns"
    :rows="response"
    search_placeholder="Search shipments..."
    @row_click="handleAction($event, 'view')"
  >
    <template #cell-shipmentCode="{ value }">
      <span class="font-bold">{{ value || '-' }}</span>
    </template>

    <template #cell-dispatchDate="{ value }">
      <span class="text-sm text-gray-600">
        {{ dateFormatter(value) }}
      </span>
    </template>

    <template #cell-route="{ row }">
      <span class="font-medium text-gray-700">
        {{ row.route?.routeName || '-' }}
      </span>
    </template>

    <template #cell-agent="{ row }">
      <span class="font-medium text-gray-700">
        {{ row.agent?.name || '-' }}
      </span>
    </template>

    <template #cell-vehicle="{ row }">
      <span class="font-medium text-gray-700">
        {{ row.vehicle?.plateNumber || '-' }}
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
      <Status :variant="value ? 'uploaded' : 'active'" type="wrapped">
        {{ value ? 'Uploaded' : 'Pending' }}
      </Status>
    </template>

    <template #extra-actions>
      <div class="items-center gap-4 inline-flex border-l border-grey-100 overflow-x-auto px-3">
        <i v-html="icons.filter" />
        <ReceivableShipmentFilters @change="handleFilterChange" />
      </div>
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
import { icons } from "@/utils/icons";
import { usePagination } from "@/composables/usePagination";
import type { TableColumn } from "@/components/common/Table.vue";
import ReceivableShipmentFilters from "./ReceivableShipmentFilters.vue";
import { currencyFormatter, dateFormatter } from "@/utils/utils";

const emit = defineEmits(["action"]);

const columns: TableColumn<any>[] = [
  { key: "shipmentCode", label: "Shipment Code", field: "shipmentCode" },
  { key: "dispatchDate", label: "Dispatch Date", field: "dispatchDate" },
  { key: "route", label: "Route", field: "route" },
  { key: "agent", label: "Agent", field: "agent" },
  { key: "shipperIssueVoucher", label: "Issue Voucher", field: "shipperIssueVoucher" },
  { key: "vehicle", label: "Vehicle", field: "vehicle" },
  { key: "driver", label: "Driver", field: "driver" },
  { key: "totalPrice", label: "Total", field: "totalPrice" },
  { key: "areDocumentsUploaded", label: "Documents", field: "areDocumentsUploaded" },
  { key: "actions", label: "Actions", field: "", cellAlign: "right" },
];

const activeFilters = ref({});
const { response, refetch } = usePagination<any>({
  id: "receivable-shipment-list",
  url: "/shipment/receivableShipments",
  params: computed(() => activeFilters.value),
});

const handleFilterChange = (newFilters: any) => {
  activeFilters.value = { ...newFilters };
};

const handleAction = (row: any, action: string) => {
  emit("action", { row, action });
};

defineExpose({ refetch });
</script>
