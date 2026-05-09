<template>
  <Table
    id="receivable-settlement-list"
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
    <template #cell-advanceNumber="{ row }">
      <span class="font-bold">{{ row.advancePayment?.advanceNumber || '-' }}</span>
    </template>

    <template #cell-driver="{ row }">
      <div class="flex flex-col">
        <span class="font-semibold text-gray-900">
          {{ row.advancePayment?.shipment?.vehicle?.plateNumber || '-' }}
        </span>
        <span class="text-xs text-gray-400 font-medium" v-if="row.advancePayment?.driver">
          {{ row.advancePayment.driver.firstName }} {{ row.advancePayment.driver.lastName }}
        </span>
      </div>
    </template>

    <template #cell-route="{ row }">
      <span class="font-medium text-gray-700">
        {{ row.advancePayment?.shipment?.route?.routeName || '-' }}
      </span>
    </template>

    <template #cell-shipmentCode="{ row }">
      <span class="text-sm text-gray-600">{{ row.advancePayment?.shipment?.shipmentCode || '-' }}</span>
    </template>

    <template #cell-fuelAdvance="{ row }">
      <span>{{ row.category === 'FUEL' ? currencyFormatter(row.amount) : '-' }}</span>
    </template>
    
    <template #cell-perdiemAdvance="{ row }">
      <span>{{ row.category === 'PERDIEM' ? currencyFormatter(row.amount) : '-' }}</span>
    </template>

    <template #cell-otherAdvance="{ row }">
      <span>{{ row.category === 'OTHER' ? currencyFormatter(row.amount) : '-' }}</span>
    </template>

    <template #cell-total="{ row }">
      <span class="font-bold text-gray-900">
        {{ currencyFormatter(row.amount) }}
      </span>
    </template>

    <template #cell-createdAt="{ value }">
      <span class="text-sm text-gray-600">
        {{ dateFormatter(value) }}
      </span>
    </template>

    <template #after-search>
      <div class="items-center gap-4 inline-flex border-l border-grey-100 overflow-x-auto px-3">
        <i v-html="icons.filter" />
        <ReceivableSettlementFilters @change="handleFilterChange" />
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
            <DropDownItem
              v-if="row.status === 'AUTHORIZED'"
              v-permission="'TRANSACTION:pay'"
              :icon="icons.cash"
              label="Collect"
              @click.stop="
                handleAction(row, 'pay');
                close();
              "
            />
            <DropDownItem
              v-if="row.status === 'APPROVED'"
              v-permission="'TRANSACTION:authorize'"
              :icon="icons.checkCircle"
              label="Authorize"
              @click.stop="
                handleAction(row, 'authorize');
                close();
              "
            />
            <DropDownItem
              v-if="row.status === 'APPROVED'"
              v-permission="'TRANSACTION:update'"
              variant="danger"
              :icon="icons.closeCircle"
              label="Cancel"
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
import { computed, ref, watch } from "vue";
import Table from "@/components/common/Table.vue";
import Dropdown from "@/components/common/Dropdown.vue";
import DropDownItem from "@/components/common/DropDownItem.vue";
import { icons } from "@/utils/icons";
import { usePagination } from "@/composables/usePagination";
import type { TableColumn } from "@/components/common/Table.vue";
import ReceivableSettlementFilters from "./ReceivableSettlementFilters.vue";
import Select from "@/components/common/Select.vue";
import { currencyFormatter, dateFormatter } from "@/utils/utils";

const emit = defineEmits(["action"]);

const columns: TableColumn<any>[] = [
  { key: "advanceNumber", label: "Code", field: "advanceNumber" },
  { key: "driver", label: "Driver/Vehicle", field: "driver" },
  { key: "createdAt", label: "Date", field: "createdAt" },
  { key: "shipmentCode", label: "Shipment Code", field: "shipmentCode" },
  { key: "route", label: "Route", field: "route" },
  { key: "fuelAdvance", label: "Fuel", field: "fuelAdvance" },
  { key: "perdiemAdvance", label: "Per Diem", field: "perdiemAdvance" },
  { key: "otherAdvance", label: "Other", field: "otherAdvance" },
  { key: "total", label: "Total", field: "amount" },
  { key: "actions", label: "Actions", field: "", cellAlign: "right" },
];

const searchFieldOptions = [
  { label: "Plate Number", value: "vehiclePlateNumber" },
  { label: "Advance Number", value: "advanceNumber" },
  { label: "First Name", value: "driverFirstName" },
  { label: "Middle Name", value: "driverMiddleName" },
];

const selectedSearchField = ref("vehiclePlateNumber");
const searchTerm = ref("");

const dynamicSearchPlaceholder = computed(() => {
  const option = searchFieldOptions.find((o) => o.value === selectedSearchField.value);
  return option ? `Search by ${option.label}...` : "Search...";
});

const activeFilters = ref<any>({});

const { response, refetch } = usePagination<any>({
  id: "receivable-settlement-list",
  url: "/transaction/receivableTransaction",
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
  activeFilters.value = { ...newFilters };
};

const handleAction = (row: any, action: string) => {
  emit("action", { row, action });
};

defineExpose({ refetch, response });
</script>
