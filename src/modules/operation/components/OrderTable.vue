<template>
  <Table
    :row_alignment="{
      order: 'left',
      details: 'left',
      carrier: 'left',
    }"
    :head_alignment="{
      order: 'left',
      details: 'left',
      carrier: 'left',
      actions: 'center',
    }"
    id="order-list"
    :columns="columns"
    :rows="response"
  >
    <template #cell-order="{ row }">
      <div class="flex flex-col">
        <div class="flex items-center gap-1">
          <span class="font-semibold text-gray-900">
            {{ row?.route?.routeName || "N/A" }}
          </span>
          <div
            v-if="row.priority"
            class="w-4 h-4 flex items-center justify-center text-[10px] rounded-full"
            :class="{
              'bg-red-100 text-red-600 font-semibold':
                row.priority === 'URGENT',
              'bg-orange-100 text-orange-500 font-semibold':
                row.priority === 'HIGH',
              'bg-yellow-100 text-yellow-500 font-medium':
                row.priority === 'MEDIUM',
              'bg-blue-100 text-blue-500 font-normal': row.priority === 'LOW',
            }"
          >
            {{ row.priority?.charAt(0) }}
          </div>
        </div>
        <span class="text-gray-400 font-medium">
          {{ row.agent?.name || "N/A" }}
        </span>
      </div>
    </template>

    <template #cell-details="{ row }">
      <div class="flex flex-col">
        <span class="font-semibold text-gray-900">
          {{ row?.vehicleType?.name || "N/A" }}
        </span>
        <span class="text-gray-400 font-medium">
          {{
            Array.isArray(row.commodity)
              ? row.commodity.map((c: any) => c.name).join(", ")
              : row.commodity?.name || row.commodity || ""
          }}
        </span>
        <span class="text-gray-400 font-medium">
          {{ row.totalRequest }} - {{ row.unitOfMeasurement }}
        </span>
      </div>
    </template>

    <template #cell-created="{ row }">
      <span class="text-base">
        {{ row.createdAt?.split("T")[0] }}
      </span>
    </template>

    <template #cell-carrier="{ row }">
      <div class="flex flex-col">
        <span class="font-semibold text-gray-900">
          {{ row.carrier?.name }}
        </span>
        <span class="text-gray-400 font-medium">{{ row.orderCode }}</span>
      </div>
    </template>

    <template #cell-status="{ row }">
      <Status :variant="row.status" type="wrapped">
        {{ row.status }}
      </Status>
    </template>

    <template #cell-actions="{ row }">
      <Dropdown>
        <template #default="{ close }">
          <!-- <button
            v-if="row.status === 'pending' || row.status === 'approved'"
            class="w-full text-left px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-50 text-primary transition-colors"
            @click="
              handleShip(row);
              close();
            "
          >
            Ship
          </button>
          <button
            v-if="row.status === 'pending'"
            class="w-full text-left px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-50 text-red-500 transition-colors"
            @click="
              handleReject(row);
              close();
            "
          >
            Reject
          </button> -->
          <span
            v-if="row.status === 'shipped' || row.status === 'cancelled'"
            class="block px-3 py-2 text-sm font-medium text-gray-400 italic"
          >
            No actions available
          </span>
        </template>
      </Dropdown>
    </template>
  </Table>
</template>

<script setup lang="ts">
import Table from "@/components/common/Table.vue";
import type { TableColumn } from "@/components/common/Table.vue";
import Status from "@/components/common/Status.vue";
import Dropdown from "@/components/common/Dropdown.vue";
import { usePagination } from "@/composables/usePagination";

const emit = defineEmits(["action"]);

const columns: TableColumn[] = [
  { key: "order", label: "Order", field: "route" },
  { key: "details", label: "Details", field: "vehicleType" },
  { key: "created", label: "Created", field: "createdAt" },
  { key: "carrier", label: "Carrier", field: "carrier" },
  { key: "status", label: "Status", field: "status" },
  { key: "actions", label: "Actions", field: "", cellAlign: "right" },
];

const { response, refetch } = usePagination({
  id: "order-list",
  url: "/order/shipper",
});

const handleShip = (row: any) => {
  emit("action", { row, action: "ship" });
};

const handleReject = (row: any) => {
  emit("action", { row, action: "reject" });
};

defineExpose({ refetch });
</script>
