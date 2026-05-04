<template>
  <Table
    id="good-transfers-list"
    :columns="columns"
    :rows="response"
    search_placeholder="Search by reference number..."
  >
    <template #cell-type="{ row }">
      <!-- <Status :value="row.type" /> -->
      {{ row.type }}
    </template>

    <template #cell-status="{ row }">
      <!-- <Status :value="row.status" /> -->
      {{ row.status }}
    </template>

    <template #cell-items="{ row }">
      <div class="flex flex-col gap-1">
        <span v-for="item in row.items?.slice(0, 2)" :key="item._id" class="text-xs text-gray-600">
          • {{ item.inventoryItem?.name || item.item?.name }} ({{ item.quantity }})
        </span>
        <span v-if="row.items?.length > 2" class="text-[10px] text-primary font-medium">
          + {{ row.items.length - 2 }} more items
        </span>
      </div>
    </template>

    <template #cell-date="{ row }">
      {{ new Date(row.date).toLocaleDateString() }}
    </template>

    <template #cell-preparedBy="{ row }">
      {{ row.preparedBy?.username }}
    </template>

    <template #cell-actions="{ row }">
      <div class="flex items-center justify-end">
        <Dropdown>
          <template #default="{ close }">
            <DropDownItem
              :icon="icons.eye"
              label="View Details"
              @click.stop="
                handleAction(row, 'view');
                close();
              "
            />
            <DropDownItem
              v-if="row.status === 'PENDING'"
              :icon="icons.edit"
              label="Edit"
              @click.stop="
                handleAction(row, 'edit');
                close();
              "
            />
            <DropDownItem
              v-if="row.status === 'PENDING'"
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
import Status from "@/components/common/Status.vue";
import { usePagination } from "@/composables/usePagination";
import { icons } from "@/utils/icons";
import type { TableColumn } from "@/components/common/Table.vue";

const emit = defineEmits(["action"]);

const { response, refetch } = usePagination<any>({
  id: "good-transfers-list",
  url: "/good-transfer-vouchers",
  searchKey: "referenceNumber[regexAny]",
});

const columns: TableColumn<any>[] = [
  { key: "date", label: "Date", field: "date" },
  { key: "referenceNumber", label: "Reference No", field: "referenceNumber" },
  { key: "type", label: "Type", field: "type" },
  { key: "status", label: "Status", field: "status" },
  { key: "items", label: "Items", field: "items" },
  { key: "preparedBy", label: "Prepared By", field: "preparedBy" },
  { key: "actions", label: "Actions", field: "", cellAlign: "right" },
];

const handleAction = (row: any, action: string) => {
  emit("action", { row, action });
};

defineExpose({
  refetch,
});
</script>
