<template>
  <Table
    id="purchase-requisitions-list"
    v-model:search_value="searchTerm"
    :columns="columns"
    :rows="response"
    :search_placeholder="dynamicSearchPlaceholder"
    :hide_on_sm_screen="['srv', 'supplierName', 'requestedDate', 'preparedBy']"
    :on_sm_screen_column_span="{ date: 2, referenceNumber: 2, items: 2, status: 2 }"
    @row_click="(row) => handleAction(row, 'view')"
  >
    <template #search-prefix>
      <div class="hidden sm:flex h-full items-center border-r border-gray-200 pr-2 mr-2 w-48">
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

    <template #after-search>
      <div class="flex-1">
        <Select
          size="xs"
          label="Status"
          class="[&_.input-focus]:bg-grey-25 flex-1 flex max-h-16 h-16 min-h-16 *:w-[220px] *:shrink-0 px-2 gap-2 overflow-auto"
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
        <span v-for="item in row.items?.slice(0, 2)" :key="item._id" class="text-xs text-gray-600">
          • {{ item.item?.name }} ({{ item.quantity }})
        </span>
        <span v-if="row.items?.length > 2" class="text-[10px] text-primary font-medium">
          + {{ row.items.length - 2 }} more items
        </span>
      </div>
    </template>

    <template #cell-date="{ row }">
      {{ new Date(row.date).toLocaleDateString() }}
    </template>

    <template #cell-requestedDate="{ row }">
      {{ new Date(row.requestedDate).toLocaleDateString() }}
    </template>

    <template #cell-srv="{ row }">
      <span class="font-medium text-gray-900">{{ row.srv?.referenceNumber || '-' }}</span>
    </template>

    <template #cell-preparedBy="{ row }">
      <div class="flex items-center gap-2">
        <!-- <div class="size-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold">
          {{ row.preparedBy?.firstName?.[0] }}{{ row.preparedBy?.lastName?.[0] }}
        </div>
        <span class="text-xs font-medium">{{ row.preparedBy?.firstName }} {{ row.preparedBy?.lastName }}</span> -->
        {{ row.preparedBy?.username }}
      </div>
    </template>

    <template #cell-actions="{ row }">
      <div class="flex items-center justify-center">
        <Dropdown>
          <template #default="{ close }">
            <DropDownItem v-permission="'PURCHASE_REQUISITION:read'"
              :icon="icons.eye"
              label="View Details"
              @click.stop="
                handleAction(row, 'view');
                close();
              "
            />
            <DropDownItem v-permission="'PURCHASE_REQUISITION:update'"
              v-if="row.status === 'PENDING'"
              :icon="icons.edit"
              label="Edit"
              @click.stop="
                handleAction(row, 'edit');
                close();
              "
            />
            <DropDownItem v-permission="'PURCHASE_REQUISITION:approve'"
              v-if="row.status === 'PENDING'"
              :icon="icons.successBell"
              label="Approve"
              class="text-success-600"
              @click.stop="
                handleAction(row, 'approve');
                close();
              "
            />
            <DropDownItem v-permission="'PURCHASE_REQUISITION:reject'"
              v-if="row.status === 'PENDING'"
              :icon="icons.rejectedBell"
              label="Reject"
              class="text-error-600"
              @click.stop="
                handleAction(row, 'reject');
                close();
              "
            />
            <DropDownItem v-permission="'PURCHASE_REQUISITION:authorize'"
              v-if="row.status === 'APPROVED'"
              :icon="icons.successBell"
              label="Authorize"
              class="text-success-600"
              @click.stop="
                handleAction(row, 'authorize');
                close();
              "
            />
            <DropDownItem v-permission="'PURCHASE_REQUISITION:cancel'"
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
import Dropdown from "@/components/common/Dropdown.vue";
import DropDownItem from "@/components/common/DropDownItem.vue";
import { usePagination } from "@/composables/usePagination";
import { icons } from "@/utils/icons";
import type { TableColumn } from "@/components/common/Table.vue";
import Status from "@/components/common/Status.vue";

const emit = defineEmits(["action"]);

const searchFieldOptions = [
  { label: "Ref No", value: "referenceNumber" },
  { label: "Item Name", value: "itemName" },
  { label: "Supplier", value: "supplierName" },
];

const statusOptions = [
  { label: "Pending", value: "PENDING" },
  { label: "Approved", value: "APPROVED" },
  { label: "Authorized", value: "AUTHORIZED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Cancelled", value: "CANCELLED" },
];

const selectedSearchField = ref("referenceNumber");
const searchTerm = ref("");

const dynamicSearchPlaceholder = computed(() => {
  const option = searchFieldOptions.find((o) => o.value === selectedSearchField.value);
  return option ? `Search by ${option.label}...` : "Search...";
});

const activeFilters = ref<any>({});
const { response, refetch } = usePagination<any>({
  id: "purchase-requisitions-list",
  url: "/purchase-requisitions",
  params: (state) => {
    return {
      [selectedSearchField.value]: { regexAny: state.search },
      ...activeFilters.value,
      q: undefined,
    };
  },
});

const columns: TableColumn<any>[] = [
  { key: "date", label: "Date", field: "date" },
  { key: "referenceNumber", label: "Reference No", field: "referenceNumber" },
  { key: "srv", label: "SRV No", field: "srv" },
  { key: "supplierName", label: "Supplier", field: "supplierName" },
  { key: "items", label: "Items", field: "items" },
  { key: "requestedDate", label: "Requested Date", field: "requestedDate" },
  { key: "preparedBy", label: "Prepared By", field: "preparedBy" },
  { key: "status", label: "Status", field: "status" },
  { key: "actions", label: "Actions", field: "", cellAlign: "center" },
];

const getStatusVariant = (status: string) => {
  switch (status) {
    case "PENDING": return "warning";
    case "APPROVED": return "info";
    case "AUTHORIZED": return "success";
    case "CANCELLED":
    case "REJECTED": return "error";
    default: return "neutral";
  }
};

const handleAction = (row: any, action: string) => {
  emit("action", { row, action });
};

defineExpose({
  refetch,
  selectedSearchField,
  searchFieldOptions,
});
</script>
