<template>
  <Teleport to="#page-actions" defer>
    <Button size="md" variant="primary" @click="handleAdd">
      Add Carrier Admin
    </Button>
  </Teleport>

  <Table :columns="columns" :rows="response">
    <template #cell-username="{ row }">
      <span class="font-bold text-grey-900">{{ row.username }}</span>
    </template>
    <template #cell-carrier="{ row }">
      <span class="text-grey-600">{{ row.carrier?.name || "-" }}</span>
    </template>
    <template #cell-role="{ row }">
      <span class="text-grey-600">{{ row.role?.name || "-" }}</span>
    </template>
    <template #cell-actions="{ row }">
      <div @click.stop class="flex justify-center">
        <button
          class="px-3 py-1 text-xs font-semibold text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors"
          @click="handleEdit(row)"
        >
          Edit
        </button>
      </div>
    </template>
  </Table>
</template>

<script setup lang="ts">
import { openModal } from "@customizer/modal-x";
import Table, { type TableColumn } from "@/components/common/Table.vue";
import Button from "@/components/common/Button.vue";
import { usePagination } from "@/composables/usePagination";

const { response, refetch } = usePagination({
  id: "admin-carrier-admins",
  url: "/carrier/admins",
  params(state) {
    return { username: state.search };
  },
});

const columns: TableColumn<any>[] = [
  { key: "username", label: "Username", field: "username" },
  { key: "carrier", label: "Organization", field: "carrier" },
  { key: "role", label: "Role", field: "role" },
  { key: "actions", label: "Action", field: "" },
];

async function handleAdd() {
  const res = await openModal("CreateCarrierAdminModal");
  if (res) refetch();
}

async function handleEdit(row: any) {
  const res = await openModal("EditCarrierAdminModal", { admin: row });
  if (res) refetch();
}
</script>
