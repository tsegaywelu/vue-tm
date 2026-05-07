<template>
  <Teleport to="#page-actions" defer>
    <Button v-permission="'TRANSPORTER:create'" size="md" variant="primary" @click="handleOpenAddModal">
      New Transporter
    </Button>
  </Teleport>

  <Table :columns="columns" :rows="response" @row_click="navigateToDetails">
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
import { useRouter } from "vue-router";
import Button from "@/components/common/Button.vue";
import { usePagination } from "@/composables/usePagination";
import { openModal } from "@customizer/modal-x";
import Dropdown from "@/components/common/Dropdown.vue";
import DropDownItem from "@/components/common/DropDownItem.vue";
import Table, { type TableColumn } from "@/components/common/Table.vue";

const router = useRouter();

const { response, refetch, isLoading } = usePagination({
  id: "transporters-list",
  url: "/transporter",
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
