<template>
  <div class="flex flex-col gap-6">
    <!-- Info Cards -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <InfoWrapper title="Carrier Information">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 py-3">
          <DetailItem label="Name" :value="contract?.carrier?.name" />
          <DetailItem label="Email" :value="contract?.carrier?.email" />
          <DetailItem label="Phone" :value="contract?.carrier?.phone" />
          <DetailItem label="Address" :value="contract?.carrier?.address" />
        </div>
      </InfoWrapper>

      <InfoWrapper title="Shipper Information">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 py-3">
          <DetailItem label="Name" :value="contract?.shipper?.name" />
          <DetailItem label="Email" :value="contract?.shipper?.email" />
          <DetailItem label="Phone" :value="contract?.shipper?.phone" />
          <DetailItem label="Address" :value="contract?.shipper?.address" />
        </div>
      </InfoWrapper>
    </div>

    <!-- Routes Section -->
    <div class="flex flex-col gap-4">
      <div class="flex items-center justify-between px-1">
        <div class="flex items-center gap-3">
          <h2 class="text-xl font-bold text-gray-900">Contract Routes</h2>
          <span class="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">
            {{ contract?.routes?.length || 0 }} Routes
          </span>
        </div>
        <Button variant="primary" size="md" @click="openAddRouteModal">
          + Add Route
        </Button>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div
          v-for="routeObj in contract?.routes"
          :key="routeObj._id"
          class="relative bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 flex flex-col gap-6"
        >
          <!-- Icon actions -->
          <div class="absolute top-4 right-4 flex items-center gap-1 bg-white/60 backdrop-blur-sm rounded-lg p-1 border border-gray-200/50 shadow-sm z-10">
            <button
              type="button"
              class="flex items-center justify-center size-8 rounded-md hover:bg-white text-gray-600 transition-colors shadow-sm"
              title="Edit Route"
              @click="openEditRouteModal(routeObj)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                <path d="m15 5 4 4" />
              </svg>
            </button>
            <button
              type="button"
              class="flex items-center justify-center size-8 rounded-md hover:bg-red-50 text-red-500 transition-colors shadow-sm"
              title="Delete Route"
              @click="deleteRoute(routeObj)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                <line x1="10" x2="10" y1="11" y2="17" />
                <line x1="14" x2="14" y1="11" y2="17" />
              </svg>
            </button>
          </div>

          <!-- Route Header -->
          <div class="flex items-center gap-3 pr-20">
            <div class="size-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-600 shrink-0">
              <i class="mdi mdi-map-marker-path text-xl"></i>
            </div>
            <div>
              <h3 class="font-bold text-gray-900 leading-tight">{{ routeObj.route?.routeName || 'Unnamed Route' }}</h3>
              <p class="text-xs text-gray-500">{{ routeObj.route?.origin }} → {{ routeObj.route?.destination }}</p>
            </div>
          </div>

          <!-- Route Metadata -->
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-gray-50 p-4 rounded-2xl flex flex-col gap-1">
              <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Commodities</span>
              <div class="flex flex-wrap gap-1 mt-1">
                <span
                  v-for="c in routeObj.commodities"
                  :key="c._id"
                  class="px-2 py-0.5 bg-white border border-gray-200 rounded-lg text-[10px] font-medium text-gray-700"
                >
                  {{ c.name }}
                </span>
                <span v-if="!routeObj.commodities?.length" class="text-xs text-gray-400 italic">None</span>
              </div>
            </div>
            <div class="bg-gray-50 p-4 rounded-2xl flex flex-col gap-1">
              <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Packagings</span>
              <div class="flex flex-wrap gap-1 mt-1">
                <span
                  v-for="p in routeObj.packagings"
                  :key="p._id"
                  class="px-2 py-0.5 bg-white border border-gray-200 rounded-lg text-[10px] font-medium text-gray-700"
                >
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

      <div v-if="!contract?.routes?.length" class="bg-white rounded-3xl p-12 text-center border border-gray-100">
        <i class="mdi mdi-routes text-4xl text-gray-300 mb-3 block"></i>
        <p class="text-gray-500 text-sm">No routes added to this contract yet.</p>
        <Button variant="primary" size="md" class="mt-4" @click="openAddRouteModal">
          + Add First Route
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { openModal } from "@customizer/modal-x";
import { useQueryClient } from "@tanstack/vue-query";
import { useToastStore } from "@/store/toastStore";
import InfoWrapper from "../../shipment-details/InfoWrapper.vue";
import DetailItem from "../../vehicle-details/DetailItem.vue";
import Button from "@/components/Button.vue";
import { delete_contract_route } from "../../../api/settings.api";

const props = defineProps<{
  contract?: any;
  context?: "carrier" | "shipper";
}>();

const queryClient = useQueryClient();
const toast = useToastStore();

async function openAddRouteModal() {
  await openModal("ContractRouteAddModal", {
    contractId: props.contract._id,
    context: props.context || "carrier",
  });
}

async function openEditRouteModal(routeObj: any) {
  await openModal("ContractRouteEditModal", {
    contractId: props.contract._id,
    route: routeObj,
    context: props.context || "carrier",
  });
}

async function deleteRoute(routeObj: any) {
  const confirmed = await openModal("ConfirmationModal", {
    title: "Delete Route",
    message: `Remove "${routeObj.route?.routeName || 'this route'}" from the contract?`,
    confirmText: "Delete",
  });
  if (!confirmed) return;

  try {
    const res = await delete_contract_route(props.contract._id, routeObj._id);
    if (res.success) {
      toast.success("Route removed from contract");
      queryClient.invalidateQueries({ queryKey: ["contract", props.contract._id] });
    } else {
      toast.error(res.error || "Failed to remove route");
    }
  } catch (err: any) {
    toast.error(err.message || "An unexpected error occurred");
  }
}
</script>
