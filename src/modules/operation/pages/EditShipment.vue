<template>
  <div v-if="isLoading" class="flex justify-center items-center py-20">
    <div
      class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"
    ></div>
  </div>
  <ShipmentForm
    v-else-if="initialValues"
    form-id="edit-shipment-form"
    :initial-values="initialValues"
    :labels="labels"
    :on-submit="handleUpdateShipment"
    mode="edit"
  >
    <template #order-selection-extra="{ form }">
      <div v-role="'ADMIN'">
        <SelectInput name="status" label="Status" :options="statusOptions" />
      </div>
      <SelectInput
        v-if="form.state.values.productType !== ProductType['Site Transfer']"
        name="agent"
        label="Agent"
        url="/agent"
        label_key="name"
        value_key="_id"
      />
    </template>

    <template #operational-details-extra="{ form }">
      <div
        class="col-span-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 border-t border-gray-100 pt-6 mt-2"
      >
        <div class="flex flex-col gap-4">
          <ToggleInput name="CKRF" label="CKRF" />
          <component
            :is="form.Subscribe"
            :selector="(state: any) => [state.values.CKRF]"
          >
            <template #default="[CKRF]">
              <Input
                v-if="CKRF"
                name="CKRFCode"
                label="CKRF Code"
                :validation="{ required }"
              />
            </template>
          </component>
        </div>
        <div class="flex items-center gap-4">
          <ToggleInput name="isDamaged" label="Is Damaged" />
          <component
            :is="form.Subscribe"
            :selector="(state: any) => state.values.isDamaged"
          >
            <template #default="isDamaged">
              <button
                v-if="isDamaged"
                type="button"
                class="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors w-fit"
                @click="openDamageReport"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                  />
                </svg>
                Damage Report
              </button>
            </template>
          </component>
        </div>
      </div>
    </template>

    <template #submit-btn="{ form }">
      <Button size="md" variant="outline" @click="router.back()">
        Cancel
      </Button>
      <SubmitButton> Save Changes </SubmitButton>
    </template>
  </ShipmentForm>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import ShipmentForm from "../components/ShipmentForm.vue";
import {
  fetch_shipment_details,
  update_shipment,
  update_shipment_shipper,
} from "../api/shipment.api";
import { useToastStore } from "@/store/toastStore";
import SubmitButton from "@/components/form/SubmitButton.vue";
import Button from "@/components/common/Button.vue";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import {
  ProductType,
  VehicleOwnership,
  ShipmentStatus,
} from "../operation.types";
import SelectInput from "@/components/form/SelectInput.vue";
import Input from "@/components/form/Input.vue";
import ToggleInput from "@/components/form/ToggleInput.vue";
import { useAuthStore } from "@/store/authStore";
import { required } from "@/utils/validations";
import { openModal } from "@customizer/modal-x";

const authStore = useAuthStore();

const router = useRouter();
const route = useRoute();
const toast = useToastStore();
const queryClient = useQueryClient();
const shipmentId = route.params.id as string;

const statusOptions = Object.entries(ShipmentStatus).map(([key, value]) => ({
  label: key.replace(/([A-Z])/g, " $1").trim(),
  value,
}));

async function openDamageReport() {
  await openModal("DamageReportModal", {
    shipmentId,
    shipperId: shipment.value?.shipper?._id || "",
    carrierId: shipment.value?.carrier?._id || "",
  });
}


const { data: shipment, isLoading } = useQuery({
  queryKey: ["shipment", shipmentId],
  queryFn: async () => {
    const res = await fetch_shipment_details(shipmentId);
    if (!res.success) throw new Error(res.error);
    return res.data;
  },
});

const initialValues = computed(() => {
  if (!shipment.value) return null;
  const data = shipment.value;
  return {
    orderCode: data.orderCode || "",
    order: data.order?._id || data.order || "",
    shipper: data.shipper?._id || data.shipper || "",
    route: data.route?._id || data.route || "",
    tripType: data.tripType || "",
    productType: data.productType || "",
    vehicleType: data.vehicleType?._id || data.vehicleType || "",
    packaging: data.packaging?._id || data.packaging || "",
    commodity: data.commodity?.map((c: any) => c._id || c) || [],
    waypoint: data.waypoint?._id || data.waypoint || "",
    freightOrder: data.freightOrder || "",
    dispatchWeight: data.dispatchWeight || "",
    vehicle: data.vehicle?._id || data.vehicle || "",
    odometerAtDispatch: data.odometerAtDispatch || "",
    dispatchDate: data.dispatchDate
      ? new Date(data.dispatchDate).toISOString().split("T")[0]
      : "",
    fuelReadingAtDispatch: data.fuelReadingAtDispatch || "",
    deadHole: data.deadHole || "",
    remark: data.remark || "",
    totalPrice: data.totalPrice?.toFixed(2) || "",
    // These are used for display in ShipmentForm and will be updated via handleOrderSelect or handleVehicleSelect
    driver: data.driver?._id,
    isDamaged: data.isDamaged,
    CKRF: data.CKRF,
    CKRFCode: data.CKRFCode || "",
    status: data.status,
    pricingType: data.pricingType?._id,
    ...(data.productType !== ProductType["Site Transfer"]
      ? {
          agent: data.agent?._id ?? null,
        }
      : {}),
    transporter:
      data.vehicle?.ownership == VehicleOwnership.Owned
        ? data.transporter?._id
        : null,
    transporterPrice:
      data.vehicle?.ownership == VehicleOwnership.Owned
        ? data.transporterPrice
        : null,
  };
});

const labels = computed(() => {
  if (!shipment.value) return {};
  const data = shipment.value;
  return {
    orderCode: data.orderCode || "",
    vehicle: data.vehicle?.plateNumber || "",
    waypoint: data.waypoint?.name || "",
    driver: data.driver
      ? `${data.driver.firstName} ${data.driver.middleName || ""} ${data.driver.lastName || ""}`.trim()
      : "",
    transporter: data.transporter?.name || data.transporter?.tradeName || "",
    commodity:
      data.commodity?.reduce((acc: any, c: any) => {
        acc[c._id || c] = c.name || c;
        return acc;
      }, {}) || {},
  };
});

const updateMutation = useMutation({
  mutationFn: (values: any) =>
    authStore.is_shipper
      ? update_shipment_shipper(shipmentId, values)
      : update_shipment(shipmentId, values),
});

const handleUpdateShipment = async (values: any, context: any) => {
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
    status: values.status,
    commodity: values.commodity, // Array of IDs for Edit
    pricingType: values.pricingType, // _id for Edit
    amount: values.amount,
    isDamaged: values.isDamaged,
  };

  if (values.CKRF) {
    payload.CKRFCode = values.CKRFCode;
  }

  if (productType !== ProductType["Site Transfer"]) {
    payload.agent = values.agent;
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

  const res = await updateMutation.mutateAsync(payload);
  if (res.success) {
    toast.success("Shipment updated successfully");
    queryClient.invalidateQueries({ queryKey: ["shipment", shipmentId] });
    const basePath = authStore.is_shipper
      ? "/shipper/shipments"
      : "/operation/shipments";
    router.push(`${basePath}/${shipmentId}`);
  } else {
    toast.error(res.error || "Failed to update shipment");
  }
};
</script>
