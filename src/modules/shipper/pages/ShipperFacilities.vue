<template>
  <Teleport to="#page-actions" defer>
      <Button
        v-if="!isLoading"
        size="md"
        @click="handleOpenAddModal"
      >
        Add Facility
      </Button>
  </Teleport>

  <Table :columns="columns" :rows="response">
    <template #cell-name="{ row }">
      <span class="font-bold text-grey-900">{{ row.name }}</span>
    </template>
    <template #cell-region="{ row }">
      <span class="text-grey-600">{{
        row.location?.region || row.region || "-"
      }}</span>
    </template>
    <template #cell-city="{ row }">
      <span class="text-grey-600">{{
        row.location?.city || row.city || "-"
      }}</span>
    </template>
    <template #cell-actions="{ row }">
      <div @click.stop class="flex justify-center">
        <Dropdown>
          <template #default="{ close }">
            <DropDownItem
              label="Edit Facility"
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
import { computed } from "vue";
import { useAuthStore } from "@/store/authStore";
import { usePagination } from "@/composables/usePagination";
import Table, { type TableColumn } from "@/components/common/Table.vue";
import Button from "@/components/common/Button.vue";
import Dropdown from "@/components/common/Dropdown.vue";
import DropDownItem from "@/components/common/DropDownItem.vue";
import { openModal } from "@customizer/modal-x";

const authStore = useAuthStore();
const shipperId = computed(
  () => authStore.current_user?.user?.shipper?._id || "",
);

const { response, refetch, isLoading } = usePagination({
  id: "shipper-facilities-list",
  url: "/facility",
});

const columns: TableColumn<any>[] = [
  { key: "name", label: "Facility Name", field: "name" },
  { key: "region", label: "Region", field: "region" },
  { key: "city", label: "City", field: "city" },
  { key: "actions", label: "Actions", field: "" },
];
const handleOpenAddModal = () => {
  openModal("FacilityModal", {
    shipperId: shipperId.value,
    isShipper: true,
    onClose: (isCreated: boolean) => {
      if (isCreated) refetch();
    },
  });
};

const handleOpenEditModal = (row: any) => {
  openModal("FacilityModal", {
    facility: row,
    isShipper: true,
    onClose: (isUpdated: boolean) => {
      if (isUpdated) refetch();
    },
  });
};
</script
