<template>
  <Table
    id="fuel-transactions-list"
    v-model:search_value="searchTerm"
    :columns="columns"
    :rows="response"
    :search_placeholder="dynamicSearchPlaceholder"
    @row_click="handleAction($event, 'view')"
  >
    <template #search-prefix>
      <div class="h-full flex items-center border-r border-gray-200 pr-2 mr-2 w-48">
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

    <template #cell-vehicleDriver="{ row }">
      <div class="flex flex-col">
        <span class="font-bold text-gray-900">{{ row.plateNumber?.toUpperCase() || 'N/A' }}</span>
        <span class="text-xs text-gray-500">{{ row.driverName || 'N/A' }}</span>
      </div>
    </template>

    <template #cell-shipmentRoute="{ row }">
      <div class="flex flex-col">
        <span class="font-semibold text-gray-900">{{ row.shipmentCode || 'N/A' }}</span>
        <span class="text-xs text-gray-500 line-clamp-1">{{ row.routeName || 'N/A' }}</span>
      </div>
    </template>

    <template #cell-date="{ value }">
      <span class="text-gray-700">{{ dateFormatter(value) }}</span>
    </template>

    <template #cell-typeStatus="{ row }">
      <div class="flex flex-col gap-1">
        <Status
          :type="row.type === 'RETURN' ? 'cancelled' : row.type === 'PAYMENT' ? 'active' : 'completed'"
          :label="row.type"
          class="w-fit"
        />
        <Status
          :type="getStatusType(row.status)"
          :label="row.status"
          class="w-fit"
        />
      </div>
    </template>

    <template #cell-amountLiters="{ row }">
      <div class="flex flex-col">
        <span
          :class="[row.amount < 0 ? 'text-error-600' : 'text-success-600', 'font-bold']"
        >
          {{ currencyFormatter(row.amount) }}
        </span>
        <span class="text-xs text-gray-500">{{ row.liters || 0 }} liters</span>
      </div>
    </template>

    <template #cell-notes="{ value }">
      <span class="text-gray-600 line-clamp-1 max-w-xs">{{ value || '-' }}</span>
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
import { computed, ref, watch } from "vue";
import Table from "@/components/common/Table.vue";
import Select from "@/components/common/Select.vue";
import Dropdown from "@/components/common/Dropdown.vue";
import DropDownItem from "@/components/common/DropDownItem.vue";
import Status from "@/components/common/Status.vue";
import { icons } from "@/utils/icons";
import { usePagination } from "@/composables/usePagination";
import type { TableColumn } from "@/components/common/Table.vue";
import { currencyFormatter, dateFormatter } from "@/utils/utils";

const emit = defineEmits(["action"]);

const columns: TableColumn<any>[] = [
  { key: "vehicleDriver", label: "Vehicle & Driver", field: "plateNumber" },
  { key: "shipmentRoute", label: "Shipment & Route", field: "shipmentCode" },
  { key: "date", label: "Date", field: "createdAt" },
  { key: "typeStatus", label: "Type & Status", field: "type" },
  { key: "amountLiters", label: "Amount & Liters", field: "amount" },
  { key: "notes", label: "Notes", field: "notes" },
  { key: "actions", label: "Actions", field: "", cellAlign: "right" },
];

const searchFieldOptions = [
  { label: "Plate Number", value: "plateNumber" },
  { label: "Driver Name", value: "driverName" },
  { label: "Shipment Code", value: "shipmentCode" },
  { label: "Route Name", value: "routeName" },
];

const selectedSearchField = ref("plateNumber");
const searchTerm = ref("");

const dynamicSearchPlaceholder = computed(() => {
  const option = searchFieldOptions.find((o) => o.value === selectedSearchField.value);
  return option ? `Search by ${option.label}...` : "Search...";
});

const activeFilters = ref<any>({});

const { response, refetch } = usePagination<any>({
  id: "fuel-transactions-list",
  url: "/transaction/fuel/filter",
  params: computed(() => {
    const params: any = { ...activeFilters.value };
    // Map the search query to the dynamic key the backend expects
    if (searchTerm.value) {
      params[`${selectedSearchField.value}[regexAny]`] = searchTerm.value;
      params.q = undefined; // Prevent sending the default 'q' parameter
    }
    return params;
  }),
});

const getStatusType = (status: string) => {
  switch (status) {
    case 'PAID':
    case 'APPROVED':
      return 'active';
    case 'PENDING':
      return 'pending';
    case 'AUTHORIZED':
      return 'completed';
    default:
      return 'cancelled';
  }
};

const handleAction = (row: any, action: string) => {
  emit("action", { row, action });
};

defineExpose({ refetch });
</script>
