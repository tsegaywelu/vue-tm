<template>
  <Table
    id="users-list"
    :columns="columns"
    :rows="response"
    search_placeholder="Search by username..."
  >
    <template #cell-roleName="{ row }">
      {{ row.role?.name || '-' }}
    </template>
    
    <template #cell-roleType="{ row }">
      {{ row.role?.type || '-' }}
    </template>

    <template #cell-region="{ row }">
      {{ row.region?.name || '-' }}
    </template>

    <template #cell-actions="{ row }">
      <div class="flex items-center justify-end gap-2">
        <Button
          size="sm"
          variant="outline"
          class="text-error-600 border-error-200 hover:bg-error-50"
          @click.stop="handleAction(row, 'reset')"
        >
          Reset Password
        </Button>
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
import Button from "@/components/Button.vue";
import Dropdown from "@/components/common/Dropdown.vue";
import DropDownItem from "@/components/common/DropDownItem.vue";
import { usePagination } from "@/composables/usePagination";
import { icons } from "@/utils/icons";
import type { TableColumn } from "@/components/common/Table.vue";

const emit = defineEmits(["action"]);

const { response, refetch } = usePagination<any>({
  id: "users-list",
  url: "/user",
  searchKey: "username[regex]",
});

const columns: TableColumn<any>[] = [
  { key: "username", label: "Username", field: "username" },
  { key: "roleName", label: "Role Name", field: "role.name" },
  { key: "roleType", label: "Role Type", field: "role.type" },
  { key: "region", label: "Region", field: "region.name" },
  { key: "actions", label: "Action", field: "", cellAlign: "right" },
];

const handleAction = (row: any, action: string) => {
  emit("action", { row, action });
};

defineExpose({
  refetch,
});
</script>
