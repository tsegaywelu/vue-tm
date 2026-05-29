<template>
  <Form
    ref="formRef"
    :id="formId"
    :values="formInitialValues"
    :onSubmit="handleSubmit"
  >
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
            :display_value="internalLabels.orderCode"
            :validation="{
              required,
            }"
            @select="(opt) => handleOrderSelect(opt.item, form)"
          />

          <!-- shipper -->
          <ShipperInput
            v-if="props.mode === 'edit'"
            name="shipper"
            label="Shipper"
            searchable
            label_key="shipper.name"
            value_key="shipper._id"
            :display_value="internalLabels.shipper"
            :validation="{ required }"
          />
          <SelectInput
            v-else
            parent_class_name="[&_.input-focus]:bg-grey-25!"
            name="shipper"
            label="Shipper"
            hide_icon
            :options="autoFilledOptions.shipper"
            :display_value="internalLabels.shipper"
            :attributes="{
              placeholder: 'Auto filled values based on selected order',
              disabled: true,
            }"
            :validation="{ required }"
          />

          <!-- route (depends on current shipper value) -->
          <template v-if="props.mode === 'edit'">
            <component
              :is="form.Subscribe"
              :selector="(state: any) => [state.values.shipper]"
            >
              <template #default="[shipper]">
                <SelectInput
                  :key="`route-${shipper}`"
                  name="route"
                  label="Route"
                  searchable
                  :params="
                    (state) => {
                      return {
                        routeName: {
                          regexAny: state.search,
                        },
                        sort: 'shipmentCount',
                        q: undefined,
                      };
                    }
                  "
                  :url="shipper ? `/route/shipper/${shipper}` : '/route'"
                  label_key="routeName"
                  value_key="_id"
                  :display_value="internalLabels.route"
                  :validation="{ required }"
                />
              </template>
            </component>
          </template>
          <SelectInput
            v-else
            parent_class_name="[&_.input-focus]:bg-grey-25!"
            name="route"
            label="Route"
            hide_icon
            :options="autoFilledOptions.route"
            :display_value="internalLabels.route"
            :attributes="{
              placeholder: 'Auto filled values based on selected order',
              disabled: true,
            }"
            :validation="{ required }"
          />

          <!-- tripType: full enum options in edit, single auto-filled option in add -->
          <SelectInput
            :parent_class_name="
              props.mode !== 'edit' ? '[&_.input-focus]:bg-grey-25!' : ''
            "
            name="tripType"
            label="Trip Type"
            :hide_icon="props.mode !== 'edit'"
            :options="
              props.mode === 'edit'
                ? tripTypeOptions
                : autoFilledOptions.tripType
            "
            :display_value="internalLabels.tripType"
            :attributes="{
              disabled: props.mode !== 'edit',
              placeholder:
                props.mode === 'edit'
                  ? 'Select trip type'
                  : 'Auto filled values based on selected order',
            }"
            :validation="{ required }"
          />

          <!-- productType: full enum options in edit, single auto-filled option in add -->
          <SelectInput
            :parent_class_name="
              props.mode !== 'edit' ? '[&_.input-focus]:bg-grey-25!' : ''
            "
            name="productType"
            label="Product Type"
            :hide_icon="props.mode !== 'edit'"
            :options="
              props.mode === 'edit'
                ? productTypeOptions
                : autoFilledOptions.productType
            "
            :display_value="internalLabels.productType"
            :attributes="{
              disabled: props.mode !== 'edit',
              placeholder:
                props.mode === 'edit'
                  ? 'Select product type'
                  : 'Auto filled values based on selected order',
            }"
            :validation="{ required }"
          />

          <!-- vehicleType -->
          <VehicleTypeInput
            v-if="props.mode === 'edit'"
            name="vehicleType"
            :display_value="internalLabels.vehicleType"
            :validation="{ required }"
          />
          <SelectInput
            v-else
            parent_class_name="[&_.input-focus]:bg-grey-25!"
            name="vehicleType"
            label="Vehicle Type"
            hide_icon
            :options="autoFilledOptions.vehicleType"
            :display_value="internalLabels.vehicleType"
            :attributes="{
              disabled: true,
              placeholder: 'Auto filled values based on selected order',
            }"
            :validation="{ required }"
          />

          <!-- commodity -->
          <CommodityInput
            v-if="props.mode === 'edit'"
            name="commodity"
            multiple
            :initial_labels="internalLabels.commodity"
            :validation="{ required: (val: any) => required(val) }"
          />
          <SelectInput
            v-else
            parent_class_name="[&_.input-focus]:bg-grey-25!"
            name="commodity"
            label="Commodity"
            multiple
            hide_icon
            :options="autoFilledOptions.commodity"
            :initial_labels="internalLabels.commodity"
            :attributes="{
              disabled: true,
              placeholder: 'Auto filled values based on selected order',
            }"
            :validation="{ required: (val: any) => required(val) }"
          />

          <!-- packaging -->
          <PackagingInput
            v-if="props.mode === 'edit'"
            name="packaging"
            :display_value="internalLabels.packaging"
            :validation="{ required }"
            :params="
              (state) => ({
                limit: undefined,
                page: undefined,
                q: undefined,
                name: state.search,
              })
            "
          />
          <SelectInput
            v-else
            parent_class_name="[&_.input-focus]:bg-grey-25!"
            name="packaging"
            label="Packaging"
            hide_icon
            :options="autoFilledOptions.packaging"
            :display_value="internalLabels.packaging"
            :attributes="{
              disabled: true,
              placeholder: 'Auto filled values based on selected order',
            }"
            :validation="{ required }"
          />
          <slot name="order-selection-extra" :form="form"></slot>
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
            :display_value="internalLabels.waypoint"
            @select="(opt) => handleWaypointChange(opt.value, form)"
            :validation="{
              required,
            }"
          />

          <Input
            name="freightOrder"
            label="Freight Order"
            :attributes="{
              placeholder: 'Enter freight order number',
            }"
            :validation="{
              required,
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
              required,
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
          <div class="relative">
            <button
              type="button"
              class="absolute top-0 right-0 text-primary text-[10px] font-black uppercase tracking-wider hover:underline z-10"
              @click="openRegistrationModal(form)"
            >
              Add New
            </button>

            <VehicleInput
              name="vehicle"
              label="Search Vehicles"
              :params="{ operationalRole: 'SHIPMENT,BOTH' }"
              :options="selectedVehicle ? [selectedVehicle] : []"
              :display_value="internalLabels.vehicle"
              :validation="{ required }"
              @select="(opt: any) => handleVehicleSelect(opt.item, form)"
            >
              <template #item="{ item }">
                <span>
                  {{ item.plateNumber }} - {{ item.vehicleType?.name }} ({{
                    item.driver.firstName
                  }})
                </span>
              </template>
            </VehicleInput>
          </div>

          <DriverInput
            v-if="props.mode === 'edit'"
            name="driver"
            :display_value="internalLabels.driver"
            :validation="{ required }"
            :params="
              (state: any) => ({
                name: { regexAny: state.search },
                q: undefined,
              })
            "
          />
          <SelectInput
            v-else
            parent_class_name="[&_.input-focus]:bg-grey-25!"
            name="driver"
            label="Driver"
            hide_icon
            :display_value="internalLabels.driver"
            :attributes="{
              disabled: true,
              placeholder: 'Auto filled based on selected vehicle',
            }"
            :validation="{ required }"
          />

          <SelectInput
            parent_class_name="[&_.input-focus]:bg-grey-25!"
            v-if="selectedVehicleOwnership !== VehicleOwnership.Owned"
            name="transporter"
            label="Transporter"
            hide_icon
            :display_value="internalLabels.transporter"
            :attributes="{
              disabled: true,
              placeholder: 'Auto filled based on selected vehicle',
            }"
            :validation="{
              required,
            }"
          />

          <Input
            v-if="selectedVehicleOwnership === VehicleOwnership.Rental"
            name="transporterPrice"
            label="Transporter Price"
            :attributes="{
              placeholder: '0.00',
            }"
            :validation="{
              required,
              price,
            }"
          />
        </div>
      </Colapsable>

      <!-- 4. Operational Dispatch Details -->
      <Colapsable
        title="Operational Details"
        description="Finalize dispatch information such as date, odometer readings, and remarks."
      >
        <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 *:min-w-0">
          <Input
            v-if="
              selectedVehicleOwnership === VehicleOwnership.Owned ||
              selectedVehicleOwnership === VehicleOwnership.Leased
            "
            name="odometerAtDispatch"
            label="Odometer at Dispatch"
            :attributes="{
              placeholder: '0',
              type: 'number',
            }"
            :validation="{
              required,
            }"
          />

          <DateInput
            name="dispatchDate"
            label="Dispatch Date"
            :validation="{
              required,
            }"
            :attributes="{
              placeholder: 'Select a Date',
            }"
          />

          <Input
            v-if="
              selectedVehicleOwnership === VehicleOwnership.Owned ||
              selectedVehicleOwnership === VehicleOwnership.Leased
            "
            name="fuelReadingAtDispatch"
            label="Fuel Reading"
            :attributes="{
              placeholder: '0',
              type: 'number',
            }"
            :validation="{
              required,
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
              required: (val: any) =>
                val !== '' && val !== null && val !== undefined
                  ? [true, '']
                  : [false, 'This field is required'],
            }"
          />

          <div class="relative lg:col-span-full xl:col-span-1">
            <button
              v-if="
                filteredPricingType &&
                +calculateTotalPrice(form.state.values) > 0
              "
              type="button"
              class="absolute top-0 right-0 text-primary text-[10px] font-black uppercase tracking-wider hover:underline z-10"
              @click="
                form.setFieldValue(
                  'totalPrice',
                  String(+calculateTotalPrice(form.state.values)),
                )
              "
            >
              Use Calculated Price from Contract
            </button>
            <Input
              name="totalPrice"
              label="Total Price"
              :attributes="{
                placeholder: 'Enter Total Price',
              }"
              :validation="{
                required,
                price,
              }"
            />
          </div>

          <div
            v-if="pricingWarning"
            class="col-span-full flex items-center gap-2 rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3 text-amber-800"
          >
            <i class="mdi mdi-alert-circle-outline text-lg text-amber-500"></i>
            <span class="text-xs font-medium">{{ pricingWarning }}</span>
          </div>

          <TextareaInput
            parent_class_name="col-span-full"
            name="remark"
            label="Remarks & Special Instructions"
            :attributes="{
              placeholder: 'Enter remarks or any additional notes...',
            }"
          />
          <slot name="operational-details-extra" :form="form"></slot>
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
import { ref, computed, onMounted, watch } from "vue";
import Form from "@/components/form/Form.vue";
import Input from "@/components/form/Input.vue";
import SelectInput from "@/components/form/SelectInput.vue";
import DateInput from "@/components/form/DateInput.vue";
import TextareaInput from "@/components/form/TextareaInput.vue";
import Colapsable from "@/components/common/Colapsable.vue";
import VehicleInput from "@/components/common/inputs/VehicleInput.vue";
import VehicleTypeInput from "@/components/common/inputs/VehicleTypeInput.vue";
import DriverInput from "@/components/common/inputs/DriverInput.vue";
import { currencyFormatter } from "@/utils/utils";
import {
  dateGreaterThanOrEqalToToday,
  price,
  required,
} from "@/utils/validations";
import type { Order } from "../operation.types";
import {
  PricingType,
  VehicleOwnership,
  TripType,
  ProductType,
} from "../operation.types";
import { fetch_order_by_id } from "../api/orders.api";
import { openModal } from "@customizer/modal-x";
import ApiService from "@/api/ApiService";
import ShipperInput from "@/components/common/inputs/ShipperInput.vue";
import CommodityInput from "@/components/common/inputs/CommodityInput.vue";
import PackagingInput from "@/components/common/inputs/PackagingInput.vue";

