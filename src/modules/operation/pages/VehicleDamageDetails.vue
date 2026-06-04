<template>
  <div v-if="isLoading" class="flex justify-center py-20">
    <i class="w-10 h-10 animate-spin text-primary" v-html="icons.spinner"></i>
  </div>

  <div v-else-if="damage" class="flex flex-col gap-4 md:gap-6">
    <!-- Header Info Card -->
    <div class="bg-grey-25 rounded-[32px] p-4 md:p-10 border border-grey-100 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div class="flex items-center gap-4 md:gap-8">
        <div class="size-16 md:size-32 shrink-0 rounded-full bg-surface flex items-center justify-center shadow-lg border border-grey-100 p-3 md:p-4">
          <div class="text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
        </div>
        <div class="flex flex-col gap-1">
          <h2 class="text-2xl md:text-4xl font-black text-grey-900 tracking-tight">
            {{ currencyFormatter(damage.actualRepairCost || 0) }}
          </h2>
          <div class="flex items-center gap-2 flex-wrap">
            <span class="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase">
              {{ damage.vehicle?.plateNumber || "N/A" }}
            </span>
            <span class="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
              {{ dateFormatter(damage.damageDate) }}
            </span>
          </div>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-3 md:gap-4">
        <div class="flex flex-col gap-1">
          <span class="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Severity</span>
          <span class="px-3 py-1 bg-red-100 text-red-700 font-bold text-xs rounded uppercase">
            {{ damage.severity || "Unknown" }}
          </span>
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Payable</span>
          <Status :variant="damage.payableStatus || 'unknown'" type="wrapped" :label="damage.payableStatus || 'Unknown'" />
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Receivable</span>
          <Status :variant="damage.receivableStatus || 'unknown'" type="wrapped" :label="damage.receivableStatus || 'Unknown'" />
        </div>
      </div>
    </div>

    <!-- Tab Content -->
    <div class="transition-all duration-300">
      <component :is="activeTabComponent" :damage="damage" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import Status from "@/components/common/Status.vue";
import { fetch_vehicle_damage_by_id } from "../api/operation.api";
import { currencyFormatter, dateFormatter } from "@/utils/utils";
import { icons } from "@/utils/icons";

import VehicleDamageBasicTab from "../components/damage-details/VehicleDamageBasicTab.vue";
import VehiclePartsTab from "../components/damage-details/VehiclePartsTab.vue";

const route = useRoute();
const damageId = route.params.id as string;

const { data: damageData, isLoading } = useQuery({
  queryKey: ["vehicle-damage", damageId],
  queryFn: () => fetch_vehicle_damage_by_id(damageId),
});

const damage = computed(() => damageData.value?.data);

const tabs = computed(() => (route.meta.tabs || []) as any[]);
const activeTab = computed(
  () => (route.query.tab as string) || tabs.value?.[0]?.value || "basic",
);

const tabComponents: Record<string, any> = {
  basic: VehicleDamageBasicTab,
  parts: VehiclePartsTab,
};

const activeTabComponent = computed(() => tabComponents[activeTab.value]);
</script>
