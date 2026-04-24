<template>
  <Form :id="formId" :values="initialValues" :onSubmit="handleSubmit">
    <template #default="{ form }">
      <Colapsable
        title="Order Selection"
        description="Select a pending order to automatically populate core shipment details."
      >
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SelectInput
            name="orderCode"
            searchable
            label="Select Order Code"
            :attributes="{
              placeholder: 'Choose pending order',
            }"
            label_key="orderCode"
            value_key="orderCode"
            url="/order"
            :validation="{
              required: (val: string) => required(val),
            }"
            @select="(opt) => handleOrderSelect(opt.item, form)"
          />

          <SelectInput
            parent_class_name="[&_.input-focus]:bg-grey-25!"
            name="shipper"
            label="Shipper"
            :attributes="{
              placeholder: 'Auto filled values based on selected order',
              disabled: true,
            }"
            :validation="{
              required: (val: string) => required(val),
            }"
          />

          <Input
            input_style="[&_input]:bg-grey-25"
            name="route"
            label="Route"
            :attributes="{
              placeholder: 'Auto filled values based on selected order',
              disabled: true,
            }"
            :validation="{
              required: (val: string) => required(val),
            }"
          />

          <Input
            input_style="[&_input]:bg-grey-25"
            name="tripType"
            label="Trip Type"
            :attributes="{
              disabled: true,
              placeholder: 'Auto filled values based on selected order',
            }"
            :validation="{
              required: (val: string) => required(val),
            }"
          />

          <Input
            input_style="[&_input]:bg-grey-25"
            name="productType"
            label="Product Type"
            :attributes="{
              disabled: true,
              placeholder: 'Auto filled values based on selected order',
            }"
            :validation="{
              required: (val: string) => required(val),
            }"
          />

          <Input
            input_style="[&_input]:bg-grey-25"
            name="vehicleType"
            label="Vehicle Type"
            :attributes="{
              disabled: true,
              placeholder: 'Auto filled values based on selected order',
            }"
            :validation="{
              required: (val: string) => required(val),
            }"
          />

          <Input
            input_style="[&_input]:bg-grey-25"
            name="commodity"
            label="Commodity"
            :attributes="{
              disabled: true,
              placeholder: 'Auto filled values based on selected order',
            }"
            :validation="{
              required: (val: string) => required(val),
            }"
          />

          <Input
            input_style="[&_input]:bg-grey-25"
            name="packaging"
            label="Packaging"
            :attributes="{
              disabled: true,
              placeholder: 'Auto filled values based on selected order',
            }"
            :validation="{
              required: (val: string) => required(val),
            }"
          />
        </div>
      </Colapsable>

      <!-- 2. Logistics & Pricing Section -->
      <Colapsable
        title="Logistics & Pricing"
        description="Define waypoints, weight, and verify calculated costs."
      >
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SelectInput
            name="waypoint"
            label="Target Waypoint"
            :attributes="{
              placeholder: 'Select waypoint',
            }"
            :options="waypointOptions"
            @select="(opt) => handleWaypointChange(opt.value, form)"
            :validation="{
              required: (val: string) => required(val),
            }"
          />

          <Input
            name="freightOrder"
            label="Freight Order"
            :attributes="{
              placeholder: 'Enter freight order number',
            }"
            :validation="{
              required: (val: string) => required(val),
            }"
          />

          <Input
            name="dispatchWeight"
            label="Dispatch Weight"
            :attributes="{
              placeholder: '0.00',
              type: 'number',
            }"
            :on_change="
              (val) => updateTotalPrice(form, { dispatchWeight: val })
            "
            :validation="{
              required: (val: string) => required(val),
            }"
          />

          <div
            v-if="filteredPricingType"
            class="col-span-full bg-primary/5 rounded-3xl p-6 border border-primary/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div class="flex items-center gap-4 text-primary">
              <div
                class="size-12 rounded-2xl bg-primary/10 flex items-center justify-center"
              >
                <i class="mdi mdi-calculator text-2xl"></i>
              </div>
              <div>
                <p
                  class="text-xs font-bold uppercase tracking-widest opacity-60"
                >
                  Base Pricing Model
                </p>
                <p class="text-xl font-black">
                  {{ currencyFormatter(filteredPricingType.pricePerUnit) }}
                  <span class="text-sm font-medium opacity-70"
                    >/ {{ formatType(filteredPricingType.type) }}</span
                  >
                </p>
              </div>
            </div>

            <div class="text-left md:text-right">
              <p class="text-xs font-bold uppercase tracking-widest opacity-60">
                Estimated Total Cost
              </p>
              <p class="text-3xl font-black text-primary">
                {{ currencyFormatter(+calculateTotalPrice(form.state.values)) }}
              </p>
            </div>
          </div>
        </div>
      </Colapsable>

      <!-- 3. Vehicle & Carrier Assignment -->
      <Colapsable
        title="Vehicle & Carrier"
        description="Assign a vehicle and verify driver and transporter information."
      >
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SelectInput
            name="vehicle"
            label="Search Vehicles"
            :attributes="{
              placeholder: 'Choose vehicle',
            }"
            label_key="plateNumber"
            value_key="_id"
            url="/vehicle"
            :validation="{
              required: (val: string) => required(val),
            }"
            @select="(opt) => handleVehicleSelect(opt.item, form)"
          >
            <template #item="{ item }">
              <span>
                {{ item.plateNumber }} - {{ item.vehicleType?.name }} ({{
                  item.driver.firstName
                }})
              </span>
            </template>
          </SelectInput>

          <Input
            input_style="[&_input]:bg-grey-25"
            name="driver"
            label="Driver"
            :attributes="{
              disabled: true,
              placeholder: 'Auto filled based on selected vehicle',
            }"
            :validation="{
              required: (val: string) => required(val),
            }"
          />

          <Input
            input_style="[&_input]:bg-grey-25"
            v-if="selectedVehicleOwnership !== 'Owned'"
            name="transporter"
            label="Transporter"
            :attributes="{
              disabled: true,
              placeholder: 'Auto filled based on selected vehicle',
            }"
            :validation="{
              required: (val: string) => required(val),
            }"
          />

          <Input
            v-if="selectedVehicleOwnership === 'Rental'"
            name="transporterPrice"
            label="Transporter Price"
            :attributes="{
              placeholder: '0.00',
              type: 'number',
            }"
            :validation="{
              required: (val: string) => required(val),
            }"
          />
        </div>
      </Colapsable>

      <!-- 4. Operational Dispatch Details -->
      <Colapsable
        title="Operational Details"
        description="Finalize dispatch information such as date, odometer readings, and remarks."
      >
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Input
            v-if="selectedVehicleOwnership !== 'Rental'"
            name="odometerAtDispatch"
            label="Odometer at Dispatch"
            :attributes="{
              placeholder: '0',
              type: 'number',
            }"
            :validation="{
              required: (val: string) => required(val),
            }"
          />

          <DateInput
            name="dispatchDate"
            label="Dispatch Date"
            :validation="{
              required: (val: string) => required(val),
            }"
          />

          <Input
            v-if="selectedVehicleOwnership !== 'Rental'"
            name="fuelReadingAtDispatch"
            label="Fuel Reading"
            :attributes="{
              placeholder: '0',
              type: 'number',
            }"
            :validation="{
              required: (val: string) => required(val),
            }"
          />

          <Input
            name="deadHole"
            label="Dead Haul"
            :attributes="{
              placeholder: '0',
              type: 'number',
            }"
            :validation="{
              required: (val: string) => required(val),
            }"
          />

          <Input
            input_style="[&_input]:bg-grey-25"
            name="totalPrice"
            label="Total Price"
            :attributes="{
              placeholder: 'Auto-calculated from pricing model',
              disabled: true,
            }"
            :validation="{
              required: (val: string) => required(val),
            }"
          />

          <TextareaInput
            parent_class_name="col-span-3"
            name="remark"
            label="Remarks & Special Instructions"
            :attributes="{
              placeholder: 'Enter remarks or any additional notes...',
            }"
          />
        </div>
      </Colapsable>

      <!-- Action Footer -->
      <div class="pt-10 flex justify-end gap-4">
        <slot :form="form" name="submit-btn"></slot>
      </div>
    </template>
  </Form>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import Form from "@/components/form/Form.vue";
