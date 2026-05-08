<template>
  <Table
    id="receivable-lease-list"
    :columns="columns"
    :rows="response"
    search_placeholder="Search by plate number..."
    @row_click="handleAction($event, 'view')"
  >
    <template #cell-vehicle="{ row }">
      <span class="font-bold">{{ row.vehicle?.plateNumber || '-' }}</span>
    </template>

    <template #cell-transporter="{ row }">
      <span class="font-medium text-gray-700">
        {{ row.transporter?.name || row.transporter || '-' }}
      </span>
    </template>

    <template #cell-leaseDirection="{ value }">
      <span class="text-sm text-gray-600">{{ value || 'OUTWARD' }}</span>
    </template>

    <template #cell-settlementStatus="{ row }">
      <Status :variant="row.settlementStatus || row.payableStatus || 'PENDING'" type="wrapped">
        {{ (row.settlementStatus || row.payableStatus || 'PENDING').replace(/_/g, " ") }}
      </Status>
    </template>

    <template #cell-total="{ row }">
      <span class="font-bold text-gray-900">
        {{ currencyFormatter(row.total || row.payable || 0) }}
      </span>
    </template>

    <template #cell-createdAt="{ value }">
      <span class="text-sm text-gray-600">
        {{ dateFormatter(value) }}
      </span>
    </template>

    <template #extra-actions>
      <div class="items-center gap-4 inline-flex border-l border-grey-100 overflow-x-auto px-3">
        <i v-html="icons.filter" />
        <Form
          id="receivable-lease-filter"
          @change="handleFilterChange"
          class="[&_.input-focus]:bg-grey-25 flex-1 flex max-h-16 h-16 min-h-16 *:w-[220px] *:shrink-0 px-2 gap-2 overflow-auto"
        >
          <SelectInput
            :show_validation_status="false"
            label="Settlement Status"
            name="settlementStatus"
            size="xs"
            :options="[
              { label: 'All', value: '' },
              { label: 'Pending', value: 'PENDING' },
              { label: 'Approved', value: 'APPROVED' },
              { label: 'Authorized', value: 'AUTHORIZED' },
              { label: 'Settled', value: 'SETTLED' },
              { label: 'Cancelled', value: 'CANCELLED' },
              { label: 'Rejected', value: 'REJECTED' }
            ]"
            :attributes="{ placeholder: 'Select Status' }"
          />
        </Form>
      </div>
    </template>

    <template #cell-actions="{ row }">
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
            <DropDownItem
              v-if="(row.settlementStatus || row.payableStatus) === 'AUTHORIZED'"
              v-permission="'VEHICLE_LEASE_AGREEMENT:pay'"
              :icon="icons.cash"
              label="Collect"
              @click.stop="
                handleAction(row, 'pay');
                close();
              "
            />
            <DropDownItem
              v-if="(row.settlementStatus || row.payableStatus) === 'APPROVED'"
              v-permission="'VEHICLE_LEASE_AGREEMENT:authorize'"
              :icon="icons.checkCircle"
              label="Authorize"
              @click.stop="
                handleAction(row, 'authorize');
                close();
              "
            />
            <DropDownItem
              v-if="(row.settlementStatus || row.payableStatus) === 'APPROVED'"
              v-permission="'VEHICLE_LEASE_AGREEMENT:update'"
              variant="danger"
              :icon="icons.closeCircle"
              label="Cancel"
              @click.stop="
                handleAction(row, 'cancel');
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
import { computed, ref, watch } from "vue";
import Table from "@/components/common/Table.vue";
import Dropdown from "@/components/common/Dropdown.vue";
import DropDownItem from "@/components/common/DropDownItem.vue";
import Status from "@/components/common/Status.vue";
import Form from "@/components/form/Form.vue";
import SelectInput from "@/components/form/SelectInput.vue";
import { icons } from "@/utils/icons";
import { usePagination } from "@/composables/usePagination";
import type { TableColumn } from "@/components/common/Table.vue";
import { currencyFormatter, dateFormatter } from "@/utils/utils";

const emit = defineEmits(["action"]);

const columns: TableColumn<any>[] = [
  { key: "vehicle", label: "Vehicle", field: "vehicle" },
  { key: "transporter", label: "Transporter", field: "transporter" },
  { key: "leaseDirection", label: "Direction", field: "leaseDirection" },
  { key: "settlementStatus", label: "Status", field: "settlementStatus" },
  { key: "createdAt", label: "Created At", field: "createdAt" },
  { key: "total", label: "Amount", field: "total" },
  { key: "actions", label: "Actions", field: "", cellAlign: "right" },
];

const activeFilters = ref({ leaseDirection: 'OUTWARD' });
const { response, refetch } = usePagination<any>({
  id: "receivable-lease-list",
  url: "/vehicle-lease-agreement",
  params: computed(() => activeFilters.value),
});

const handleFilterChange = (newFilters: any) => {
  activeFilters.value = { ...activeFilters.value, ...newFilters };
};

const handleAction = (row: any, action: string) => {
  emit("action", { row, action });
};

defineExpose({ refetch, response });
</script>
