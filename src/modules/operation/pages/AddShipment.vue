<template>
  <ShipmentForm
    form-id="add-shipment-form"
    :initial-values="initialValues"
    :on-submit="handleCreateShipment"
  >
    <template #submit-btn="{ form }">
      <Button size="md" variant="outline" @click="form.reset()">
        Discard Changes
      </Button>
      <SubmitButton> Create Shipment </SubmitButton>
    </template>
  </ShipmentForm>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import ShipmentForm from "../components/ShipmentForm.vue";
import { create_shipment } from "../api/shipment.api";
import { useToastStore } from "@/store/toastStore";
import SubmitButton from "@/components/form/SubmitButton.vue";
import Button from "@/components/Button.vue";
import { useMutation } from "@tanstack/vue-query";
const mutation = useMutation({
  mutationFn: (values) => create_shipment(values),
});
const router = useRouter();
const toast = useToastStore();

const initialValues = {
  order: "",
  waypoint: "",
  freightOrder: "",
  dispatchWeight: "",
  vehicle: "",
  transporterPrice: "",
  odometerAtDispatch: "",
  dispatchDate: new Date().toISOString().split("T")[0],
  fuelReadingAtDispatch: "",
  deadHole: "",
  remark: "",
  totalPrice: "",
};

const handleCreateShipment = async (values: any) => {
  const res = await mutation.mutateAsync(values);
  if (res.success) {
    toast.success("Shipment created successfully");
    router.push("/operation/shipments");
  } else {
    toast.error(res.error || "Failed to create shipment");
  }
};
</script>
