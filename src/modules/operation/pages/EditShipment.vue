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
        <div class="flex flex-col gap-4">
          <ToggleInput
            name="isDamaged"
            label="Is Damaged"
            :on_change="(val) => handleDamageToggle(val, form)"
          />
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
import { computed, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import ShipmentForm from "../components/ShipmentForm.vue";
import { fetch_shipment_details, update_shipment } from "../api/shipment.api";
import { useToastStore } from "@/store/toastStore";
import SubmitButton from "@/components/form/SubmitButton.vue";
import Button from "@/components/common/Button.vue";
import { useMutation, useQuery } from "@tanstack/vue-query";
import {
  ProductType,
  VehicleOwnership,
  ShipmentStatus,
} from "../operation.types";
import SelectInput from "@/components/form/SelectInput.vue";
import Input from "@/components/form/Input.vue";
import ToggleInput from "@/components/form/ToggleInput.vue";
import { required } from "@/utils/validations";
import { openModal } from "@customizer/modal-x";

const router = useRouter();
const route = useRoute();
const toast = useToastStore();
const shipmentId = route.params.id as string;

const statusOptions = Object.entries(ShipmentStatus).map(([key, value]) => ({
  label: key.replace(/([A-Z])/g, " $1").trim(),
  value,
}));

async function handleDamageToggle(val: any, form: any) {
  if (val) {
    const success = await openModal("DamageReportModal", {
      shipmentId,
    });
    if (!success) {
      form.setFieldValue("isDamaged", false);
    } else {
      form.setFieldValue("isDamaged", true);
    }
  }
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
    driver: data.driver._id,
    isDamaged: data.isDamaged,
    CKRF: data.CKRF,
    CKRFCode: data.CKRFCode || "",
    status: data.status,
    pricingType: data.pricingType._id,
    ...(data.productType !== ProductType["Site Transfer"]
      ? {
          agent: data.agent?._id ?? null,
        }
      : {}),
    transporter:
      data.vehicle.ownership == VehicleOwnership.Owned
        ? data.transporter?._id
        : null,
    transporterPrice:
      data.vehicle.ownership == VehicleOwnership.Owned
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
  mutationFn: (values: any) => update_shipment(shipmentId, values),
});

const handleUpdateShipment = async (values: any) => {
  const res = await updateMutation.mutateAsync(values);
  if (res.success) {
    toast.success("Shipment updated successfully");
    router.push(`/operation/shipments`);
  } else {
    toast.error(res.error || "Failed to update shipment");
  }
};
</script>
