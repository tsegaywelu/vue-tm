<template>
  <Teleport to="#page-actions" defer>
    <Button>
      <template #leading>
        <div class="size-5" v-html="all_icons.plus"></div>
      </template>
      New Work Order
    </Button>
  </Teleport>
  <WorkOrderTable @action="handleWorkOrderAction" />
</template>

<script setup lang="ts">
import WorkOrderTable from "../../components/maintenanceTables/WorkOrderTable.vue";
import Button from "@/components/Button.vue";
import type { WorkOrder } from "../../operation.types";
import { icons } from "@/utils/icons";
import { raaz_icons } from "@/utils/raaz_icons";

const all_icons = { ...icons, ...raaz_icons };

const handleWorkOrderAction = ({
  row,
  action,
}: {
  row: WorkOrder;
  action: string;
}) => {
  console.log(`Action: ${action} on WorkOrder: ${row._id}`);
  // TODO: Implement modal views or navigation for work order details and status changes
};
</script>
