<template>
  <Table alignment="left" :columns="columns" :rows="response">
    <template #cell-name="{ row }">
      <span class="font-bold text-grey-900">{{ row.name }}</span>
    </template>
    <template #cell-createdAt="{ row }">
      <span class="text-grey-600">
        {{ row.createdAt ? row.createdAt.substring(0, 10) : "-" }}
      </span>
    </template>
    <template #cell-actions="{ row }">
      <div @click.stop class="flex justify-center">
        <Dropdown>
          <template #default="{ close }">
            <DropDownItem
              label="Edit Role"
              @click="
                close();
                $emit('action', { action: 'edit', row });
              "
            />
            <DropDownItem
              label="Delete Role"
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
  id: "shipper-roles-list",
  url: "/role",
  params: computed(() => ({
    shipper: shipperId.value,
  })),
});

const columns: TableColumn<any>[] = [
  { key: "name", label: "Name", field: "name" },
  { key: "createdAt", label: "Created At", field: "createdAt" },
  { key: "actions", label: "Action", field: "" },
];

defineExpose({ refetch });
defineEmits(["action"]);
</script>
