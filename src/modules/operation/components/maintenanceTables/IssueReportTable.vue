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
    :hide_on_sm_screen="['severity', 'location', 'createdAt']"
    :on_sm_screen_column_span="{ driver: 2, type: 2, status: 3 }"
  >
    <template #after-search>
      <div
        class="items-center gap-4 hidden sm:flex border-l border-grey-100 overflow-x-auto px-3"
      >
        <i v-html="icons.filter" />
        <IssueReportFilters @change="handleFilterChange" />
      </div>
    </template>
    <template #cell-driver="{ row }">
      <div class="text-sm text-gray-700">
        <div class="font-medium text-gray-900">
          {{ row.driver?.firstName || "" }} {{ row.driver?.lastName || "" }}
        </div>
        <div class="text-xs text-gray-500">
          {{ row.driver?.email || "N/A" }}
        </div>
      </div>
    </template>

    <template #cell-type="{ row }">
      <span class="text-gray-600">{{ row.type || "-" }}</span>
    </template>

    <template #cell-severity="{ row }">
      <span
        :class="getSeverityClass(row.severity)"
        class="inline-flex rounded-full px-2 py-1 text-xs font-semibold"
      >
        {{ row.severity || "-" }}
      </span>
    </template>

    <template #cell-status="{ row }">
      <Status :variant="getStatusVariant(row.status)">{{
        row.status || "OPEN"
      }}</Status>
    </template>

    <template #cell-location="{ row }">
      <span class="text-gray-600">{{ row.location || "N/A" }}</span>
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
            <DropDownItem
              v-permission="'ISSUE_REPORT:read'"
              :icon="icons.eye"
              label="View Details"
              @click.stop="
                handleAction(row, 'view');
                close();
              "
            />
            <DropDownItem
              v-permission="'ISSUE_REPORT:update'"
              :icon="icons.edit"
              label="Change Status"
              @click.stop="
                handleAction(row, 'edit-status');
                close();
              "
            />
            <DropDownItem
              v-permission="'ISSUE_REPORT:delete'"
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
import type { IssueReport } from "../../operation.types";
import type { TableColumn } from "@/components/common/Table.vue";

import IssueReportFilters from "../IssueReportFilters.vue";

const emit = defineEmits(["action"]);

const columns: TableColumn<IssueReport>[] = [
  { key: "driver", label: "Driver" },
  { key: "type", label: "Type" },
  { key: "severity", label: "Severity" },
  { key: "location", label: "Location" },
  { key: "createdAt", label: "Created At" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions", cellAlign: "center" },
];

const activeFilters = ref<any>({});

const { response, refetch } = usePagination<IssueReport>({
  id: "issue-reports-list",
  url: "/issue-report",
  params: computed(() => ({
    ...activeFilters.value,
  })),
});

const handleFilterChange = (filters: any) => {
  activeFilters.value = filters;
};

const getSeverityClass = (severity?: string) => {
  const classes: Record<string, string> = {
    LOW: "bg-blue-100 text-blue-800",
    MEDIUM: "bg-yellow-100 text-yellow-800",
    HIGH: "bg-orange-100 text-orange-800",
    CRITICAL: "bg-red-600 text-white",
  };
  return severity && classes[severity]
    ? classes[severity]
    : "bg-gray-100 text-gray-800";
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
