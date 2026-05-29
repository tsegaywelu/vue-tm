<template>
  <!-- Mobile: filter icon next to page title -->
  <Teleport to="#page-title-actions" defer>
    <button
      class="sm:hidden size-8 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
      @click="mobileSearchOpen = true"
    >
      <i class="*:size-4" v-html="icons.filterOptions"></i>
    </button>
  </Teleport>

  <!-- Mobile: search field picker sheet -->
  <BottomSheet v-model="mobileSearchOpen" title="Search By">
    <div class="flex flex-col py-2 px-4 gap-1">
      <button
        v-for="opt in AdvanceStatusOptions.filter((o) => o.value)"
        :key="opt.value"
        class="flex items-center justify-between py-3 px-2 hover:bg-gray-50 rounded-xl transition-colors"
        @click="
          selectedStatus = opt.value;
          mobileSearchOpen = false;
        "
      >
        <span class="font-medium">{{ opt.label }}</span>
        <i
          v-if="selectedStatus === opt.value"
          class="*:size-4 text-primary"
          v-html="icons.check"
        ></i>
      </button>
    </div>
  </BottomSheet>

  <CheckTable
    :row_alignment="{ driver: 'left', route: 'left' }"
    :head_alignment="{ driver: 'left', route: 'left' }"
    :id="tableId"
    :columns="columns"
    :rows="response"
    :clickable_rows="true"
    :search_placeholder="dynamicSearchPlaceholder"
    :canBeSelected="checkable"
    :on_sm_screen_column_span="columnSpan"
    :hide_on_sm_screen="hideOnSmScreen"
    :top_right_cell_key="topRightCellKey"
    v-model="selectedItems"
    unique_key="_id"
    :loading="isLoading"
    @row_click="handleRowClick($event)"
  >
    <template #search-prefix>
      <div
        class="hidden sm:flex h-full items-center border-r border-gray-200 pr-2 mr-2 w-48"
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
      <div class="items-center gap-4 inline-flex overflow-x-auto">
        <AdvanceFilters
          @change="handleFilterChange"
          :pagination-id="props.paginationId"
        />
      </div>
    </template>

    <template #cell-advanceNumber="{ value }">
      <span class="font-bold">{{ value }}</span>
    </template>

    <template #cell-driver="{ row }">
      <span class="text-base" v-if="typeof row.driver === 'string'">
        {{ row.driver }}
      </span>
      <span class="text-base" v-else-if="row.driver">
        {{ row.driver?.firstName }} {{ row.driver?.middleName || "" }}
        {{ row.driver?.lastName || "" }}
      </span>
      <span v-else class="text-gray-400 italic text-sm">-</span>
    </template>

    <template #cell-transporter="{ row }">
      <span class="text-base">
        {{
          row.transporterName ||
          row.shipment?.transporter?.name ||
          row.transporter?.name ||
          "-"
        }}
      </span>
    </template>

    <template #cell-plateNumber="{ row }">
      <span class="text-base">
        {{
          row.plateNumber ||
          row.shipment?.vehicle?.plateNumber ||
          row.vehicle?.plateNumber ||
          "-"
        }}
      </span>
    </template>

    <template #cell-status="{ value }">
      <Status :variant="value" type="wrapped">
        {{
          value
            ?.toLowerCase()
            .replace(/_/g, " ")
            .replace(/\b\w/g, (c: string) => c.toUpperCase())
        }}
      </Status>
    </template>

    <template #cell-date="{ value }">
      <span class="text-base">{{ value?.split("T")[0] }}</span>
    </template>

    <template #cell-createdAt="{ value }">
      <span class="text-base">{{ value?.split("T")[0] }}</span>
    </template>

    <template #cell-shipment="{ row }">
      <span class="text-base">
        {{
          row.shipmentCode || row.shipment?.shipmentCode || row.shipment || "-"
        }}
      </span>
    </template>

    <template #cell-route="{ row }">
      <span class="text-base">
        {{
          typeof row.route === "string"
            ? row.route
            : row.shipment?.route?.routeName || row.route?.name || "-"
        }}
      </span>
    </template>

    <template #cell-fuelAdvance="{ row }">
      <span class="text-base">
        {{
          currencyFormatter(
            row.FUEL ??
              (Array.isArray(row.fuelAdvances)
                ? row.fuelAdvances.reduce(
                    (acc: number, item: any) => acc + (item.amount || 0),
                    0,
                  )
                : 0),
          )
        }}
      </span>
    </template>

    <template #cell-perDiemAdvance="{ row }">
      <span class="text-base">
        {{
          currencyFormatter(
            row.PERDIEM ??
              (Array.isArray(row.perDiemExpenses)
                ? row.perDiemExpenses.reduce(
                    (acc: number, item: any) => acc + (item.amount || 0),
                    0,
                  )
                : 0),
          )
        }}
      </span>
    </template>

    <template #cell-otherAdvance="{ row }">
      <span class="text-base">
        {{
          currencyFormatter(
            row.OTHER ??
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

    <template #cell-total="{ row }">
      <span class="text-base font-semibold">
        {{
          currencyFormatter(
            row.TOTAL ??
              row.amount ??
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

    <template #cell-type="{ value }">
      <span class="text-base">
        {{
          value
            ?.toLowerCase()
            .replace(/_/g, " ")
            .replace(/\b\w/g, (c: string) => c.toUpperCase()) || "-"
        }}
      </span>
    </template>

    <template #cell-amount="{ value }">
      <span class="text-base font-semibold">
        {{ currencyFormatter(value || 0) }}
      </span>
    </template>
  </CheckTable>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import CheckTable from "@/components/common/CheckTable.vue";
import Select from "@/components/common/Select.vue";
import type { TableColumn } from "@/components/common/Table.vue";
import { usePagination } from "@/composables/usePagination";
import { currencyFormatter } from "@/utils/utils";
import AdvanceFilters from "./AdvanceFilters.vue";
import Status from "@/components/common/Status.vue";
import { icons } from "@/utils/icons";
import BottomSheet from "@/components/BottomSheet.vue";

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
    /** Whether row selection is enabled */
    checkable?: boolean;
    /** Selected items (v-model) */
    modelValue?: any[];
    /** Column span overrides on small screens */
    columnSpan?: Record<string, number>;
    /** Columns hidden in mobile card view */
    hideOnSmScreen?: string[];
    /** Key shown in the top-right of each mobile card */
    topRightCellKey?: string;
  }>(),
  {
    url: "/advance-payment",
    paginationId: "advance-list",
    extraParams: () => ({}),
    checkable: false,
    modelValue: () => [],
    columnSpan: () => ({}),
    hideOnSmScreen: () => [],
    topRightCellKey: "",
  },
);

const emit = defineEmits<{
  (e: "update:modelValue", value: any[]): void;
  (e: "refetch"): void;
}>();

const router = useRouter();
const tableId = computed(() => props.paginationId);

const selectedItems = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const AdvanceStatusOptions = [
  { label: "Status: All", value: "" },
  { label: "Plate Number", value: "vehiclePlateNumber" },
  { label: "Advance Number", value: "advanceNumber" },
  { label: "Driver Name", value: "driverName" },
  { label: "Issue Voucher", value: "shipperIssueVoucher" },
];

const selectedStatus = ref("vehiclePlateNumber");
const activeFilters = ref<any>({});
const mobileSearchOpen = ref(false);

const dynamicSearchPlaceholder = computed(() => {
  const option = AdvanceStatusOptions.find(
    (o) => o.value === selectedStatus.value,
  );
  return option ? `Search by ${option.label}...` : "Search advances...";
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

const { response, refetch, isLoading } = usePagination({
  id: props.paginationId,
  url: props.url,
  params: (state) => ({
    ...props.extraParams,
    ...activeFilters.value,
    [selectedStatus.value]: state.search,
    q: undefined,
  }),
});

defineExpose({ refetch });
</script>
