<template>
  <Teleport to="#page-actions" defer>
    <div class="hidden sm:flex">
      <Button v-permission="'INSPECTION:create'" @click="router.push('/maintenance/inspection/add')">
        <template #leading>
          <div class="size-5" v-html="all_icons.plus"></div>
        </template>
        New Inspection
      </Button>
    </div>
  </Teleport>
  <button
    v-permission="'INSPECTION:create'"
    class="sm:hidden fixed bottom-6 right-6 z-40 size-14 rounded-full bg-primary text-white shadow-xl flex items-center justify-center"
    @click="router.push('/maintenance/inspection/add')"
  >
    <i class="*:size-6" v-html="all_icons.plus"></i>
  </button>
  <InspectionTable @action="handleInspectionAction" />
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import InspectionTable from "../../components/maintenanceTables/InspectionTable.vue";
import Button from "@/components/Button.vue";
import type { Inspection } from "../../operation.types";
import { icons } from "@/utils/icons";
import { raaz_icons } from "@/utils/raaz_icons";

const all_icons = { ...icons, ...raaz_icons };
const router = useRouter();

const handleInspectionAction = ({
  row,
  action,
}: {
  row: Inspection;
  action: string;
}) => {
  if (action === "edit") {
    router.push(`/maintenance/inspection/edit/${row._id}`);
  }
};
</script>
