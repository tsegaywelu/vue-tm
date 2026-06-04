<template>
  <Teleport to="#page-actions" defer>
    <div class="hidden sm:flex">
      <Button v-permission="'SERVICE_RECORD:create'" @click="router.push('/maintenance/service-record/add')">
        <template #leading>
          <div class="size-5" v-html="all_icons.plus"></div>
        </template>
        New Service Record
      </Button>
    </div>
  </Teleport>
  <button
    v-permission="'SERVICE_RECORD:create'"
    class="sm:hidden fixed bottom-6 right-6 z-40 size-14 rounded-full bg-primary text-white shadow-xl flex items-center justify-center"
    @click="router.push('/maintenance/service-record/add')"
  >
    <i class="*:size-6" v-html="all_icons.plus"></i>
  </button>
  <ServiceRecordTable @action="handleServiceRecordAction" />
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import ServiceRecordTable from "../../components/maintenanceTables/ServiceRecordTable.vue";
import Button from "@/components/Button.vue";
import type { ServiceRecord } from "../../operation.types";
import { icons } from "@/utils/icons";
import { raaz_icons } from "@/utils/raaz_icons";

const all_icons = { ...icons, ...raaz_icons };
const router = useRouter();

const handleServiceRecordAction = ({
  row,
  action,
}: {
  row: ServiceRecord;
  action: string;
}) => {
  if (action === "edit") {
    router.push(`/maintenance/service-record/edit/${row._id}`);
  }
};
</script>
