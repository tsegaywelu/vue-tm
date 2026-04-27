<template>
  <Table
    :row_alignment="{
      serialNumber: 'left',
      vehiclePlate: 'left',
      brand: 'left',
      tyrePosition: 'left',
      price: 'right',
      status: 'left',
      actions: 'right',
    }"
    :head_alignment="{
      serialNumber: 'left',
      vehiclePlate: 'left',
      brand: 'left',
      tyrePosition: 'left',
      price: 'right',
      status: 'left',
      actions: 'right',
    }"
    id="tyre-detail-list"
    :columns="columns"
    :rows="response"
  >
    <template #cell-serialNumber="{ row }">
      <span class="font-medium text-gray-900">{{ row.serialNumber || '-' }}</span>
    </template>

    <template #cell-vehiclePlate="{ row }">
      <span class="text-gray-900">{{ row.vehicle?.plateNumber || '-' }}</span>
    </template>

    <template #cell-brand="{ row }">
      <span class="text-gray-600">{{ row.brand || '-' }}</span>
    </template>

    <template #cell-tyrePosition="{ row }">
      <span class="text-gray-600">{{ formatPosition(row.tyrePosition) || '-' }}</span>
    </template>

    <template #cell-price="{ row }">
      <span class="text-gray-900 font-medium">{{ row.price ? currencyFormatter(row.price) : '-' }}</span>
    </template>

    <template #cell-status="{ row }">
      <Status :variant="getStatusVariant(row.status)">{{ row.status || 'AVAILABLE' }}</Status>
    </template>

    <template #cell-actions="{ row }">
      <div class="flex items-center justify-end">
        <Dropdown>
          <template #default="{ close }">
            <button
              class="w-full text-left px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              @click="
                handleAction(row, 'decommission');
                close();
              "
            >
              Decommission
            </button>
            <button
              class="w-full text-left px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              @click="
                handleAction(row, 'inspect');
                close();
              "
            >
              Inspect
            </button>
            <button
              class="w-full text-left px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              @click="
                handleAction(row, 'repair');
                close();
              "
            >
              Repair
            </button>
            <button
              class="w-full text-left px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              @click="
                handleAction(row, 'replace');
                close();
              "
            >
              Replace
            </button>
            <button
              class="w-full text-left px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              @click="
                handleAction(row, 'rethread');
                close();
              "
            >
              Rethread
            </button>
            <button
              class="w-full text-left px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              @click="
                handleAction(row, 'rotate');
                close();
              "
            >
              Rotate
            </button>
            <button
              class="w-full text-left px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              @click="
                handleAction(row, 'reassign');
                close();
              "
            >
              Reassign
            </button>
          </template>
        </Dropdown>
      </div>
    </template>
  </Table>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import Table from "@/components/common/Table.vue";
import Dropdown from "@/components/common/Dropdown.vue";
import Status from "@/components/common/Status.vue";
import { usePagination } from "@/composables/usePagination";
import type { Tyre } from "../operation.types";
import type { TableColumn } from "@/components/common/Table.vue";
import { currencyFormatter } from "@/utils/utils";

const props = defineProps<{
  vehicleId?: string;
}>();

const emit = defineEmits(["action"]);

const columns: TableColumn<Tyre>[] = [
  { key: "serialNumber", label: "Serial Number" },
  { key: "vehiclePlate", label: "Vehicle" },
  { key: "brand", label: "Brand" },
  { key: "tyrePosition", label: "Tyre Position" },
  { key: "price", label: "Price", cellAlign: "right" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions", cellAlign: "right" },
];

const activeFilters = ref<{ vehicle?: string }>({});

watch(
  () => props.vehicleId,
  (newId) => {
    if (newId) {
      activeFilters.value.vehicle = newId;
    } else {
      delete activeFilters.value.vehicle;
    }
  },
  { immediate: true }
);

const { response, refetch } = usePagination<Tyre>({
  id: "tyre-detail-list",
  url: "/tyre",
  params: computed(() => activeFilters.value),
});

const getStatusVariant = (status?: string) => {
  if (!status) return "active";
  switch (status.toUpperCase()) {
    case "INSTALLED":
      return "active";
    case "AVAILABLE":
    case "SPARE":
      return "completed";
    case "IN_REPAIR":
    case "REPAIRING":
      return "pending";
    case "DECOMMISSIONED":
    case "SCRAPPED":
      return "cancelled";
    default:
      return "active";
  }
};

const formatPosition = (position?: string) => {
  if (!position) return "";
  return position
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
};

import { openModal } from "@customizer/modal-x";
const handleAction = (row: Tyre, action: string) => {
  let modalName: string | null = null;

  switch (action) {
    case "decommission":
      modalName = "Decommission";
      break;
    case "inspect":
      modalName = "Inspect";
      break;
    case "repair":
      modalName = "Repair";
      break;
    case "replace":
      modalName = "Replace";
      break;
    case "rethread":
      modalName = "Rethread";
      break;
    case "rotate":
      modalName = "Rotate";
      break;
    case "reassign":
      modalName = "Reassign";
      break;
  }

  if (modalName) {
    openModal(
      modalName as any, 
      { tyre: row }, 
      (res) => {
        if (res) refetch();
      }
    );
  }

  emit("action", { row, action });
};

defineExpose({ refetch });
</script>
