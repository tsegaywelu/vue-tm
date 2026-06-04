<template>
  <Table
    id="store-requisitions-list"
    v-model:search_value="searchTerm"
    :columns="columns"
    :rows="response"
    :search_placeholder="dynamicSearchPlaceholder"
    :hide_on_sm_screen="['items', 'requiredDate', 'preparedBy']"
    :on_sm_screen_column_span="{ date: 2, referenceNumber: 2, status: 2 }"
    @row_click="(row) => handleAction(row, 'view')"
  >
    <template #search-prefix>
      <div
        class="hidden sm:flex h-full items-center border-r border-gray-200 pr-2 mr-2 w-48"
      >
        <SearchFieldSelect
          v-model="selectedSearchField"
          pagination-id="store-requisitions-list"
          :options="searchFieldOptions"
          select-class="[&_.input-focus]:shadow-none! [&_.input-focus]:border-none [&_.input-focus]:min-h-full min-w-48"
        />
      </div>
    </template>

    <template #after-search>
      <div class="flex items-center overflow-x-auto">
        <Select
          size="xs"
          label="Status"
          class="[&_.input-focus]:bg-grey-25 min-w-[180px]"
          v-model="activeFilters.status"
          :options="statusOptions"
          label_key="label"
          value_key="value"
          :clearable="true"
          placeholder="All Statuses"
        />
      </div>
    </template>

    <template #cell-status="{ row }">
      <Status :variant="row.status" />
    </template>

    <template #cell-items="{ row }">
      <div class="flex flex-col gap-1">
        <span
          v-for="item in row.items?.slice(0, 2)"
          :key="item._id"
          class="text-xs text-gray-600"
        >
          • {{ item.inventoryItem?.name }} ({{ item.quantity }})
        </span>
        <span
          v-if="row.items?.length > 2"
          class="text-[10px] text-primary font-medium"
        >
          + {{ row.items.length - 2 }} more items
        </span>
      </div>
    </template>

    <template #cell-date="{ value }">
      {{ dateFormatter(value) }}
    </template>

    <template #cell-requiredDate="{ value }">
      {{ dateFormatter(value) }}
    </template>

    <template #cell-preparedBy="{ row }">
      {{ row.preparedBy?.username }} {{ row.preparedBy?.lastName }}
    </template>

    <template #cell-actions="{ row }">
      <div class="flex items-center justify-center">
        <Dropdown>
          <template #default="{ close }">
            <DropDownItem
              v-permission="'STORE_REQUISITION_VOUCHER:read'"
              :icon="icons.eye"
              label="View Details"
              @click.stop="
                handleAction(row, 'view');
                close();
              "
            />
            <DropDownItem
              v-permission="'STORE_REQUISITION_VOUCHER:update'"
              v-if="row.status === 'PENDING'"
              :icon="icons.edit"
              label="Edit"
              @click.stop="
                handleAction(row, 'edit');
                close();
              "
            />
            <DropDownItem
              v-permission="'STORE_REQUISITION_VOUCHER:approve'"
              v-if="row.status === 'PENDING'"
              :icon="icons.successBell"
              label="Approve"
              class="text-success-600"
              @click.stop="
                handleAction(row, 'approve');
                close();
              "
            />
            <DropDownItem
              v-permission="'STORE_REQUISITION_VOUCHER:reject'"
              v-if="row.status === 'PENDING'"
              :icon="icons.rejectedBell"
              label="Reject"
              class="text-error-600"
              @click.stop="
                handleAction(row, 'reject');
                close();
              "
            />
            <DropDownItem
              v-permission="'STORE_REQUISITION_VOUCHER:authorize'"
              v-if="row.status === 'APPROVED'"
              :icon="icons.successBell"
              label="Authorize"
              class="text-success-600"
              @click.stop="
                handleAction(row, 'authorize');
                close();
              "
            />
            <DropDownItem
              v-permission="'STORE_REQUISITION_VOUCHER:cancel'"
              v-if="row.status === 'APPROVED'"
              :icon="icons.rejectedBell"
              label="Cancel"
              class="text-error-600"
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
import Select from "@/components/common/Select.vue";
import SearchFieldSelect from "@/components/common/SearchFieldSelect.vue";
import Dropdown from "@/components/common/Dropdown.vue";
import DropDownItem from "@/components/common/DropDownItem.vue";

import { usePagination, useTableLastMeta } from "@/composables/usePagination";
import { icons } from "@/utils/icons";
import type { TableColumn } from "@/components/common/Table.vue";
import Status from "@/components/common/Status.vue";
import { dateFormatter } from "@/utils/utils";

const emit = defineEmits(["action"]);

const searchFieldOptions = [
  { label: "Ref No", value: "referenceNumber" },
  { label: "Item Name", value: "itemName" },
  { label: "Remark", value: "remark" },
];

const statusOptions = [
  { label: "Pending", value: "PENDING" },
  { label: "Approved", value: "APPROVED" },
  { label: "Authorized", value: "AUTHORIZED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Cancelled", value: "CANCELLED" },
];

const lastMeta = useTableLastMeta("store-requisitions-list");
const selectedSearchField = ref(
  (lastMeta.value.searchField as string | undefined) || "referenceNumber",
);
const searchTerm = ref("");

const dynamicSearchPlaceholder = computed(() => {
  const option = searchFieldOptions.find(
    (o) => o.value === selectedSearchField.value,
  );
  return option ? `Search by ${option.label}...` : "Search...";
});

const activeFilters = ref<any>({});

const { response, refetch } = usePagination<any>({
  id: "store-requisitions-list",
  url: "/store-requisition-vouchers",
  params: (state) => {
    return {
      [selectedSearchField.value]: {
        regexAny: state.search,
      },
      ...activeFilters.value,
      q: undefined,
    };
  },
});

const columns: TableColumn<any>[] = [
  { key: "date", label: "Date", field: "date" },
  { key: "referenceNumber", label: "Reference No", field: "referenceNumber" },
  { key: "items", label: "Items", field: "items" },
  { key: "requiredDate", label: "Required Date", field: "requiredDate" },
  { key: "preparedBy", label: "Prepared By", field: "preparedBy" },
  { key: "status", label: "Status", field: "status" },
  { key: "actions", label: "Actions", field: "", cellAlign: "center" },
];

const handleAction = (row: any, action: string) => {
  emit("action", { row, action });
};

defineExpose({
  refetch,
  selectedSearchField,
  searchFieldOptions,
});
</script>
