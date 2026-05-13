<template>
  <Teleport to="#page-actions" defer>
    <Button size="md" @click="$router.push('/shipper/routes/add')">
      Create Route
    </Button>
  </Teleport>
  <Table 
    alignment="left" 
    :columns="columns" 
    :rows="response"
    @row_click="(row) => $router.push(`/shipper/routes/${row._id}`)"
  >
    <template #after-search> </template>
    <template #cell-routeName="{ row }">
      <span class="font-bold text-grey-900">{{ row.routeName }}</span>
    </template>
    <template #cell-carriers="{ value }">
      <span class="text-grey-600">{{
        value?.map((el: any) => el.name)?.join?.(", ")
      }}</span>
    </template>
    <template #cell-waypoint="{ value }">
      <span class="text-grey-600">{{ value?.length || 0 }}</span>
    </template>
    <template #cell-actions="{ row }">
      <div class="flex items-center justify-start gap-2 w-full">
        <button
          @click.stop="$router.push(`/shipper/routes/${row._id}`)"
          class="p-2 text-gray-400 hover:text-primary transition-colors"
          title="View Details"
        >
          <span class="size-5" v-html="icons.eye"></span>
        </button>
        <button
          @click.stop="$router.push(`/shipper/routes/edit/${row._id}`)"
          class="p-2 text-gray-400 hover:text-primary transition-colors"
          title="Edit Route"
        >
          <span class="size-5" v-html="icons.editIcon"></span>
        </button>
      </div>
    </template>
  </Table>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useAuthStore } from "@/store/authStore";
import { usePagination } from "@/composables/usePagination";
import Table, { type TableColumn } from "@/components/common/Table.vue";
import Button from "@/components/common/Button.vue";
import { icons } from "@/utils/icons";

const authStore = useAuthStore();
const shipperId = computed(
  () => authStore.current_user?.user?.shipper?._id || "",
);

const { response } = usePagination({
  id: "shipper-routes-list",
  url: `/route-request`,
});

const columns: TableColumn<any>[] = [
  { key: "routeName", label: "Route Name", field: "routeName" },
  { key: "waypoint", label: "Waypoint" },
  { key: "carriers", label: "Carriers" },
  { key: "actions", label: "Actions", field: "", cellAlign: "right" },
];
</script>
