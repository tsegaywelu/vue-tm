<template>
  <Table
    id="store-requisitions-list"
    :columns="columns"
    :rows="response"
    search_placeholder="Search by reference number..."
  >
    <template #cell-status="{ row }">
      <!-- <Badge :variant="getStatusVariant(row.status)">
        {{ row.status }}
      </Badge> -->
      <!-- <Status :value="row.status" /> -->
       {{ row.status }}
    </template>

    <template #cell-items="{ row }">
      <div class="flex flex-col gap-1">
        <span v-for="item in row.items?.slice(0, 2)" :key="item._id" class="text-xs text-gray-600">
          • {{ item.inventoryItem?.name }} ({{ item.quantity }})
        </span>
        <span v-if="row.items?.length > 2" class="text-[10px] text-primary font-medium">
          + {{ row.items.length - 2 }} more items
        </span>
      </div>
    </template>

    <template #cell-date="{ row }">
      {{ new Date(row.date).toLocaleDateString() }}
    </template>

    <template #cell-requiredDate="{ row }">
      {{ new Date(row.requiredDate).toLocaleDateString() }}
    </template>

    <template #cell-preparedBy="{ row }">
      <!-- <div class="flex items-center gap-2">
        <div class="size-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold">
          {{ row.preparedBy?.firstName?.[0] }}{{ row.preparedBy?.lastName?.[0] }}
        </div>
        <span class="text-xs font-medium">{{ row.preparedBy?.firstName }} {{ row.preparedBy?.lastName }}</span> -->
        {{ row.preparedBy?.username }} {{ row.preparedBy?.lastName }}
      <!-- </div> -->
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

import { usePagination } from "@/composables/usePagination";
import { icons } from "@/utils/icons";
import type { TableColumn } from "@/components/common/Table.vue";

const emit = defineEmits(["action"]);

const { response, refetch } = usePagination<any>({
  id: "store-requisitions-list",
  url: "/store-requisition-vouchers",
  searchKey: "referenceNumber[regexAny]",
});

const columns: TableColumn<any>[] = [
  { key: "date", label: "Date", field: "date" },
  { key: "referenceNumber", label: "Reference No", field: "referenceNumber" },
  { key: "status", label: "Status", field: "status" },
  { key: "items", label: "Items", field: "items" },
  { key: "requiredDate", label: "Required Date", field: "requiredDate" },
  { key: "preparedBy", label: "Prepared By", field: "preparedBy" },
  { key: "actions", label: "Actions", field: "", cellAlign: "right" },
];

const getStatusVariant = (status: string) => {
  switch (status) {
    case "PENDING": return "warning";
    case "APPROVED": return "info";
    case "AUTHORIZED": return "success";
    case "CANCELLED":
    case "REJECTED": return "error";
    default: return "neutral";
  }
};

const handleAction = (row: any, action: string) => {
  emit("action", { row, action });
};

defineExpose({
  refetch,
});
</script>
