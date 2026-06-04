<template>
  <div v-if="isLoading" class="flex justify-center py-20">
    <i class="w-10 h-10 animate-spin text-primary" v-html="icons.spinner"></i>
  </div>

  <div v-else-if="insurance" class="flex flex-col gap-4 md:gap-6">
    <!-- Header Info Card -->
    <div class="bg-grey-25 rounded-[32px] p-4 md:p-10 md:border md:border-grey-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-8">
      <div class="flex items-center gap-4 md:gap-8">
        <div class="size-16 md:size-32 shrink-0 rounded-full bg-surface flex items-center justify-center shadow-lg border border-grey-100 p-3 md:p-4">
          <i class="*:size-full text-primary" v-html="icons.insurance"></i>
        </div>
        <div class="flex flex-col gap-1">
          <h2 class="text-2xl md:text-4xl font-black text-grey-900 tracking-tight">
            {{ insurance.insurer?.name || "Unknown Insurer" }}
          </h2>
          <div class="flex items-center gap-2 flex-wrap">
            <span class="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase">
              {{ insurance.vehicle?.plateNumber || "N/A" }}
            </span>
            <Status
              :variant="insurance.status || 'unknown'"
              type="wrapped"
              :label="insurance.status || 'Unknown'"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Tab Content -->
    <div class="transition-all duration-300">
      <component :is="activeTabComponent" :insurance="insurance" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import Status from "@/components/common/Status.vue";
import { fetch_insurance_by_id } from "../api/operation.api";
import { icons } from "@/utils/icons";

import BasicDetailsTab from "../components/insurance-details/BasicDetailsTab.vue";
import DocumentsTab from "../components/insurance-details/DocumentsTab.vue";

const route = useRoute();
const insuranceId = route.params.id as string;

const { data: insuranceData, isLoading } = useQuery({
  queryKey: ["insurance", insuranceId],
  queryFn: () => fetch_insurance_by_id(insuranceId),
});

const insurance = computed(() => insuranceData.value?.data);

const tabs = computed(() => (route.meta.tabs || []) as any[]);
const activeTab = computed(
  () => (route.query.tab as string) || tabs.value?.[0]?.value || "basic",
);

const tabComponents: Record<string, any> = {
  basic: BasicDetailsTab,
  documents: DocumentsTab,
};

const activeTabComponent = computed(() => tabComponents[activeTab.value]);
</script>
