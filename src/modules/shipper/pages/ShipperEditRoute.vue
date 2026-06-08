<template>
  <div v-if="isLoading" class="flex justify-center py-20">
    <div
      class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"
    ></div>
  </div>

  <ShipperRouteForm
    v-else-if="routeData"
    form-id="edit-shipper-route"
    :initial-values="initialValues"
    :on-submit="handleFormSubmit"
  >
    <template #submit-btn="{ form }">
      <SubmitButton> Update Route </SubmitButton>
    </template>
  </ShipperRouteForm>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import Button from "@/components/common/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import ShipperRouteForm from "../components/ShipperRouteForm.vue";
import {
  fetch_route_request_details,
  update_route_request,
} from "../../operation/api/route-request.api";
import { useToastStore } from "@/store/toastStore";

const route = useRoute();
const router = useRouter();
const queryClient = useQueryClient();
const toast = useToastStore();
const id = route.params.id as string;

const { data: routeResponse, isLoading } = useQuery({
  queryKey: ["route-request-details", id],
  queryFn: () => fetch_route_request_details(id),
});

const routeData = computed(() => routeResponse.value?.data);

const initialValues = computed(() => {
  if (!routeData.value) return {};

  return {
    originCity: routeData.value.originCity?._id || routeData.value.originCity || "",
    destinationCity: routeData.value.destinationCity?._id || routeData.value.destinationCity || "",
    origin: routeData.value.origin,
    destination: routeData.value.destination,
    routeName: routeData.value.routeName,
    carriers: routeData.value.carriers?.map((c: any) => c._id) || [],
    waypoints: routeData.value.waypoint || [],
  };
});

const mutation = useMutation({
  mutationFn: (values: any) => update_route_request(id, values),
  onSuccess: (res) => {
    if (res.success) {
      toast.success("Route request updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["shipper-routes-list"] });
      queryClient.invalidateQueries({
        queryKey: ["route-request-details", id],
      });
      router.push("/shipper/routes");
    } else {
      toast.error(res.error || "Failed to update route request.");
    }
  },
});

const handleFormSubmit = async (values: any) => {
  await mutation.mutateAsync(values);
};
</script>
