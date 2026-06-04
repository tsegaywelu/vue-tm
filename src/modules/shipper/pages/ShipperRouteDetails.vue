<template>
  <div v-if="isLoading" class="flex justify-center py-20">
    <div
      class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"
    ></div>
  </div>

  <div v-else-if="routeData" class="flex flex-col gap-8">
    <InfoWrapper title="General Information">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-2">
        <ShipmentDataLabel label="Route Name" :value="routeData.routeName" />
        <ShipmentDataLabel label="Origin" :value="routeData.origin" />
        <ShipmentDataLabel label="Destination" :value="routeData.destination" />
        <div>
          <p class="text-sm lg:text-base text-[#666D80] mb-0.5">
            Assigned Carriers
          </p>
          <div class="flex flex-wrap gap-1">
            <template v-if="routeData.carriers?.length">
              <span
                v-for="carrier in routeData.carriers"
                :key="carrier._id"
                class="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-md border border-gray-200"
              >
                {{ carrier.name }}
              </span>
            </template>
            <span v-else class="text-gray-400 italic text-sm font-medium"
              >None assigned</span
            >
          </div>
        </div>
      </div>
    </InfoWrapper>

    <!-- Waypoints Section -->
    <div class="flex flex-col gap-6">
      <div class="flex items-center gap-2 px-2">
        <i class="mdi mdi-map-marker-multiple-outline text-primary text-xl"></i>
        <h2 class="text-xl font-bold text-gray-900">
          Waypoints ({{ routeData.waypoint?.length || 0 }})
        </h2>
      </div>

      <div class="space-y-6">
        <div v-for="(wp, index) in routeData.waypoint" :key="index">
          <InfoWrapper
            :title="`Waypoint ${+index + 1}: ${wp.name || 'Unnamed'}`"
          >
            <template #title-extra>
              <div class="flex gap-2 ml-auto items-center h-full">
                <span
                  v-if="wp.isActive"
                  class="px-2 py-0.5 bg-green-100 text-green-700 rounded-md text-[10px] font-bold uppercase tracking-wider"
                  >Active</span
                >
                <span
                  v-else
                  class="px-2 py-0.5 bg-gray-100 text-gray-400 rounded-md text-[10px] font-bold uppercase tracking-wider"
                  >Inactive</span
                >
                <span
                  v-if="wp.isDefault"
                  class="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-md text-[10px] font-bold uppercase tracking-wider"
                  >Preferred</span
                >
              </div>
            </template>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-6 py-2">
              <ShipmentDataLabel
                label="Distance"
                :value="wp.distance + ' km'"
              />
            </div>
          </InfoWrapper>
        </div>

        <div
          v-if="!routeData.waypoint || routeData.waypoint.length === 0"
          class="text-center py-10 text-gray-500 bg-surface rounded-3xl border border-dashed border-gray-200"
        >
          No waypoints defined for this route.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import Button from "@/components/common/Button.vue";
import {
  fetch_route_request_details,
  delete_route_request,
} from "../../operation/api/route-request.api";
import { icons } from "@/utils/icons";
import { openModal } from "@customizer/modal-x";
import { useToastStore } from "@/store/toastStore";
import InfoWrapper from "../../operation/components/shipment-details/InfoWrapper.vue";
import ShipmentDataLabel from "../../operation/components/shipment-details/ShipmentDataLabel.vue";

const route = useRoute();
const router = useRouter();
const queryClient = useQueryClient();
const toast = useToastStore();
const id = route.params.id as string;
const isDeleting = ref(false);

const { data: routeResponse, isLoading } = useQuery({
  queryKey: ["route-request-details", id],
  queryFn: () => fetch_route_request_details(id),
});

const routeData = computed(() => routeResponse.value?.data);

const deleteMutation = useMutation({
  mutationFn: () => delete_route_request(id),
  onSuccess: (res) => {
    if (res.success) {
      toast.success("Route request deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ["shipper-routes-list"] });
      router.push("/shipper/routes");
    } else {
      toast.error(res.error || "Failed to delete route request.");
    }
  },
  onSettled: () => {
    isDeleting.value = false;
  },
});

const handleDelete = () => {
  openModal(
    "ConfirmModal",
    {
      title: "Delete Route Request",
      message: `Are you sure you want to delete the route "${routeData.value?.routeName}"? This action cannot be undone.`,
      confirmText: "Delete",
      variant: "danger",
    },
    (res) => {
      if (res) {
        isDeleting.value = true;
        deleteMutation.mutate();
      }
    },
  );
};
</script>
