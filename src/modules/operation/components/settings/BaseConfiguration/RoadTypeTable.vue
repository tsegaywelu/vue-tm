<template>
  <Table
    id="road-type-list"
    :columns="columns"
    :rows="response"
    search_placeholder="Search by name..."
  >
    <template #cell-name="{ row }">
      {{ row.name }}
    </template>
    
    <template #cell-code="{ row }">
      {{ row.code }}
    </template>

    <template #cell-actions="{ row }">
      <div class="flex items-center justify-end gap-2">
        <Dropdown>
          <template #default="{ close }">
            <DropDownItem v-permission="'ROAD_TYPE:update'"
              :icon="icons.edit"
              label="Edit"
              @click.stop="
                handleAction(row, 'edit');
                close();
              "
            />
            <!-- <DropDownItem
              :icon="icons.delete"
              label="Delete"
              class="text-error-600"
              @click.stop="
                handleAction(row, 'delete');
                close();
              "
            /> -->
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
  id: "road-type-list",
  url: "/road-type",
  searchKey: "name[regex]",
});

const columns: TableColumn<any>[] = [
  { key: "name", label: "Name", field: "name" },
  { key: "code", label: "Code", field: "code" },
  { key: "actions", label: "Action", field: "",  },
];

const handleAction = (row: any, action: string) => {
  emit("action", { row, action });
};

defineExpose({
  refetch,
});
</script>
