<template>
  <Table
    id="invoice-report-list"
    :columns="columns"
    :rows="response"
    search_placeholder="Search by reference..."
    v-model:search_value="searchTerm"
    @row_click="handleAction($event, 'view')"
  >
    <template #after-search>
      <div
        class="items-center gap-4 inline-flex border-l border-grey-100 overflow-x-auto px-3"
      >
        <i v-html="icons.filter" />
        <InvoiceReportFilters @change="handleFilterChange" />
      </div>
    </template>
    <template #cell-reference="{ value }">
      <span class="font-bold text-primary">{{ value || "-" }}</span>
    </template>

    <template #cell-totalAmount="{ value }">
      <span class="font-bold text-gray-900">
        {{ currencyFormatter(value) }}
      </span>
    </template>

    <template #cell-paymentRequestedDate="{ value }">
      <span class="text-sm text-gray-600">
        {{ dateFormatter(value) }}
      </span>
    </template>

    <template #cell-paymentRequestedBy="{ row }">
      <span class="font-medium text-gray-700">
        {{ row.paymentRequestedBy?.username || "-" }}
      </span>
    </template>

    <template #cell-status="{ value }">
      <Status :variant="value || 'pending'" type="wrapped">
        {{ (value || "Pending").replace(/_/g, " ") }}
      </Status>
    </template>

    <template #cell-actions="{ row }">
      <div class="flex items-center justify-end">
        <Dropdown>
          <template #default="{ close }">
            <!-- <DropDownItem v-permission="'REPORT:update'"
              :icon="icons.edit"
              label="Edit"
              @click.stop="
                handleAction(row, 'edit');
                close();
              "
            /> -->
            <DropDownItem
              v-permission="'REPORT:approve'"
              :icon="icons.check"
              label="Approve"
              @click.stop="
                handleAction(row, 'approve');
                close();
              "
            />
            <DropDownItem
              v-permission="'REPORT:cancel'"
              :icon="icons.close"
              label="Cancel"
              @click.stop="
                handleAction(row, 'cancel');
                close();
              "
            />
            <DropDownItem
              v-permission="'REPORT:read'"
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
import InvoiceReportFilters from "./finance/InvoiceReportFilters.vue";

const emit = defineEmits(["action"]);

const columns: TableColumn<any>[] = [
  { key: "reference", label: "Reference", field: "reference" },
  { key: "totalAmount", label: "Total Amount", field: "totalAmount" },
  {
    key: "paymentRequestedDate",
    label: "Request Date",
    field: "paymentRequestedDate",
  },
  {
    key: "paymentRequestedBy",
    label: "Requested By",
    field: "paymentRequestedBy.username",
  },
  { key: "status", label: "Status", field: "status" },
  { key: "actions", label: "Actions", field: "", cellAlign: "right" },
];

const props = defineProps<{
  filters?: {
    startDate?: string;
    endDate?: string;
  };
}>();

const searchTerm = ref("");
const activeFilters = ref<{ shipper?: string }>({});

const handleFilterChange = (values: { shipper?: string }) => {
  activeFilters.value = values;
};

const { response, refetch } = usePagination<any>({
  id: "invoice-report-list",
  url: "/shipment/paymentRequestedInvoices",
  params: (state) => {
    const params: any = {};
    if (props.filters?.startDate)
      params["createdAt[gte]"] = props.filters.startDate;
    if (props.filters?.endDate)
      params["createdAt[lte]"] = props.filters.endDate;
    if (state.search) params["reference[regexAny]"] = state.search;
    if (activeFilters.value.shipper)
      params.shipper = activeFilters.value.shipper;
    return { ...params, q: undefined };
  },
});

const handleAction = (row: any, action: string) => {
  emit("action", { row, action });
};

defineExpose({ refetch });
</script>
