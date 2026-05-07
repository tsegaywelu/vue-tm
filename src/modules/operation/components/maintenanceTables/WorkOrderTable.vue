<template>
  <Table
    :row_alignment="{
      vehicle: 'left',
      date: 'left',
      statusAction: 'left',
      contacts: 'left',
      workType: 'left',
      workArea: 'left',
      partsCost: 'left',
      actions: 'right',
    }"
    :head_alignment="{
      vehicle: 'left',
      date: 'left',
      statusAction: 'left',
      contacts: 'left',
      workType: 'left',
      workArea: 'left',
      partsCost: 'left',
      actions: 'right',
    }"
    id="work-orders-list"
    v-model:search_value="searchTerm"
    :columns="columns"
    :rows="response"
    :search_placeholder="dynamicSearchPlaceholder"
  >
    <template #search-prefix>
      <div
        class="h-full flex items-center border-r border-gray-200 pr-2 mr-2 w-38"
      >
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
    <template #cell-vehicle="{ row }">
      <span class="font-medium text-gray-900">{{ row.vehicle?.plateNumber || '-' }}</span>
    </template>

    <template #cell-date="{ row }">
      <span class="text-gray-600">{{ row.createdAt ? row.createdAt.split('T')[0] : '-' }}</span>
    </template>

    <template #cell-statusAction="{ row }">
      <Status :variant="row.status || 'pending'">{{ row.status || 'PENDING' }}</Status>
    </template>

    <template #cell-contacts="{ row }">
      <span class="text-gray-600">
        {{
          row.mechanics && row.mechanics.length > 0
            ? row.mechanics
                .map((m: any) => m.name || `${m.firstName || ""} ${m.lastName || ""}`.trim())
                .join(", ")
            : "-"
        }}
      </span>
    </template>

    <template #cell-workType="{ row }">
      <span class="text-gray-600">{{ row.workType || '-' }}</span>
    </template>

    <template #cell-workArea="{ row }">
      <span class="text-gray-600">{{ row.workArea || '-' }}</span>
    </template>

    <template #cell-partsCost="{ row }">
      <span class="text-gray-600">{{ row.costBreakdown?.partsCost ?? '-' }}</span>
    </template>

    <template #cell-actions="{ row }">
      <div class="flex items-center justify-end">
        <Dropdown>
          <template #default="{ close }">
            <button v-permission="'WORK_ORDER:approve'"
              v-if="row.status === 'PENDING'"
              class="w-full text-left px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors text-brightBlue-dark"
              @click="handleAction(row, 'approve'); close();"
            >
              Approve
            </button>
            <button v-permission="'WORK_ORDER:cancel'"
              v-if="row.status === 'PENDING'"
              class="w-full text-left px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors text-red-600"
              @click="handleAction(row, 'cancel'); close();"
            >
              Reject
            </button>
            <button
              v-if="row.status === 'APPROVED'"
              class="w-full text-left px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors text-brightBlue-dark"
              @click="handleAction(row, 'complete'); close();"
            >
              Complete
            </button>
            <button v-permission="'WORK_ORDER:read'"
              class="w-full text-left px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              @click="handleAction(row, 'view'); close();"
            >
              Details
            </button>
            <button v-permission="'WORK_ORDER:update'"
              class="w-full text-left px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors text-brightBlue-dark"
              @click="handleAction(row, 'edit'); close();"
            >
              Edit
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
import Status from "@/components/common/Status.vue";
import Select from "@/components/common/Select.vue";
import { usePagination } from "@/composables/usePagination";
import type { WorkOrder } from "../operation.types";
import type { TableColumn } from "@/components/common/Table.vue";

const emit = defineEmits(["action"]);

const columns: TableColumn<WorkOrder>[] = [
  { key: "vehicle", label: "Vehicle" },
  { key: "date", label: "Date" },
  { key: "statusAction", label: "Status" },
  { key: "contacts", label: "Contacts" },
  { key: "workType", label: "Work Type" },
  { key: "workArea", label: "Work Area" },
  { key: "partsCost", label: "Parts Cost" },
  { key: "actions", label: "Actions", cellAlign: "right" },
];

const searchFieldOptions = [
  { label: "First Name", value: "firstName" },
  { label: "Middle Name", value: "middleName" },
  { label: "Last Name", value: "lastName" },
  { label: "Phone Number", value: "phoneNumber" },
];

const selectedSearchField = ref("firstName");
const searchTerm = ref("");

const dynamicSearchPlaceholder = computed(() => {
  const option = searchFieldOptions.find(
    (o) => o.value === selectedSearchField.value,
  );
  return option ? `Search by ${option.label}...` : "Search...";
});

const activeFilters = ref<any>({});
const { response, refetch } = usePagination<WorkOrder>({
  id: "work-orders-list",
  url: "/work-order",
  params: computed(() => {
    const params: any = { ...activeFilters.value };
    if (searchTerm.value) {
      params[`${selectedSearchField.value}[regex]`] = searchTerm.value;
      params.q = undefined;
    }
    return params;
  }),
});

const handleAction = (row: WorkOrder, action: string) => {
  emit("action", { row, action });
};

defineExpose({ refetch });
</script>
