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
            name="carrier"
            label="Carrier"
            searchable
            :params="{
              page: undefined,
              limit: undefined,
            }"
            :attributes="{
              placeholder: 'Select carrier',
            }"
            label_key="carrier.name"
            value_key="carrier._id"
            url="/carrier/contractedCarriers"
            :display_value="internalLabels.carrier"
            :validation="{
              required,
            }"
            @select="(opt) => handleCarrierSelect(opt.item, form)"
          />

          <component
            :is="form.Subscribe"
            :selector="(state: any) => [state.values.carrier]"
          >
            <template #default="[carrier]">
              <SelectInput
                :key="carrier"
                :params="{
                  page: undefined,
                  limit: undefined,
                  carrier: carrier,
                }"
                name="route"
                label="Route"
                searchable
                :attributes="{
                  placeholder: 'Select route',
                }"
                label_key="routeName"
                value_key="_id"
                :url="`/route/carrier/${carrier || ''}`"
                :display_value="internalLabels.route"
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
            :initial_labels="internalLabels.commodity"
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
        </div>
      </Colapsable>

      <!-- 2. Order Details -->
      <Colapsable
        title="Order Details"
        description="Specify vehicle type, trip details, and quantities."
      >
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <component
            :is="form.Subscribe"
            :selector="(state: any) => [state.values.carrier]"
          >
            <template #default="[carrier]">
              <VehicleTypeInput
                :key="carrier"
                name="vehicleType"
                :attributes="{ placeholder: 'Select vehicle type' }"
                :url="`/vehicle-type/carrier/${carrier || ''}`"
                :params="{ page: undefined, limit: undefined }"
                :validation="{ required }"
              />
            </template>
          </component>

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
            }"
            :validation="{
              range(value: any) {
                const val = Number(value);
                return val >= 1 && val <= 10
                  ? [true, '']
                  : [false, 'Number Must be Between 1 and 10'];
              },
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
import VehicleTypeInput from "@/components/common/inputs/VehicleTypeInput.vue";
import TextareaInput from "@/components/form/TextareaInput.vue";
import Colapsable from "@/components/common/Colapsable.vue";
import { required } from "@/utils/validations";
import { fetch_contract_route_details_shipper } from "../../operation/api/orders.api";
import { TripType, VehicleTypeName } from "../../operation/operation.types";
import { useAuthStore } from "@/store/authStore";

const authStore = useAuthStore();
const currentUserShipperId = computed(
  () => authStore.current_user?.user?.shipper?._id,
);

const props = withDefaults(
  defineProps<{
    formId: string;
    initialValues: Record<string, any>;
    labels?: Record<string, any>;
    preloadedRouteDetails?: any;
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

const handleCarrierSelect = (carrier: any, form: any) => {
  internalLabels.value.carrier = carrier?.carrier?.name || carrier?.name || "";
  // Reset route and related fields when carrier changes
  form.setFieldValue("route", "");
  form.setFieldValue("agent", "");
  form.setFieldValue("commodity", []);
  form.setFieldValue("packaging", "");
  internalLabels.value.route = "";
  internalLabels.value.agent = "";
  internalLabels.value.packaging = "";
  routeCommodities.value = [];
  routePackagings.value = [];
  routeAgents.value = [];
  contractProductTypes.value = [];
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
  internalLabels.value.route = route?.routeName || "";

  // Reset auto-filled fields first to prevent stale data
  form.setFieldValue("commodity", []);
  form.setFieldValue("packaging", "");
  form.setFieldValue("productType", "");
  form.setFieldValue("agent", "");
  internalLabels.value.agent = "";
  internalLabels.value.packaging = "";
  routeCommodities.value = [];
  routePackagings.value = [];
  routeAgents.value = [];
  contractProductTypes.value = [];

  if (route && form.state.values.carrier) {
    isRouteDetailsLoading.value = true;
    try {
      const res = await fetch_contract_route_details_shipper(
        form.state.values.carrier,
        route._id,
      );
      if (res.success) {
        routeCommodities.value = res.data?.commodities || [];
        routePackagings.value = res.data?.packagings || [];
        routeAgents.value = res.data?.agents || [];
        contractProductTypes.value = res.data?.productType || [];

        // Auto-select if there's exactly 1 option and current value is empty
        if (
          routeCommodities.value.length === 1 &&
          (!form.state.values.commodity ||
            form.state.values.commodity.length === 0)
        ) {
          form.setFieldValue("commodity", [
            (routeCommodities.value[0] as any)._id,
          ]);
        }

        if (
          routePackagings.value.length === 1 &&
          !form.state.values.packaging
        ) {
          form.setFieldValue(
            "packaging",
            (routePackagings.value[0] as any)._id,
          );
          internalLabels.value.packaging = (
            routePackagings.value[0] as any
          ).name;
        }

        if (contractProductTypes.value.length === 1) {
          form.setFieldValue("productType", contractProductTypes.value[0]);
        }

        if (routeAgents.value.length === 1 && !form.state.values.agent) {
          form.setFieldValue("agent", (routeAgents.value[0] as any)._id);
          internalLabels.value.agent = (routeAgents.value[0] as any).name;
        }
      }
    } finally {
      isRouteDetailsLoading.value = false;
    }
  }
};

const initializeRouteDetails = (details: any) => {
  if (!details) return;
  routeCommodities.value = details.commodities || [];
  routePackagings.value = details.packagings || [];
  routeAgents.value = details.agents || [];
  contractProductTypes.value = details.productType || [];
};

watch(
  () => props.preloadedRouteDetails,
  (newDetails) => {
    if (newDetails) initializeRouteDetails(newDetails);
  },
  { immediate: true },
);

onMounted(async () => {
  if (props.preloadedRouteDetails) {
    initializeRouteDetails(props.preloadedRouteDetails);
    return;
  }
  if (props.initialValues.route && props.initialValues.carrier) {
    isRouteDetailsLoading.value = true;
    try {
      const res = await fetch_contract_route_details_shipper(
        props.initialValues.carrier,
        props.initialValues.route,
      );
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
    shipper: currentUserShipperId.value,
    totalRequest: Number(values.totalRequest) || 0,
    numberOfVehicles: Number(values.numberOfVehicles) || 1,
  };

  if (payload.productType === "SITE_TRANSFER") {
    delete payload.agent;
  }

  await props.onSubmit(payload);
};
</script>
