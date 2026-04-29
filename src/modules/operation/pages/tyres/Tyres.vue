<template>
  <Teleport to="#page-actions" defer>
    <!-- <Button>
      <template #leading>
        <div class="size-5" v-html="all_icons.plus"></div>
      </template>
      New Tyre
    </Button> -->
  </Teleport>
  <VehicleTyreDetailTable :vehicle-id="vehicleId" @action="handleTyreAction" />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import VehicleTyreDetailTable from "../../components/VehicleTyreDetailTable.vue";
import Button from "@/components/Button.vue";
import type { Tyre } from "../../operation.types";
import { icons } from "@/utils/icons";
import { raaz_icons } from "@/utils/raaz_icons";

const all_icons = { ...icons, ...raaz_icons };
const route = useRoute();

// The vehicle id passed through the URL params: /operation/vehicle-tyres/:id
const vehicleId = computed(() => route.params.id as string | undefined);

const handleTyreAction = ({
  row,
  action,
}: {
  row: Tyre;
  action: string;
}) => {
  console.log(`Action: ${action} on Tyre: ${row.serialNumber}`);
  // TODO: Implement modal views for actions: decommission, inspect, repair, replace, rethread, rotate, reassign
};
</script>
