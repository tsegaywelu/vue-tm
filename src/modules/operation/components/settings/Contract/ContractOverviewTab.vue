<template>
  <div class="flex flex-col gap-6">
    <!-- Info Cards -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Carrier Info -->
      <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <div class="flex items-center gap-3 mb-6">
          <div class="size-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <i class="mdi mdi-truck-outline text-xl"></i>
          </div>
          <h2 class="text-lg font-bold text-gray-900">Carrier Information</h2>
        </div>
        <div class="flex flex-col gap-4">
          <DataLabel label="Name" :value="contract?.carrier?.name" />
          <DataLabel label="Email" :value="contract?.carrier?.email" />
          <DataLabel label="Phone" :value="contract?.carrier?.phone" />
          <DataLabel label="Address" :value="contract?.carrier?.address" />
        </div>
      </div>

      <!-- Shipper Info -->
      <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <div class="flex items-center gap-3 mb-6">
          <div class="size-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600">
            <i class="mdi mdi-domain text-xl"></i>
          </div>
          <h2 class="text-lg font-bold text-gray-900">Shipper Information</h2>
        </div>
        <div class="flex flex-col gap-4">
          <DataLabel label="Name" :value="contract?.shipper?.name" />
          <DataLabel label="Email" :value="contract?.shipper?.email" />
          <DataLabel label="Phone" :value="contract?.shipper?.phone" />
          <DataLabel label="Address" :value="contract?.shipper?.address" />
        </div>
      </div>
    </div>

    <!-- Routes Section -->
    <div class="flex flex-col gap-4">
      <div class="flex items-center justify-between px-1">
        <h2 class="text-xl font-bold text-gray-900">Contract Routes</h2>
        <span class="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">
          {{ contract?.routes?.length || 0 }} Routes
        </span>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div
          v-for="(routeObj, index) in contract?.routes"
          :key="index"
          class="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 flex flex-col gap-6"
        >
          <!-- Route Header -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="size-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-600">
                <i class="mdi mdi-map-marker-path text-xl"></i>
              </div>
              <div>
                <h3 class="font-bold text-gray-900 leading-tight">{{ routeObj.route?.routeName || 'Unnamed Route' }}</h3>
                <p class="text-xs text-gray-500">{{ routeObj.route?.origin }} → {{ routeObj.route?.destination }}</p>
              </div>
            </div>
          </div>

          <!-- Route Metadata -->
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-gray-50 p-4 rounded-2xl flex flex-col gap-1">
              <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Commodities</span>
              <div class="flex flex-wrap gap-1 mt-1">
                <span v-for="c in routeObj.commodities" :key="c._id" class="px-2 py-0.5 bg-white border border-gray-200 rounded-lg text-[10px] font-medium text-gray-700">
                  {{ c.name }}
                </span>
                <span v-if="!routeObj.commodities?.length" class="text-xs text-gray-400 italic">None</span>
              </div>
            </div>
            <div class="bg-gray-50 p-4 rounded-2xl flex flex-col gap-1">
              <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Packagings</span>
              <div class="flex flex-wrap gap-1 mt-1">
                <span v-for="p in routeObj.packagings" :key="p._id" class="px-2 py-0.5 bg-white border border-gray-200 rounded-lg text-[10px] font-medium text-gray-700">
                  {{ p.name }}
                </span>
                <span v-if="!routeObj.packagings?.length" class="text-xs text-gray-400 italic">None</span>
              </div>
            </div>
          </div>

          <!-- Waypoints / Pricing -->
          <div class="flex flex-col gap-3">
            <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">Waypoints & Pricing</h4>
            <div class="flex flex-col gap-3">
              <div
                v-for="waypoint in routeObj.waypoints"
                :key="waypoint.waypoint?._id"
                class="border border-gray-100 rounded-2xl p-4 bg-gray-50/30"
              >
                <div class="flex items-center justify-between mb-3">
                  <span class="text-sm font-bold text-gray-900">📍 {{ waypoint.waypoint?.name }}</span>
                  <span class="text-xs text-gray-500 font-medium">{{ waypoint.waypoint?.distance }} km</span>
                </div>
                
                <div class="flex flex-col gap-2">
                  <div
                    v-for="(pricing, pIdx) in waypoint.vehiclePricing"
                    :key="pIdx"
                    class="bg-white p-3 rounded-xl border border-gray-100 flex justify-between items-center"
                  >
                    <div class="flex flex-col">
                      <span class="text-[11px] font-bold text-gray-900">{{ pricing.vehicleType?.name }}</span>
                      <span class="text-[10px] text-gray-500">{{ pricing.productType?.replace(/_/g, " ") }}</span>
                    </div>
                    <div class="text-right">
                      <span class="text-sm font-black text-primary">{{ pricing.pricePerUnit }}</span>
                      <span class="text-[10px] text-gray-400 ml-1">/ {{ pricing.type?.replace(/_/g, " ") }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DataLabel from "../../shipment-details/ShipmentDataLabel.vue";

defineProps<{
  contract?: any;
}>();
</script>
