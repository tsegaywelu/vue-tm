<template>
  <div class="flex flex-col gap-4">
    <div
      class="rounded-2xl px-0 md:px-3 md:py-4 bg-surface flex flex-col gap-6 shadow-sm border border-gray-100"
    >
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 lg:gap-12">
        <InfoWrapper title="Order Information">
          <div
            class="flex flex-col justify-between lg:grid lg:grid-cols-2 gap-6 lg:gap-2.5"
          >
            <div class="flex items-center gap-2">
              <i
                v-html="icons.shippingRoute"
                class="shrink-0 *:h-[108px] *:w-[22px]"
              />
              <div class="h-[108px] flex flex-col justify-between">
                <div class="flex flex-col">
                  <span class="text-base lg:text-lg font-semibold">
                    {{ order?.route?.origin || "Unknown" }}
                  </span>
                  <span class="text-xs lg:text-sm text-grey-500">
                    {{ order?.createdAt ? dateFormatter(order?.createdAt) : "" }}
                  </span>
                </div>
                <span class="font-semibold text-base lg:text-lg">
                  {{ order?.route?.destination || "Unknown" }}
                </span>
              </div>
            </div>
          </div>
          <div class="grid border-t py-4 mt-4 border-line grid-cols-1 sm:grid-cols-2 px-2 gap-4">
            <DataLabel
              label="Trip Type"
              :value="formatStatus(order?.tripType)"
            />
            <DataLabel
              label="Product Type"
              :value="formatStatus(order?.productType)"
            />
            <DataLabel
              label="Vehicle Type"
              :value="order?.vehicleType?.name"
            />
            <DataLabel
              label="Priority"
              :value="formatStatus(order?.priority)"
            />
          </div>
        </InfoWrapper>

        <InfoWrapper title="Cargo Details">
          <div class="flex flex-col gap-4">
            <DataLabel
              label="Commodity"
              :value="order?.commodity?.map((c) => c.name).join(', ') || '-'"
            />
            <DataLabel
              label="Packaging"
              :value="order?.packaging?.name || '-'"
            />
            <DataLabel
              label="Total Request"
              :value="numberFormatter(order?.totalRequest || 0) + ' ' + (order?.unitOfMeasurement || '')"
            />
            <DataLabel
              label="Number of Vehicles"
              :value="numberFormatter(order?.numberOfVehicles || 0)"
            />
          </div>
        </InfoWrapper>

        <InfoWrapper title="Shipper & Agent">
          <div class="flex flex-col gap-4">
            <DataLabel
              label="Shipper Name"
              :value="order?.shipper?.name"
            />
            <DataLabel
              label="Shipper Code"
              :value="order?.shipper?.shipperCode"
            />
            <DataLabel
              label="Agent"
              :value="order?.agent?.name || '-'"
            />
             <DataLabel
              label="Carrier"
              :value="order?.carrier?.name || '-'"
            />
          </div>
        </InfoWrapper>
      </div>

      <!-- Waypoints if available -->
      <InfoWrapper v-if="order?.waypoints?.length" title="Order Waypoints">
        <div class="flex flex-wrap gap-4 px-2 py-2">
           <div v-for="wp in order.waypoints" :key="wp._id" class="p-3 bg-gray-50 rounded-xl border border-gray-100 min-w-[150px]">
              <span class="text-xs text-gray-500 font-bold uppercase block mb-1">Waypoint</span>
              <span class="text-sm font-bold text-gray-900">{{ wp._id }}</span>
           </div>
        </div>
      </InfoWrapper>

      <InfoWrapper v-if="order?.remark" title="Remarks">
        <div class="p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm text-gray-700 italic">
          "{{ order.remark }}"
        </div>
      </InfoWrapper>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Order } from "../../operation.types";
import InfoWrapper from "../shipment-details/InfoWrapper.vue";
import DataLabel from "../shipment-details/ShipmentDataLabel.vue"; // Reusing for now
import { icons } from "@/utils/icons";
import {
  numberFormatter,
  dateFormatter,
  formatStatus,
} from "@/utils/utils";

const props = defineProps<{
  order?: Order;
}>();
</script>
