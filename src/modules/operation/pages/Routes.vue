<template>
  <Teleport to="#page-actions" defer>
    <Button @click="navigateToAddRoute">
      <template #leading>
        <div class="size-5" v-html="all_icons.plus"></div>
      </template>
      Add Route
    </Button>
  </Teleport>
  <RouteTable />
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import RouteTable from "../components/RouteTable.vue";
import Button from "@/components/Button.vue";
import { icons } from "@/utils/icons";
import { raaz_icons } from "@/utils/raaz_icons";
const all_icons = { ...icons, ...raaz_icons };

const router = useRouter();

const navigateToAddRoute = () => {
  router.push("/routes/addRoute");
};
</script>
