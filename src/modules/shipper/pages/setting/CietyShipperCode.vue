<template>
  <div class="flex flex-col h-full">
    <Teleport to="#page-actions" defer>
      <Button
        variant="primary"
        size="md"
        class="flex items-center gap-2"
        @click="openCreateModal"
      >
        <i v-html="icons.plus" />
        Add City Code
      </Button>
    </Teleport>

    <div class="flex-1 min-h-0">
      <Table
        id="city-shipper-codes-list"
        :columns="columns"
        :rows="response"
        :loading="isLoading"
        search_placeholder="Search..."
      >
        <template #cell-city="{ row }">
          <div class="flex flex-col">
            <span class="font-medium text-gray-900">
              {{ row.city?.code || row.city?.name || "-" }}
            </span>
            <span v-if="row.city?.code" class="text-xs text-gray-400">
              {{ row.city?.name }}
            </span>
          </div>
        </template>

        <template #cell-shipper="{ row }">
          <span class="text-sm text-gray-700">
            {{ row.shipper?.name || "-" }}
          </span>
        </template>

        <template #cell-originCode="{ value }">
          <span class="font-mono text-sm font-semibold text-primary">
            {{ value || "-" }}
          </span>
        </template>

        <template #cell-destinationCode="{ value }">
          <span class="font-mono text-sm font-semibold text-primary">
            {{ value || "-" }}
          </span>
        </template>

        <template #cell-actions="{ row }">
          <div class="flex items-center justify-end">
            <Dropdown>
              <template #trigger>
                <button class="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </template>
              <template #default="{ close }">
                <div class="py-1 min-w-[140px]">
                  <DropDownItem
                    :icon="icons.edit"
                    label="Edit"
                    @click.stop="openEditModal(row); close()"
                  />
                  <DropDownItem
                    :icon="icons.delete"
                    label="Delete"
                    class="text-red-600"
                    @click.stop="handleDelete(row); close()"
                  />
                </div>
              </template>
            </Dropdown>
          </div>
        </template>
      </Table>
    </div>
  </div>
</template>

<script setup lang="ts">
import Table from "@/components/common/Table.vue";
import Button from "@/components/Button.vue";
import Dropdown from "@/components/common/Dropdown.vue";
import DropDownItem from "@/components/common/DropDownItem.vue";
import { icons } from "@/utils/icons";
import { useToastStore } from "@/store/toastStore";
import { usePagination } from "@/composables/usePagination";
import { openModal } from "@customizer/modal-x";
import { useMutation } from "@tanstack/vue-query";
import { delete_city_shipper_code } from "@/modules/shipper/api/city-shipper-code.api";
import type { TableColumn } from "@/components/common/Table.vue";

const toast = useToastStore();

const { response, isLoading, refetch } = usePagination<any>({
  id: "city-shipper-codes-list",
  url: "/city-shipper-code/contracted",
});

const columns: TableColumn<any>[] = [
  { key: "city", label: "City", field: "city" },
  { key: "shipper", label: "Shipper", field: "shipper" },
  { key: "originCode", label: "Origin Code", field: "originCode" },
  { key: "destinationCode", label: "Destination Code", field: "destinationCode" },
  { key: "actions", label: "", field: "", cellAlign: "right" },
];

const deleteMutation = useMutation({
  mutationFn: ({ shipperId, id }: { shipperId: string; id: string }) =>
    delete_city_shipper_code(shipperId, id),
});

const openCreateModal = async () => {
  const result = await openModal("CreateCityShipperCodeModal", {});
  if (result) refetch();
};

const openEditModal = async (item: any) => {
  const result = await openModal("EditCityShipperCodeModal", { item });
  if (result) refetch();
};

const handleDelete = async (row: any) => {
  const confirmed = await openModal("ConfirmationModal", {
    title: "Delete City Shipper Code",
    message: `Delete the code for "${row.city?.name || "this city"}"? This cannot be undone.`,
    confirmText: "Delete",
    action: "delete",
  });
  if (!confirmed) return;

  const shipperId = row.shipper?._id || row.shipper;
  const res = await deleteMutation.mutateAsync({ shipperId, id: row._id });
  if (res.success || res.status === 200 || res.status === 204) {
    toast.success("City shipper code deleted");
    refetch();
  } else {
    toast.error(res.error || "Failed to delete city shipper code");
  }
};
</script>
