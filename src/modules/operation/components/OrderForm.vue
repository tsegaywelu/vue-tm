<template>
  <Form :id="formId" :values="initialValues" :onSubmit="handleSubmit">
    <template #default="{ form }">
      <!-- 1. Order Configuration -->
      <Colapsable
        title="Order Configuration"
        description="Select carrier, route, and define order parameters."
      >
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SelectInput
            name="shipper"
            label="Shipper"
            searchable
            :params="{
              page: undefined,
              limit: undefined,
            }"
            :attributes="{
              placeholder: 'Select shipper',
            }"
            label_key="shipper.name"
            value_key="shipper._id"
            url="/shipper/contractedShippers"
            :validation="{
              required,
            }"
            @select="(opt) => handleShipperSelect(opt.item, form)"
          />
          <component
            :is="form.Subscribe"
            :selector="(state: any) => [state.values.shipper]"
          >
            <template #default="[shipper]">
              <SelectInput
                :key="shipper"
                :params="{
                  page: undefined,
                  limit: undefined,
                }"
                name="route"
                label="Route"
                searchable
                :attributes="{
                  placeholder: 'Select route',
                }"
                label_key="routeName"
                value_key="_id"
                :url="`/route/shipper/${shipper || ''}`"
                :validation="{
                  required,
                }"
                @select="(opt) => handleRouteSelect(opt.item, form)"
              />
            </template>
          </component>

          <SelectInput
            name="productType"
            label="Product Type"
            :attributes="{
              placeholder: 'Select product type',
            }"
            :options="filteredProductTypeOptions"
            :validation="{
              required,
            }"
          />

          <component
            :is="form.Subscribe"
            :selector="(state: any) => [state.values.productType]"
          >
            <template #default="[productType]">
              <SelectInput
                v-if="productType && productType !== 'SITE_TRANSFER'"
                name="agent"
                label="Agent"
                searchable
                :attributes="{
                  placeholder: 'Select agent',
                }"
                label_key="name"
                value_key="_id"
                :options="routeAgents"
                :pending="isRouteDetailsLoading"
                :display_value="internalLabels.agent"
                :validation="{
                  required,
                }"
              />
            </template>
          </component>

          <SelectInput
            name="commodity"
            label="Commodity"
            multiple
            searchable
            :attributes="{
              placeholder: 'Select commodities',
            }"
            label_key="name"
            value_key="_id"
            :options="routeCommodities"
            :pending="isRouteDetailsLoading"
            :validation="{
              required: (val: any) => required(val),
            }"
          />

          <SelectInput
            name="packaging"
            label="Packaging"
            :attributes="{
              placeholder: 'Select packaging',
            }"
            label_key="name"
            value_key="_id"
            :options="routePackagings"
            :pending="isRouteDetailsLoading"
            :display_value="internalLabels.packaging"
            :validation="{
              required,
            }"
          />

          <slot name="config-extra" :form="form"></slot>
        </div>
      </Colapsable>

      <!-- 2. Order Details -->
      <Colapsable
        title="Order Details"
        description="Specify vehicle type, trip details, and quantities."
      >
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SelectInput
            name="vehicleType"
            label="Vehicle Type"
            :attributes="{
              placeholder: 'Select vehicle type',
            }"
            url="/vehicle-type"
            label_key="name"
            value_key="_id"
            :validation="{
              required,
            }"
          />

          <SelectInput
            name="tripType"
            label="Trip Type"
            :attributes="{
              placeholder: 'Select trip type',
            }"
            :options="tripTypeOptions"
            :validation="{
              required,
            }"
          />

          <SelectInput
            name="priority"
            label="Priority"
            :attributes="{
              placeholder: 'Select priority',
            }"
            :options="priorityOptions"
            :validation="{
              required,
            }"
          />

          <div class="flex gap-0">
            <Input
              parent_class_name="flex-1"
              name="totalRequest"
              label="Total Request"
              :attributes="{
                placeholder: '0',
                type: 'number',
              }"
              :validation="{
                required,
              }"
            />
            <SelectInput
              parent_class_name="w-36 [&_.input-focus]:rounded-l-none [&_.input-focus]:border-l-0"
              name="unitOfMeasurement"
              label="Unit"
              :options="uomOptions"
              :attributes="{
                placeholder: 'Unit',
              }"
              :validation="{
                required,
              }"
            />
          </div>

          <Input
            name="numberOfVehicles"
            label="Number of Vehicles"
            :attributes="{
              placeholder: '1',
              type: 'number',
              min: 1,
              max: 10,
            }"
          />

          <component
            :is="form.Subscribe"
            :selector="(state: any) => [state.values.productType]"
          >
            <template #default="[productType]">
              <Input
                v-if="
                  productType === 'IN_BOUND' || productType === 'SITE_TRANSFER'
                "
                name="allocationNumber"
                label="Allocation Number"
                :attributes="{
                  placeholder: 'Enter allocation number',
                }"
                :validation="{
                  required,
                }"
              />
            </template>
          </component>

          <TextareaInput
            parent_class_name="col-span-full"
            name="remark"
            label="Remarks & Special Instructions"
            :attributes="{
              placeholder: 'Enter remarks or any additional notes...',
            }"
          />

          <slot name="details-extra" :form="form"></slot>
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
import { ref, watch, onMounted, computed } from "vue";
import Form from "@/components/form/Form.vue";
import Input from "@/components/form/Input.vue";
import SelectInput from "@/components/form/SelectInput.vue";
import TextareaInput from "@/components/form/TextareaInput.vue";
import Colapsable from "@/components/common/Colapsable.vue";
import { required } from "@/utils/validations";
import { fetch_contract_route_details } from "../api/orders.api";
import { ProductType, TripType, VehicleTypeName } from "../operation.types";

