<template>
  <!-- Export: icon button always next to page title -->
  <Teleport to="#page-title-actions" defer>
    <button
      class="sm:hidden size-10 rounded-lg bg-grey-75 border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
      @click="handleExport"
    >
      <i class="*:size-6" v-html="all_icons.excell"></i>
      <i class="*:size-3" v-html="all_icons.longArrow"></i>
    </button>
  </Teleport>

  <Teleport to="#page-actions" defer>
    <div class="hidden sm:flex items-center gap-2">
      <Button variant="secondary" size="md" @click="handleExport">
        <template #leading>
          <div class="size-5" v-html="all_icons.excell"></div>
        </template>
        Export to Excel
      </Button>
      <Button
        v-permission="'ROUTE:create'"
        @click="navigateToAddRoute"
      >
        <template #leading>
          <div class="size-5" v-html="all_icons.plus"></div>
        </template>
        Add Route
      </Button>
    </div>
  </Teleport>

  <!-- Mobile FAB -->
  <button
    v-permission="'ROUTE:create'"
    @click="navigateToAddRoute"
    class="sm:hidden fixed bottom-6 right-6 z-40 size-14 rounded-full bg-primary text-white shadow-xl flex items-center justify-center"
  >
    <div class="size-6" v-html="all_icons.plus"></div>
  </button>

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
