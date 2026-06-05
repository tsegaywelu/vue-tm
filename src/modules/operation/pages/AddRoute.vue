<template>
  <RouteForm
    form-id="add-route-form"
    :initial-values="initialValues"
    :on-submit="handleCreateRoute"
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
      <SubmitButton> Create Route </SubmitButton>
    </template>
  </RouteForm>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useMutation } from "@tanstack/vue-query";
import { useToastStore } from "@/store/toastStore";
import RouteForm from "../components/RouteForm.vue";
import Button from "@/components/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import { create_route } from "../api/route.api";

const router = useRouter();
const toast = useToastStore();

const initialValues = {
  originCity: "",
  destinationCity: "",
  routeName: "",
  productType: "",
  waypoints: [],
};

const mutation = useMutation({
  mutationFn: (values: any) => create_route(values),
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

const handleCreateRoute = async (values: any) => {
  const res = await mutation.mutateAsync(values);
  if (res.success) {
    toast.success("Route created successfully");
    router.push("/operation/routes");
  } else {
    toast.error(res.error || "Failed to create route");
  }
};
</script>
