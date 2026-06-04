<template>
  <!-- Mobile: filter icon next to page title -->
  <Teleport to="#page-title-actions" defer>
    <button
      class="sm:hidden size-8 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
      @click="mobileSearchOpen = true"
    >
      <i class="*:size-4" v-html="icons.filterOptions"></i>
    </button>
  </Teleport>

  <!-- Mobile: search field picker sheet -->
  <BottomSheet v-model="mobileSearchOpen" title="Search By">
    <div class="flex flex-col py-2 px-4 gap-1">
      <button
        class="flex items-center justify-between py-3 px-2 hover:bg-gray-50 rounded-xl transition-colors"
        @click="mobileSearchOpen = false"
      >
        <span class="font-medium">Plate Number</span>
        <i class="*:size-4 text-primary" v-html="icons.check"></i>
      </button>
    </div>
  </BottomSheet>

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
    :sm_row_alignment="{ totalPrice: 'right' }"
    id="tyres-list"
    :columns="columns"
    :rows="response"
    search_placeholder="Search by plate number"
    :on_sm_screen_column_span="{ vehiclePlate: 2, totalPrice: 3 }"
    @row_click="handleAction($event, 'view')"
  >
    <template #cell-vehiclePlate="{ row }">
      <span class="font-bold text-gray-900">{{ row.vehicle?.plateNumber || 'N/A' }}</span>
    </template>

    <template #cell-totalTyres="{ row }">
      <span class="text-base">{{ row.totalTyres }}</span>
    </template>

    <template #cell-totalPrice="{ row }">
      <span class="text-base font-medium">{{ row.totalPrice ? currencyFormatter(row.totalPrice) : '-' }}</span>
    </template>
  </Table>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import Table from "@/components/common/Table.vue";
import BottomSheet from "@/components/BottomSheet.vue";
import { usePagination } from "@/composables/usePagination";
import type { Tyre } from "../operation.types";
import type { TableColumn } from "@/components/common/Table.vue";
import { currencyFormatter } from "@/utils/utils";
import { icons } from "@/utils/icons";

const mobileSearchOpen = ref(false);
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
    q: undefined,
  };
}, { immediate: true });

const handleAction = (row: Tyre, action: string) => {
  emit("action", { row, action });
};

defineExpose({ refetch });
</script>
