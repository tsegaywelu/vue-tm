<template>
  <Table
    id="expense-list"
    :columns="columns"
    :rows="response"
    v-model:search_value="searchTerm"
    search_placeholder="Search by plate number..."
    @row_click="handleAction($event, 'view')"
  >
    <template #cell-plateNumber="{ value }">
      <span class="font-bold">{{ value || '-' }}</span>
    </template>

    <template #cell-totalFuelCost="{ value }">
      <span class="text-gray-900">{{ currencyFormatter(value || 0) }}</span>
    </template>

    <template #cell-totalMaintenanceCost="{ value }">
      <span class="text-gray-900">{{ currencyFormatter(value || 0) }}</span>
    </template>

    <template #cell-totalTyreCost="{ value }">
      <span class="text-gray-900">{{ currencyFormatter(value || 0) }}</span>
    </template>

    <template #cell-totalInsuranceCost="{ value }">
      <span class="text-gray-900">{{ currencyFormatter(value || 0) }}</span>
    </template>

    <template #cell-totalExpenses="{ value }">
      <span class="font-bold text-gray-900">{{ currencyFormatter(value || 0) }}</span>
    </template>

    <!-- <template #cell-actions="{ row }">
      <div class="flex items-center justify-end">
         <Dropdown>
          <template #default="{ close }">
            <DropDownItem v-permission="'TRANSACTION:read'"
              :icon="icons.eye"
              label="Details"
              @click.stop="
                handleAction(row, 'view');
                close();
              "
            />
          </template>
        </Dropdown> 
      </div>
    </template> -->
  
  </Table>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import Table from "@/components/common/Table.vue";
import { usePagination } from "@/composables/usePagination";
import type { TableColumn } from "@/components/common/Table.vue";
import { currencyFormatter } from "@/utils/utils";


const props = defineProps<{
  filters?: {
    startDate?: string;
    endDate?: string;
  };
}>();

const emit = defineEmits(["action"]);

const columns: TableColumn<any>[] = [
  { key: "plateNumber", label: "Vehicle", field: "plateNumber" },
  { key: "totalFuelCost", label: "Fuel Cost", field: "totalFuelCost" },
  { key: "totalMaintenanceCost", label: "Maintenance Cost", field: "totalMaintenanceCost" },
  { key: "totalTyreCost", label: "Tyre Cost", field: "totalTyreCost" },
  { key: "totalInsuranceCost", label: "Insurance Cost", field: "totalInsuranceCost" },
  { key: "totalExpenses", label: "Total Cost", field: "totalExpenses" },
];

const searchTerm = ref("");

const { response, refetch } = usePagination<any>({
  id: "expense-list",
  url: "/expense",
  method: "POST",
  paginate: false,
  params: computed(() => {
    const params: any = {};
    if (props.filters?.startDate) {
      params["createdAt[gte]"] = props.filters.startDate;
    }
    if (props.filters?.endDate) {
      params["createdAt[lte]"] = props.filters.endDate;
    }
    if (searchTerm.value) {
      params.plateNumber = searchTerm.value;
      params.q = undefined;
    }
    return params;
  }),
});

const handleAction = (row: any, action: string) => {
  emit("action", { row, action });
};

defineExpose({ refetch });
</script>
