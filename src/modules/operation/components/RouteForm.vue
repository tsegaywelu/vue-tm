<template>
  <Form
    :id="formId"
    :values="initialValues"
    :on-submit="handleSubmit"
    class="w-full flex flex-col gap-6"
  >
    <template #default="{ form }">
      <Colapsable
        title="Route Details"
        description="Specify origin, destination, and product details."
      >
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SelectInput
            name="originCity"
            label="Origin City"
            url="/city"
            label_key="name"
            value_key="_id"
            searchable
            :display_label_fn="cityLabel"
            :validation="{ required }"
            :attributes="{ placeholder: 'Select origin city' }"
            @select="(city) => onOriginCitySelect(city, form)"
          />
          <SelectInput
            name="destinationCity"
            label="Destination City"
            url="/city"
            label_key="name"
            value_key="_id"
            searchable
            :display_label_fn="cityLabel"
            :validation="{ required }"
            :attributes="{ placeholder: 'Select destination city' }"
            @select="(city) => onDestCitySelect(city, form)"
          />
          <Input
            name="routeName"
            label="Route Name"
            :attributes="{ placeholder: 'Enter route name' }"
            :validation="{ required }"
          />

          <SelectInput
            name="productType"
            label="Product Type"
            :options="productTypeOptions"
            :validation="{ required }"
            :attributes="{ placeholder: 'Select product type' }"
          />
        </div>
      </Colapsable>

      <!-- Waypoint Array Component -->
      <WaypointInput name="waypoints" />

      <!-- Form Logic Slot -->
      <slot name="form-logic" :form="form"></slot>

      <!-- Action Footer -->
      <div class="pt-10 flex justify-end gap-4">
        <slot :form="form" name="submit-btn"></slot>
      </div>
    </template>
  </Form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Form from "@/components/form/Form.vue";
import Input from "@/components/form/Input.vue";
import SelectInput from "@/components/form/SelectInput.vue";
import Colapsable from "@/components/common/Colapsable.vue";
import WaypointInput from "./inputs/WaypointInput.vue";
import { required } from "@/utils/validations";
import { ProductType } from "../operation.types";

const props = defineProps<{
  formId: string;
  initialValues: Record<string, any>;
  onSubmit: (values: any) => Promise<void> | void;
}>();

const cityLabel = (city: any) => city.code || city.name;

const selectedOriginCity = ref<any>(null);
const selectedDestCity = ref<any>(null);

function onOriginCitySelect(city: any, form: any) {
  selectedOriginCity.value = city;
  const origin = city?.code || city?.name || "";
  const dest = selectedDestCity.value?.code || selectedDestCity.value?.name || "";
  if (origin && dest) form.setFieldValue("routeName", `${origin} - ${dest}`);
}

function onDestCitySelect(city: any, form: any) {
  selectedDestCity.value = city;
  const origin = selectedOriginCity.value?.code || selectedOriginCity.value?.name || "";
  const dest = city?.code || city?.name || "";
  if (origin && dest) form.setFieldValue("routeName", `${origin} - ${dest}`);
}

const productTypeOptions = [
  { label: "Out Bound", value: ProductType["Out Bound"] },
  { label: "In Bound", value: ProductType["In Bound"] },
  { label: "Site Transfer", value: ProductType["Site Transfer"] },
];

const handleSubmit = async (values: any) => {
  const formattedValues = {
    ...values,
    waypoints: values.waypoints?.map((wp: any) => ({
      ...wp,
      distance: Number(wp.distance || 0),
      perDiemDays: Number(wp.perDiemDays || 0),
      TAT: Number(wp.TAT || 0),
      AFU: Number(wp.AFU || 0),
      otherAmount: Number(wp.otherAmount || 0),
    })),
  };
  await props.onSubmit(formattedValues);
};
</script>
