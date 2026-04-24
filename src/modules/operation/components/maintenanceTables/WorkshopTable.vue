<template>
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
    :columns="columns"
    :rows="response"
  >
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
  { key: "actions", label: "Actions", cellAlign: "right" },
];

const activeFilters = ref({});
const { response, refetch } = usePagination<Workshop>({
  id: "workshops-list",
  url: "/workshop",
  params: computed(() => activeFilters.value),
});

const handleAction = (row: Workshop, action: string) => {
  emit("action", { row, action });
};

defineExpose({ refetch });
</script>
