<template>
  <ShipperOrderForm
    form-id="shipper-add-order-form"
    :initial-values="initialValues"
    :on-submit="handleCreateOrder"
  >
    <template #submit-btn="{ form }">
      <Button size="md" variant="outline" @click="router.back()">
        Discard
      </Button>
      <SubmitButton> Create Order </SubmitButton>
    </template>
  </ShipperOrderForm>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import ShipperOrderForm from "../components/ShipperOrderForm.vue";
import { create_order_shipper } from "../../operation/api/orders.api";
import { useToastStore } from "@/store/toastStore";
import SubmitButton from "@/components/form/SubmitButton.vue";
import Button from "@/components/Button.vue";
import { useMutation, useQueryClient } from "@tanstack/vue-query";

const queryClient = useQueryClient();
const router = useRouter();
const toast = useToastStore();

const mutation = useMutation({
  mutationFn: (values: any) => create_order_shipper(values),
});

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
  const reqCount = Number(values.numberOfVehicles) || 1;
  const requests = Array(reqCount)
    .fill(0)
    .map(() => mutation.mutateAsync(values));

  try {
    const results = await Promise.all(requests);
    if (results.some((res) => res.success)) {
      toast.success("Order(s) created successfully");
      queryClient.invalidateQueries({ queryKey: ["order-list"] });
      queryClient.invalidateQueries({ queryKey: ["shipment-list"] });
      router.push("/shipper/orders");
    } else {
      toast.error(results[0]?.error || "Failed to create order");
    }
  } catch (error: any) {
    toast.error(error.message || "An error occurred");
  }
};
</script>
