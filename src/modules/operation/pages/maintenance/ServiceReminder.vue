<template>
  <Teleport to="#page-actions" defer>
    <Button>
      <template #leading>
        <div class="size-5" v-html="all_icons.plus"></div>
      </template>
      New Service Reminder
    </Button>
  </Teleport>
  <ServiceReminderTable @action="handleServiceReminderAction" />
</template>

<script setup lang="ts">
import ServiceReminderTable from "../../components/maintenanceTables/ServiceReminderTable.vue";
import Button from "@/components/Button.vue";
import type { ServiceReminder } from "../../operation.types";
import { icons } from "@/utils/icons";
import { raaz_icons } from "@/utils/raaz_icons";

const all_icons = { ...icons, ...raaz_icons };

const handleServiceReminderAction = ({
  row,
  action,
}: {
  row: ServiceReminder;
  action: string;
}) => {
  console.log(`Action: ${action} on ServiceReminder: ${row._id}`);
  // TODO: Implement modal views or navigation for service reminder details
};
</script>
