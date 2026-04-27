<template>
  <Teleport to="#page-actions" defer>
    <Button>
      <template #leading>
        <div class="size-5" v-html="all_icons.plus"></div>
      </template>
      New Service Record
    </Button>
  </Teleport>
  <ServiceRecordTable @action="handleServiceRecordAction" />
</template>

<script setup lang="ts">
import ServiceRecordTable from "../../components/maintenanceTables/ServiceRecordTable.vue";
import Button from "@/components/Button.vue";
import type { ServiceRecord } from "../../operation.types";
import { icons } from "@/utils/icons";
import { raaz_icons } from "@/utils/raaz_icons";

const all_icons = { ...icons, ...raaz_icons };

const handleServiceRecordAction = ({
  row,
  action,
}: {
  row: ServiceRecord;
  action: string;
}) => {
  console.log(`Action: ${action} on ServiceRecord: ${row._id}`);
  // TODO: Implement modal views or navigation for service record details
};
</script>
