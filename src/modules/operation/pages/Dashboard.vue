<template>
  <div class="flex flex-col gap-6 p-6 min-h-full bg-gray-50">
    <!-- Row 1: Stat cards -->
    <StatCardsRow />

    <!-- Row 2: Driver status | Vehicle status | Destination downtime -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <DriverStatusChart />
      <VehicleStatusChart />
      <DestinationDownTime />
    </div>

    <!-- Row 3: Shipment flow | Route volume -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <ShipmentStatusFlow />
      <RouteVolumeTable />
    </div>
  </div>
</template>

<script setup lang="ts">
import StatCardsRow from "../components/dashboard/StatCardsRow.vue";
import DriverStatusChart from "../components/dashboard/DriverStatusChart.vue";
import VehicleStatusChart from "../components/dashboard/VehicleStatusChart.vue";
import DestinationDownTime from "../components/dashboard/DestinationDownTime.vue";
import ShipmentStatusFlow from "../components/dashboard/ShipmentStatusFlow.vue";
import RouteVolumeTable from "../components/dashboard/RouteVolumeTable.vue";
</script>
