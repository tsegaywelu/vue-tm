<template>
  <div
    v-if="isLoading"
    class="flex justify-center items-center py-2 animate-fade-in"
  >
    <i class="mdi mdi-loading mdi-spin text-xl text-primary"></i>
  </div>

  <div
    v-else
    class="my-2 ml-2 flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none animate-fade-in text-xs py-1"
  >
    <!-- InProgress -->
    <div
      class="flex items-center gap-1.5 bg-white border border-grey-100 px-3.5 py-1.5 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all hover:bg-grey-25 cursor-pointer"
    >
      <span class="text-grey-600 font-medium">InProgress</span>
      <span class="font-extrabold text-primary">{{
        stats.InProgress || 0
      }}</span>
    </div>

    <!-- Completed -->
    <div
      class="flex items-center gap-1.5 bg-white border border-grey-100 px-3.5 py-1.5 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all hover:bg-grey-25 cursor-pointer"
    >
      <span class="text-grey-600 font-medium">Completed</span>
      <span class="font-extrabold text-grey-800">{{
        stats.completed || 0
      }}</span>
    </div>

    <!-- In Bound -->
    <div
      class="flex items-center gap-1.5 bg-white border border-grey-100 px-3.5 py-1.5 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all hover:bg-grey-25 cursor-pointer"
    >
      <span class="text-grey-600 font-medium">In Bound</span>
      <span class="font-extrabold text-grey-800">{{
        stats.IN_BOUND || 0
      }}</span>
    </div>

    <!-- Out Bound -->
    <div
      class="flex items-center gap-1.5 bg-white border border-grey-100 px-3.5 py-1.5 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all hover:bg-grey-25 cursor-pointer"
    >
      <span class="text-grey-600 font-medium">Out Bound</span>
      <span class="font-extrabold text-grey-800">{{
        stats.OUT_BOUND || 0
      }}</span>
    </div>

    <!-- Site Transfer -->
    <div
      class="flex items-center gap-1.5 bg-white border border-grey-100 px-3.5 py-1.5 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all hover:bg-grey-25 cursor-pointer"
    >
      <span class="text-grey-600 font-medium">Site Transfer</span>
      <span class="font-extrabold text-grey-800">{{
        stats.SITE_TRANSFER || 0
      }}</span>
    </div>

    <!-- Owned -->
    <div
      class="flex items-center gap-1.5 bg-white border border-grey-100 px-3.5 py-1.5 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all hover:bg-grey-25 cursor-pointer"
    >
      <span class="text-grey-600 font-medium">Owned</span>
      <span class="font-extrabold text-grey-800">{{ stats.owned || 0 }}</span>
    </div>

    <!-- Rental -->
    <div
      class="flex items-center gap-1.5 bg-white border border-grey-100 px-3.5 py-1.5 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all hover:bg-grey-25 cursor-pointer"
    >
      <span class="text-grey-600 font-medium">Rental</span>
      <span class="font-extrabold text-grey-800">{{ stats.rental || 0 }}</span>
    </div>

    <!-- Leased -->
    <div
      class="flex items-center gap-1.5 bg-white border border-grey-100 px-3.5 py-1.5 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all hover:bg-grey-25 cursor-pointer"
    >
      <span class="text-grey-600 font-medium">Leased</span>
      <span class="font-extrabold text-grey-800">{{ stats.leased || 0 }}</span>
    </div>

    <!-- Power & Trailer -->
    <div
      class="flex items-center gap-1.5 bg-white border border-grey-100 px-3.5 py-1.5 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all hover:bg-grey-25 cursor-pointer"
    >
      <span class="text-grey-600 font-medium">Power & Trailer</span>
      <span class="font-extrabold text-grey-800">{{
        stats["power & trailer"] || stats["power & trailor"] || 0
      }}</span>
    </div>

    <!-- MDV -->
    <div
      class="flex items-center gap-1.5 bg-white border border-grey-100 px-3.5 py-1.5 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all hover:bg-grey-25 cursor-pointer"
    >
      <span class="text-grey-600 font-medium">MDV</span>
      <span class="font-extrabold text-grey-800">{{ stats.mdv || 0 }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { fetch_shipment_status_count } from "../api/operation.api";

const { data: response, isLoading } = useQuery({
  queryKey: ["shipmentStatusCount"],
  queryFn: () => fetch_shipment_status_count(),
});

const stats = computed(() => response.value?.data || {});
</script>
