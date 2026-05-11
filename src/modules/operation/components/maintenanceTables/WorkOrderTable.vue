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
      <div class="h-full flex items-center border-r border-gray-200 pr-2 mr-2">
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
      <span class="font-medium text-gray-900">{{
        row.vehicle?.plateNumber || "-"
      }}</span>
    </template>

    <template #cell-date="{ row }">
      <span class="text-gray-600">{{
        row.createdAt ? row.createdAt.split("T")[0] : "-"
      }}</span>
    </template>

    <template #cell-statusAction="{ row }">
      <Status :variant="row.status || 'pending'">{{
        row.status || "PENDING"
      }}</Status>
    </template>

    <template #cell-contacts="{ row }">
      <span class="text-gray-600">
        {{
          row.mechanics && row.mechanics.length > 0
            ? row.mechanics
                .map(
                  (m: any) =>
                    m.name || `${m.firstName || ""} ${m.lastName || ""}`.trim(),
                )
                .join(", ")
            : "-"
        }}
      </span>
    </template>

    <template #cell-workType="{ row }">
      <span class="text-gray-600">{{ row.workType || "-" }}</span>
    </template>

    <template #cell-workArea="{ row }">
      <span class="text-gray-600">{{ row.workArea || "-" }}</span>
    </template>

    <template #cell-partsCost="{ row }">
      <span class="text-gray-600">{{
        row.costBreakdown?.partsCost ?? "-"
      }}</span>
    </template>

    <template #cell-actions="{ row }">
      <div class="flex items-center justify-center">
        <Dropdown>
          <template #default="{ close }">
            <DropDownItem
              v-permission="'WORK_ORDER:approve'"
              v-if="row.status === 'PENDING'"
              :icon="icons.check"
              label="Approve"
              class="text-brightBlue-dark"
              @click.stop="
                handleAction(row, 'approve');
                close();
              "
            />
            <DropDownItem
              v-permission="'WORK_ORDER:cancel'"
              v-if="row.status === 'PENDING'"
              :icon="icons.close"
              label="Reject"
              class="text-error-600"
              @click.stop="
                handleAction(row, 'cancel');
                close();
              "
            />
            <DropDownItem
              v-permission="'WORK_ORDER:update'"
              v-if="row.status === 'APPROVED'"
              :icon="icons.check"
              label="Complete"
              class="text-brightBlue-dark"
              @click.stop="
                handleAction(row, 'complete');
                close();
              "
            />
            <DropDownItem
              v-permission="'WORK_ORDER:read'"
              :icon="icons.eye"
              label="View Details"
              @click.stop="
                handleAction(row, 'view');
                close();
              "
            />
            <DropDownItem
              v-permission="'WORK_ORDER:update'"
              :icon="icons.edit"
              label="Edit"
              @click.stop="
                handleAction(row, 'edit');
                close();
              "
            />
            <DropDownItem
              v-permission="'WORK_ORDER:delete'"
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
import Status from "@/components/common/Status.vue";
import Select from "@/components/common/Select.vue";
import { icons } from "@/utils/icons";
import { usePagination } from "@/composables/usePagination";
import type { WorkOrder } from "../../operation.types";
import type { TableColumn } from "@/components/common/Table.vue";

const emit = defineEmits(["action"]);

const columns: TableColumn<WorkOrder>[] = [
  { key: "vehicle", label: "Vehicle" },
  { key: "date", label: "Date" },
  { key: "contacts", label: "Contacts" },
  { key: "workType", label: "Work Type" },
  { key: "workArea", label: "Work Area" },
  { key: "partsCost", label: "Parts Cost" },
  { key: "statusAction", label: "Status" },
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
