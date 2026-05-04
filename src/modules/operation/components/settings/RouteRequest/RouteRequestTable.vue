<template>
  <Table
    id="route-request-list"
    :columns="columns"
    :rows="response"
    search_placeholder="Search route requests..."
  >
    <template #cell-routeName="{ row }">
      {{ row.routeName }}
    </template>

    <template #cell-origin="{ row }">
      {{ row.origin }}
    </template>

    <template #cell-destination="{ row }">
      {{ row.destination }}
    </template>

    <template #cell-waypoint="{ row }">
      {{ row.waypoint?.length || 0 }}
    </template>

    <template #cell-carriers="{ row }">
      {{ row.carriers?.map((c: any) => c.name).join(", ") || "-" }}
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

const emit = defineEmits(["action"]);

const { response, refetch } = usePagination<any>({
  id: "route-request-list",
  url: "/route-request",
  searchKey: "routeName[regex]",
});

const columns: TableColumn<any>[] = [
  { key: "routeName", label: "Route Name", field: "routeName" },
  { key: "origin", label: "Origin", field: "origin" },
  { key: "destination", label: "Destination", field: "destination" },
  { key: "waypoint", label: "Waypoints", field: "waypoint" },
  { key: "carriers", label: "Carriers", field: "carriers" },
  { key: "actions", label: "Action", field: "", cellAlign: "right" },
];

const handleAction = (row: any, action: string) => {
  emit("action", { row, action });
};

defineExpose({
  refetch,
});
</script>
