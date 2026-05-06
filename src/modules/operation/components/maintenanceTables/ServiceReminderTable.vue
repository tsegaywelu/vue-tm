<template>
  <Table
    :row_alignment="{
      vehicle: 'left',
      serviceTask: 'left',
      interval: 'left',
      lastService: 'left',
      reminder: 'left',
      actions: 'right',
    }"
    :head_alignment="{
      vehicle: 'left',
      serviceTask: 'left',
      interval: 'left',
      lastService: 'left',
      reminder: 'left',
      actions: 'right',
    }"
    id="service-reminders-list"
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

    <template #cell-serviceTask="{ row }">
      <span class="text-gray-600">{{ row.serviceTask?.name || '-' }}</span>
    </template>

    <template #cell-interval="{ row }">
      <span class="text-gray-600">{{ row.mileageInterval ?? row.interval ?? '-' }}</span>
    </template>

    <template #cell-lastService="{ row }">
      <span class="text-gray-600">{{ row.lastServiceDate ? row.lastServiceDate.split('T')[0] : (row.lastServiceMileage ?? '-') }}</span>
    </template>

    <template #cell-reminder="{ row }">
      <span class="text-gray-600">{{ row.reminderMileage ?? row.reminderDays ?? '-' }}</span>
    </template>

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
              class="w-full text-left px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors text-brightBlue-dark"
              @click="
                handleAction(row, 'edit');
                close();
              "
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
import Select from "@/components/common/Select.vue";
import { usePagination } from "@/composables/usePagination";
import type { ServiceReminder } from "../operation.types";
import type { TableColumn } from "@/components/common/Table.vue";

const emit = defineEmits(["action"]);

const columns: TableColumn<ServiceReminder>[] = [
  { key: "vehicle", label: "Vehicle" },
  { key: "serviceTask", label: "Service Task" },
  { key: "interval", label: "Mileage / Date Interval" },
  { key: "lastService", label: "Last service mileage / date" },
  { key: "reminder", label: "Reminder Mileage" },
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
const { response, refetch } = usePagination<ServiceReminder>({
  id: "service-reminders-list",
  url: "/service-reminder",
  params: computed(() => {
    const params: any = { ...activeFilters.value };
    if (searchTerm.value) {
      params[`${selectedSearchField.value}[regex]`] = searchTerm.value;
      params.q = undefined;
    }
    return params;
  }),
});

const handleAction = (row: ServiceReminder, action: string) => {
  emit("action", { row, action });
};

defineExpose({ refetch });
</script>
