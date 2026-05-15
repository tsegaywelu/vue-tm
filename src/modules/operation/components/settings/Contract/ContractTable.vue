<template>
  <Table
    alignment="left"
    id="contract-list"
    :columns="columns"
    :rows="response"
    search_placeholder="Search contracts..."
  >
    <template #cell-shipper="{ row }">
      {{ row.shipper?.name || "-" }}
    </template>

    <template #cell-carrier="{ row }">
      {{ row.carrier?.name || "-" }}
    </template>

    <template #cell-createdAt="{ row }">
      {{ new Date(row.createdAt).toLocaleDateString() }}
    </template>

    <template #cell-actions="{ row }">
      <div class="flex items-center justify-center">
        <button
          type="button"
          v-permission="'CONTRACT:read'"
          class="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-primary"
          @click.stop="handleAction(row, 'view')"
          title="View Details"
        >
          <i v-html="icons.eye"></i>
        </button>
      </div>
    </template>
  </Table>
</template>

<script setup lang="ts">
import Table from "@/components/common/Table.vue";
import { usePagination } from "@/composables/usePagination";
import { icons } from "@/utils/icons";
import type { TableColumn } from "@/components/common/Table.vue";

const emit = defineEmits(["action"]);

const { response, refetch } = usePagination<any>({
  id: "contract-list",
  url: "/contract",
});

const columns: TableColumn<any>[] = [
  { key: "shipper", label: "Shipper", field: "shipper.name" },
  { key: "carrier", label: "Carrier", field: "carrier.name" },
  { key: "createdAt", label: "Date Created", field: "createdAt" },
  { key: "actions", label: "Action", field: "", cellAlign: "right" },
];

const handleAction = (row: any, action: string) => {
  emit("action", { row, action });
};

defineExpose({
  refetch,
});
</script>
