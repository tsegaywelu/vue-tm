<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Vehicle Information -->
    <InfoWrapper title="Vehicle Information">
      <div class="space-y-4">
        <DetailItem label="Side Number" :value="vehicle.sideNumber" />
        <DetailItem label="Plate Number" :value="vehicle.plateNumber" />
        <DetailItem label="Chassis Number" :value="vehicle.chassisNumber" />
        <DetailItem label="Engine Number" :value="vehicle.engineNumber" />
        <DetailItem label="Ownership" :value="vehicle.ownership" />
        <DetailItem label="Purchase Date" :value="formatDate(vehicle.purchaseDate)" />
        <DetailItem label="Bolo Issue Date" :value="formatDate(vehicle.boloIssueDate)" />
        <DetailItem label="Bolo Expiration Date" :value="formatDate(vehicle.boloExpirationDate)" />
      </div>
    </InfoWrapper>

    <!-- Trailer & Transporter Information -->
    <div class="flex flex-col gap-6">
      <InfoWrapper title="Trailer Information">
        <div class="space-y-4">
          <DetailItem label="Trailer Plate" :value="vehicle.trailerPlate" />
          <DetailItem label="Trailer Chassis" :value="vehicle.trailerChassisNumber" />
          <DetailItem label="Trailer Purchase Date" :value="formatDate(vehicle.trailerPurchaseDate)" />
        </div>
      </InfoWrapper>

      <InfoWrapper v-if="vehicle.transporter" title="Transporter">
        <DetailItem label="Transporter Name" :value="vehicle.transporter.name" />
      </InfoWrapper>
    </div>

    <!-- Technical & More Info -->
    <InfoWrapper title="Technical Information">
      <div class="space-y-4">
        <DetailItem label="Mileage" :value="vehicle.mileage" />
        <DetailItem label="Mileage Since Service" :value="vehicle.mileageSinceService" />
        <DetailItem label="Fuel Rate Loaded" :value="vehicle.fuelRateLoaded" />
        <DetailItem label="Fuel Rate Unloaded" :value="vehicle.fuelRateUnloaded" />
        <DetailItem label="Average Fuel Usage" :value="vehicle.averageFuelUsage" />
        <DetailItem label="Last Service Date" :value="formatDate(vehicle.lastServiceDate)" />
      </div>
    </InfoWrapper>

    <InfoWrapper title="More Information">
      <div class="space-y-4">
        <DetailItem label="Driver" :value="getDriverName(vehicle.driver)" />
        <DetailItem label="Vehicle Group" :value="vehicle.vehicleGroup?.name" />
        <DetailItem label="Vehicle Model" :value="vehicle.vehicleModel?.name" />
        <DetailItem label="Vehicle Type" :value="vehicle.vehicleType?.name" />
        <DetailItem label="Maker" :value="vehicle.maker?.name" />
        <DetailItem label="Region" :value="vehicle.region?.name" />
      </div>
    </InfoWrapper>
  </div>
</template>

<script setup lang="ts">
import type { Vehicle } from "../../operation.types";
import DetailItem from "./DetailItem.vue";
import InfoWrapper from "../shipment-details/InfoWrapper.vue";

defineProps<{
  vehicle: Vehicle;
}>();

const formatDate = (date?: string) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString();
};

const getDriverName = (driver?: any) => {
  if (!driver) return "N/A";
  return `${driver.firstName} ${driver.middleName || ""} ${driver.lastName || ""}`.trim();
};
</script>
