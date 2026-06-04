<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6">
    <!-- Main Details -->
    <div class="lg:col-span-2 flex flex-col gap-6">
      <div class="bg-surface p-6 rounded-[20px] border border-gray-100 shadow-sm flex flex-col gap-6">
        <h3 class="text-lg font-bold text-gray-900 border-b border-gray-50 pb-2">Report Details</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
          <div class="flex flex-col gap-1">
            <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Severity</span>
            <span 
              :class="[
                'text-sm font-bold w-fit px-2 py-0.5 rounded',
                issueReport.severity === 'CRITICAL' ? 'bg-red-600 text-white' : 
                issueReport.severity === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                issueReport.severity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              ]"
            >
              {{ issueReport.severity }}
            </span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Issue Type</span>
            <span class="text-sm font-bold text-gray-900">{{ issueReport.type || '-' }}</span>
          </div>
          <div class="flex flex-col gap-1 md:col-span-2">
            <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Location</span>
            <div class="flex items-center gap-2">
              <span class="text-sm font-bold text-gray-900">{{ issueReport.location || 'Not specified' }}</span>
              <a
                v-if="issueReport.lat && issueReport.long"
                :href="`https://www.google.com/maps?q=${issueReport.lat},${issueReport.long}`"
                target="_blank"
                class="text-primary hover:underline text-sm flex items-center gap-1 font-semibold"
              >
                <i class="mdi mdi-map-marker text-lg"></i>
                View on Map
              </a>
            </div>
            <p v-if="issueReport.lat" class="text-xs text-gray-500">
              Coordinates: {{ issueReport.lat }}, {{ issueReport.long }}
            </p>
          </div>
          <div class="flex flex-col gap-1 md:col-span-2">
            <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Description</span>
            <p class="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100 min-h-[100px]">
              {{ issueReport.description || 'No description provided' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Attached Picture -->
      <div v-if="issueReport.picture" class="bg-surface p-6 rounded-[20px] border border-gray-100 shadow-sm flex flex-col gap-4">
        <h3 class="text-lg font-bold text-gray-900 border-b border-gray-50 pb-2">Evidence / Picture</h3>
        <div class="relative group w-full max-w-2xl overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
          <img 
            :src="getImageUrl(issueReport.picture)" 
            alt="Issue Evidence" 
            class="w-full h-auto object-contain max-h-[600px]"
          />
        </div>
      </div>
    </div>

    <!-- Sidebar / Secondary Info -->
    <div class="flex flex-col gap-6">
      <div class="bg-surface p-6 rounded-[20px] border border-gray-100 shadow-sm flex flex-col gap-6 text-sm">
        <h3 class="text-lg font-bold text-gray-900 border-b border-gray-50 pb-2 text-base">Involved Parties</h3>
        
        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-1">
            <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Driver</span>
            <div v-if="issueReport.driver" class="flex flex-col">
              <span class="font-bold text-gray-900">{{ issueReport.driver.firstName }} {{ issueReport.driver.lastName }}</span>
              <span class="text-gray-500">{{ issueReport.driver.email }}</span>
              <span v-if="issueReport.driver.phone" class="text-gray-500">{{ issueReport.driver.phone }}</span>
            </div>
            <span v-else class="text-gray-400">N/A</span>
          </div>

          <div class="flex flex-col gap-1">
            <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Carrier</span>
            <div v-if="issueReport.carrier" class="flex flex-col">
              <span class="font-bold text-gray-900">{{ issueReport.carrier.name }}</span>
              <span class="text-gray-500">{{ issueReport.carrier.email }}</span>
            </div>
            <span v-else class="text-gray-400">N/A</span>
          </div>

          <div class="flex flex-col gap-1 border-t border-gray-50 pt-4 mt-2">
            <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Related Shipment</span>
            <div v-if="issueReport.shipment">
              <router-link
                :to="`/shipments/${issueReport.shipment._id}`"
                class="font-bold text-primary hover:underline"
              >
                {{ issueReport.shipment.shipmentNumber || issueReport.shipment._id }}
              </router-link>
            </div>
            <span v-else class="text-gray-400">Not linked</span>
          </div>
        </div>
      </div>

      <div class="bg-surface p-6 rounded-[20px] border border-gray-100 shadow-sm flex flex-col gap-4 text-sm text-gray-500">
        <div class="flex justify-between items-center">
          <span>Created:</span>
          <span class="font-bold text-gray-900">{{ dateFormatter(issueReport.createdAt) }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span>Last Update:</span>
          <span class="font-bold text-gray-900">{{ dateFormatter(issueReport.updatedAt) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { dateFormatter } from "@/utils/utils";

defineProps<{
  issueReport: any;
}>();

const getImageUrl = (path: string) => {
  if (!path) return "";
  return `${import.meta.env.VITE_API_URL}/${path.replace(/\\/g, "/")}`;
};
</script>
