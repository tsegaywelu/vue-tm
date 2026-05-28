<template>
  <Teleport to="#page-actions" defer>
    <Button v-permission="'TRANSPORTER:create'" size="md" variant="primary" @click="handleOpenAddModal">
      New Transporter
    </Button>
  </Teleport>

  <Table :columns="columns" :rows="response" @row_click="navigateToDetails" search_placeholder="Search transporters...">
    <template #search-prefix>
      <div class="h-full flex items-center border-r border-gray-200 pr-2 mr-2 w-44">
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
import { ref } from "vue";
import { useRouter } from "vue-router";
import Button from "@/components/common/Button.vue";
import { usePagination } from "@/composables/usePagination";
import { openModal } from "@customizer/modal-x";
import Dropdown from "@/components/common/Dropdown.vue";
import DropDownItem from "@/components/common/DropDownItem.vue";
import Table, { type TableColumn } from "@/components/common/Table.vue";
import Select from "@/components/common/Select.vue";

const router = useRouter();

const filterFieldOptions = [
  { label: "Name", value: "name" },
  { label: "Trade Name", value: "tradeName" },
  { label: "TIN", value: "tin" },
  { label: "Phone Number", value: "phoneNumber" },
];

const selectedSearchField = ref("name");

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
