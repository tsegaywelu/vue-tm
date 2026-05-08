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

    <template #cell-status="{ row }">
      <div v-if="row.routeRegisteredCarriers">
        <Status variant="active" type="wrapped" >
         
            Registered
         
        </Status>

      </div>
      <div v-else>
        <Status variant="pending" type="wrapped" >
         
            Not Registered
         
        </Status>
      </div>

      <!-- <div class="flex items-center justify-end gap-2">
        <Dropdown>
          <template #default="{ close }">
            <DropDownItem v-permission="'ROUTEREGISTER:update'"
              :icon="icons.edit"
              label="Edit"
              @click.stop="
                handleAction(row, 'edit');
                close();
              "
            />
            <!-- Delete action commented out temporarily -->
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
      </div> -->
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
import Status from "@/components/common/Status.vue";

const emit = defineEmits(["action"]);

const { response, refetch } = usePagination<any>({
  id: "route-request-list",
  url: "/route-request/carrier",
  searchKey: "routeName[regex]",
});

const columns: TableColumn<any>[] = [
  { key: "routeName", label: "Route Name", field: "routeName" },
  { key: "origin", label: "Origin", field: "origin" },
  { key: "destination", label: "Destination", field: "destination" },
  { key: "waypoint", label: "Waypoints", field: "waypoint" },
  { key: "carriers", label: "Carriers", field: "carriers" },
  { key: "status", label: "Status", field: "status" },
];

const handleAction = (row: any, action: string) => {
  emit("action", { row, action });
};

defineExpose({
  refetch,
});
</script>
