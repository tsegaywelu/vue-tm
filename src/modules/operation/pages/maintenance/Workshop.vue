<template>
  <Teleport to="#page-actions" defer>
    <Button>
      <template #leading>
        <div class="size-5" v-html="all_icons.plus"></div>
      </template>
      New Workshop
    </Button>
  </Teleport>
  <WorkshopTable @action="handleWorkshopAction" />
</template>

<script setup lang="ts">
import WorkshopTable from "../../components/maintenanceTables/WorkshopTable.vue";
import Button from "@/components/Button.vue";
import type { Workshop } from "../../operation.types";
import { icons } from "@/utils/icons";
import { raaz_icons } from "@/utils/raaz_icons";

const all_icons = { ...icons, ...raaz_icons };

const handleWorkshopAction = ({
  row,
  action,
}: {
  row: Workshop;
  action: string;
}) => {
  console.log(`Action: ${action} on Workshop: ${row._id}`);
  // TODO: Implement modal views or navigation for workshop details
};
</script>
