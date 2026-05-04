<template>
  <Table
    :row_alignment="{
      vehicle: 'left',
      inspectionDate: 'left',
      inspectionReason: 'left',
      inspector: 'left',
      odometerReading: 'left',
      remarks: 'left',
      issuesFound: 'left',
      actions: 'right',
    }"
    :head_alignment="{
      vehicle: 'left',
      inspectionDate: 'left',
      inspectionReason: 'left',
      inspector: 'left',
      odometerReading: 'left',
      remarks: 'left',
      issuesFound: 'left',
      actions: 'right',
    }"
    id="inspections-list"
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
          class="[&_.custom-input]:border-none [&_.custom-input]:min-h-full w-66"
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

    <template #cell-inspectionDate="{ row }">
      <span class="text-gray-600">{{ row.inspectionDate ? row.inspectionDate.split('T')[0] : '-' }}</span>
    </template>

    <template #cell-inspectionReason="{ row }">
      <span class="text-gray-600">{{ row.inspectionReason || '-' }}</span>
    </template>

    <template #cell-inspector="{ row }">
      <span class="text-gray-600">{{ row.inspector?.name || '-' }}</span>
    </template>

    <template #cell-odometerReading="{ row }">
      <span class="text-gray-600">{{ row.odometerReading ?? '-' }}</span>
    </template>

    <template #cell-remarks="{ row }">
      <span class="text-gray-600">{{ row.remarks || '-' }}</span>
    </template>

    <template #cell-issuesFound="{ row }">
      <span class="text-gray-600">{{ row.issuesFound && row.issuesFound.length > 0 ? row.issuesFound.map((issue) => issue.issueType).join(', ') : '-' }}</span>
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
import type { Inspection } from "../../operation.types";
import type { TableColumn } from "@/components/common/Table.vue";

const emit = defineEmits(["action"]);

const columns: TableColumn<Inspection>[] = [
  { key: "vehicle", label: "Vehicle" },
  { key: "inspectionDate", label: "Inspection Date" },
  { key: "inspectionReason", label: "Reason" },
  { key: "inspector", label: "Inspector" },
  { key: "odometerReading", label: "Mileage" },
  { key: "remarks", label: "Remarks" },
  { key: "issuesFound", label: "Issue Found" },
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
const { response, refetch } = usePagination<Inspection>({
  id: "inspections-list",
  url: "/inspection",
  params: computed(() => {
    const params: any = { ...activeFilters.value };
    if (searchTerm.value) {
      params[`${selectedSearchField.value}[regex]`] = searchTerm.value;
      params.q = undefined;
    }
    return params;
  }),
});

const handleAction = (row: Inspection, action: string) => {
  emit("action", { row, action });
};

defineExpose({ refetch });
</script>
