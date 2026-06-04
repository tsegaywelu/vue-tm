<template>
  <Teleport defer to="#page-actions">
    <div class="hidden sm:flex">
      <Button @click="router.push('/vehicle-tyres/add')">
        <template #leading>
          <div class="size-5" v-html="all_icons.plus"></div>
        </template>
        New Tyre
      </Button>
    </div>
  </Teleport>

  <!-- Mobile FAB -->
  <button
    class="sm:hidden fixed bottom-6 right-6 z-40 size-14 rounded-full bg-primary text-white shadow-xl flex items-center justify-center"
    @click="router.push('/vehicle-tyres/add')"
  >
    <i class="*:size-6" v-html="icons.plus"></i>
  </button>

  <TyreTable @action="handleTyreAction" />
</template>

<script setup lang="ts">
import TyreTable from "../../components/tyre-details/TyreTable.vue";
import Button from "@/components/Button.vue";
import { useRouter } from "vue-router";
import { type Tyre } from "../../operation.types";
import { icons } from "@/utils/icons";
import { raaz_icons } from "@/utils/raaz_icons";

const all_icons = { ...icons, ...raaz_icons };
const router = useRouter();

const handleTyreAction = ({ row, action }: { row: Tyre; action: string }) => {
  if (action === "view" && row.vehicle?._id) {
    router.push(`/vehicle-tyres/${row.vehicle._id}`);
  }
};
</script>
