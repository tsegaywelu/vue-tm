<template>
  <Teleport to="#page-actions" defer>
    <Button v-permission="'SERVICE_RECORD:create'" @click="router.push('/maintenance/service-record/add')">
      <template #leading>
        <div class="size-5" v-html="all_icons.plus"></div>
      </template>
      New Service Record
    </Button>
  </Teleport>
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
