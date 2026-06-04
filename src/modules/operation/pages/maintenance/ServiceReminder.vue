<template>
  <Teleport to="#page-actions" defer>
    <div class="hidden sm:flex">
      <Button v-permission="'SERVICE_REMINDER:create'" @click="router.push('/maintenance/service-reminder/add')">
        <template #leading>
          <div class="size-5" v-html="all_icons.plus"></div>
        </template>
        New Service Reminder
      </Button>
    </div>
  </Teleport>
  <button
    v-permission="'SERVICE_REMINDER:create'"
    class="sm:hidden fixed bottom-6 right-6 z-40 size-14 rounded-full bg-primary text-white shadow-xl flex items-center justify-center"
    @click="router.push('/maintenance/service-reminder/add')"
  >
    <i class="*:size-6" v-html="all_icons.plus"></i>
  </button>
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