const props = withDefaults(
  defineProps<{
    formId: string;
    initialValues: Record<string, any>;
    labels?: Record<string, any>;
    onSubmit: (values: any, context?: any) => Promise<void> | void;
    mode?: "add" | "edit";
  }>(),
  {
    labels: () => ({}),
    mode: "add",
  },
);

const formInitialValues = computed(() => ({
  ...props.initialValues,
  ...(props.mode === "add" && { totalPrice: "" }),
}));

const internalLabels = ref({ ...props.labels });

watch(
  () => props.labels,
  (newLabels) => {
    internalLabels.value = { ...newLabels };
  },
  { deep: true, immediate: true },
);

const emit = defineEmits<{
  (e: "cancel"): void;
}>();

const selectedOrder = ref<Order | null>(null);
const selectedVehicle = ref<any>(null);
const formRef = ref<any>(null);
const filteredPricingType = ref<any>(null);
const pricingWarning = ref("");

const tripTypeOptions = [
  { label: "Round Trip", value: TripType.RoundTrip },
  { label: "Single Trip", value: TripType.SingleTrip },
];

const productTypeOptions = Object.entries(ProductType).map(([key, value]) => ({
  label: key,
  value,
}));

const waypointOptions = computed(() => {
  if (!selectedOrder.value?.waypoints) return [];
  return selectedOrder.value.waypoints.map(({ waypoint }) => ({
    label: waypoint.name,
    value: waypoint._id,
  }));
});

