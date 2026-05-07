<template>
  <Table
    :row_alignment="{
      vehiclePlate: 'left',
      totalTyres: 'center',
      totalPrice: 'center',
    
    }"
    :head_alignment="{
      vehiclePlate: 'left',
      totalTyres: 'center',
      totalPrice: 'center',
     
    }"
    id="tyres-list"
    :columns="columns"
    :rows="response"
    search_placeholder="Search by plate number"
    
    @row_click="handleAction($event, 'view')"
  >
  <template >

  </template>
    <template #cell-vehiclePlate="{ row }">
      <span class="font-bold text-gray-900">{{ row.vehicle?.plateNumber || 'N/A' }}</span>
    </template>

    <template #cell-totalTyres="{ row }">
      <span class="text-base">{{ row.totalTyres }}</span>
    </template>

    <template #cell-totalPrice="{ row }">
      <span class="text-base font-medium">{{ row.totalPrice ? currencyFormatter(row.totalPrice) : '-' }}</span>
    </template>

    <!-- <template #cell-actions="{ row }">
      <div class="flex items-center justify-end">
        <Dropdown>
          <template #default="{ close }">
            <button v-permission="'TYRE:read'"
              class="w-full text-left px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              @click="
                handleAction(row, 'view');
                close();
              "
            >
              Details
            </button>
          </template>
        </Dropdown>
      </div>
    </template> -->
  </Table>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import Table from "@/components/common/Table.vue";
import Dropdown from "@/components/common/Dropdown.vue";
import { usePagination } from "@/composables/usePagination";
import type { Tyre } from "../operation.types";
import type { TableColumn } from "@/components/common/Table.vue";
import { currencyFormatter } from "@/utils/utils";

const emit = defineEmits(["action"]);

const columns: TableColumn<Tyre>[] = [
  { key: "vehiclePlate", label: "Vehicle Plate", sortable: true, sort_key: "vehicle.plateNumber" },
  { key: "totalTyres", label: "Total Tyres", cellAlign: "center", sortable: true, sort_key: "totalTyres" },
  { key: "totalPrice", label: "Total Price", cellAlign: "center", sortable: true, sort_key: "totalPrice" },
 
];

const activeFilters = ref<Record<string, any>>({});

const pagination = usePagination<Tyre>({
  id: "tyres-list",
  url: "/tyre/vehicle",
  params: computed(() => activeFilters.value),
});

const { response, refetch, debouncedSearch } = pagination;

watch(debouncedSearch, (newVal) => {
  activeFilters.value = {
    ...activeFilters.value,
    search: newVal || undefined,
    q: undefined
  };
}, { immediate: true });

const handleAction = (row: Tyre, action: string) => {
  emit("action", { row, action });
};

defineExpose({ refetch });
</script>
