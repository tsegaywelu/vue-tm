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
import { useMutation } from "@tanstack/vue-query";

const mutation = useMutation({
  mutationFn: (values: any) => create_order(values),
});
const router = useRouter();
const toast = useToastStore();

const initialValues = {
  carrier: "",
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
  const res = await mutation.mutateAsync(values);
  if (res.success) {
    toast.success("Order created successfully");
    router.push("/operation/orders");
  } else {
    toast.error(res.error || "Failed to create order");
  }
};
</script>
