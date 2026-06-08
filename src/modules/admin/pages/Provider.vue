<template>
  <Teleport to="#page-actions" defer>
    <Button size="md" variant="primary" @click="handleOpenAddModal">
      Add Provider
    </Button>
  </Teleport>

  <Table :columns="columns" :rows="response">
    <template #cell-code="{ row }">
      <span class="font-mono font-bold text-grey-900 text-sm">{{ row.code }}</span>
    </template>
    <template #cell-name="{ row }">
      <span class="font-semibold text-grey-900">{{ row.name }}</span>
    </template>
    <template #cell-authType="{ row }">
      <span class="text-grey-600">{{ row.authType || "-" }}</span>
    </template>
    <template #cell-status="{ row }">
      <span
        class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold"
        :class="row.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-grey-100 text-grey-500'"
      >
        {{ row.status }}
      </span>
    </template>
    <template #cell-actions="{ row }">
      <div @click.stop class="flex justify-center">
        <Dropdown>
          <template #default="{ close }">
            <DropDownItem
              label="Edit"
              @click="close(); handleOpenEditModal(row)"
            />
            <DropDownItem
              label="Delete"
              class="text-red-500"
              @click="close(); handleDelete(row)"
            />
          </template>
        </Dropdown>
      </div>
    </template>
  </Table>
</template>

<script setup lang="ts">
import { openModal } from "@customizer/modal-x";
import Button from "@/components/common/Button.vue";
import Table, { type TableColumn } from "@/components/common/Table.vue";
import Dropdown from "@/components/common/Dropdown.vue";
import DropDownItem from "@/components/common/DropDownItem.vue";
import { usePagination } from "@/composables/usePagination";
import { useToastStore } from "@/store/toastStore";
import { deleteProvider } from "@/modules/admin/api/gps.api";

const toast = useToastStore();

const { response, refetch } = usePagination({
  id: "admin-gps-providers-list",
  url: "/gps-config/providers",
  params(state) {
    return { name: state.search };
  },
});

const columns: TableColumn<any>[] = [
  { key: "code", label: "Code", field: "code" },
  { key: "name", label: "Name", field: "name" },
  { key: "authType", label: "Auth Type", field: "authType" },
  { key: "status", label: "Status", field: "status" },
  { key: "actions", label: "Actions", field: "" },
];

const handleOpenAddModal = async () => {
  const res = await openModal("GpsProviderModal");
  if (res) refetch();
};

const handleOpenEditModal = async (row: any) => {
  const res = await openModal("GpsProviderModal", { provider: row });
  if (res) refetch();
};

const handleDelete = async (row: any) => {
  const confirmed = await openModal("ConfirmationModal", {
    title: "Delete Provider",
    message: `Are you sure you want to delete "${row.name}"? This action cannot be undone.`,
    confirmText: "Delete",
    action: "delete",
  });

  if (!confirmed) return;

  const res: any = await deleteProvider(row._id);
  if (res.success || res.status === 200 || res.status === 204) {
    toast.success("Provider deleted successfully!");
    refetch();
  } else {
    toast.error(res.error || "Failed to delete provider");
  }
};
</script>
