<template>
  <Table
    id="purchase-orders-list"
    v-model:search_value="searchTerm"
    :columns="columns"
    :rows="response"
    :search_placeholder="dynamicSearchPlaceholder"
    :hide_on_sm_screen="['items', 'pr', 'preparedBy', 'itemsCount', 'createdAt']"
    :on_sm_screen_column_span="{ date: 2, referenceNumber: 2, status: 2 }"
    @row_click="(row) => handleAction(row, 'view')"
  >
    <template #search-prefix>
      <div class="hidden sm:flex h-full items-center border-r border-line pr-2 mr-2 w-48">
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

    <template #cell-pr="{ row }">
      {{ row.pr?.referenceNumber || row.pr }}
    </template>

    <template #cell-itemsCount="{ row }">
      {{ row.items?.length || 0 }}
    </template>

    <template #cell-createdAt="{ row }">
      {{ new Date(row.createdAt).toLocaleDateString() }}
    </template>

    <template #cell-items="{ row }">
      <div class="flex flex-col gap-1">
        <span v-for="item in row.items?.slice(0, 2)" :key="item._id" class="text-xs text-gray-600">
          • {{ item.inventoryItem?.name || item.item?.name }} ({{ item.quantity }})
        </span>
        <span v-if="row.items?.length > 2" class="text-[10px] text-primary font-medium">
          + {{ row.items.length - 2 }} more items
        </span>
      </div>
    </template>

    <template #cell-date="{ row }">
      {{ new Date(row.date).toLocaleDateString() }}
    </template>

    <template #cell-preparedBy="{ row }">
      <div class="flex items-center gap-2">
        {{ row.preparedBy?.username }}
      </div>
    </template>

    <template #cell-actions="{ row }">
      <div class="flex items-center justify-center">
        <Dropdown>
          <template #default="{ close }">
            <DropDownItem v-permission="'PURCHASE_ORDER:read'"
              :icon="icons.eye"
              label="View Details"
              @click.stop="
                handleAction(row, 'view');
                close();
              "
            />
            <DropDownItem v-permission="'PURCHASE_ORDER:update'"
              v-if="row.status === 'PENDING'"
              :icon="icons.edit"
              label="Edit"
              @click.stop="handleAction(row, 'edit'); close();"
            />
            <DropDownItem v-permission="'PURCHASE_ORDER:update'"
              v-if="row.status === 'PENDING'"
              :icon="icons.approveIcon"
              label="Approve"
              @click.stop="handleAction(row, 'approve'); close();"
            />
            <DropDownItem v-permission="'PURCHASE_ORDER:update'"
              v-if="row.status === 'APPROVED'"
              :icon="icons.check"
              label="Authorize"
              @click.stop="handleAction(row, 'authorize'); close();"
            />
            <DropDownItem v-permission="'PURCHASE_ORDER:update'"
              v-if="!['CANCELLED', 'AUTHORIZED'].includes(row.status)"
              :icon="icons.close"
              label="Cancel"
              class="text-error-600"
              @click.stop="handleAction(row, 'cancel'); close();"
            />
          </template>
        </Dropdown>
      </div>
    </template>
  </Table>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import Table from "@/components/common/Table.vue";
import Select from "@/components/common/Select.vue";
import Dropdown from "@/components/common/Dropdown.vue";
import DropDownItem from "@/components/common/DropDownItem.vue";
import Status from "@/components/common/Status.vue";
import { usePagination } from "@/composables/usePagination";
import { icons } from "@/utils/icons";
import type { TableColumn } from "@/components/common/Table.vue";

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
  id: "purchase-orders-list",
  url: "/purchase-orders",
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
  { key: "referenceNumber", label: "Reference Number", field: "referenceNumber" },
  { key: "items", label: "Items", field: "items" },
  { key: "pr", label: "Pr Number", field: "pr" },
  { key: "preparedBy", label: "Prepared By", field: "preparedBy" },
  { key: "itemsCount", label: "Items", field: "items" },
  { key: "createdAt", label: "Created At", field: "createdAt" },
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
