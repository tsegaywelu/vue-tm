<template>
  <Teleport to="#page-actions" defer>
    <Button v-permission="'FACILITY:create'" size="md" variant="primary" @click="openFacilityModal(null)">
      New Facility
    </Button>
  </Teleport>

  <Table
    :columns="columns"
    :rows="response"
    :loading="isLoading"
  >
    <template #cell-name="{ row }">
      <span class="font-bold text-grey-900">{{ row.name }}</span>
    </template>
    <template #cell-shipper="{ row }">
      <span class="text-grey-600">{{ row.shipper?.name || '-' }}</span>
    </template>
    <template #cell-region="{ row }">
      <span class="text-grey-600">{{ row.location?.region || '-' }}</span>
    </template>
    <template #cell-city="{ row }">
      <span class="text-grey-600">{{ row.location?.city || '-' }}</span>
    </template>
    <template #cell-actions="{ row }">
      <div @click.stop class="flex justify-center">
        <Dropdown>
          <template #default="{ close }">
            <DropDownItem
              label="Edit Facility"
              @click="
                close();
                openFacilityModal(row);
              "
            />
          </template>
        </Dropdown>
      </div>
    </template>
  </Table>
</template>

<script setup lang="ts">
import Button from "@/components/common/Button.vue";
import { usePagination } from "@/composables/usePagination";
import Dropdown from "@/components/common/Dropdown.vue";
import DropDownItem from "@/components/common/DropDownItem.vue";
import Table from "@/components/common/Table.vue";
import type { TableColumn } from "@/components/common/Table.vue";
import { openModal } from "@customizer/modal-x";

const { response, refetch, isLoading } = usePagination({
  id: "facilities-list",
  url: "/facility/shipper/carrier",
});

const columns: TableColumn<any>[] = [
  { key: "name", label: "Name", field: "name" },
  { key: "shipper", label: "Shipper", field: "shipper.name" },
  { key: "region", label: "Region", field: "location.region" },
  { key: "city", label: "City", field: "location.city" },
  { key: "actions", label: "Actions", field: "" },
];

const openFacilityModal = async (facility: any = null) => {
  const res = await openModal("FacilityModal", { facility });
  if (res) {
    refetch();
  }
};
</script>
