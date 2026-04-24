<template>
  <Teleport to="#page-actions" defer>
    <Button>
      <template #leading>
        <div class="size-5" v-html="all_icons.plus"></div>
      </template>
      New Service Type
    </Button>
  </Teleport>
  <ServiceTypeTable @action="handleServiceTypeAction" />
</template>

<script setup lang="ts">
import ServiceTypeTable from "../../components/maintenanceTables/ServiceTypeTable.vue";
import Button from "@/components/Button.vue";
import type { ServiceType } from "../../operation.types";
import { icons } from "@/utils/icons";
import { raaz_icons } from "@/utils/raaz_icons";

const all_icons = { ...icons, ...raaz_icons };

const handleServiceTypeAction = ({
  row,
  action,
}: {
  row: ServiceType;
  action: string;
}) => {
  console.log(`Action: ${action} on ServiceType: ${row._id}`);
  // TODO: Implement modal views or navigation for service type details
};
</script>
