<template>
  <Teleport to="#page-actions" defer>
    <Button v-permission="'SERVICE_TASK:create'" @click="router.push('/maintenance/service-task/add')">
      <template #leading>
        <div class="size-5" v-html="all_icons.plus"></div>
      </template>
      New Service Task
    </Button>
  </Teleport>
  <ServiceTaskTable @action="handleServiceTaskAction" />
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import ServiceTaskTable from "../../components/maintenanceTables/ServiceTaskTable.vue";
import Button from "@/components/Button.vue";
import type { ServiceTask } from "../../operation.types";
import { icons } from "@/utils/icons";
import { raaz_icons } from "@/utils/raaz_icons";

const router = useRouter();
const all_icons = { ...icons, ...raaz_icons };

const handleServiceTaskAction = ({
  row,
  action,
}: {
  row: ServiceTask;
  action: string;
}) => {
  if (action === "edit") {
    router.push(`/maintenance/service-task/edit/${row._id}`);
  }
};
</script>
