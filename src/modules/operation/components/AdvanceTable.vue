<template>
  <Table
    :row_alignment="{ driver: 'left', route: 'left' }"
    :head_alignment="{ driver: 'left', route: 'left' }"
    :id="tableId"
    :columns="columns"
    :rows="response"
    :clickable_rows="true"
    :search_placeholder="dynamicSearchPlaceholder"
    @row_click="handleRowClick"
  >
    <template #search-prefix>
      <div
        class="h-full flex items-center border-r border-gray-200 pr-2 mr-2 w-48"
      >
        <Select
          class="[&_.input-focus]:shadow-none! [&_.input-focus]:border-none [&_.input-focus]:min-h-full min-w-48"
          v-model="selectedStatus"
          :options="AdvanceStatusOptions"
          label_key="label"
          value_key="value"
          :clearable="false"
        />
      </div>
    </template>

    <template #after-search>
      <div
        class="items-center gap-4 inline-flex border-l border-grey-100 overflow-x-auto px-3"
      >
        <i v-html="icons.filter" />
        <AdvanceFilters @change="handleFilterChange" />
      </div>
    </template>

    <template #cell-advanceNumber="{ value }">
      <span class="font-bold">{{ value }}</span>
    </template>

    <template #cell-driver="{ row }">
      <span class="text-base" v-if="row.driver">
        {{ row.driver?.firstName }} {{ row.driver?.middleName || "" }}
        {{ row.driver?.lastName || "" }}
      </span>
      <span v-else class="text-gray-400 italic text-sm">-</span>
    </template>

    <template #cell-transporter="{ row }">
      <span class="text-base">
        {{ row.shipment?.transporter?.name || row.transporter?.name || "-" }}
      </span>
    </template>

    <template #cell-plateNumber="{ row }">
      <span class="text-base">
        {{
          row.shipment?.vehicle?.plateNumber || row.vehicle?.plateNumber || "-"
        }}
      </span>
    </template>

    <template #cell-status="{ value }">
      <Status :variant="value" type="wrapped">
        {{
          value
            ?.toLowerCase()
            .replace(/_/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase())
        }}
      </Status>
    </template>

    <template #cell-createdAt="{ value }">
      <span class="text-base">{{ value?.split("T")[0] }}</span>
    </template>

    <template #cell-shipment="{ row }">
      <span class="text-base">
        {{ row.shipment?.shipmentCode || row.shipmentCode || "-" }}
      </span>
    </template>

    <template #cell-route="{ row }">
      <span class="text-base">
        {{ row.shipment?.route?.routeName || row.route?.name || "-" }}
      </span>
    </template>

    <template #cell-fuelAdvance="{ row }">
      <span class="text-base">
        {{
          currencyFormatter(
            Array.isArray(row.fuelAdvances)
              ? row.fuelAdvances
                  .reduce(
                    (acc: number, item: any) => acc + (item.amount || 0),
                    0,
                  )
                  .toFixed(2)
              : "0.00",
          )
        }}
      </span>
    </template>

    <template #cell-perDiemAdvance="{ row }">
      <span class="text-base">
        {{
          currencyFormatter(
            Array.isArray(row.perDiemExpenses)
              ? row.perDiemExpenses.reduce(
                  (acc: number, item: any) => acc + (item.amount || 0),
                  0,
                )
              : 0,
          )
        }}
      </span>
    </template>

    <template #cell-otherAdvance="{ row }">
      <span class="text-base">
        {{
          currencyFormatter(
            Array.isArray(row.otherExpenses)
              ? row.otherExpenses.reduce(
                  (acc: number, item: any) => acc + (item.amount || 0),
                  0,
                )
              : 0,
          )
        }}
      </span>
    </template>

    <template #cell-total="{ row }">
      <span class="text-base font-semibold">
        {{
          currencyFormatter(
            row.amount ||
              (Array.isArray(row.fuelAdvances)
                ? row.fuelAdvances.reduce(
                    (acc: number, item: any) => acc + (item.amount || 0),
                    0,
                  )
                : 0) +
                (Array.isArray(row.perDiemExpenses)
                  ? row.perDiemExpenses.reduce(
                      (acc: number, item: any) => acc + (item.amount || 0),
                      0,
                    )
                  : 0) +
                (Array.isArray(row.otherExpenses)
                  ? row.otherExpenses.reduce(
                      (acc: number, item: any) => acc + (item.amount || 0),
                      0,
                    )
                  : 0),
          )
        }}
      </span>
    </template>

    <template #cell-paidBy="{ value }">
      <span class="text-base">{{ value?.username || "-" }}</span>
    </template>
  </Table>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import Table from "@/components/common/Table.vue";
import Select from "@/components/common/Select.vue";
import type { TableColumn } from "@/components/common/Table.vue";
import { usePagination } from "@/composables/usePagination";
import { currencyFormatter } from "@/utils/utils";
import AdvanceFilters from "./AdvanceFilters.vue";
import Status from "@/components/common/Status.vue";
import { icons } from "@/utils/icons";

const props = withDefaults(
  defineProps<{
    /** API URL — changes depending on page context */
    url?: string;
    /** Unique pagination store id */
    paginationId?: string;
    /** Extra params merged into the request */
    extraParams?: Record<string, any>;
    /** Table columns */
    columns: TableColumn[];
  }>(),
  {
    url: "/advance-payment",
    paginationId: "advance-list",
    extraParams: () => ({}),
  },
);

const router = useRouter();
const tableId = computed(() => props.paginationId);

const AdvanceStatusOptions = [
  { label: "Status: All", value: "" },
  { label: "Pending", value: "PENDING" },
  { label: "Authorized", value: "AUTHORIZED" },
  { label: "Approved", value: "APPROVED" },
  { label: "Paid", value: "PAID" },
  { label: "Success", value: "SUCCESS" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Cancelled", value: "CANCELLED" },
  { label: "Failed", value: "FAILED" },
];

const selectedStatus = ref("");
const activeFilters = ref<any>({
  searchField: "advanceNumber",
});

const dynamicSearchPlaceholder = computed(() => {
  return "Search Advances...";
});

watch(selectedStatus, (newStatus) => {
  activeFilters.value = { ...activeFilters.value, status: newStatus || undefined };
});

const handleFilterChange = (newFilters: any) => {
  activeFilters.value = {
    ...activeFilters.value,
    ...newFilters,
  };
};

const handleRowClick = (row: any) => {
  if (row._id) {
    router.push(`/operation/advance-details/${row._id}`);
  }
};

const { response, refetch } = usePagination({
  id: props.paginationId,
  url: props.url,
  params: computed(() => ({ ...props.extraParams, ...activeFilters.value })),
});

defineExpose({ refetch });
</script>
