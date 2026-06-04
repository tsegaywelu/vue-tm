<template>
  <Table
    id="payment-collection-list"
    :columns="columns"
    :rows="response"
    search_placeholder="Search by reference..."
    @row_click="handleAction($event, 'view')"
    :hide_on_sm_screen="['shipments', 'paymentRequestedDate', 'paymentRequestedBy', 'paymentApprovedBy', 'paymentCollectedBy', 'crv', 'csi', 'remark']"
    :on_sm_screen_column_span="{ reference: 2, totalAmount: 2, shipperName: 2, status: 2 }"
  >
    <template #cell-reference="{ value }">
      <span class="font-bold">{{ value || "-" }}</span>
    </template>

    <template #cell-shipments="{ value }">
      <span class="inline-flex items-center justify-center min-w-[1.5rem] px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
        {{ value?.length ?? 0 }}
      </span>
    </template>

    <template #cell-totalAmount="{ value }">
      <span class="font-bold text-gray-900">
        {{ currencyFormatter(value) }}
      </span>
    </template>

    <template #cell-shipperName="{ row }">
      <span class="font-medium text-gray-700">
        {{ row.shipper?.name || "-" }}
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

    <template #cell-paymentApprovedBy="{ row }">
      <span class="font-medium text-gray-700">
        {{ row.paymentApprovedBy?.username || "-" }}
      </span>
    </template>

    <template #cell-paymentCollectedBy="{ row }">
      <span class="font-medium text-gray-700">
        {{ row.paymentCollectedByCarrier?.username || "-" }}
      </span>
    </template>

    <template #cell-remark="{ row }">
      <span
        class="text-sm text-gray-600 truncate max-w-[150px] inline-block"
        :title="row.remarkCarrier || row.remark || '-'"
      >
        {{ row.remarkCarrier || row.remark || "-" }}
      </span>
    </template>

    <template #cell-status="{ value }">
      <Status :variant="value || 'pending'" type="wrapped">
        {{ (value || "Pending").replace(/_/g, " ") }}
      </Status>
    </template>

    <template #after-search>
      <div class="flex items-center gap-4 overflow-x-auto">
        <PaymentCollectionFilters
          @change="handleFilterChange"
          pagination-id="payment-collection-list"
        />
      </div>
    </template>

    <template #cell-actions="{ row }">
      <div class="flex items-center justify-end">
        <Dropdown title="Actions">
          <template #default="{ close }">
            <DropDownItem
              v-if="row.status === 'payment_approved'"
              :icon="icons.check"
              label="Collect"
              @click.stop="
                handleAction(row, 'collect');
                close();
              "
            />
            <DropDownItem
              v-if="row.status !== 'paid'"
              v-permission="'TRANSACTION:update'"
              :icon="icons.edit"
              label="Edit"
              @click.stop="
                handleAction(row, 'edit');
                close();
              "
            />
            <DropDownItem
              v-permission="'TRANSACTION:read'"
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
import PaymentCollectionFilters from "./PaymentCollectionFilters.vue";

const props = defineProps<{
  filters?: {
    startDate?: string;
    endDate?: string;
  };
}>();

const emit = defineEmits(["action"]);

const columns: TableColumn<any>[] = [
  { key: "reference", label: "Reference", field: "reference" },
  { key: "shipments", label: "Shipment Count", field: "shipments" },
  { key: "totalAmount", label: "Total Amount", field: "totalAmount" },
  { key: "shipperName", label: "Shipper", field: "shipper" },
  {
    key: "paymentRequestedDate",
    label: "Request Date",
    field: "paymentRequestedDate",
  },
  {
    key: "paymentRequestedBy",
    label: "Requested By",
    field: "paymentRequestedBy",
  },
  {
    key: "paymentApprovedBy",
    label: "Approved By",
    field: "paymentApprovedBy",
  },
  {
    key: "paymentCollectedBy",
    label: "Collected By",
    field: "paymentCollectedByCarrier",
  },
  { key: "crv", label: "CRV", field: "crv" },
  { key: "csi", label: "CSI", field: "csi" },
  { key: "remark", label: "Remark", field: "remark" },
  { key: "status", label: "Status", field: "status" },
  { key: "actions", label: "Actions", field: "", cellAlign: "right" },
];

const activeFilters = ref({});
const { response, refetch } = usePagination<any>({
  id: "payment-collection-list",
  url: "/shipment/approvedAndCollectedInvoices",
  params: (state) => {
    const params: any = { ...activeFilters.value };
    if (props.filters?.startDate) {
      params["createdAt[gte]"] = props.filters.startDate;
    }
    if (props.filters?.endDate) {
      params["createdAt[lte]"] = props.filters.endDate;
    }
    return {
      ...params,
      reference: {
        regexAny: state.search,
      },
      q: undefined,
    };
  },
});

const handleFilterChange = (newFilters: any) => {
  activeFilters.value = { ...newFilters };
};

const handleAction = (row: any, action: string) => {
  emit("action", { row, action });
};

defineExpose({ refetch, activeFilters });
</script>
