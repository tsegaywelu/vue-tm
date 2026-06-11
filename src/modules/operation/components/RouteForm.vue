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
          <Input
            name="origin"
            label="Origin"
            :attributes="{ placeholder: 'Enter origin' }"
            :validation="{ required }"
            :on_change="(val, f) => { const dest = f.getFieldValue('destination'); if (val && dest) f.setFieldValue('routeName', `${val} - ${dest}`); }"
          />
          <Input
            name="destination"
            label="Destination"
            :attributes="{ placeholder: 'Enter destination' }"
            :validation="{ required }"
            :on_change="(val, f) => { const origin = f.getFieldValue('origin'); if (origin && val) f.setFieldValue('routeName', `${origin} - ${val}`); }"
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
      <div class="form-footer pt-6 flex justify-end gap-3">
        <slot :form="form" name="submit-btn"></slot>
      </div>
    </template>
  </Form>
</template>

<script setup lang="ts">
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

<style scoped>
@media (max-width: 639px) {
  .form-footer {
    flex-direction: column;
  }
  .form-footer :deep(button) {
    width: 100% !important;
    min-height: 3.25rem;
    font-size: 1rem;
    border-radius: 1rem;
  }
}
</style>
