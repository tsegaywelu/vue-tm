<template>
  <div v-if="isLoading" class="flex justify-center items-center py-20">
    <div
      class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"
    ></div>
  </div>
  <CarrierOrderForm
    v-else-if="initialValues"
    form-id="edit-order-form"
    :initial-values="initialValues"
    :labels="labels"
    :preloaded-route-details="routeDetails"
    :on-submit="handleUpdateOrder"
  >
    <template #submit-btn="{ form }">
      <Button size="md" variant="outline" @click="router.back()">
        Cancel
      </Button>
      <SubmitButton> Save Changes </SubmitButton>
    </template>
  </CarrierOrderForm>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import CarrierOrderForm from "../components/CarrierOrderForm.vue";
import { fetch_order_by_id, update_order, update_order_shipper } from "../api/orders.api";
import { useToastStore } from "@/store/toastStore";
import { useAuthStore } from "@/store/authStore";
import SubmitButton from "@/components/form/SubmitButton.vue";
import Button from "@/components/Button.vue";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { fetch_contract_route_details } from "../api/orders.api";

const queryClient = useQueryClient();
const router = useRouter();
const route = useRoute();
const toast = useToastStore();
const authStore = useAuthStore();
const orderId = route.params.id as string;

const { data: order, isLoading } = useQuery({
  queryKey: ["order", orderId],
  queryFn: async () => {
    const res = await fetch_order_by_id(orderId);
    if (!res.success) throw new Error(res.error);
    return res.data;
  },
});

const { data: routeDetails, isLoading: isRouteDetailsLoading } = useQuery({
  queryKey: ["contract-route-details", orderId],
  queryFn: async () => {
    if (!order.value) return null;
    const shipperId = order.value.shipper?._id;
    const routeId = order.value.route?._id;
    if (!shipperId || !routeId) return null;
    const res = await fetch_contract_route_details(shipperId, routeId);
    return res.data;
  },
  enabled: computed(() => !!order.value),
});

const initialValues = computed(() => {
  if (!order.value) return null;
  const data = order.value;
  return {
    shipper: data.shipper?._id || "",
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
    numberOfVehicles: +data.numberOfVehicles,
    allocationNumber: (data as any).allocationNumber || "",
    remark: data.remark || "",
  };
});

const labels = computed(() => {
  if (!order.value) return {};
  const data = order.value;
  return {
    shipper: data.shipper?.name || "",
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
    queryClient.invalidateQueries({ queryKey: ["order", orderId] });
    queryClient.invalidateQueries({ queryKey: ["order-list"] });
    router.push("/operation/orders");
  } else {
    toast.error(res.error || "Failed to update order");
  }
};
</script>
