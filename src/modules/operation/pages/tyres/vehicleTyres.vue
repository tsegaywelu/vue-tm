<template>
  <Teleport to="#page-actions" defer>
    <Button>
      <template #leading>
        <div class="size-5" v-html="all_icons.plus"></div>
      </template>
      New Tyre
    </Button>
  </Teleport>
  <TyreTable @action="handleTyreAction" />
</template>

<script setup lang="ts">
import TyreTable from "../../components/TyreTable.vue";
import Button from "@/components/Button.vue";
import { useRouter } from "vue-router";
import { type Tyre } from "../../operation.types";
import { icons } from "@/utils/icons";
import { raaz_icons } from "@/utils/raaz_icons";
const all_icons = { ...icons, ...raaz_icons };

const router = useRouter();

const handleTyreAction = ({
  row,
  action,
}: {
  row: Tyre;
  action: string;
}) => {
  if (action === "view" && row.vehicle?._id) {
    router.push(`/vehicle-tyres/${row.vehicle._id}`);
  }
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
