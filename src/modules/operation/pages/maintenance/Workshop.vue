<template>
  <Teleport to="#page-actions" defer>
    <div class="hidden sm:flex">
      <Button v-permission="'WORKSHOP:create'" @click="router.push('/maintenance/workshop/add')">
        <template #leading>
          <div class="size-5" v-html="all_icons.plus"></div>
        </template>
        New Workshop
      </Button>
    </div>
  </Teleport>
  <button
    v-permission="'WORKSHOP:create'"
    class="sm:hidden fixed bottom-6 right-6 z-40 size-14 rounded-full bg-primary text-white shadow-xl flex items-center justify-center"
    @click="router.push('/maintenance/workshop/add')"
  >
    <i class="*:size-6" v-html="all_icons.plus"></i>
  </button>
  <WorkshopTable @action="handleWorkshopAction" />
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import WorkshopTable from "../../components/maintenanceTables/WorkshopTable.vue";
import Button from "@/components/Button.vue";
import type { Workshop } from "../../operation.types";
import { icons } from "@/utils/icons";
import { raaz_icons } from "@/utils/raaz_icons";

const router = useRouter();
const all_icons = { ...icons, ...raaz_icons };

const handleWorkshopAction = ({
  row,
  action,
}: {
  row: Workshop;
  action: string;
}) => {
  if (action === "edit") {
    router.push(`/maintenance/workshop/edit/${row._id}`);
  }
};
</script>
