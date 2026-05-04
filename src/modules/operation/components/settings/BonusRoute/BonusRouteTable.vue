<template>
  <Table
    id="bonus-route-list"
    :columns="columns"
    :rows="response"
    search_placeholder="Search bonus routes..."
  >
    <template #cell-route="{ row }">
      {{ row.route?.routeName || (row.route?.origin?.name + ' - ' + row.route?.destination?.name) }}
    </template>

    <template #cell-amount="{ row }">
      <span class="font-semibold">ETB</span> {{ row.amount?.toFixed(2) }}
    </template>

    <template #cell-description="{ row }">
      {{ row.description || "-" }}
    </template>

    <template #cell-createdAt="{ row }">
      {{ row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-" }}
    </template>

    <template #cell-actions="{ row }">
      <div class="flex items-center justify-end gap-2">
        <Dropdown>
          <template #default="{ close }">
            <DropDownItem
              :icon="icons.edit"
              label="Edit"
              @click.stop="
                handleAction(row, 'edit');
                close();
              "
            />
            <DropDownItem
              :icon="icons.delete"
              label="Delete"
              class="text-error-600"
              @click.stop="
                handleAction(row, 'delete');
                close();
              "
            />
          </template>
        </Dropdown>
      </div>
    </template>
  </Table>
</template>

<script setup lang="ts">
import Table from "@/components/common/Table.vue";
import Dropdown from "@/components/common/Dropdown.vue";
import DropDownItem from "@/components/common/DropDownItem.vue";
import { usePagination } from "@/composables/usePagination";
import { icons } from "@/utils/icons";
import type { TableColumn } from "@/components/common/Table.vue";
import type { BonusRoute } from "../../operation.types";

const emit = defineEmits(["action"]);

const { response, refetch } = usePagination<BonusRoute>({
  id: "bonus-route-list",
  url: "/bonus/config/route",
  searchKey: "description[regex]", // Searching by description or maybe route name if backend supports it
});

const columns: TableColumn<BonusRoute>[] = [
  { key: "route", label: "Route", field: "route.routeName" },
  { key: "amount", label: "Amount (ETB)", field: "amount" },
  { key: "description", label: "Description", field: "description" },
  { key: "createdAt", label: "Created At", field: "createdAt" },
  { key: "actions", label: "Action", field: "", cellAlign: "right" },
];

const handleAction = (row: BonusRoute, action: string) => {
  emit("action", { row, action });
};

defineExpose({
  refetch,
});
</script>
