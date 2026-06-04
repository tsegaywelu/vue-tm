<template>
  <Teleport to="#page-actions" defer>
    <div class="hidden sm:flex">
      <Button v-permission="'SERVICE_TASK:create'" @click="router.push('/maintenance/service-task/add')">
        <template #leading>
          <div class="size-5" v-html="all_icons.plus"></div>
        </template>
        New Service Task
      </Button>
    </div>
  </Teleport>
  <button
    v-permission="'SERVICE_TASK:create'"
    class="sm:hidden fixed bottom-6 right-6 z-40 size-14 rounded-full bg-primary text-white shadow-xl flex items-center justify-center"
    @click="router.push('/maintenance/service-task/add')"
  >
    <i class="*:size-6" v-html="all_icons.plus"></i>
  </button>
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
