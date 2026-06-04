<template>
  <div class="h-full flex flex-col gap-4">
    <div id="contract-details-tabs" class="w-full"></div>

    <div v-if="isLoading" class="flex justify-center py-20">
      <i class="mdi mdi-loading mdi-spin text-4xl text-primary"></i>
    </div>

    <template v-else-if="contract">
      <!-- Header -->
      <div
        class="bg-surface flex flex-col md:flex-row md:items-center justify-between px-3 md:px-4 py-4 md:py-3 rounded-[20px] gap-4 shadow-sm border border-gray-100"
      >
        <div class="flex flex-col gap-2 flex-1">
          <div class="flex items-center gap-4">
            <div
              class="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary"
            >
              <i class="mdi mdi-file-certificate-outline text-2xl"></i>
            </div>
            <div>
              <h1 class="font-bold text-2xl leading-tight text-gray-900 uppercase">
                Contract Details
              </h1>
              <div class="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                <span class="text-sm text-gray-600">
                  Carrier:
                  <span class="font-bold text-black text-sm ml-1">
                    {{ contract.carrier?.name || "-" }}
                  </span>
                </span>
                <span class="text-sm text-gray-600">
                  Shipper:
                  <span class="font-bold text-black text-sm ml-1">
                    {{ contract.shipper?.name || "-" }}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex-1 min-h-0 overflow-y-auto pb-10 mt-2">
        <component
          :is="activeTabComponent"
          :key="activeTab"
          :contract="contract"
          context="shipper"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import { fetch_shipper_contract_by_id } from "../api/shipper.api";
import ContractOverviewTab from "../../operation/components/settings/Contract/ContractOverviewTab.vue";

const route = useRoute();
const contractId = route.params.id as string;

const tabs = computed(() => (route.meta.tabs || []) as any[]);
const activeTab = computed(
  () =>
    (route.query.tab as string) ||
    (tabs.value?.[0]?.value as string) ||
    "overview",
);

const { data: response, isLoading } = useQuery({
  queryKey: ["contract", contractId],
  queryFn: () => fetch_shipper_contract_by_id(contractId),
  enabled: !!contractId,
});

const contract = computed(() => response.value?.data as any);

const activeTabComponent = computed(() => {
  switch (activeTab.value) {
    case "overview":
      return ContractOverviewTab;
    default:
      return ContractOverviewTab;
  }
});
</script>
