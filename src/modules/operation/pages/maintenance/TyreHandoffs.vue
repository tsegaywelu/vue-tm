<template>
  <Teleport to="#page-actions" defer>
    <Button>
      <template #leading>
        <div class="size-5" v-html="all_icons.plus"></div>
      </template>
      New Tyre Handoff
    </Button>
  </Teleport>
  <TyreHandoffTable @action="handleTyreHandoffAction" />
</template>

<script setup lang="ts">
import TyreHandoffTable from "../../components/maintenanceTables/TyreHandoffTable.vue";
import Button from "@/components/Button.vue";
import type { TyreHandoff } from "../../operation.types";
import { icons } from "@/utils/icons";
import { raaz_icons } from "@/utils/raaz_icons";

const all_icons = { ...icons, ...raaz_icons };

const handleTyreHandoffAction = ({
  row,
  action,
}: {
  row: TyreHandoff;
  action: string;
}) => {
  console.log(`Action: ${action} on TyreHandoff: ${row._id}`);
  // TODO: Implement modal views or navigation for tyre handoff details and assignments
};
</script>
