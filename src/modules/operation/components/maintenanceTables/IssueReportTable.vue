<template>
  <Table
    :row_alignment="{
      driver: 'left',
      type: 'left',
      severity: 'left',
      status: 'left',
      location: 'left',
      createdAt: 'left',
      actions: 'right',
    }"
    :head_alignment="{
      driver: 'left',
      type: 'left',
      severity: 'left',
      status: 'left',
      location: 'left',
      createdAt: 'left',
      actions: 'right',
    }"
    id="issue-reports-list"
    :columns="columns"
    :rows="response"
  >
    <template #cell-driver="{ row }">
      <div class="text-sm text-gray-700">
        <div class="font-medium text-gray-900">{{ row.driver?.firstName || '' }} {{ row.driver?.lastName || '' }}</div>
        <div class="text-xs text-gray-500">{{ row.driver?.email || 'N/A' }}</div>
      </div>
    </template>

    <template #cell-type="{ row }">
      <span class="text-gray-600">{{ row.type || '-' }}</span>
    </template>

    <template #cell-severity="{ row }">
      <span :class="getSeverityClass(row.severity)" class="inline-flex rounded-full px-2 py-1 text-xs font-semibold">
        {{ row.severity || '-' }}
      </span>
    </template>

    <template #cell-status="{ row }">
      <Status :variant="getStatusVariant(row.status)">{{ row.status || 'OPEN' }}</Status>
    </template>

    <template #cell-location="{ row }">
      <span class="text-gray-600">{{ row.location || 'N/A' }}</span>
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
                handleAction(row, 'edit-status');
                close();
              "
            >
              Change Status
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
import Status from "@/components/common/Status.vue";
import { usePagination } from "@/composables/usePagination";
import type { IssueReport } from "../../operation.types";
import type { TableColumn } from "@/components/common/Table.vue";

const emit = defineEmits(["action"]);

const columns: TableColumn<IssueReport>[] = [
  { key: "driver", label: "Driver" },
  { key: "type", label: "Type" },
  { key: "severity", label: "Severity" },
  { key: "status", label: "Status" },
  { key: "location", label: "Location" },
  { key: "createdAt", label: "Created At" },
  { key: "actions", label: "Actions", cellAlign: "right" },
];

const activeFilters = ref({});
const { response, refetch } = usePagination<IssueReport>({
  id: "issue-reports-list",
  url: "/issue-report",
  params: computed(() => activeFilters.value),
});

const getSeverityClass = (severity?: string) => {
  const classes: Record<string, string> = {
    LOW: "bg-blue-100 text-blue-800",
    MEDIUM: "bg-yellow-100 text-yellow-800",
    HIGH: "bg-orange-100 text-orange-800",
    CRITICAL: "bg-red-600 text-white",
  };
  return severity && classes[severity] ? classes[severity] : "bg-gray-100 text-gray-800";
};

const getStatusVariant = (status?: string) => {
  switch (status) {
    case "OPEN":
      return "warning";
    case "IN_PROGRESS":
      return "active";
    case "RESOLVED":
      return "completed";
    case "CLOSED":
      return "closed"; // Will fall back to grey in Status.vue
    default:
      return "warning";
  }
};

const handleAction = (row: IssueReport, action: string) => {
  emit("action", { row, action });
};

defineExpose({ refetch });
</script>
