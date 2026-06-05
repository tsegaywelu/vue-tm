<template>
  <div class="flex flex-col gap-3 p-3 sm:gap-6 sm:p-6 min-h-full bg-gray-50">
    <!-- Row 1: Stat cards -->
    <StatCardsRow />

    <!-- Row 2: Driver status | Vehicle status | Destination downtime -->
    <div class="grid grid-cols-1 @[560px]:grid-cols-2 @[900px]:grid-cols-3 gap-4">
      <DriverStatusChart />
      <VehicleStatusChart />
      <DestinationDownTime />
    </div>

    <!-- Row 3: Shipment flow | Route volume | Order requests -->
    <div class="grid grid-cols-1 @[560px]:grid-cols-2 @[900px]:grid-cols-3 gap-4">
      <ShipmentStatusFlow />
      <RouteVolumeTable />
      <OrderRequestsCard />
    </div>

    <!-- Row 4: Expiry tracking -->
    <div class="grid grid-cols-1 @[560px]:grid-cols-2 @[900px]:grid-cols-3 gap-4">
      <VehicleServiceCard />
      <DriverLicenceExpiryCard />
      <BoloExpiryCard />
      <InsuranceExpiryCard />
      <LeaseExpiryCard />
    </div>

    <!-- Row 5: Vehicle alerts -->
    <div class="grid grid-cols-1 @[560px]:grid-cols-2 gap-4">
      <SpeedingAlertsCard />
      <MovementAlertsCard />
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
import VehicleServiceCard from "../components/dashboard/VehicleServiceCard.vue";
import DriverLicenceExpiryCard from "../components/dashboard/DriverLicenceExpiryCard.vue";
import BoloExpiryCard from "../components/dashboard/BoloExpiryCard.vue";
import InsuranceExpiryCard from "../components/dashboard/InsuranceExpiryCard.vue";
import LeaseExpiryCard from "../components/dashboard/LeaseExpiryCard.vue";
import SpeedingAlertsCard from "../components/dashboard/SpeedingAlertsCard.vue";
import MovementAlertsCard from "../components/dashboard/MovementAlertsCard.vue";
import OrderRequestsCard from "../components/dashboard/OrderRequestsCard.vue";
</script>
