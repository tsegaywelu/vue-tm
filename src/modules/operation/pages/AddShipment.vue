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
import { create_shipment, create_shipment_shipper } from "../api/shipment.api";
import { useToastStore } from "@/store/toastStore";
import { useAuthStore } from "@/store/authStore";
import SubmitButton from "@/components/form/SubmitButton.vue";
import Button from "@/components/Button.vue";
import { useMutation } from "@tanstack/vue-query";

const authStore = useAuthStore();
const mutation = useMutation({
  mutationFn: (values: any) => create_shipment(values),
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

const handleCreateShipment = async (values: any, context: any) => {
  const { selectedOrder, selectedVehicle, filteredPricingType } = context;

  const shipperId = selectedOrder?.shipper?._id || values.shipper;
  const driverId = selectedVehicle?.driver?._id || values.driver;
  const transporterId = selectedVehicle?.transporter?._id || values.transporter;
  const vehicleTypeId = selectedOrder?.vehicleType?._id || values.vehicleType;
  const routeId = selectedOrder?.route?._id || values.route;
  const productType = selectedOrder?.productType || values.productType;
  const tripType = selectedOrder?.tripType || values.tripType;
  const packagingId = selectedOrder?.packaging?._id || values.packaging;
  const vehicleId = selectedVehicle?._id || values.vehicle;

  const payload: any = {
    order: values.order,
    orderCode: values.orderCode,
    shipper: shipperId,
    driver: driverId,
    vehicleType: vehicleTypeId,
    route: routeId,
    productType: productType,
    tripType: tripType,
    packaging: packagingId,
    vehicle: vehicleId,
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

  if (values.CKRF) {
    payload.CKRFCode = values.CKRFCode;
  }

  const isVehicleOwned = selectedVehicle
    ? selectedVehicle.ownership === "Owned"
    : false;

  if (!isVehicleOwned) {
    payload.transporter = transporterId;
    payload.transporterPrice = values.transporterPrice
      ? Number(values.transporterPrice)
      : undefined;
  } else {
    payload.transporter = null;
    payload.transporterPrice = null;
  }

  const res = await mutation.mutateAsync(payload);
  if (res.success) {
    toast.success("Shipment created successfully");
    const basePath = authStore.is_shipper
      ? "/shipper/shipments"
      : "/operation/shipments";
    router.push(basePath);
  } else {
    toast.error(res.error || "Failed to create shipment");
  }
};
</script>
