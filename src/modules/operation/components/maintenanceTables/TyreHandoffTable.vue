<template>
  <Table
    :row_alignment="{
      serialNumber: 'left',
      eventType: 'left',
      status: 'left',
      vehicle: 'left',
      assignedTo: 'left',
      createdAt: 'left',
      actions: 'right',
    }"
    :head_alignment="{
      serialNumber: 'left',
      eventType: 'left',
      status: 'left',
      vehicle: 'left',
      assignedTo: 'left',
      createdAt: 'left',
      actions: 'right',
    }"
    id="tyre-handoffs-list"
    :columns="columns"
    :rows="response"
  >
    <template #cell-serialNumber="{ row }">
      <span class="font-medium text-gray-900">{{ row.serialNumber || '-' }}</span>
    </template>

    <template #cell-eventType="{ row }">
      <span :class="getEventTypeClass(row.eventType)" class="inline-flex rounded-full px-2 py-1 text-xs font-semibold">
        {{ formatEventType(row.eventType) || '-' }}
      </span>
    </template>

    <template #cell-status="{ row }">
      <Status :variant="getStatusVariant(row.status)">{{ row.status || 'PENDING' }}</Status>
    </template>

    <template #cell-vehicle="{ row }">
      <div class="text-gray-900" v-if="row.toVehicle || row.fromVehicle">
        <span v-if="row.toVehicle">To: {{ row.toVehicle?.plateNumber || 'N/A' }}</span>
        <span v-else-if="row.fromVehicle">From: {{ row.fromVehicle?.plateNumber || 'N/A' }}</span>
      </div>
      <span v-else class="text-gray-400">-</span>
    </template>

    <template #cell-assignedTo="{ row }">
      <span class="text-gray-600">{{ row.assignedTo?.username || 'Unassigned' }}</span>
    </template>

    <template #cell-createdAt="{ row }">
      <span class="text-gray-600">
        {{
          row.createdAt
            ? new Date(row.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "-"
        }}
      </span>
    </template>

    <template #cell-actions="{ row }">
      <div class="flex items-center justify-center">
        <Dropdown>
          <template #default="{ close }">
            <DropDownItem v-permission="'TYRE:read'"
              :icon="icons.eye"
              label="View Details"
              @click.stop="
                handleAction(row, 'view');
                close();
              "
            />
            <DropDownItem v-permission="'TYRE:update'"
              v-if="row.status === 'PENDING'"
              :icon="icons.edit"
              label="Assign"
              @click.stop="
                handleAction(row, 'assign');
                close();
              "
            />
            <DropDownItem v-permission="'TYRE:delete'"
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
import { icons } from "@/utils/icons";
import { usePagination } from "@/composables/usePagination";
import type { TyreHandoff } from "../operation.types";
import type { TableColumn } from "@/components/common/Table.vue";

const emit = defineEmits(["action"]);

const columns: TableColumn<TyreHandoff>[] = [
  { key: "serialNumber", label: "Serial Number" },
  { key: "eventType", label: "Event Type" },
  { key: "status", label: "Status" },
  { key: "vehicle", label: "Vehicle" },
  { key: "assignedTo", label: "Assigned To" },
  { key: "createdAt", label: "Created At" },
  { key: "actions", label: "Actions", cellAlign: "center" },
];

const activeFilters = ref({});
const { response, refetch } = usePagination<TyreHandoff>({
  id: "tyre-handoffs-list",
  url: "/tyre-handoffs",
  params: computed(() => activeFilters.value),
});

const getStatusVariant = (status?: string) => {
  switch (status) {
    case "PENDING":
      return "pending";
    case "IN_PROGRESS":
      return "active";
    case "COMPLETED":
      return "completed";
    case "FAILED":
    case "CANCELLED":
      return "cancelled";
    default:
      return "pending";
  }
};

const getEventTypeClass = (eventType?: string) => {
  const classes: Record<string, string> = {
    ISSUE_TO_MAINTENANCE: "bg-purple-100 text-purple-800",
    INSTALL_ON_VEHICLE: "bg-green-100 text-green-800",
    REMOVE_FROM_VEHICLE: "bg-orange-100 text-orange-800",
    RETURN_TO_STORE: "bg-blue-100 text-blue-800",
    REISSUE_FROM_STORE: "bg-indigo-100 text-indigo-800",
    TRANSFER_VEHICLE_TO_VEHICLE: "bg-cyan-100 text-cyan-800",
    DECOMMISSION: "bg-red-100 text-red-800",
    CANCELLED: "bg-gray-100 text-gray-800",
    FAILED: "bg-red-100 text-red-800",
  };
  return eventType && classes[eventType] ? classes[eventType] : "bg-gray-100 text-gray-800";
};

const formatEventType = (eventType?: string) => {
  if (!eventType) return "";
  return eventType
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());
};

const handleAction = (row: TyreHandoff, action: string) => {
  emit("action", { row, action });
};

defineExpose({ refetch });
</script>
