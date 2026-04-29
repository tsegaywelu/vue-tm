<template>
  <Table
    id="payable-list"
    :columns="columns"
    :rows="response"
    search_placeholder="Search..."
    @row_click="handleAction($event, 'view')"
  >
    <template #cell-advanceNumber="{ value }">
      <span class="font-bold">{{ value || '-' }}</span>
    </template>

    <template #cell-payableType="{ value }">
      <div
        class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider w-fit"
        :class="typeClasses[value] || 'bg-gray-100 text-gray-500'"
      >
        {{ formatType(value) }}
      </div>
    </template>

    <template #cell-driver="{ row }">
      <div class="flex flex-col">
        <span class="font-semibold text-gray-900">
          {{ row.plateNumber || '-' }}
        </span>
        <span class="text-xs text-gray-400 font-medium" v-if="row.driver">
          {{ row.driver.firstName }} {{ row.driver.lastName }}
        </span>
      </div>
    </template>

    <template #cell-route="{ row }">
      <span class="font-medium text-gray-700">
        {{ row.route?.name || '-' }}
      </span>
    </template>

    <template #cell-shipmentCode="{ value }">
      <span class="text-sm text-gray-600">{{ value || '-' }}</span>
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
    
    <template #cell-createdAt="{ value }">
      <span class="text-sm text-gray-600">
        {{ dateFormatter(value) }}
      </span>
    </template>

    <template #after-search>
      <div class="items-center gap-4 inline-flex border-l border-grey-100 overflow-x-auto px-3 ">
        <i v-html="icons.filter" />
        <PayableFilters @change="handleFilterChange" />
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
import PayableFilters from "./PayableFilters.vue";
import { currencyFormatter, dateFormatter } from "@/utils/utils";

const emit = defineEmits(["action"]);

const columns: TableColumn<any>[] = [
  { key: "advanceNumber", label: "Code", field: "advanceNumber" },
  { key: "payableType", label: "Type", field: "payableType" },
  { key: "driver", label: "Driver/Vehicle", field: "driver" },
  { key: "route", label: "Route", field: "route" },
  { key: "shipmentCode", label: "Shipment Code", field: "shipmentCode" },
  { key: "total", label: "Total", field: "total" },
  { key: "status", label: "Status", field: "status" },
  { key: "createdAt", label: "Created At", field: "createdAt" },
  { key: "actions", label: "Actions", field: "", cellAlign: "right" },
];

const activeFilters = ref({});
const { response, refetch } = usePagination<any>({
  id: "payable-list",
  url: "/advance-payment/all",
  params: computed(() => activeFilters.value),
});

const handleFilterChange = (newFilters: any) => {
  activeFilters.value = { ...newFilters };
};

const handleAction = (row: any, action: string) => {
  emit("action", { row, action });
};

const formatType = (val: string) => {
  if(!val) return '-';
  return val.replace(/([A-Z])/g, " $1").trim();
};

const typeClasses: Record<string, string> = {
  advancePayment: "bg-blue-50 text-blue-600",
  transactions: "bg-purple-50 text-purple-600",
  prePayments: "bg-orange-50 text-orange-600",
  vehicleLeaseAgreement: "bg-teal-50 text-teal-600",
  shipments: "bg-green-50 text-green-600",
  purchaseOrder: "bg-indigo-50 text-indigo-600",
};

defineExpose({ refetch });
</script>
