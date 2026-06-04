<template>
  <Teleport defer to="#page-title-actions">
    <button
      class="sm:hidden size-8 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
      @click="showSearchSheet = true"
    >
      <i class="*:size-4" v-html="icons.filterOptions"></i>
    </button>
  </Teleport>

  <BottomSheet v-model="showSearchSheet" title="Search By">
    <div class="flex flex-col gap-2 p-4">
      <button
        v-for="option in searchFieldOptions"
        :key="option.value"
        class="flex items-center gap-3 p-3 rounded-xl text-left transition-colors"
        :class="selectedSearchField === option.value ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-gray-50'"
        @click="selectedSearchField = option.value; showSearchSheet = false"
      >
        {{ option.label }}
      </button>
    </div>
  </BottomSheet>

  <Table
    :row_alignment="{
      fullName: 'left',
      employment: 'left',
      phoneNumber: 'left',
      employeeNumber: 'left',
      dateOfBirth: 'left',
      certification: 'left',
      experience: 'left',
      workshop: 'left',
      actions: 'right',
    }"
    :head_alignment="{
      fullName: 'left',
      employment: 'left',
      phoneNumber: 'left',
      employeeNumber: 'left',
      dateOfBirth: 'left',
      certification: 'left',
      experience: 'left',
      workshop: 'left',
      actions: 'right',
    }"
    id="mechanics-list"
    v-model:search_value="searchTerm"
    :columns="columns"
    :rows="response"
    :search_placeholder="dynamicSearchPlaceholder"
    :hide_on_sm_screen="['employeeNumber', 'dateOfBirth', 'certification', 'experience', 'workshop']"
    :on_sm_screen_column_span="{ fullName: 2, phoneNumber: 2, employment: 3 }"
  >
    <template #search-prefix>
      <div
        class="h-full hidden sm:flex items-center border-r border-gray-200 pr-2 mr-2 w-38"
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
    <template #cell-fullName="{ row }">
      <span class="font-medium text-gray-900">{{ row.firstName }} {{ row.middleName || '' }} {{ row.lastName || '' }}</span>
    </template>

    <template #cell-employment="{ row }">
      <span class="text-gray-600">{{ row.isInternal ? "Employee" : "Not Employee" }}</span>
    </template>

    <template #cell-phoneNumber="{ row }">
      <span class="text-gray-600">{{ row.phoneNumber || '-' }}</span>
    </template>

    <template #cell-employeeNumber="{ row }">
      <span class="text-gray-600">{{ row.employeeNumber || '-' }}</span>
    </template>

    <template #cell-dateOfBirth="{ row }">
      <span class="text-gray-600">{{ row.dateOfBirth ? row.dateOfBirth.split('T')[0] : '-' }}</span>
    </template>

    <template #cell-certification="{ row }">
      <span class="text-gray-600">{{ row.certification || '-' }}</span>
    </template>

    <template #cell-experience="{ row }">
      <span class="text-gray-600">{{ row.experience || '-' }}</span>
    </template>

    <template #cell-workshop="{ row }">
      <span class="text-gray-600">{{ row.workshop?.name || '-' }}</span>
    </template>

    <template #cell-actions="{ row }">
      <div class="flex items-center justify-center">
        <Dropdown>
          <template #default="{ close }">
            <DropDownItem v-permission="'MECHANIC:read'"
              :icon="icons.eye"
              label="View Details"
              @click.stop="
                handleAction(row, 'view');
                close();
              "
            />
            <DropDownItem v-permission="'MECHANIC:update'"
              :icon="icons.edit"
              label="Edit"
              @click.stop="
                handleAction(row, 'edit');
                close();
              "
            />
            <DropDownItem v-permission="'MECHANIC:delete'"
              :icon="icons.delete"
              label="Delete"
              class="text-error-600"
              @click.stop="
                handleAction(row, 'delete');
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
import Select from "@/components/common/Select.vue";
import BottomSheet from "@/components/BottomSheet.vue";
import { icons } from "@/utils/icons";
import { usePagination } from "@/composables/usePagination";
import type { Mechanic } from "../../operation.types";
import type { TableColumn } from "@/components/common/Table.vue";

const emit = defineEmits(["action"]);

const columns: TableColumn<Mechanic>[] = [
  { key: "fullName", label: "Full Name" },
  { key: "employment", label: "Employment" },
  { key: "phoneNumber", label: "Phone Number" },
  { key: "employeeNumber", label: "Employee Number" },
  { key: "dateOfBirth", label: "Date of Birth" },
  { key: "certification", label: "Certification" },
  { key: "experience", label: "Experience" },
  { key: "workshop", label: "Workshop" },
  { key: "actions", label: "Actions", cellAlign: "center" },
];

const searchFieldOptions = [
  { label: "First Name", value: "firstName" },
  { label: "Middle Name", value: "middleName" },
  { label: "Last Name", value: "lastName" },
  { label: "Phone Number", value: "phoneNumber" },
];

const selectedSearchField = ref("firstName");
const searchTerm = ref("");
const showSearchSheet = ref(false);

const dynamicSearchPlaceholder = computed(() => {
  const option = searchFieldOptions.find(
    (o) => o.value === selectedSearchField.value,
  );
  return option ? `Search by ${option.label}...` : "Search...";
});

const activeFilters = ref<any>({});
const { response, refetch } = usePagination<Mechanic>({
  id: "mechanics-list",
  url: "/mechanic",
  params: computed(() => {
    const params: any = { ...activeFilters.value };
    if (searchTerm.value) {
      params[`${selectedSearchField.value}[regex]`] = searchTerm.value;
      params.q = undefined;
    }
    return params;
  }),
});

const handleAction = (row: Mechanic, action: string) => {
  emit("action", { row, action });
};

defineExpose({ refetch });
</script>