const autoFilledOptions = computed(() => {
  const order = selectedOrder.value;
  if (!order)
    return {
      shipper: [],
      route: [],
      vehicleType: [],
      tripType: [],
      productType: [],
      packaging: [],
      commodity: [],
    };

  return {
    shipper: [{ label: order.shipper.name, value: order.shipper._id }],
    route: [{ label: order.route.routeName, value: order.route._id }],
    vehicleType: [
      { label: order.vehicleType.name, value: order.vehicleType._id },
    ],
    tripType: [{ label: formatType(order.tripType), value: order.tripType }],
    productType: [
      { label: formatType(order.productType), value: order.productType },
    ],
    packaging: [{ label: order.packaging.name, value: order.packaging._id }],
    commodity: order.commodity.map((c: any) => ({
      label: c.name,
      value: c._id,
    })),
  };
});

const selectedVehicleOwnership = computed(
  () => selectedVehicle.value?.ownership,
);

const formatType = (type: string) => {
  if (!type) return "";
  return type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
};

const handleOrderSelect = async (order: Order, form: any) => {
  console.log(order);
  const order_data = await fetch_order_by_id(order._id);
  const order_record = order_data.data as any as Order | undefined;

  selectedOrder.value = order_record ?? null;

  if (order_record) {
    form.setFieldValue("order", order_record._id || "");
    form.setFieldValue("shipper", order_record.shipper?._id || "");
    form.setFieldValue("route", order_record.route?._id || "");
    form.setFieldValue("tripType", order_record.tripType || "");
    form.setFieldValue("productType", order_record.productType || "");
    form.setFieldValue("vehicleType", order_record.vehicleType?._id || "");
    form.setFieldValue("packaging", order_record.packaging?._id || "");
    form.setFieldValue(
      "commodity",
      order_record.commodity?.map((c: any) => c._id) || [],
    );
    internalLabels.value.orderCode = order_record.orderCode || "";
    internalLabels.value.shipper = order_record.shipper?.name || "";
    internalLabels.value.route = order_record.route?.routeName || "";
    internalLabels.value.tripType = formatType(order_record.tripType);
    internalLabels.value.productType = formatType(order_record.productType);
    internalLabels.value.vehicleType = order_record.vehicleType?.name || "";
    internalLabels.value.packaging = order_record.packaging?.name || "";
    internalLabels.value.commodity =
      order_record.commodity?.reduce((acc: any, c: any) => {
        acc[c._id] = c.name;
        return acc;
      }, {}) || {};
  }
  form.setFieldValue("waypoint", "");
  filteredPricingType.value = null;
  pricingWarning.value = "";
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
    pricingWarning.value = vp
      ? ""
      : "No pricing configured for this vehicle type on the selected waypoint. Please contact an admin to add pricing data.";
  } else {
    filteredPricingType.value = null;
    pricingWarning.value =
      "No vehicle pricing data found for the selected waypoint.";
  }

  updateTotalPrice(form, { waypoint: val });
};

