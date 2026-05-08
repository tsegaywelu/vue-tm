<template>
  <Teleport to="#page-actions" defer>
    <Button v-permission="'MECHANIC:create'" @click="router.push('/maintenance/mechanic/add')">
      <template #leading>
        <div class="size-5" v-html="all_icons.plus"></div>
      </template>
      New Mechanic
    </Button>
  </Teleport>
  <MechanicTable @action="handleMechanicAction" />
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import MechanicTable from "../../components/maintenanceTables/MechanicTable.vue";
import Button from "@/components/Button.vue";
import type { Mechanic } from "../../operation.types";
import { icons } from "@/utils/icons";
import { raaz_icons } from "@/utils/raaz_icons";

const all_icons = { ...icons, ...raaz_icons };
const router = useRouter();

const handleMechanicAction = ({
  row,
  action,
}: {
  row: Mechanic;
  action: string;
}) => {
  if (action === "edit") {
    router.push(`/maintenance/mechanic/edit/${row._id}`);
  }
};
</script>
