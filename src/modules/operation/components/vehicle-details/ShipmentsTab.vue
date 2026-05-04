<template>
  <div class="flex flex-col gap-6">
    <div class="bg-grey-25 rounded-3xl p-6 border border-grey-100">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-bold text-grey-900">Shipments Completed</h3>
      </div>

      <ShipmentTable
        :filters="{ vehiclePlateNumber: vehicle.plateNumber }"
        title="Shipment History"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Vehicle } from "../../operation.types";
import ShipmentTable from "../ShipmentTable.vue";

defineProps<{
  vehicle: Vehicle;
}>();
</script>
