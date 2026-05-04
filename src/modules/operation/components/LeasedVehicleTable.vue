<template>
  <Table
    id="leased-vehicle-list"
    :columns="columns"
    :rows="response"
    search_placeholder="Search by plate number..."
    @row_click="handleAction($event, 'view')"
  >
    <template #cell-plateNumber="{ row }">
      <span class="font-bold text-gray-900">{{ row.vehicle?.plateNumber || row.plateNumber || '-' }}</span>
    </template>

    <template #cell-date="{ row }">
      <span class="text-sm text-gray-600">
        {{ dateFormatter(row.createdAt || row.date) }}
      </span>
    </template>

    <template #cell-transporter="{ row }">
      <span class="font-medium text-gray-700">
        {{ row.transporter?.name || row.transporter || '-' }}
      </span>
    </template>

    <template #cell-status="{ row }">
      <Status :variant="row.status || row.settlementStatus || 'PENDING'" type="wrapped">
        {{ (row.status || row.settlementStatus || 'PENDING').replace(/_/g, " ") }}
      </Status>
    </template>

    <template #cell-leaseDirection="{ value }">
      <span class="text-sm text-gray-600">{{ value || 'OUTWARD' }}</span>
    </template>

    <template #cell-payableStatus="{ row }">
      <Status :variant="row.payableStatus || row.settlementStatus || 'PENDING'" type="wrapped">
        {{ (row.payableStatus || row.settlementStatus || 'PENDING').replace(/_/g, " ") }}
      </Status>
    </template>

    <template #cell-total="{ row }">
      <span class="font-bold text-gray-900">
        {{ currencyFormatter(row.total || row.payable || 0) }}
      </span>
    </template>

    <template #cell-actions="{ row }">
      <div class="flex items-center justify-end">
        <Dropdown>
          <template #default="{ close }">
            <DropDownItem
              :icon="icons.eye"
              label="View Details"
              @click.stop="
                handleAction(row, 'view');
                close();
              "
            />
            <DropDownItem
              v-if="row.status !== 'ACTIVE'"
              :icon="icons.edit"
              label="Extend Agreement"
              @click.stop="
                handleAction(row, 'extend');
                close();
              "
            />
            <DropDownItem
              :icon="icons.refresh || icons.edit"
              label="Renew Agreement"
              @click.stop="
                handleAction(row, 'renew');
                close();
              "
            />
            <DropDownItem
              v-if="row.status !== 'TERMINATED'"
              :icon="icons.trash"
              label="Terminate Agreement"
              @click.stop="
                handleAction(row, 'terminate');
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
import type { TableColumn } from "@/components/common/Table.vue";
import { currencyFormatter, dateFormatter } from "@/utils/utils";

const emit = defineEmits(["action"]);

const columns: TableColumn<any>[] = [
  { key: "plateNumber", label: "Plate Number", field: "vehicle" },
  { key: "date", label: "Date", field: "createdAt" },
  { key: "transporter", label: "Transporter", field: "transporter" },
  { key: "status", label: "Status", field: "status" },
  { key: "leaseDirection", label: "Direction", field: "leaseDirection" },
  { key: "payableStatus", label: "Payable Status", field: "payableStatus" },
  { key: "total", label: "Amount", field: "total" },
  { key: "actions", label: "Action", field: "", cellAlign: "right" },
];

const { response, refetch } = usePagination<any>({
  id: "leased-vehicle-list",
  url: "/vehicle-lease-agreement",
});

const handleAction = (row: any, action: string) => {
  emit("action", { row, action });
};

defineExpose({ refetch });
</script>
