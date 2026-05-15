<template>
  <Teleport to="#page-actions" defer>
    <Button
      variant="primary"
      size="md"
      @click="router.push('/shipper/contracts/add')"
    >
      + Add Contract
    </Button>
  </Teleport>
  <Table :columns="columns" :rows="response" @row_click="navigateToDetails">
    <template #cell-shipper="{ row }">
      <span class="text-grey-600">{{ row.shipper?.name || "-" }}</span>
    </template>
    <template #cell-carrier="{ row }">
      <span class="text-grey-600">{{ row.carrier?.name || "-" }}</span>
    </template>
    <template #cell-createdAt="{ value }">
      <span class="text-grey-600">{{ value.split("T")[0] || "-" }}</span>
    </template>
  </Table>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { usePagination } from "@/composables/usePagination";
import Table, { type TableColumn } from "@/components/common/Table.vue";
import Button from "@/components/Button.vue";

const router = useRouter();

const { response } = usePagination({
  id: "shipper-contracts-list",
  url: "/contract",
});

const columns: TableColumn<any>[] = [
  { key: "shipper", label: "Shipper", field: "shipper.name" },
  { key: "carrier", label: "Carrier", field: "carrier.name" },
  { key: "createdAt", label: "Created At", field: "createdAt" },
];

const navigateToDetails = (row: any) => {
  router.push(`/shipper/contracts/${row._id}`);
};
</script>
