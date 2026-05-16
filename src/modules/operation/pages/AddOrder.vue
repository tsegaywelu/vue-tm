<template>
  <CarrierOrderForm
    form-id="add-order-form"
    :initial-values="initialValues"
    :on-submit="handleCreateOrder"
  >
    <template #submit-btn="{ form }">
      <Button size="md" variant="outline" @click="form.reset()">
        Discard Changes
      </Button>
      <SubmitButton> Create Order </SubmitButton>
    </template>
  </CarrierOrderForm>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import CarrierOrderForm from "../components/CarrierOrderForm.vue";
import { create_order, create_order_shipper } from "../api/orders.api";
import { useToastStore } from "@/store/toastStore";
import { useAuthStore } from "@/store/authStore";
import SubmitButton from "@/components/form/SubmitButton.vue";
import Button from "@/components/Button.vue";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
const queryClient = useQueryClient();
const mutation = useMutation({
  mutationFn: (values: any) => create_order(values),
});
const router = useRouter();
const toast = useToastStore();
const authStore = useAuthStore();

const initialValues = {
  shipper: "",
  route: "",
  productType: "",
  agent: "",
  commodity: [],
  packaging: "",
  vehicleType: "",
  tripType: "",
  priority: "",
  totalRequest: "",
  unitOfMeasurement: "",
  numberOfVehicles: "1",
  allocationNumber: "",
  remark: "",
};

const handleCreateOrder = async (values: any) => {
  const req = Array(values.numberOfVehicles)
    .fill(0)
    .map((el) => {
      return mutation.mutateAsync({ ...values, carrer: undefined });
    });
  const res = await Promise.all(req);
  if (res.some((el) => el.success)) {
    toast.success("Order created successfully");
    // invalidate orders query
    queryClient.invalidateQueries({ queryKey: ["order-list"] });
    router.push("/operation/orders");
  } else {
    toast.error(
      res.map((el) => el.error).join(", ") || "Failed to create order",
    );
  }
};
</script>
