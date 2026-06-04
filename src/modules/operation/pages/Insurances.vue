<template>
  <!-- Mobile: filter icon next to page title -->
  <Teleport to="#page-title-actions" defer>
    <button
      class="size-8 rounded-xl border border-line flex items-center justify-center text-faint-text hover:bg-surface-hover transition-colors"
      @click="mobileSearchOpen = true"
    >
      <i class="*:size-4" v-html="icons.filterOptions"></i>
    </button>
  </Teleport>

  <!-- Mobile: search field picker sheet -->
  <BottomSheet v-model="mobileSearchOpen" title="Search By">
    <div class="flex flex-col py-2 px-4 gap-1">
      <button
        v-for="opt in searchFieldOptions"
        :key="opt.value"
        class="flex items-center justify-between py-3 px-2 hover:bg-surface-hover rounded-xl transition-colors"
        @click="
          selectedSearchField = opt.value;
          mobileSearchOpen = false;
        "
      >
        <span class="font-medium">{{ opt.label }}</span>
        <i
          v-if="selectedSearchField === opt.value"
          class="*:size-4 text-primary"
          v-html="icons.check"
        ></i>
      </button>
    </div>
  </BottomSheet>

  <Teleport defer to="#page-actions">
    <div class="hidden sm:flex">
      <Button
        v-permission="'INSURANCE:create'"
        variant="primary"
        size="md"
        @click="openAddInsuranceModal"
      >
        Add Insurance
      </Button>
    </div>
  </Teleport>

  <!-- Mobile FAB -->
  <button
    v-permission="'INSURANCE:create'"
    class="sm:hidden fixed bottom-6 right-6 z-40 size-14 rounded-full bg-primary text-white shadow-xl flex items-center justify-center"
    @click="openAddInsuranceModal"
  >
    <i class="*:size-6" v-html="icons.plus"></i>
  </button>

  <Table
    :columns="columns"
    :rows="tableData"
    @row_click="handleRowClick"
    :search_placeholder="dynamicSearchPlaceholder"
    :row_alignment="{ total: 'right' }"
    :head_alignment="{ total: 'right' }"
    :on_sm_screen_column_span="{
      insurer: 2,
      prePaymentDate: 2,
      prePaymentMatureDate: 2,
      total: 3,
      actions: 2,
    }"
  >
    <template #search-prefix>
      <div
        class="hidden sm:flex h-full items-center border-r border-line pr-2 mr-2 w-44"
      >
        <Select
          v-model="selectedSearchField"
          class="[&_.input-focus]:shadow-none! [&_.input-focus]:border-none [&_.input-focus]:min-h-full min-w-44"
          :options="searchFieldOptions"
          label_key="label"
          value_key="value"
          :clearable="false"
        />
      </div>
    </template>

    <template #cell-insurer="{ row }">
      <span class="font-bold text-gray-900">{{
        row.insurer?.name || "N/A"
      }}</span>
    </template>

    <template #cell-vehicle="{ row }">
      <span class="font-bold text-gray-900">{{
        row.vehicle?.plateNumber || "N/A"
      }}</span>
    </template>

    <template #cell-prePaymentDate="{ row }">
      <span class="text-gray-600 font-medium">{{
        dateFormatter(row.prePaymentDate)
      }}</span>
    </template>

    <template #cell-prePaymentMatureDate="{ row }">
      <span class="text-gray-600 font-medium">{{
        dateFormatter(row.prePaymentMatureDate)
      }}</span>
    </template>

    <template #cell-total="{ row }">
      <span class="font-black">{{ currencyFormatter(row.total) }}</span>
    </template>

    <template #cell-actions="{ row }">
      <Dropdown>
        <DropDownItem @click="handleRowClick(row)">View Details</DropDownItem>
        <DropDownItem @click="openEditInsuranceModal(row)">Edit</DropDownItem>
      </Dropdown>
    </template>
  </Table>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { usePagination } from "@/composables/usePagination";
import Table from "@/components/common/Table.vue";
import Button from "@/components/common/Button.vue";
import type { TableColumn } from "@/components/common/Table.vue";
import { openModal } from "@customizer/modal-x";
import { currencyFormatter, dateFormatter } from "@/utils/utils";
import Dropdown from "@/components/common/Dropdown.vue";
import DropDownItem from "@/components/common/DropDownItem.vue";
import BottomSheet from "@/components/BottomSheet.vue";
import Select from "@/components/common/Select.vue";
import { icons } from "@/utils/icons";

const router = useRouter();

const searchFieldOptions = [
  { label: "Insurer Name", value: "name" },
  { label: "Plate Number", value: "vehiclePlateNumber" },
];

const selectedSearchField = ref("vehiclePlateNumber");
const mobileSearchOpen = ref(false);

const dynamicSearchPlaceholder = computed(() => {
  const opt = searchFieldOptions.find(
    (o) => o.value === selectedSearchField.value,
  );
  return opt ? `Search by ${opt.label}...` : "Search insurances...";
});

const { response: tableData, refetch } = usePagination({
  url: "/insurance",
  params: (state) => ({
    [`${selectedSearchField.value}`]: state.search || undefined,
    q: undefined,
  }),
  queryKey: ["insurances"],
});

const columns: TableColumn[] = [
  { key: "insurer", label: "Insurance Provider" },
  { key: "vehicle", label: "Vehicle" },
  { key: "prePaymentDate", label: "Pre Payment Date" },
  { key: "prePaymentMatureDate", label: "Mature Date" },
  { key: "JV", label: "JV" },
  { key: "CPV", label: "CPV" },
  { key: "total", label: "Total Price", cellAlign: "right" },
  { key: "actions", label: "Actions", cellAlign: "right" },
];

const openAddInsuranceModal = () => {
  openModal("AddInsuranceModal", {
    onSuccess: () => refetch(),
  });
};

const openEditInsuranceModal = (row: any) => {
  openModal("EditInsuranceModal", {
    insurance: row,
    onSuccess: () => refetch(),
  });
};

const handleRowClick = (row: any) => {
  router.push(`/insurance/insuranceDetails/${row._id}`);
};
</script>
