<template>
  <Teleport defer to="#page-actions">
    <Button v-if="entry" variant="secondary" size="md" @click="router.push(`/fleet/meter-entries/edit/${id}`)">
      Edit
    </Button>
  </Teleport>

  <div v-if="isLoading" class="flex justify-center items-center py-20">
    <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
  </div>

  <div v-else-if="entry" class="flex flex-col gap-8">
    <InfoWrapper title="General Information">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 py-2">
        <ShipmentDataLabel label="Vehicle" :value="entry.vehicle?.plateNumber" />
        <ShipmentDataLabel label="Meter Type" :value="entry.meterType?.replace('_', ' ')" />
        <ShipmentDataLabel label="Entry Date" :value="dateFormatter(entry.entryDate)" />
        <ShipmentDataLabel label="Entry Source" :value="entry.entrySource?.replace(/_/g, ' ')" />
      </div>
    </InfoWrapper>

    <InfoWrapper title="Reading Details">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 py-2">
        <ShipmentDataLabel label="Reading" :value="entry.reading != null ? entry.reading.toLocaleString() : null" />
        <div class="flex flex-col gap-0.5">
          <span class="text-sm lg:text-base text-[#666D80]">Override</span>
          <span
            class="inline-block px-2 py-0.5 rounded-full text-xs font-bold uppercase w-fit"
            :class="entry.isOverride ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'"
          >{{ entry.isOverride ? 'Yes' : 'No' }}</span>
        </div>
        <ShipmentDataLabel v-if="entry.isOverride" label="Override Reason" :value="entry.overrideReason" class="col-span-2" />
        <ShipmentDataLabel label="Created By" :value="entry.createdBy?.username" />
        <ShipmentDataLabel label="Created At" :value="dateFormatter(entry.createdAt)" />
      </div>
    </InfoWrapper>

    <InfoWrapper v-if="entry.comment" title="Comment">
      <p class="py-2 text-sm text-gray-700">{{ entry.comment }}</p>
    </InfoWrapper>

    <InfoWrapper v-if="entry.photos?.length" title="Photos">
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 py-2">
        <a
          v-for="(photo, i) in entry.photos"
          :key="i"
          :href="`${API_URL}/${photo}`"
          target="_blank"
          class="aspect-square rounded-2xl overflow-hidden border border-grey-100 hover:opacity-90 transition-opacity"
        >
          <img :src="`${API_URL}/${photo}`" alt="Photo" class="w-full h-full object-cover" />
        </a>
      </div>
    </InfoWrapper>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import Button from "@/components/common/Button.vue";
import InfoWrapper from "@/modules/operation/components/shipment-details/InfoWrapper.vue";
import ShipmentDataLabel from "@/modules/operation/components/shipment-details/ShipmentDataLabel.vue";
import { fetch_meter_entries } from "../api/fleet.api";
import { dateFormatter } from "@/utils/utils";

const route = useRoute();
const router = useRouter();
const id = route.params.id as string;
const API_URL = import.meta.env.VITE_API_URL;

const { data: response, isLoading } = useQuery({
  queryKey: ["meter-entry", id],
  queryFn: () => fetch_meter_entries({ _id: id }),
  enabled: !!id,
});

const entry = computed(() => {
  const data = response.value?.data as any;
  return data?.results?.[0] ?? null;
});
</script>
