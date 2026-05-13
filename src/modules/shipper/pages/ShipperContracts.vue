<template>
  <Table :columns="columns" :rows="response" @row_click="navigateToDetails">
    <template #cell-name="{ row }">
      <span class="font-bold text-grey-900">{{ row.name || "-" }}</span>
    </template>
    <template #cell-shipper="{ row }">
      <span class="text-grey-600">{{ row.shipper?.name || "-" }}</span>
    </template>
    <template #cell-carrier="{ row }">
      <span class="text-grey-600">{{ row.carrier?.name || "-" }}</span>
    </template>
    <template #cell-startDate="{ row }">
      <span class="text-grey-600">{{ row.startDate?.split("T")[0] || "-" }}</span>
    </template>
    <template #cell-endDate="{ row }">
      <span class="text-grey-600">{{ row.endDate?.split("T")[0] || "-" }}</span>
    </template>
    <template #cell-status="{ row }">
      <span
        class="px-2 py-1 text-xs font-bold rounded-full"
        :class="
          row.isActive
            ? 'bg-emerald-100 text-emerald-700'
            : 'bg-red-100 text-red-700'
        "
      >
        {{ row.isActive ? "Active" : "Inactive" }}
      </span>
    </template>
  </Table>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { usePagination } from "@/composables/usePagination";
import Table from "@/components/common/Table.vue";

const router = useRouter();

const { response } = usePagination({
  id: "shipper-contracts-list",
  url: "/contract",
});

const columns: TableColumn<any>[] = [
  { key: "name", label: "Contract Name", field: "name" },
  { key: "shipper", label: "Shipper", field: "shipper.name" },
  { key: "carrier", label: "Carrier", field: "carrier.name" },
  { key: "startDate", label: "Start Date", field: "startDate" },
  { key: "endDate", label: "End Date", field: "endDate" },
  { key: "status", label: "Status", field: "isActive" },
];

const navigateToDetails = (row: any) => {
  router.push(`/shipper/contracts/${row._id}`);
};
</script>
