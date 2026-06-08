<template>
  <div class="flex items-center justify-between mb-2">
    <Teleport to="#page-actions" defer>
      <Button
        size="md"
        @click="router.push(`/operation/routes/edit/${routeId}`)"
      >
        Edit Route 
      </Button>
    </Teleport>
  </div>

  <div
    v-if="isLoading || isMetadataLoading"
    class="flex justify-center items-center py-20"
  >
    <div
      class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"
    ></div>
  </div>

  <div v-else-if="routeData" class="flex flex-col gap-8">
    <!-- Route Information Card -->
    <InfoWrapper title="General Information">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-2">
        <ShipmentDataLabel label="Route Name" :value="routeData.routeName" />
        <ShipmentDataLabel label="Origin" :value="routeData.origin" />
        <ShipmentDataLabel label="Destination" :value="routeData.destination" />
        <ShipmentDataLabel
          label="Product Type"
          :value="formatStatus(routeData.productType)"
        />
      </div>
    </InfoWrapper>

    <!-- Waypoints List -->
    <div class="flex flex-col gap-6">
      <div class="flex items-center gap-2 px-2">
        <i class="mdi mdi-map-marker-multiple-outline text-primary text-xl"></i>
        <h2 class="text-xl font-bold text-gray-900">
          Waypoints ({{ routeData.waypoints?.length || 0 }})
        </h2>
      </div>

      <div class="space-y-6">
        <div v-for="(waypoint, index) in routeData.waypoints" :key="index">
          <InfoWrapper
            :title="`Waypoint ${+index + 1}: ${waypoint.name || 'Unnamed'}`"
          >
            <template #title-extra>
              <div class="flex gap-2 ml-auto items-center h-full">
                <span
                  v-if="waypoint.isActive"
                  class="px-2 py-0.5 bg-green-100 text-green-700 rounded-md text-[10px] font-bold uppercase tracking-wider"
                  >Active</span
                >
                <span
                  v-if="waypoint.isDefault"
                  class="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md text-[10px] font-bold uppercase tracking-wider"
                  >Preferred</span
                >
              </div>
            </template>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-6 py-2">
              <ShipmentDataLabel
                label="Distance"
                :value="waypoint.distance + ' km'"
              />
              <ShipmentDataLabel
                label="Perdiem Days"
                :value="waypoint.perDiemDays"
              />
              <ShipmentDataLabel
                label="Turn Around Time"
                :value="waypoint.TAT + ' h'"
              />
              <ShipmentDataLabel
                label="Avg Fuel Usage"
                :value="waypoint.AFU + ' L'"
              />
              <ShipmentDataLabel
                v-if="waypoint.otherAmount"
                label="Other Amount"
                :value="currencyFormatter(waypoint.otherAmount)"
              />

              <div class="col-span-2">
                <ShipmentDataLabel
                  label="Road Types"
                  :value="resolveRoadTypes(waypoint.roadTypes)"
                />
              </div>
              <div class="col-span-2">
                <ShipmentDataLabel
                  label="Terrain Types"
                  :value="resolveTerrainTypes(waypoint.terrainTypes)"
                />
              </div>
            </div>
          </InfoWrapper>
        </div>

        <div
          v-if="!routeData.waypoints || routeData.waypoints.length === 0"
          class="text-center py-10 text-gray-500 bg-surface rounded-3xl border border-dashed border-line"
        >
          No waypoints defined for this route.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import Button from "@/components/Button.vue";
import { fetch_route_by_id } from "../api/route.api";
import { fetch_road_types, fetch_terrain_types } from "../api/operation.api";
import InfoWrapper from "../components/shipment-details/InfoWrapper.vue";
import ShipmentDataLabel from "../components/shipment-details/ShipmentDataLabel.vue";
import { formatStatus, currencyFormatter } from "@/utils/utils";

const router = useRouter();
const route = useRoute();
const routeId = route.params.id as string;

const { data: routeData, isLoading } = useQuery({
  queryKey: ["route", routeId],
  queryFn: async () => {
    const res = await fetch_route_by_id(routeId);
    if (!res.success) throw new Error(res.error);
    return res.data;
  },
});

const { data: roadTypesResponse, isLoading: isRoadLoading } = useQuery({
  queryKey: ["road-types"],
  queryFn: () => fetch_road_types(),
});

const { data: terrainTypesResponse, isLoading: isTerrainLoading } = useQuery({
  queryKey: ["terrain-types"],
  queryFn: () => fetch_terrain_types(),
});

const isMetadataLoading = computed(
  () => isRoadLoading.value || isTerrainLoading.value,
);

const extractData = (res: any) => {
  const raw = res?.data;
  if (!raw) return [];
  const d = raw.result || raw.data || raw;
  return Array.isArray(d)
    ? d
    : d?.items && Array.isArray(d.items)
      ? d.items
      : d?.results && Array.isArray(d.results)
        ? d.results
        : d?.docs && Array.isArray(d.docs)
          ? d.docs
          : [];
};

const resolveRoadTypes = (ids: any[]) => {
  if (!ids || !ids.length) return "N/A";
  const roadTypes = extractData(roadTypesResponse.value);
  if (!roadTypes.length) return ids.join(", ");

  return ids
    .map((id) => {
      const roadId = id._id || id;
      return roadTypes.find((rt: any) => rt._id === roadId)?.name || roadId;
    })
    .join(", ");
};

const resolveTerrainTypes = (ids: any[]) => {
  if (!ids || !ids.length) return "N/A";
  const terrainTypes = extractData(terrainTypesResponse.value);
  if (!terrainTypes.length) return ids.join(", ");

  return ids
    .map((id) => {
      const terrainId = id._id || id;
      return (
        terrainTypes.find((tt: any) => tt._id === terrainId)?.name || terrainId
      );
    })
    .join(", ");
};
</script>
