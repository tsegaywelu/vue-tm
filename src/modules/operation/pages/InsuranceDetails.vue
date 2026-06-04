<template>
  <div v-if="isLoading" class="flex justify-center py-20">
    <i class="mdi mdi-loading mdi-spin text-4xl text-primary"></i>
  </div>

  <div v-else-if="insurance" class="flex flex-col gap-6">
    <!-- Header Info Card -->
    <div
      class="bg-grey-25 rounded-[32px] p-6 md:p-10 border border-grey-100 flex flex-col md:flex-row items-center justify-between gap-8"
    >
      <div class="flex items-center gap-8">
        <div
          class="size-24 md:size-32 rounded-full bg-surface flex items-center justify-center shadow-lg border border-grey-100 p-4"
        >
          <div class="text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
        </div>
        <div class="flex flex-col gap-1">
          <h2
            class="text-3xl md:text-4xl font-black text-grey-900 tracking-tight"
          >
            {{ insurance.insurer?.name || 'Unknown Insurer' }}
          </h2>
          <div class="flex items-center gap-2">
            <span
              class="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase"
            >
              {{ insurance.vehicle?.plateNumber || 'N/A' }}
            </span>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <Status
          :variant="insurance.status || 'unknown'"
          type="wrapped"
          :label="insurance.status || 'Unknown'"
        />
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

// Tabs
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
const activeTab = computed(() => {
  return (
    (route.query.tab as string) || (tabs.value?.[0]?.value as string) || "basic"
  );
});

const tabComponents: Record<string, any> = {
  basic: BasicDetailsTab,
  documents: DocumentsTab,
};

const activeTabComponent = computed(() => {
  return tabComponents[activeTab.value];
});
</script>
