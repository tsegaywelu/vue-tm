<template>
  <div class="flex flex-col gap-4">
    <div
      class="rounded-2xl px-3 md:px-5 py-6 bg-white flex flex-col gap-8 shadow-sm border border-gray-100"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Event Information -->
        <InfoWrapper title="Event Information">
          <div class="flex flex-col gap-4">
            <DataLabel label="Serial Number" :value="handoff?.serialNumber" />
            <DataLabel label="Event Type" :value="formatStatus(handoff?.eventType)" />
            <DataLabel label="Status" :value="handoff?.status" />
            <DataLabel label="Assigned To" :value="handoff?.assignedTo?.username || 'Unassigned'" />
            <DataLabel v-if="handoff?.failureReason" label="Failure Reason" :value="handoff.failureReason" />
            <DataLabel v-if="handoff?.cancellationReason" label="Cancellation Reason" :value="handoff.cancellationReason" />
          </div>
        </InfoWrapper>

        <!-- Vehicle Association -->
        <InfoWrapper title="Vehicle Association">
          <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-500 font-medium">From Vehicle</span>
              <span class="font-bold text-gray-900 cursor-pointer hover:underline" @click="handoff?.fromVehicle?._id && $router.push(`/vehicles/${handoff.fromVehicle._id}`)">
                {{ handoff?.fromVehicle?.plateNumber || '-' }}
              </span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-gray-500 font-medium">To Vehicle</span>
              <span class="font-bold text-gray-900 cursor-pointer hover:underline" @click="handoff?.toVehicle?._id && $router.push(`/vehicles/${handoff.toVehicle._id}`)">
                {{ handoff?.toVehicle?.plateNumber || '-' }}
              </span>
            </div>
            <DataLabel label="Position" :value="handoff?.technicalPayload?.position || '-'" />
          </div>
        </InfoWrapper>

        <!-- Technical Details -->
        <InfoWrapper title="Technical Details">
          <div class="flex flex-col gap-4">
            <DataLabel label="Mileage" :value="handoff?.technicalPayload?.mileage ? handoff.technicalPayload.mileage.toLocaleString() + ' km' : '-'" />
            <DataLabel label="Reason" :value="handoff?.reason || '-'" />
            <DataLabel label="Created At" :value="handoff?.createdAt ? dateTimeFormatter(handoff.createdAt) : '-'" />
            <DataLabel label="Updated At" :value="handoff?.updatedAt ? dateTimeFormatter(handoff.updatedAt) : '-'" />
          </div>
        </InfoWrapper>

        <!-- Tyre Details (if available) -->
        <InfoWrapper v-if="handoff?.tyre" class="md:col-span-2 lg:col-span-3" title="Tyre Details">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            <DataLabel label="Tyre Serial" :value="handoff.tyre.serialNumber" />
            <DataLabel label="Brand" :value="handoff.tyre.brand" />
            <DataLabel label="Size" :value="handoff.tyre.size" />
            <DataLabel label="Current Status" :value="handoff.tyre.status" />
          </div>
        </InfoWrapper>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TyreHandoff } from "../../operation.types";
import InfoWrapper from "../shipment-details/InfoWrapper.vue";
import DataLabel from "../shipment-details/ShipmentDataLabel.vue";
import {
  dateTimeFormatter,
  formatStatus,
} from "@/utils/utils";

defineProps<{
  handoff?: TyreHandoff;
}>();
</script>
