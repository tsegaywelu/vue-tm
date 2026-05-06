<template>
  <Teleport defer to="#page-actions">
    <Button variant="primary" size="md" @click="openAddInsuranceModal">
      <template #leftIcon>
        <i class="mdi mdi-plus text-lg"></i>
      </template>
      Add Insurance
    </Button>
  </Teleport>
  <Table
    :columns="columns"
    :rows="tableData"
    @row_click="handleRowClick"
    :row_alignment="{
      total: 'right',
    }"
    :head_alignment="{
      total: 'right',
    }"
  >
    <template #cell-insurer="{ row }">
      <span class="font-bold text-gray-900">{{
        row.insurer?.name || "N/A"
      }}</span>
    </template>

    <template #cell-vehicle="{ row }">
      <div class="flex items-center gap-2">
        <span class="font-bold text-gray-900">{{
          row.vehicle?.plateNumber || "N/A"
        }}</span>
      </div>
    </template>

    <template #cell-prePaymentDate="{ row }">
      <span class="text-gray-600 font-medium">{{
        dateFormatter(row.prePaymentDate)
      }}</span>
    </template>

    <template #cell-prePaymentMatureDate="{ row }">
      <span class="text-gray-600 font-medium">{{
        dateFormatter(row.prePaymentMatureDate)
      }}</span>
    </template>

    <template #cell-total="{ row }">
      <span class="font-black">{{ currencyFormatter(row.total) }}</span>
    </template>

    <template #cell-actions="{ row }">
      <Dropdown>
        <DropDownItem @click="handleRowClick(row)">View Details</DropDownItem>
        <DropDownItem @click="openEditInsuranceModal(row)">Edit</DropDownItem>
      </Dropdown>
    </template>
  </Table>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { usePagination } from "@/composables/usePagination";
import Table from "@/components/common/Table.vue";
import Button from "@/components/common/Button.vue";
import type { TableColumn } from "@/components/common/Table.vue";
import { openModal } from "@customizer/modal-x";
import { currencyFormatter, dateFormatter } from "@/utils/utils";
import Dropdown from "@/components/common/Dropdown.vue";
import DropDownItem from "@/components/common/DropDownItem.vue";

const router = useRouter();

const filters = ref({
  status: "",
});

const { response: tableData, refetch } = usePagination({
  url: "/insurance",
  params: computed(() => ({
    status: filters.value.status || undefined,
  })),
  queryKey: ["insurances"],
});
const columns: TableColumn[] = [
  { key: "insurer", label: "Insurance Provider" },
  { key: "vehicle", label: "Vehicle" },
  { key: "prePaymentDate", label: "Pre Payment Date" },
  { key: "prePaymentMatureDate", label: "Mature Date" },
  { key: "JV", label: "JV" },
  { key: "CPV", label: "CPV" },
  { key: "total", label: "Total Price", cellAlign: "right" },
  { key: "actions", label: "Actions", cellAlign: "right" },
];

const openAddInsuranceModal = () => {
  openModal("AddInsuranceModal", {
    onSuccess: () => {
      refetch();
    },
  });
};

const openEditInsuranceModal = (row: any) => {
  openModal("EditInsuranceModal", {
    insurance: row,
    onSuccess: () => {
      refetch();
    },
  });
};

const handleRowClick = (row: any) => {
  router.push(`/insurance/insuranceDetails/${row._id}`);
};
</script>
