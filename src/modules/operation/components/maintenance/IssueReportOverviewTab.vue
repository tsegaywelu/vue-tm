<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6">
    <!-- Main Details -->
    <div class="lg:col-span-2 flex flex-col gap-6">
      <div class="bg-surface p-6 rounded-[20px] border border-line dark:border-white/10 shadow-sm flex flex-col gap-6">
        <h3 class="text-lg font-bold text-base-text border-b border-line pb-2">Report Details</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
          <div class="flex flex-col gap-1">
            <span class="text-xs font-semibold text-faint-text uppercase tracking-wider">Severity</span>
            <span 
              :class="[
                'text-sm font-bold w-fit px-2 py-0.5 rounded',
                issueReport.severity === 'CRITICAL' ? 'bg-red-600 text-white' : 
                issueReport.severity === 'HIGH' ? 'bg-orange-500/15 text-orange-600' :
                issueReport.severity === 'MEDIUM' ? 'bg-yellow-500/15 text-yellow-600' :
                'bg-blue-500/15 text-blue-600'
              ]"
            >
              {{ issueReport.severity }}
            </span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-xs font-semibold text-faint-text uppercase tracking-wider">Issue Type</span>
            <span class="text-sm font-bold text-base-text">{{ issueReport.type || '-' }}</span>
          </div>
          <div class="flex flex-col gap-1 md:col-span-2">
            <span class="text-xs font-semibold text-faint-text uppercase tracking-wider">Location</span>
            <div class="flex items-center gap-2">
              <span class="text-sm font-bold text-base-text">{{ issueReport.location || 'Not specified' }}</span>
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
            <p v-if="issueReport.lat" class="text-xs text-dim-text">
              Coordinates: {{ issueReport.lat }}, {{ issueReport.long }}
            </p>
          </div>
          <div class="flex flex-col gap-1 md:col-span-2">
            <span class="text-xs font-semibold text-faint-text uppercase tracking-wider">Description</span>
            <p class="text-sm text-base-text whitespace-pre-wrap leading-relaxed bg-surface-muted p-4 rounded-xl border border-line min-h-[100px]">
              {{ issueReport.description || 'No description provided' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Attached Picture -->
      <div v-if="issueReport.picture" class="bg-surface p-6 rounded-[20px] border border-line dark:border-white/10 shadow-sm flex flex-col gap-4">
        <h3 class="text-lg font-bold text-base-text border-b border-line pb-2">Evidence / Picture</h3>
        <div class="relative group w-full max-w-2xl overflow-hidden rounded-xl border border-line bg-surface-muted">
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
      <div class="bg-surface p-6 rounded-[20px] border border-line dark:border-white/10 shadow-sm flex flex-col gap-6 text-sm">
        <h3 class="text-lg font-bold text-base-text border-b border-line pb-2 text-base">Involved Parties</h3>
        
        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-1">
            <span class="text-xs font-semibold text-faint-text uppercase tracking-wider">Driver</span>
            <div v-if="issueReport.driver" class="flex flex-col">
              <span class="font-bold text-base-text">{{ issueReport.driver.firstName }} {{ issueReport.driver.lastName }}</span>
              <span class="text-dim-text">{{ issueReport.driver.email }}</span>
              <span v-if="issueReport.driver.phone" class="text-dim-text">{{ issueReport.driver.phone }}</span>
            </div>
            <span v-else class="text-faint-text">N/A</span>
          </div>

          <div class="flex flex-col gap-1">
            <span class="text-xs font-semibold text-faint-text uppercase tracking-wider">Carrier</span>
            <div v-if="issueReport.carrier" class="flex flex-col">
              <span class="font-bold text-base-text">{{ issueReport.carrier.name }}</span>
              <span class="text-dim-text">{{ issueReport.carrier.email }}</span>
            </div>
            <span v-else class="text-faint-text">N/A</span>
          </div>

          <div class="flex flex-col gap-1 border-t border-line pt-4 mt-2">
            <span class="text-xs font-semibold text-faint-text uppercase tracking-wider">Related Shipment</span>
            <div v-if="issueReport.shipment">
              <router-link
                :to="`/shipments/${issueReport.shipment._id}`"
                class="font-bold text-primary hover:underline"
              >
                {{ issueReport.shipment.shipmentNumber || issueReport.shipment._id }}
              </router-link>
            </div>
            <span v-else class="text-faint-text">Not linked</span>
          </div>
        </div>
      </div>

      <div class="bg-surface p-6 rounded-[20px] border border-line dark:border-white/10 shadow-sm flex flex-col gap-4 text-sm text-dim-text">
        <div class="flex justify-between items-center">
          <span>Created:</span>
          <span class="font-bold text-base-text">{{ dateFormatter(issueReport.createdAt) }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span>Last Update:</span>
          <span class="font-bold text-base-text">{{ dateFormatter(issueReport.updatedAt) }}</span>
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
