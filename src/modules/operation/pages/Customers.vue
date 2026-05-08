<template>
  <Teleport to="#page-actions" defer>
    <Button v-permission="'SHIPPER:create'" size="md" variant="primary" @click="handleOpenAddModal">
      New Customer
    </Button>
  </Teleport>
  <Table :columns="columns" :rows="response" @row_click="navigateToDetails">
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
import Table from "@/components/common/Table.vue";

const router = useRouter();

const { response, refetch, isLoading } = usePagination({
  id: "customers-list",
  url: "/shipper",
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
