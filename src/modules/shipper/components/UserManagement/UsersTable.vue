<template>
  <Table :columns="columns" :rows="response" :is-loading="isLoading">
    <template #cell-username="{ row }">
      <span class="font-bold text-grey-900">{{ row.username }}</span>
    </template>
    <template #cell-roleName="{ row }">
      <span class="text-grey-600">{{ row.role?.name || "-" }}</span>
    </template>
    <template #cell-roleType="{ row }">
      <span
        class="px-2 py-1 text-xs font-bold rounded-full"
        :class="
          row.type === 'ADMIN'
            ? 'bg-purple-100 text-purple-700'
            : 'bg-blue-100 text-blue-700'
        "
      >
        {{ row.type || row.role?.type || "-" }}
      </span>
    </template>
    <template #cell-region="{ row }">
      <span class="text-grey-600">
        {{ row.region?.name || row.location?.region || "-" }}
      </span>
    </template>
    <template #cell-actions="{ row }">
      <div @click.stop class="flex justify-center">
        <Dropdown>
          <template #default="{ close }">
            <DropDownItem
              label="Edit User"
              @click="
                close();
                $emit('action', { action: 'edit', row });
              "
            />
            <DropDownItem
              label="Delete User"
              variant="danger"
              @click="
                close();
                $emit('action', { action: 'delete', row });
              "
            />
          </template>
        </Dropdown>
      </div>
    </template>
  </Table>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { usePagination } from "@/composables/usePagination";
import Table, { type TableColumn } from "@/components/common/Table.vue";
import Dropdown from "@/components/common/Dropdown.vue";
import DropDownItem from "@/components/common/DropDownItem.vue";
import { useAuthStore } from "@/store/authStore";

const authStore = useAuthStore();
const shipperId = computed(
  () => authStore.current_user?.user?.shipper?._id || "",
);

const { response, isLoading, refetch } = usePagination({
  id: "shipper-users-list",
  url: "/user",
  params: computed(() => ({
    shipper: shipperId.value,
  })),
});

const columns: TableColumn<any>[] = [
  { key: "username", label: "Name", field: "username" },
  { key: "roleName", label: "Role Name", field: "role.name" },
  { key: "roleType", label: "Role Type", field: "type" },
  { key: "region", label: "Region", field: "region.name" },
  { key: "actions", label: "Action", field: "" },
];

defineExpose({ refetch });
defineEmits(["action"]);
</script>
