<template>
  <Teleport to="#page-actions" defer>
    <Button>
      <template #leading>
        <div class="size-5" v-html="all_icons.plus"></div>
      </template>
      New Inspection
    </Button>
  </Teleport>
  <InspectionTable @action="handleInspectionAction" />
</template>

<script setup lang="ts">
import InspectionTable from "../../components/maintenanceTables/InspectionTable.vue";
import Button from "@/components/Button.vue";
import type { Inspection } from "../../operation.types";
import { icons } from "@/utils/icons";
import { raaz_icons } from "@/utils/raaz_icons";

const all_icons = { ...icons, ...raaz_icons };

const handleInspectionAction = ({
  row,
  action,
}: {
  row: Inspection;
  action: string;
}) => {
  console.log(`Action: ${action} on Inspection: ${row._id}`);
  // TODO: Implement modal views or navigation for inspection details
};
</script>
