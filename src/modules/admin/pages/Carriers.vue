<template>
  <Teleport to="#page-actions" defer>
    <Button size="md" variant="primary" @click="router.push('/admin/carriers/add')">
      Add Carrier
    </Button>
  </Teleport>

  <Table :columns="columns" :rows="response">
    <template #cell-name="{ row }">
      <span class="font-bold text-grey-900">{{ row.name }}</span>
    </template>

    <template #cell-tin="{ row }">
      <span class="text-grey-600">{{ row.tin || "-" }}</span>
    </template>
    <template #cell-phone="{ row }">
      <span class="text-grey-600">{{ row.phone || "-" }}</span>
    </template>
    <template #cell-email="{ row }">
      <span class="text-grey-600">{{ row.email || "-" }}</span>
    </template>
    <template #cell-address="{ row }">
      <span class="text-grey-600">{{ row.address || "-" }}</span>
    </template>
    <template #cell-createdAt="{ row }">
      <span class="text-grey-600">{{ new Date(row.createdAt).toLocaleDateString() }}</span>
    </template>

    <template #cell-actions="{ row }">
      <div @click.stop class="flex justify-center">
        <button
          class="px-3 py-1 text-xs font-semibold text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors"
          @click="router.push(`/admin/carriers/edit/${row._id}`)"
        >
          Edit
        </button>
      </div>
    </template>
  </Table>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import Table, { type TableColumn } from "@/components/common/Table.vue";
import Button from "@/components/common/Button.vue";
import { usePagination } from "@/composables/usePagination";

const router = useRouter();

const { response } = usePagination({
  id: "admin-carriers-list",
  url: "/carrier",
  params(state) {
    return { name: state.search };
  },
});

const columns: TableColumn<any>[] = [
  { key: "name", label: "Name", field: "name" },
  { key: "tin", label: "TIN", field: "tin" },
  { key: "phone", label: "Phone", field: "phone" },
  { key: "email", label: "Email", field: "email" },
  { key: "address", label: "Address", field: "address" },
  { key: "createdAt", label: "Created At", field: "createdAt" },
  { key: "actions", label: "Action", field: "" },
];
</script>
