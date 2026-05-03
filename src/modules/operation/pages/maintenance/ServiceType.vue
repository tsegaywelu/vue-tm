<template>
  <Teleport to="#page-actions" defer>
    <Button @click="router.push('/maintenance/service-type/add')">
      <template #leading>
        <div class="size-5" v-html="all_icons.plus"></div>
      </template>
      New Service Type
    </Button>
  </Teleport>
  <ServiceTypeTable @action="handleServiceTypeAction" />
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import ServiceTypeTable from "../../components/maintenanceTables/ServiceTypeTable.vue";
import Button from "@/components/Button.vue";
import type { ServiceType } from "../../operation.types";
import { icons } from "@/utils/icons";
import { raaz_icons } from "@/utils/raaz_icons";

const router = useRouter();
const all_icons = { ...icons, ...raaz_icons };

const handleServiceTypeAction = ({
  row,
  action,
}: {
  row: ServiceType;
  action: string;
}) => {
  if (action === "edit") {
    router.push(`/maintenance/service-type/edit/${row._id}`);
  }
};
</script>
