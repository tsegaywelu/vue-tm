<template>
  
  <TyreHandoffTable @action="handleTyreHandoffAction" />
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import TyreHandoffTable from "../../components/maintenanceTables/TyreHandoffTable.vue";
import Button from "@/components/Button.vue";
import type { TyreHandoff } from "../../operation.types";
import { icons } from "@/utils/icons";
import { raaz_icons } from "@/utils/raaz_icons";

const router = useRouter();
const all_icons = { ...icons, ...raaz_icons };

const handleTyreHandoffAction = ({
  row,
  action,
}: {
  row: TyreHandoff;
  action: string;
}) => {
  if (action === "view") {
    router.push(`/maintenance/tyre-handoffs/${row._id}`);
  } else {
    console.log(`Action: ${action} on TyreHandoff: ${row._id}`);
  }
};
</script>
