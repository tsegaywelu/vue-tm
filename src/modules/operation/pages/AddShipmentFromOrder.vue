<template>
  <div v-if="isLoading" class="flex justify-center items-center py-20">
    <div
      class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"
    ></div>
  </div>
  <ShipmentForm
    v-else-if="initialValues"
    form-id="add-shipment-from-order-form"
    :initial-values="initialValues"
    :labels="labels"
    :on-submit="handleCreateShipment"
  >
    <template #submit-btn="{ form }">
      <Button size="md" variant="outline" @click="router.back()">
        Cancel
      </Button>
      <SubmitButton> Create Shipment </SubmitButton>
    </template>
  </ShipmentForm>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import ShipmentForm from "../components/ShipmentForm.vue";
import { create_shipment } from "../api/shipment.api";
import { fetch_order_by_id } from "../api/orders.api";
import { useToastStore } from "@/store/toastStore";
import SubmitButton from "@/components/form/SubmitButton.vue";
import Button from "@/components/Button.vue";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";

const router = useRouter();
const route = useRoute();
const toast = useToastStore();
const queryClient = useQueryClient();
const orderId = route.params.orderId as string;

const mutation = useMutation({
  mutationFn: (values: any) => create_shipment(values),
});

const { data: order, isLoading } = useQuery({
  queryKey: ["order-for-shipment", orderId],
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
    order: data._id,
    orderCode: data.orderCode,
    shipper: data.shipper?._id || "",
    route: data.route?._id || "",
    tripType: data.tripType || "",
    productType: data.productType || "",
    vehicleType: data.vehicleType?._id || "",
    packaging: data.packaging?._id || "",
    commodity: data.commodity?.map((c: any) => c._id || c) || [],
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
});

const labels = computed(() => {
  if (!order.value) return {};
  const data = order.value;
  return {
    orderCode: data.orderCode || "",
    commodity:
      data.commodity?.reduce((acc: any, c: any) => {
        acc[c._id || c] = c.name || c;
        return acc;
      }, {}) || {},
  };
});

const handleCreateShipment = async (values: any, context?: any) => {
  const { selectedOrder, filteredPricingType } = context || {};

  const payload: any = {
    order: values.order,
    orderCode: values.orderCode,
    shipper: values.shipper,
    driver: values.driver,
    vehicleType: values.vehicleType,
    route: values.route,
    productType: values.productType,
    tripType: values.tripType,
    packaging: values.packaging,
    vehicle: values.vehicle,
    waypoint: values.waypoint,
    freightOrder: values.freightOrder,
    dispatchWeight: Number(values.dispatchWeight) || 0,
    odometerAtDispatch: Number(values.odometerAtDispatch) || 0,
    fuelReadingAtDispatch: Number(values.fuelReadingAtDispatch) || 0,
    deadHole: Math.max(0, Number(values.deadHole) || 0),
    dispatchDate: values.dispatchDate,
    remark: values.remark,
    totalPrice: Number(values.totalPrice) || 0,
    CKRF: !!values.CKRF,
    commodity: selectedOrder?.commodity || values.commodity,
    pricingType: {
      type: filteredPricingType?.type || "per_kilometer",
      amount: filteredPricingType?.pricePerUnit || 0,
    },
  };

  const res = await mutation.mutateAsync(payload);
  if (res.success) {
    toast.success("Shipment created successfully");
    queryClient.invalidateQueries({ queryKey: ["shipment-list"] });
    router.push("/operation/shipments");
  } else {
    toast.error(res.error || "Failed to create shipment");
  }
};
</script>
