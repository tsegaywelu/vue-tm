<template>
  <Teleport to="#page-actions" defer>
    <Button size="md" variant="primary" @click="handleOpenAddModal">
      Add City
    </Button>
  </Teleport>

  <Table :columns="columns" :rows="response">
    <template #cell-name="{ row }">
      <span class="font-bold text-grey-900">{{ row.name }}</span>
    </template>
    <template #cell-nameAm="{ row }">
      <span class="text-grey-600">{{ row.nameAm || "-" }}</span>
    </template>
    <template #cell-latitude="{ row }">
      <span class="text-grey-600">{{ row.gpsLocation?.latitude ?? "-" }}</span>
    </template>
    <template #cell-longitude="{ row }">
      <span class="text-grey-600">{{ row.gpsLocation?.longitude ?? "-" }}</span>
    </template>
    <template #cell-isActive="{ row }">
      <span
        class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold"
        :class="row.isActive ? 'bg-green-100 text-green-700' : 'bg-grey-100 text-grey-500'"
      >
        {{ row.isActive ? "Active" : "Inactive" }}
      </span>
    </template>
    <template #cell-actions="{ row }">
      <div @click.stop class="flex justify-center">
        <Dropdown>
          <DropDownItem :icon="icons.edit" @click="handleOpenEditModal(row)">
            Edit
          </DropDownItem>
          <DropDownItem :icon="icons.delete" variant="danger" @click="handleDelete(row)">
            Delete
          </DropDownItem>
        </Dropdown>
      </div>
    </template>
  </Table>
</template>

<script setup lang="ts">
import { openModal } from "@customizer/modal-x";
import { useMutation } from "@tanstack/vue-query";
import Button from "@/components/common/Button.vue";
import Dropdown from "@/components/common/Dropdown.vue";
import DropDownItem from "@/components/common/DropDownItem.vue";
import Table, { type TableColumn } from "@/components/common/Table.vue";
import { usePagination } from "@/composables/usePagination";
import { icons } from "@/utils/icons";
import { useToastStore } from "@/store/toastStore";
import { deleteCity } from "@/modules/admin/api/city.api";

const toast = useToastStore();

const { response, refetch } = usePagination({
  id: "admin-cities-list",
  url: "/city",
  params(state) {
    return { name: state.search };
  },
});

const columns: TableColumn<any>[] = [
  { key: "name", label: "Name", field: "name" },
  { key: "nameAm", label: "Amharic Name", field: "nameAm" },
  { key: "latitude", label: "Latitude", field: "" },
  { key: "longitude", label: "Longitude", field: "" },
  { key: "isActive", label: "Status", field: "isActive" },
  { key: "actions", label: "Action", field: "" },
];

const deleteMutation = useMutation({
  mutationFn: (id: string) => deleteCity(id),
});

const handleOpenAddModal = async () => {
  const res = await openModal("CityModal");
  if (res) refetch();
};

const handleOpenEditModal = async (row: any) => {
  const res = await openModal("CityModal", { city: row });
  if (res) refetch();
};

const handleDelete = async (row: any) => {
  const confirmed = await openModal("ConfirmationModal", {
    action: "delete",
    subject: "city",
    title: "Delete City",
    message: `Are you sure you want to delete "${row.name}"? This action cannot be undone.`,
    confirmText: "Yes, Delete",
  });

  if (!confirmed) return;

  const res: any = await deleteMutation.mutateAsync(row._id);
  if (res.success || res.status === 200 || res.status === 204) {
    toast.success("City deleted successfully!");
    refetch();
  } else {
    toast.error(res.error || "Failed to delete city");
  }
};
</script>
