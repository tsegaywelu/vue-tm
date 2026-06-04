<template>
  <Teleport to="#page-actions" defer>
    <Button v-permission="'FACILITY:create'" size="md" variant="primary" class="hidden sm:flex" @click="openFacilityModal(null)">
      New Facility
    </Button>
  </Teleport>

  <!-- Floating action button — mobile only -->
  <button
    v-permission="'FACILITY:create'"
    class="fixed bottom-6 right-6 sm:hidden z-50 w-14 h-14 rounded-full bg-primary text-white shadow-xl flex items-center justify-center active:scale-95 transition-transform"
    @click="openFacilityModal(null)"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  </button>

  <Table
    :columns="columns"
    :rows="response"
    :loading="isLoading"
    :hide_on_sm_screen="['city']"
    :on_sm_screen_column_span="{ name: 2, shipper: 2, region: 1 }"
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
  const res = await openModal("FacilityModal", { facility, isShipper: false });
  if (res) {
    refetch();
  }
};
</script>
