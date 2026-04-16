<template>
  <div class="flex flex-col gap-6">
    <Table
      id="shipment-list"
      :columns="columns"
      :rows="response"
      class="bg-white rounded-4xl shadow-sm overflow-hidden"
    >
      <!-- Custom Cells -->
      <template #cell-shipmentCode="{ value }">
        <span class="font-bold text-primary">{{ value }}</span>
      </template>

      <template #cell-driver="{ row }">
        <div class="flex flex-col" v-if="row.driver">
          <span class="font-semibold text-gray-900">
            {{ row.driver.firstName }} {{ row.driver.lastName }}
          </span>
          <span class="text-xs text-gray-400 font-medium" v-if="row.vehicle">
            {{ row.vehicle.plateNumber }}
          </span>
        </div>
        <span v-else class="text-gray-400 italic text-sm">Not Assigned</span>
      </template>

      <template #cell-total="{ value }">
        <span class="font-bold text-gray-900">
          {{ formatCurrency(value) }}
        </span>
      </template>

      <template #cell-status="{ value }">
        <div
          class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider w-fit"
          :class="statusClasses[value] || 'bg-gray-100 text-gray-500'"
        >
          {{ value }}
        </div>
      </template>

      <template #cell-createdAt="{ value }">
        <span class="text-gray-500 text-xs">
          {{ formatDate(value) }}
        </span>
      </template>

      <template #cell-actions="{ row }">
        <div class="flex items-center gap-2 justify-end">
          <Button
            variant="ghost"
            size="sm"
            class="h-9 px-4 text-grey-500 hover:text-primary transition-all rounded-xl"
            @click="handleAction(row, 'view')"
          >
            Details
          </Button>
          <Button
            variant="primary"
            size="sm"
            class="h-9 px-4 rounded-xl"
            @click="handleAction(row, 'update')"
          >
            Update
          </Button>
        </div>
      </template>
    </Table>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import Table from "@/components/common/Table.vue";
import Button from "@/components/Button.vue";
import { usePagination } from "@/composables/usePagination";
import type { ShipmentFilterParams, Shipment } from "../operation.types";
import type { TableColumn } from "@/components/common/Table.vue";

const props = defineProps<{
  filters: ShipmentFilterParams;
}>();

const emit = defineEmits(["action"]);

const columns: TableColumn<Shipment>[] = [
  { key: "shipmentCode", label: "Shipment ID", field: "shipmentCode" },
  {
    key: "route",
    label: "Route",
    field: (row: Shipment) => row.route?.name || "N/A",
  },
  { key: "driver", label: "Driver / Vehicle", field: "driver" },
  { key: "total", label: "Amount", field: "total" },
  { key: "status", label: "Status", field: "status" },
  { key: "createdAt", label: "Created At", field: "createdAt" },
  { key: "actions", label: "Actions", field: "", cellAlign: "right" },
];

const { response, setPage, refetch } = usePagination<Shipment>({
  id: "shipment-list",
  url: "/shipment/all",
  params: computed(() => props.filters),
});

watch(
  () => props.filters,
  () => {
    setPage(1);
  },
  { deep: true },
);

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
  }).format(val || 0);
};

const formatDate = (val: string) => {
  if (!val) return "N/A";
  return new Date(val).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const statusClasses: Record<string, string> = {
  pending: "bg-orange-50 text-orange-600",
  active: "bg-blue-50 text-blue-600",
  completed: "bg-emerald-50 text-emerald-600",
  cancelled: "bg-red-50 text-red-600",
};

const handleAction = (row: Shipment, action: string) => {
  emit("action", { row, action });
};

defineExpose({ refetch });
</script>
