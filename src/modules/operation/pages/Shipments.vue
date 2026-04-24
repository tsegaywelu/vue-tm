<template>
  <Teleport to="#page-actions" defer>
    <Button @click="router.push('/operation/shipments/add')">
      <template #leading>
        <div class="size-5" v-html="all_icons.plus"></div>
      </template>
      New Shipment
    </Button>
  </Teleport>
  <ShipmentTable @action="handleShipmentAction" />
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import ShipmentTable from "../components/ShipmentTable.vue";
import Button from "@/components/Button.vue";
import { type Shipment } from "../operation.types";
import { icons } from "@/utils/icons";
import { raaz_icons } from "@/utils/raaz_icons";
const all_icons = { ...icons, ...raaz_icons };
const router = useRouter();

const handleShipmentAction = ({
  row,
  action,
}: {
  row: Shipment;
  action: string;
}) => {
  console.log(`Action: ${action} on Shipment: ${row.shipmentCode}`);
  // TODO: Implement modal views or navigation for shipment details
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