const updateTotalPrice = (form: any, overrides?: Record<string, any>) => {
  const f = form ?? formRef.value?.form;
  if (!f) return;
  const values = { ...f.state.values, ...overrides };
  const total = calculateTotalPrice(values);
  if (+total > 0) f.setFieldValue("totalPrice", String(total));
};

const openRegistrationModal = async (form: any) => {
  const res = await openModal("AddVehicleRegistrationModal");
  if (res && res.vehicle) {
    // Inject the fully populated objects from the other steps into the vehicle object
    const enrichedVehicle = {
      ...res.vehicle,
      driver: res.driver,
      transporter: res.transporter,
    };
    handleVehicleSelect(enrichedVehicle, form);
    form.setFieldValue("vehicle", res.vehicle._id);
  }
};

const handleVehicleSelect = (vehicle: any, form: any) => {
  selectedVehicle.value = vehicle;

  let driverName = "Not Assigned";
  if (vehicle.driver && typeof vehicle.driver === "object") {
    const { firstName, middleName, lastName } = vehicle.driver;
    driverName = [firstName, middleName, lastName].filter(Boolean).join(" ");
  } else if (vehicle.driverName) {
    driverName = vehicle.driverName;
  }

  const driverId = vehicle.driver?._id || "";
  form.setFieldValue("driver", driverId);
  internalLabels.value.driver = driverName;

  let transporterName = "";
  let transporterId = "";
  if (vehicle.transporter && typeof vehicle.transporter === "object") {
    transporterName =
      vehicle.transporter.name || vehicle.transporter.tradeName || "";
    transporterId = vehicle.transporter._id || "";
  } else if (vehicle.transporterName) {
    transporterName = vehicle.transporterName;
  }

  form.setFieldValue("transporter", transporterId);
  internalLabels.value.transporter = transporterName;
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

onMounted(async () => {
  if (props.initialValues.order) {
    const order_data = await fetch_order_by_id(props.initialValues.order);
    const order_record = order_data.data as any as Order | undefined;
    selectedOrder.value = order_record ?? null;

    if (order_record?.route?.routeName && !internalLabels.value.route) {
      internalLabels.value.route = order_record.route.routeName;
    }

    if (order_record && props.initialValues.waypoint) {
      // Small delay to ensure refs are updated before triggering logic
      handleWaypointChange(props.initialValues.waypoint, null);
    }
  }

  if (props.initialValues.vehicle) {
    new ApiService()
      .addAuthenticationHeader()
      .get(`/vehicle/${props.initialValues.vehicle}`)
      .then((res: any) => {
        if (res.success) {
          selectedVehicle.value = res.data;
          const vehicle = res.data;
          if (vehicle.transporter && typeof vehicle.transporter === "object") {
            const transporterId = vehicle.transporter._id || "";
            const transporterName =
              vehicle.transporter.name || vehicle.transporter.tradeName || "";
            if (!props.initialValues.transporter && transporterId) {
              formRef.value?.form.setFieldValue("transporter", transporterId);
              internalLabels.value.transporter = transporterName;
            }
          }
        }
      });
  }
});

const handleSubmit = async (values: any) => {
  await props.onSubmit(values, {
    selectedOrder: selectedOrder.value,
    selectedVehicle: selectedVehicle.value,
    filteredPricingType: filteredPricingType.value,
  });
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
