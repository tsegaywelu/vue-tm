<template>
  <OrderForm
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
  </OrderForm>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import OrderForm from "../components/OrderForm.vue";
import { create_order } from "../api/orders.api";
import { useToastStore } from "@/store/toastStore";
import SubmitButton from "@/components/form/SubmitButton.vue";
import Button from "@/components/Button.vue";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
const queryClient = useQueryClient();
const mutation = useMutation({
  mutationFn: (values: any) => create_order(values),
});
const router = useRouter();
const toast = useToastStore();

const initialValues = {
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
      return mutation.mutateAsync(values);
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
