<template>
  <div v-if="isLoading" class="flex justify-center items-center py-20">
    <div
      class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"
    ></div>
  </div>

  <template v-else-if="initialValues">
    <RouteForm
      form-id="edit-route-form"
      :initial-values="initialValues"
      :on-submit="handleUpdateRoute"
    >
      <template #form-logic="{ form }">
        <component
          :is="form.Subscribe"
          :selector="
            (state: any) => [state.values.origin, state.values.destination]
          "
        >
          <template #default="[origin, destination]">
            <div style="display: none">
              {{ handleOriginDestChange(origin, destination, form) }}
            </div>
          </template>
        </component>
      </template>

      <template #submit-btn>
        <Button size="md" variant="outline" @click="router.back()">
          Cancel
        </Button>
        <SubmitButton> Save Changes </SubmitButton>
      </template>
    </RouteForm>
  </template>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import { useToastStore } from "@/store/toastStore";
import RouteForm from "../components/RouteForm.vue";
import Button from "@/components/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import { fetch_route_by_id, update_route } from "../api/route.api";

const router = useRouter();
const route = useRoute();
const toast = useToastStore();
const queryClient = useQueryClient();
const routeId = route.params.id as string;

const { data: routeData, isLoading } = useQuery({
  queryKey: ["route", routeId],
  queryFn: async () => {
    const res = await fetch_route_by_id(routeId);
    if (!res.success) throw new Error(res.error);
    return res.data;
  },
});

const initialValues = computed(() => {
  if (!routeData.value) return null;
  const data = routeData.value;
  return {
    originCity: data.originCity?._id || data.originCity || "",
    destinationCity: data.destinationCity?._id || data.destinationCity || "",
    routeName: data.routeName || "",
    productType: data.productType || "",
    waypoints:
      data.waypoints?.map((wp: any) => ({
        ...wp,
        roadTypes: wp.roadTypes?.map((rt: any) => rt._id || rt) || [],
        terrainTypes: wp.terrainTypes?.map((tt: any) => tt._id || tt) || [],
      })) || [],
  };
});

const updateMutation = useMutation({
  mutationFn: (values: any) => update_route(routeId, values),
});

let lastOrigin = "";
let lastDest = "";

const handleOriginDestChange = (
  origin: string,
  destination: string,
  form: any,
) => {
  if (origin !== lastOrigin || destination !== lastDest) {
    lastOrigin = origin;
    lastDest = destination;
    if (origin && destination) {
      form.setFieldValue("routeName", `${origin} - ${destination}`);
    }
  }
};

const handleUpdateRoute = async (values: any) => {
  const res = await updateMutation.mutateAsync(values);
  if (res.success) {
    toast.success("Route updated successfully");
    queryClient.invalidateQueries({ queryKey: ["route", routeId] });
    router.push(`/operation/routes/${routeId}`);
  } else {
    toast.error(res.error || "Failed to update route");
  }
};
</script>