const props = withDefaults(
  defineProps<{
    formId: string;
    initialValues: Record<string, any>;
    labels?: Record<string, any>;
    onSubmit: (values: any) => Promise<void> | void;
  }>(),
  {
    labels: () => ({}),
  },
);

const internalLabels = ref({ ...props.labels });

watch(
  () => props.labels,
  (newLabels) => {
    internalLabels.value = { ...newLabels };
  },
  { deep: true },
);

const productTypeOptions = [
  { label: "Out Bound", value: "OUT_BOUND" },
  { label: "In Bound", value: "IN_BOUND" },
  { label: "Site Transfer", value: "SITE_TRANSFER" },
];

const tripTypeOptions = [
  { label: "Round Trip", value: TripType.RoundTrip },
  { label: "Single Trip", value: TripType.SingleTrip },
];

const vehicleTypeOptions = Object.values(VehicleTypeName).map((val) => ({
  label: val,
  value: val,
}));

const priorityOptions = [
  { label: "Urgent", value: "URGENT" },
  { label: "High", value: "HIGH" },
  { label: "Medium", value: "MEDIUM" },
  { label: "Low", value: "LOW" },
];

const uomOptions = [
  { label: "PCS - Pieces", value: "pcs" },
  { label: "CTN - Cartons", value: "ctn" },
  { label: "BOX - Boxes", value: "box" },
  { label: "BAG - Bags", value: "bag" },
  { label: "SET - Sets", value: "set" },
  { label: "KG - Kilograms", value: "kg" },
  { label: "DOZ - Dozens", value: "doz" },
  { label: "LTR - Liters", value: "ltr" },
  { label: "GAL - Gallons", value: "gal" },
  { label: "BULK - Bulk", value: "bulk" },
];

const handleShipperSelect = (shipper: any, form: any) => {
  internalLabels.value.shipper = shipper?.shipper?.name || shipper?.name || "";
};

const routeCommodities = ref<any[]>([]);
const routePackagings = ref<any[]>([]);
const routeAgents = ref<any[]>([]);
const contractProductTypes = ref<string[]>([]);
const isRouteDetailsLoading = ref(false);

const filteredProductTypeOptions = computed(() => {
  if (contractProductTypes.value.length === 0) return productTypeOptions;
  return productTypeOptions.filter((opt) =>
    contractProductTypes.value.includes(opt.value),
  );
});

const handleRouteSelect = async (route: any, form: any) => {
  console.log(route);
  internalLabels.value.route = route?.routeName || "";

  if (route && form.state.values.shipper) {
    isRouteDetailsLoading.value = true;
    try {
      const res = await fetch_contract_route_details(
        form.state.values.shipper,
        route._id,
      );
      if (res.success) {
        routeCommodities.value = res.data?.commodities || [];
        routePackagings.value = res.data?.packagings || [];
        routeAgents.value = res.data?.agents || [];
        contractProductTypes.value = res.data?.productType || [];

        // Auto-select if there's exactly 1 option
        if (routeCommodities.value.length === 1) {
          form.setFieldValue("commodity", [
            (routeCommodities.value[0] as any)._id,
          ]);
        } else {
          form.setFieldValue("commodity", []);
        }

        if (routePackagings.value.length === 1) {
          form.setFieldValue(
            "packaging",
            (routePackagings.value[0] as any)._id,
          );
          internalLabels.value.packaging = (
            routePackagings.value[0] as any
          ).name;
        } else {
          form.setFieldValue("packaging", "");
          internalLabels.value.packaging = "";
        }

        // Auto-select product type if only one is available
        if (contractProductTypes.value.length === 1) {
          form.setFieldValue("productType", contractProductTypes.value[0]);
        }

        // Auto-select agent if only one is available
        if (routeAgents.value.length === 1) {
          form.setFieldValue("agent", (routeAgents.value[0] as any)._id);
          internalLabels.value.agent = (routeAgents.value[0] as any).name;
        } else {
          form.setFieldValue("agent", "");
          internalLabels.value.agent = "";
        }
      }
    } finally {
      isRouteDetailsLoading.value = false;
    }
  }
};

onMounted(async () => {
  if (props.initialValues.route && props.initialValues.shipper) {
    isRouteDetailsLoading.value = true;
    try {
      const shipperId =
        typeof props.initialValues.shipper === "object"
          ? props.initialValues.shipper._id
          : props.initialValues.shipper;
      const routeId =
        typeof props.initialValues.route === "object"
          ? props.initialValues.route._id
          : props.initialValues.route;

      const res = await fetch_contract_route_details(shipperId, routeId);
      if (res.success) {
        routeCommodities.value = res.data?.commodities || [];
        routePackagings.value = res.data?.packagings || [];
        routeAgents.value = res.data?.agents || [];
        contractProductTypes.value = res.data?.productType || [];
      }
    } finally {
      isRouteDetailsLoading.value = false;
    }
  }
});

const handleSubmit = async (values: any) => {
  const payload = {
    ...values,
    totalRequest: Number(values.totalRequest) || 0,
    numberOfVehicles: Number(values.numberOfVehicles) || 1,
  };

  // Remove agent for SITE_TRANSFER
  if (payload.productType === "SITE_TRANSFER") {
    delete payload.agent;
  }

  await props.onSubmit(payload);
};
</script>
