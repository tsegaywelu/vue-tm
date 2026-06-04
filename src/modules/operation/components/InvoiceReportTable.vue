<template>
  <Table
    id="invoice-report-list"
    :columns="columns"
    :rows="response"
    search_placeholder="Search by reference..."
    v-model:search_value="searchTerm"
    @row_click="handleAction($event, 'view')"
    :hide_on_sm_screen="['paymentRequestedDate', 'paymentRequestedBy']"
    :on_sm_screen_column_span="{ reference: 2, shipments: 2, totalAmount: 2, status: 2 }"
  >
    <template #after-search>
      <div
        class="items-center gap-4 flex overflow-x-auto"
      >
        <InvoiceReportFilters
          @change="handleFilterChange"
          pagination-id="invoice-report-list"
        />
      </div>
    </template>
    <template #cell-reference="{ value }">
      <span class="font-bold text-primary">{{ value || "-" }}</span>
    </template>

    <template #cell-shipments="{ value }">
      <span class="inline-flex items-center justify-center min-w-[1.5rem] px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
        {{ value?.length ?? 0 }}
      </span>
    </template>

    <template #cell-totalAmount="{ value }">
      <span class="font-bold text-base-text">
        {{ currencyFormatter(value) }}
      </span>
    </template>

    <template #cell-paymentRequestedDate="{ value }">
      <span class="text-sm text-dim-text">
        {{ dateFormatter(value) }}
      </span>
    </template>

    <template #cell-paymentRequestedBy="{ row }">
      <span class="font-medium text-dim-text">
        {{ row.paymentRequestedBy?.username || "-" }}
      </span>
    </template>

    <template #cell-status="{ value }">
      <Status :variant="value || 'pending'" type="wrapped">
        {{ (value || "Pending").replace(/_/g, " ") }}
      </Status>
    </template>

    <template #cell-actions="{ row }">
      <div class="flex items-center justify-center w-full">
        <Dropdown title="Actions">
          <template #default="{ close }">
            <DropDownItem
              v-permission="'PAYMENT_REQUEST:update'"
              :icon="icons.edit"
              label="Edit"
              @click.stop="
                handleAction(row, 'edit');
                close();
              "
            />
            <DropDownItem
              v-permission="'PAYMENT_REQUEST:update'"
              :icon="icons.check"
              label="Approve"
              @click.stop="
                handleAction(row, 'approve');
                close();
              "
            />
            <DropDownItem
              v-permission="'PAYMENT_REQUEST:update'"
              :icon="icons.close"
              label="Cancel"
              @click.stop="
                handleAction(row, 'cancel');
                close();
              "
            />
            <DropDownItem
              v-permission="'PAYMENT_REQUEST:view'"
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
import { ref } from "vue";
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
  { key: "shipments", label: "Shipment Count", field: "shipments" },
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
    if (state.search) params.reference = { regexAny: state.search };
    if (activeFilters.value.shipper)
      params.shipper = activeFilters.value.shipper;
    return { ...params, q: undefined };
  },
});

const handleAction = (row: any, action: string) => {
  emit("action", { row, action });
};

defineExpose({ refetch, activeFilters });
</script>
