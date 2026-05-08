<template>
  <Teleport to="#page-actions" defer>
    <Button v-permission="'SERVICE_REMINDER:create'" @click="router.push('/maintenance/service-reminder/add')">
      <template #leading>
        <div class="size-5" v-html="all_icons.plus"></div>
      </template>
      New Service Reminder
    </Button>
  </Teleport>
  <ServiceReminderTable @action="handleServiceReminderAction" />
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import ServiceReminderTable from "../../components/maintenanceTables/ServiceReminderTable.vue";
import Button from "@/components/Button.vue";
import type { ServiceReminder } from "../../operation.types";
import { icons } from "@/utils/icons";
import { raaz_icons } from "@/utils/raaz_icons";

const router = useRouter();
const all_icons = { ...icons, ...raaz_icons };

const handleServiceReminderAction = ({
  row,
  action,
}: {
  row: ServiceReminder;
  action: string;
}) => {
  if (action === "edit") {
    router.push(`/maintenance/service-reminder/edit/${row._id}`);
  }
};
</script>
