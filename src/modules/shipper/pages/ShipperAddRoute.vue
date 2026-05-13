<template>
  <ShipperRouteForm
    form-id="add-shipper-route"
    :initial-values="initialValues"
    :on-submit="handleFormSubmit"
  >
    <template #submit-btn="{ form }">
      <SubmitButton class="w-full md:w-auto"> Create Route </SubmitButton>
    </template>
  </ShipperRouteForm>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import Button from "@/components/common/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import ShipperRouteForm from "../components/ShipperRouteForm.vue";
import { create_route_request } from "../../operation/api/route-request.api";
import { useToastStore } from "@/store/toastStore";

const router = useRouter();
const queryClient = useQueryClient();
const toast = useToastStore();

const initialValues = {
  origin: "",
  destination: "",
  routeName: "",
  carriers: [],
  waypoints: [],
};

const mutation = useMutation({
  mutationFn: create_route_request,
  onSuccess: (res) => {
    if (res.success) {
      toast.success("Route request created successfully.");
      queryClient.invalidateQueries({ queryKey: ["shipper-routes-list"] });
      router.push("/shipper/routes");
    } else {
      toast.error(res.error || "Failed to create route request.");
    }
  },
});

const handleFormSubmit = async (values: any) => {
  await mutation.mutateAsync(values);
};
</script>
