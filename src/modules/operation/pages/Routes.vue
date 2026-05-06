<template>
  <Teleport to="#page-actions" defer>
    <div class="flex items-center gap-2">
      <Button variant="secondary" @click="handleExport">
        <template #leading>
          <i class="mdi mdi-file-excel-outline text-lg text-green-600"></i>
        </template>
        Export to Excel
      </Button>
      <Button @click="navigateToAddRoute">
        <template #leading>
          <div class="size-5" v-html="all_icons.plus"></div>
        </template>
        Add Route
      </Button>
    </div>
  </Teleport>
  <RouteTable ref="routeTableRef" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import RouteTable from "../components/RouteTable.vue";
import Button from "@/components/Button.vue";
import { icons } from "@/utils/icons";
import { raaz_icons } from "@/utils/raaz_icons";
import { exportRoutesToExcel } from "../utils/routeExport";

const all_icons = { ...icons, ...raaz_icons };
const router = useRouter();
const routeTableRef = ref<InstanceType<typeof RouteTable> | null>(null);

const navigateToAddRoute = () => {
  router.push("/operation/routes/add");
};

const handleExport = () => {
  const routes = routeTableRef.value?.response || [];
  exportRoutesToExcel(routes);
};
</script>
