<template>
  <!-- Mobile: filter icon next to page title -->
  <Teleport to="#page-title-actions" defer>
    <button
      class="size-8 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
      @click="mobileSearchOpen = true"
    >
      <i class="*:size-4" v-html="icons.filterOptions"></i>
    </button>
  </Teleport>

  <!-- Mobile: search field picker sheet -->
  <BottomSheet v-model="mobileSearchOpen" title="Search By">
    <div class="flex flex-col py-2 px-4 gap-1">
      <button
        v-for="opt in filterFieldOptions"
        :key="opt.value"
        class="flex items-center justify-between py-3 px-2 hover:bg-gray-50 rounded-xl transition-colors"
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

  <Teleport to="#page-actions" defer>
    <div class="hidden sm:flex">
      <Button v-permission="'TRANSPORTER:create'" size="md" variant="primary" @click="handleOpenAddModal">
        New Transporter
      </Button>
    </div>
  </Teleport>

  <!-- Mobile FAB -->
  <button
    v-permission="'TRANSPORTER:create'"
    class="sm:hidden fixed bottom-6 right-6 z-40 size-14 rounded-full bg-primary text-white shadow-xl flex items-center justify-center"
    @click="handleOpenAddModal"
  >
    <i class="*:size-6" v-html="icons.plus"></i>
  </button>

  <Table
    :columns="columns"
    :rows="response"
    @row_click="navigateToDetails"
    :search_placeholder="dynamicSearchPlaceholder"
    :on_sm_screen_column_span="{ name: 2, tradeName: 2, email: 2, address: 2, actions: 2 }"
  >
    <template #search-prefix>
      <div class="hidden sm:flex h-full items-center border-r border-gray-200 pr-2 mr-2 w-44">
        <Select
          v-model="selectedSearchField"
          class="[&_.input-focus]:shadow-none! [&_.input-focus]:border-none [&_.input-focus]:min-h-full min-w-44"
          :options="filterFieldOptions"
          label_key="label"
          value_key="value"
          :clearable="false"
        />
      </div>
    </template>

    <template #cell-name="{ row }">
      <span class="font-bold text-grey-900">{{ row.name }}</span>
    </template>
    <template #cell-tradeName="{ row }">
      <span class="text-grey-600">{{ row.tradeName }}</span>
    </template>
    <template #cell-phoneNumber="{ row }">
      <span class="text-grey-600">{{ row.phoneNumber }}</span>
    </template>
    <template #cell-email="{ row }">
      <span class="text-grey-600">{{ row.email || "-" }}</span>
    </template>
    <template #cell-address="{ row }">
      <span class="text-grey-600">{{ row.address || "-" }}</span>
    </template>
    <template #cell-tin="{ row }">
      <span class="text-grey-600">{{ row.tin || "-" }}</span>
    </template>
    <template #cell-type="{ row }">
      <span class="text-grey-600">{{ row.type }}</span>
    </template>
    <template #cell-actions="{ row }">
      <div @click.stop class="flex justify-center">
        <Dropdown>
          <template #default="{ close }">
            <DropDownItem
              label="View Details"
              @click="
                close();
                navigateToDetails(row);
              "
            />
            <DropDownItem
              label="Edit Transporter"
              @click="
                close();
                handleOpenEditModal(row);
              "
            />
          </template>
        </Dropdown>
      </div>
    </template>
  </Table>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import Button from "@/components/common/Button.vue";
import { usePagination } from "@/composables/usePagination";
import { openModal } from "@customizer/modal-x";
import Dropdown from "@/components/common/Dropdown.vue";
import DropDownItem from "@/components/common/DropDownItem.vue";
import Table, { type TableColumn } from "@/components/common/Table.vue";
import Select from "@/components/common/Select.vue";
import BottomSheet from "@/components/BottomSheet.vue";
import { icons } from "@/utils/icons";

const router = useRouter();

const filterFieldOptions = [
  { label: "Name", value: "name" },
  { label: "Trade Name", value: "tradeName" },
  { label: "TIN", value: "tin" },
  { label: "Phone Number", value: "phoneNumber" },
];

const selectedSearchField = ref("name");
const mobileSearchOpen = ref(false);

const dynamicSearchPlaceholder = computed(() => {
  const opt = filterFieldOptions.find((o) => o.value === selectedSearchField.value);
  return opt ? `Search by ${opt.label}...` : "Search transporters...";
});

const { response, refetch, isLoading } = usePagination({
  id: "transporters-list",
  url: "/transporter",
  params: (state) => ({
    [`${selectedSearchField.value}[regex]`]: state.search || undefined,
    q: undefined,
  }),
});

const columns: TableColumn<any>[] = [
  { key: "name", label: "Name", field: "name" },
  { key: "tradeName", label: "Trade Name", field: "tradeName" },
  { key: "phoneNumber", label: "Phone Number", field: "phoneNumber" },
  { key: "email", label: "Email", field: "email" },
  { key: "address", label: "Address", field: "address" },
  { key: "tin", label: "TIN", field: "tin" },
  { key: "type", label: "Type", field: "type" },
  { key: "actions", label: "Actions", field: "" },
];

const handleOpenAddModal = async () => {
  const res = await openModal("AddTransporterModal");
  if (res) {
    refetch();
  }
};

const handleOpenEditModal = async (row: any) => {
  const res = await openModal("AddTransporterModal", { transporter: row });
  if (res) {
    refetch();
  }
};

const navigateToDetails = (row: any) => {
  router.push(`/transporters/${row._id}`);
};
</script>
