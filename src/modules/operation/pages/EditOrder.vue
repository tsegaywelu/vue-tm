<template>
  <div v-if="isLoading" class="flex justify-center items-center py-20">
    <div
      class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"
    ></div>
  </div>
  <OrderForm
    v-else-if="initialValues"
    form-id="edit-order-form"
    :initial-values="initialValues"
    :labels="labels"
    :on-submit="handleUpdateOrder"
  >
    <template #submit-btn="{ form }">
      <Button size="md" variant="outline" @click="router.back()">
        Cancel
      </Button>
      <SubmitButton> Save Changes </SubmitButton>
    </template>
  </OrderForm>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import OrderForm from "../components/OrderForm.vue";
import { fetch_order_by_id, update_order } from "../api/orders.api";
import { useToastStore } from "@/store/toastStore";
import SubmitButton from "@/components/form/SubmitButton.vue";
import Button from "@/components/Button.vue";
import { useMutation, useQuery } from "@tanstack/vue-query";

const router = useRouter();
const route = useRoute();
const toast = useToastStore();
const orderId = route.params.id as string;

const { data: order, isLoading } = useQuery({
  queryKey: ["order", orderId],
  queryFn: async () => {
    const res = await fetch_order_by_id(orderId);
    if (!res.success) throw new Error(res.error);
    return res.data;
  },
});

const initialValues = computed(() => {
  if (!order.value) return null;
  const data = order.value;
  return {
    carrier: data.carrier?._id || "",
    route: data.route?._id || "",
    productType: data.productType || "",
    agent: data.agent?._id || "",
    commodity: data.commodity?.map((c: any) => c._id || c) || [],
    packaging: data.packaging?._id || "",
    vehicleType: data.vehicleType?._id || "",
    tripType: data.tripType || "",
    priority: data.priority || "",
    totalRequest: data.totalRequest || "",
    unitOfMeasurement: data.unitOfMeasurement || "",
    numberOfVehicles: data.numberOfVehicles || "1",
    allocationNumber: (data as any).allocationNumber || "",
    remark: data.remark || "",
  };
});

const labels = computed(() => {
  if (!order.value) return {};
  const data = order.value;
  return {
    carrier: data.carrier?.name || "",
    route: data.route?.routeName || "",
    agent: data.agent?.name || "",
    packaging: data.packaging?.name || "",
    vehicleType: data.vehicleType?.name || "",
    commodity:
      data.commodity?.reduce((acc: any, c: any) => {
        acc[c._id || c] = c.name || c;
        return acc;
      }, {}) || {},
  };
});

const updateMutation = useMutation({
  mutationFn: (values: any) => update_order(orderId, values),
});

const handleUpdateOrder = async (values: any) => {
  const res = await updateMutation.mutateAsync(values);
  if (res.success) {
    toast.success("Order updated successfully");
    router.push("/operation/orders");
  } else {
    toast.error(res.error || "Failed to update order");
  }
};
</script>