import Input from "@/components/form/Input.vue";
import SelectInput from "@/components/form/SelectInput.vue";
import DateInput from "@/components/form/DateInput.vue";
import TextareaInput from "@/components/form/TextareaInput.vue";
import Colapsable from "@/components/common/Colapsable.vue";
import { currencyFormatter } from "@/utils/utils";
import { icons } from "@/utils/icons";
import { raaz_icons } from "@/utils/raaz_icons";
import { required } from "@/utils/validations";
import type { Order } from "../operation.types";
import { PricingType } from "../operation.types";
import { fetch_order_by_id } from "../api/orders.api";
const all_icons = { ...icons, ...raaz_icons };

const props = defineProps<{
  formId: string;
  initialValues: Record<string, any>;
  onSubmit: (values: any) => Promise<void> | void;
}>();

const emit = defineEmits<{
  (e: "cancel"): void;
}>();

const selectedOrder = ref<Order | null>(null);
const selectedVehicle = ref<any>(null);
const filteredPricingType = ref<any>(null);

const waypointOptions = computed(() => {
  if (!selectedOrder.value?.waypoints) return [];
  return selectedOrder.value.waypoints.map(({ waypoint }) => ({
    label: waypoint.name,
    value: waypoint._id,
  }));
});

const selectedVehicleOwnership = computed(
  () => selectedVehicle.value?.ownership,
);

