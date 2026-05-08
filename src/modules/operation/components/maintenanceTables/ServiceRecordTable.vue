<template>
  <Table
    :row_alignment="{
      vehicle: 'left',
      maintenanceDate: 'left',
      mechanics: 'left',
      workshop: 'left',
      mileageAtService: 'left',
      totalCost: 'left',
      description: 'left',
      actions: 'right',
    }"
    :head_alignment="{
      vehicle: 'left',
      maintenanceDate: 'left',
      mechanics: 'left',
      workshop: 'left',
      mileageAtService: 'left',
      totalCost: 'left',
      description: 'left',
      actions: 'right',
    }"
    id="service-records-list"
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

    <template #cell-maintenanceDate="{ row }">
      <span class="text-gray-600">{{ row.maintenanceDate ? row.maintenanceDate.split('T')[0] : '-' }}</span>
    </template>

    <template #cell-mechanics="{ row }">
      <span class="text-gray-600">{{ row.mechanics && row.mechanics.length > 0 ? row.mechanics.map((m) => m?.name ? m.name : [m?.firstName, m?.middleName, m?.lastName].filter(Boolean).join(" ")).join(", ") : "-" }}</span>
    </template>

    <template #cell-workshop="{ row }">
      <span class="text-gray-600">{{ row.workshop?.name || '-' }}</span>
    </template>

    <template #cell-mileageAtService="{ row }">
      <span class="text-gray-600">{{ row.mileageAtService ?? '-' }}</span>
    </template>

    <template #cell-totalCost="{ row }">
      <span class="text-gray-600">{{ row.totalCost ?? '-' }}</span>
    </template>

    <template #cell-description="{ row }">
      <span class="text-gray-600">{{ row.description || '-' }}</span>
    </template>

    <template #cell-actions="{ row }">
      <div class="flex items-center justify-end">
        <Dropdown>
          <template #default="{ close }">
            <button v-permission="'SERVICE_RECORD:read'"
              class="w-full text-left px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              @click="
                handleAction(row, 'view');
                close();
              "
            >
              Details
            </button>
            <button v-permission="'SERVICE_RECORD:update'"
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
import type { ServiceRecord } from "../../operation.types";
import type { TableColumn } from "@/components/common/Table.vue";

const emit = defineEmits(["action"]);

const columns: TableColumn<ServiceRecord>[] = [
  { key: "vehicle", label: "Vehicle" },
  { key: "maintenanceDate", label: "Maintenance Date" },
  { key: "mechanics", label: "Mechanics" },
  { key: "workshop", label: "Workshop" },
  { key: "mileageAtService", label: "Mileage" },
  { key: "totalCost", label: "Total Cost" },
  { key: "description", label: "Description" },
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
const { response, refetch } = usePagination<ServiceRecord>({
  id: "service-records-list",
  url: "/service-record",
  params: computed(() => {
    const params: any = { ...activeFilters.value };
    if (searchTerm.value) {
      params[`${selectedSearchField.value}[regex]`] = searchTerm.value;
      params.q = undefined;
    }
    return params;
  }),
});

const handleAction = (row: ServiceRecord, action: string) => {
  emit("action", { row, action });
};

defineExpose({ refetch });
</script>
