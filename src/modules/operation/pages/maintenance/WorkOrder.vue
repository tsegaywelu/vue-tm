<template>
  <Teleport to="#page-actions" defer>
    <Button v-permission="'WORK_ORDER:create'" @click="router.push('/maintenance/work-order/add')">
      <template #leading>
        <div class="size-5" v-html="all_icons.plus"></div>
      </template>
      New Work Order
    </Button>
  </Teleport>
  <WorkOrderTable @action="handleWorkOrderAction" />
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import WorkOrderTable from "../../components/maintenanceTables/WorkOrderTable.vue";
import Button from "@/components/Button.vue";
import type { WorkOrder } from "../../operation.types";
import { icons } from "@/utils/icons";
import { raaz_icons } from "@/utils/raaz_icons";
import { useToastStore } from "@/store/toastStore";

const router = useRouter();
const toast = useToastStore();
const all_icons = { ...icons, ...raaz_icons };

const handleWorkOrderAction = ({
  row,
  action,
}: {
  row: WorkOrder;
  action: string;
}) => {
  if (action === "edit") {
    router.push(`/maintenance/work-order/edit/${row._id}`);
  } else if (action === "view") {
    router.push(`/maintenance/work-order/${row._id}`);
  } else if (action === "add") {
    router.push("/maintenance/work-order/add");
  } else if (["approve", "cancel", "complete"].includes(action)) {
    toast.info(`${action.charAt(0).toUpperCase() + action.slice(1)} action for Work Order ${row._id} is not yet implemented.`);
  }
};
</script>
