<template>
  <Teleport defer to="#page-title-actions">
    <button
      class="sm:hidden size-8 rounded-xl border border-line flex items-center justify-center text-faint-text hover:bg-surface-hover transition-colors"
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
        :class="selectedSearchField === option.value ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-surface-hover'"
        @click="selectedSearchField = option.value; showSearchSheet = false"
      >
        {{ option.label }}
      </button>
    </div>
  </BottomSheet>

  <Table
    :row_alignment="{
      name: 'left',
      tradeName: 'left',
      contactPerson: 'left',
      contactPhone: 'left',
      specialization: 'left',
      tin: 'left',
      location: 'left',
      latitude: 'left',
      longitude: 'left',
      actions: 'right',
    }"
    :head_alignment="{
      name: 'left',
      tradeName: 'left',
      contactPerson: 'left',
      contactPhone: 'left',
      specialization: 'left',
      tin: 'left',
      location: 'left',
      latitude: 'left',
      longitude: 'left',
      actions: 'right',
    }"
    id="workshops-list"
    v-model:search_value="searchTerm"
    :columns="columns"
    :rows="response"
    :search_placeholder="dynamicSearchPlaceholder"
    :hide_on_sm_screen="['tradeName', 'contactPerson', 'specialization', 'tin', 'latitude', 'longitude']"
    :on_sm_screen_column_span="{ name: 2, contactPhone: 2, location: 3 }"
  >
    <template #search-prefix>
      <div
        class="h-full hidden sm:flex items-center border-r border-line pr-2 mr-2 w-38"
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
    <template #cell-name="{ row }">
      <span class="font-medium text-gray-900">{{ row.name }}</span>
    </template>

    <template #cell-tradeName="{ row }">
      <span class="text-gray-600">{{ row.tradeName || '-' }}</span>
    </template>

    <template #cell-contactPerson="{ row }">
      <span class="text-gray-600">{{ row.contactPerson || '-' }}</span>
    </template>

    <template #cell-contactPhone="{ row }">
      <span class="text-gray-600">{{ row.contactPhone || '-' }}</span>
    </template>

    <template #cell-specialization="{ row }">
      <span class="text-gray-600">{{ row.specialization || '-' }}</span>
    </template>

    <template #cell-tin="{ row }">
      <span class="text-gray-600">{{ row.tin || '-' }}</span>
    </template>

    <template #cell-location="{ row }">
      <span class="text-gray-600">
        {{ row.location ? `${row.location.street || ''}, ${row.location.city || ''}, ${row.location.region || ''}`.replace(/^[,\s]+|[,\s]+$/g, '').replace(/,[,\s]*,/g, ', ') || '-' : '-' }}
      </span>
    </template>

    <template #cell-latitude="{ row }">
      <span class="text-gray-600">{{ row.latitude ?? '-' }}</span>
    </template>

    <template #cell-longitude="{ row }">
      <span class="text-gray-600">{{ row.longitude ?? '-' }}</span>
    </template>

    <template #cell-actions="{ row }">
      <div class="flex items-center justify-center">
        <Dropdown>
          <template #default="{ close }">
            <DropDownItem v-permission="'WORKSHOP:read'"
              :icon="icons.eye"
              label="View Details"
              @click.stop="
                handleAction(row, 'view');
                close();
              "
            />
            <DropDownItem v-permission="'WORKSHOP:update'"
              :icon="icons.edit"
              label="Edit"
              @click.stop="
                handleAction(row, 'edit');
                close();
              "
            />
            <DropDownItem v-permission="'WORKSHOP:delete'"
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
import type { Workshop } from "../operation.types";
import type { TableColumn } from "@/components/common/Table.vue";

const emit = defineEmits(["action"]);

const columns: TableColumn<Workshop>[] = [
  { key: "name", label: "Name" },
  { key: "tradeName", label: "Trade Name" },
  { key: "contactPerson", label: "Contact Person" },
  { key: "contactPhone", label: "Phone Number" },
  { key: "specialization", label: "Specialization" },
  { key: "tin", label: "TIN" },
  { key: "location", label: "Location" },
  { key: "latitude", label: "Latitude" },
  { key: "longitude", label: "Longitude" },
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
const { response, refetch } = usePagination<Workshop>({
  id: "workshops-list",
  url: "/workshop",
  params: computed(() => {
    const params: any = { ...activeFilters.value };
    if (searchTerm.value) {
      params[`${selectedSearchField.value}[regex]`] = searchTerm.value;
      params.q = undefined;
    }
    return params;
  }),
});

const handleAction = (row: Workshop, action: string) => {
  emit("action", { row, action });
};

defineExpose({ refetch });
</script>