const formatType = (type: string) => {
  if (!type) return "";
  return type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
};

const handleOrderSelect = async (order: Order, form: any) => {
  const order_data = await fetch_order_by_id(order._id);
  const order_record = order_data.data as any as Order | undefined;

  selectedOrder.value = order_record ?? null;

  if (order_record) {
    form.setFieldValue("order", order_record._id || "");
    form.setFieldValue("shipper", order_record.shipper?._id || "");
    form.setFieldValue("route", order_record.route?._id || "");
    form.setFieldValue("tripType", formatType(order_record.tripType));
    form.setFieldValue("productType", formatType(order_record.productType));
    form.setFieldValue("vehicleType", order_record.vehicleType?._id || "");
    form.setFieldValue("packaging", order_record.packaging?._id || "");
    form.setFieldValue("commodity", order_record.commodity);
  }
  form.setFieldValue("waypoint", "");
  filteredPricingType.value = null;
};

const handleWaypointChange = (val: string, form: any) => {
  if (!selectedOrder.value || !val) {
    filteredPricingType.value = null;
    form?.setFieldValue("totalPrice", "");
    return;
  }

  const wp = selectedOrder.value.waypoints.find((w) => w.waypoint._id === val);

  if (wp?.vehiclePricing) {
    const vp = wp.vehiclePricing.find(
      (pricing) =>
        pricing.vehicleType === selectedOrder.value?.vehicleType._id &&
        pricing.productType === selectedOrder.value?.productType,
    );
    filteredPricingType.value = vp;
  } else {
    filteredPricingType.value = null;
  }

  updateTotalPrice(form);
};

const updateTotalPrice = (form: any, overrides?: Record<string, any>) => {
  if (!form) return;
  const values = { ...form.state.values, ...overrides };
  const total = calculateTotalPrice(values);
  form.setFieldValue("totalPrice", +total > 0 ? String(total) : "");
};

const handleVehicleSelect = (vehicle: any, form: any) => {
  selectedVehicle.value = vehicle;

  const { firstName, middleName, lastName } = vehicle.driver || {};
  const driverName =
    [firstName, middleName, lastName].filter(Boolean).join(" ") ||
    "Not Assigned";

  form.setFieldValue("driver", driverName);
  form.setFieldValue("transporter", vehicle.transporter?.name || "");
};

const calculateTotalPrice = (values: any) => {
  if (!filteredPricingType.value || !selectedOrder.value) return 0;

  const { pricePerUnit, type } = filteredPricingType.value;

  if (type === PricingType.PerKilometer) {
    const order = selectedOrder.value!;
    const wp = order.waypoints.find((w) => w.waypoint._id === values.waypoint);
    const distance = wp?.waypoint?.distance || 0;

    return (distance * pricePerUnit).toFixed(2);
  }

  if (type === PricingType.PerQuintal && values.dispatchWeight) {
    return (pricePerUnit * Number(values.dispatchWeight)).toFixed(2);
  }

  return 0;
};

const handleSubmit = async (values: any) => {
  const payload = {
    ...values,
    shipper: selectedOrder.value?.shipper?._id,
    driver: selectedVehicle.value?.driver?._id,
    transporter: selectedVehicle.value?.transporter?._id,
    vehicleType: selectedOrder.value?.vehicleType?._id,
    route: selectedOrder.value?.route?._id,
    productType: selectedOrder.value?.productType,
    tripType: selectedOrder.value?.tripType,
    packaging: selectedOrder.value?.packaging?._id,
    totalPrice: Number(values.totalPrice) || calculateTotalPrice(values),
    dispatchWeight: Number(values.dispatchWeight) || 0,
    odometerAtDispatch: Number(values.odometerAtDispatch) || 0,
    fuelReadingAtDispatch: Number(values.fuelReadingAtDispatch) || 0,
    deadHole: Math.max(0, Number(values.deadHole) || 0),
    transporterPrice: values.transporterPrice
      ? Number(values.transporterPrice)
      : undefined,
    pricingType: filteredPricingType.value?.type || PricingType.PerKilometer,
  };

  await props.onSubmit(payload);
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
