<template>
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
    :columns="columns"
    :rows="response"
  >
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
import { usePagination } from "@/composables/usePagination";
import type { Mechanic } from "../operation.types";
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
  { key: "actions", label: "Actions", cellAlign: "right" },
];

const activeFilters = ref({});
const { response, refetch } = usePagination<Mechanic>({
  id: "mechanics-list",
  url: "/mechanic",
  params: computed(() => activeFilters.value),
});

const handleAction = (row: Mechanic, action: string) => {
  emit("action", { row, action });
};

defineExpose({ refetch });
</script>
