<template>
  <Teleport to="#page-actions" defer>
    <Button
      v-permission="'SHIPPER:create'"
      size="md"
      variant="primary"
      class="hidden sm:flex"
      @click="handleOpenAddModal"
    >
      New Customer
    </Button>
  </Teleport>

  <!-- Floating action button — mobile only -->
  <button
    v-permission="'SHIPPER:create'"
    class="fixed bottom-6 right-6 sm:hidden z-50 w-14 h-14 rounded-full bg-primary text-white shadow-xl flex items-center justify-center active:scale-95 transition-transform"
    @click="handleOpenAddModal"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  </button>

  <Table
    :columns="columns"
    :rows="response"
    :hide_on_sm_screen="['tin', 'address']"
    :on_sm_screen_column_span="{ name: 2, phone: 1, customerCode: 1, tradeName: 1 }"
    @row_click="navigateToDetails"
  >
    <template #cell-name="{ row }">
      <span class="font-bold text-grey-900">{{ row.name }}</span>
    </template>
    <template #cell-tradeName="{ row }">
      <span class="text-grey-600">{{ row.tradeName }}</span>
    </template>
    <template #cell-tin="{ row }">
      <span class="text-grey-600">{{ row.tin || "-" }}</span>
    </template>
    <template #cell-phone="{ row }">
      <span class="text-grey-600">{{ row.phone }}</span>
    </template>
    <template #cell-customerCode="{ row }">
      <span class="text-grey-600">{{
        row.customerCode || row.shipperCode || "-"
      }}</span>
    </template>
    <template #cell-address="{ row }">
      <span class="text-grey-600">{{ row.address || "-" }}</span>
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
              label="Edit Customer"
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
import { useRouter } from "vue-router";
import Button from "@/components/common/Button.vue";
import { usePagination } from "@/composables/usePagination";
import { openModal } from "@customizer/modal-x";
import Dropdown from "@/components/common/Dropdown.vue";
import DropDownItem from "@/components/common/DropDownItem.vue";
import Table, { type TableColumn } from "@/components/common/Table.vue";

const router = useRouter();

const { response, refetch, isLoading } = usePagination({
  id: "customers-list",
  url: "/shipper",
  params(state) {
    return {
      name: state.search,
      q: undefined,
    };
  },
});

const columns: TableColumn<any>[] = [
  { key: "name", label: "Customer Name", field: "name" },
  { key: "tradeName", label: "Trade Name", field: "tradeName" },
  { key: "tin", label: "TIN", field: "tin" },
  { key: "phone", label: "Phone Number", field: "phone" },
  { key: "customerCode", label: "Customer Code", field: "customerCode" },
  { key: "address", label: "Address", field: "address" },
  { key: "actions", label: "Actions", field: "" },
];

const handleOpenAddModal = () => {
  openModal("AddCustomerModal", {
    onClose: (isCreated: boolean) => {
      if (isCreated) {
        refetch();
      }
    },
  });
};

const handleOpenEditModal = (row: any) => {
  openModal("AddCustomerModal", {
    customer: row,
    onClose: (isCreated: boolean) => {
      if (isCreated) {
        refetch();
      }
    },
  });
};

const navigateToDetails = (row: any) => {
  router.push(`/customers/${row._id}`);
};
</script>
