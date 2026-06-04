<template>
  <div v-if="!tyre" class="flex justify-center py-20">
    <i class="w-10 h-10 animate-spin text-primary" v-html="icons.spinner"></i>
  </div>

  <div v-else class="flex flex-col gap-4 md:gap-6">
    <!-- Desktop: edit button -->
    <Teleport defer to="#page-actions">
      <div class="hidden sm:flex">
        <Button variant="primary" size="md" @click="handleEdit">Edit Tyre</Button>
      </div>
    </Teleport>

    <!-- Mobile: edit icon in page title -->
    <Teleport defer to="#page-title-actions">
      <button
        class="sm:hidden size-8 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
        @click="handleEdit"
      >
        <i class="*:size-4" v-html="icons.edit"></i>
      </button>
    </Teleport>

    <!-- Header Info Card -->
    <div class="bg-grey-25 rounded-[32px] p-4 md:p-10 md:border md:border-grey-100 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div class="flex items-center gap-4 md:gap-8">
        <div class="size-16 md:size-32 shrink-0 rounded-full bg-surface flex items-center justify-center shadow-lg border border-grey-100 p-3 md:p-4">
          <i class="*:size-8 md:*:size-16 text-primary" v-html="icons.tyre"></i>
        </div>
        <div class="flex flex-col gap-1">
          <h2 class="text-2xl md:text-4xl font-black text-grey-900 tracking-tight">
            {{ tyre.serialNumber || 'N/A' }}
          </h2>
          <div class="flex items-center gap-2 flex-wrap">
            <span class="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase">
              {{ tyre.vehicle?.plateNumber || 'No Vehicle' }}
            </span>
            <span v-if="tyre.brand" class="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
              {{ tyre.brand }}
            </span>
          </div>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-3 md:gap-4">
        <div v-if="tyre.status" class="flex flex-col gap-1">
          <span class="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Status</span>
          <Status :variant="tyre.status" type="wrapped" :label="tyre.status" />
        </div>
        <div v-if="tyre.installationDate" class="flex flex-col gap-1">
          <span class="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Installed</span>
          <span class="text-sm font-medium text-gray-700">{{ dateFormatter(tyre.installationDate) }}</span>
        </div>
        <div v-if="tyre.tyrePosition" class="flex flex-col gap-1">
          <span class="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Position</span>
          <span class="text-sm font-medium text-gray-700">{{ formatPosition(tyre.tyrePosition) }}</span>
        </div>
      </div>
    </div>

    <!-- Tab Content -->
    <div>
      <component :is="activeTabComponent" :tyre="tyre" @refresh="refetch" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import { fetch_tyre_by_id } from "../../api/tyre.api";
import { type Tyre } from "../../operation.types";
import Status from "@/components/common/Status.vue";
import Button from "@/components/common/Button.vue";
import { icons } from "@/utils/icons";
import { dateFormatter } from "@/utils/utils";
import TyreOverviewTab from "../../components/tyre-details/TyreOverviewTab.vue";

const route = useRoute();
const router = useRouter();
const tyreId = route.params.id as string;

const activeTab = ref("tyre-info");

const { data: tyreResponse, refetch } = useQuery<Tyre>({
  queryKey: ["tyre", tyreId],
  queryFn: () => fetch_tyre_by_id(tyreId) as any,
});

const tyre = computed(() => tyreResponse.value?.data);

const activeTabComponent = computed(() => TyreOverviewTab);

const formatPosition = (position?: string) => {
  if (!position) return "";
  return position.split("_").map((w) => w.charAt(0) + w.slice(1).toLowerCase()).join(" ");
};

const handleEdit = () => {
  router.push(`/vehicle-tyres/edit/${tyreId}`);
};
</script>
