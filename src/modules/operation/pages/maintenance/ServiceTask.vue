<template>
  <Teleport to="#page-actions" defer>
    <Button>
      <template #leading>
        <div class="size-5" v-html="all_icons.plus"></div>
      </template>
      New Service Task
    </Button>
  </Teleport>
  <ServiceTaskTable @action="handleServiceTaskAction" />
</template>

<script setup lang="ts">
import ServiceTaskTable from "../../components/maintenanceTables/ServiceTaskTable.vue";
import Button from "@/components/Button.vue";
import type { ServiceTask } from "../../operation.types";
import { icons } from "@/utils/icons";
import { raaz_icons } from "@/utils/raaz_icons";

const all_icons = { ...icons, ...raaz_icons };

const handleServiceTaskAction = ({
  row,
  action,
}: {
  row: ServiceTask;
  action: string;
}) => {
  console.log(`Action: ${action} on ServiceTask: ${row._id}`);
  // TODO: Implement modal views or navigation for service task details
};
</script>
