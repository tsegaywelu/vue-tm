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
          />
          <Input
            name="destination"
            label="Destination"
            :attributes="{ placeholder: 'Enter destination' }"
            :validation="{ required }"
          />
          <Input
            name="routeName"
            label="Route Name"
            :attributes="{ placeholder: 'Enter route name' }"
            :validation="{ required }"
          />

          <SelectInput
            name="carriers"
            label="Carriers"
            url="/carrier"
            label_key="name"
            value_key="_id"
            multiple
            searchable
            :validation="{ required }"
            :attributes="{ placeholder: 'Select carriers' }"
          />
        </div>
      </Colapsable>

      <!-- Waypoint Array Component -->
      <ShipperWaypointInput name="waypoints" />

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
import Form from "@/components/form/Form.vue";
import Input from "@/components/form/Input.vue";
import SelectInput from "@/components/form/SelectInput.vue";
import Colapsable from "@/components/common/Colapsable.vue";
import ShipperWaypointInput from "./inputs/ShipperWaypointInput.vue";
import { required } from "@/utils/validations";

const props = defineProps<{
  formId: string;
  initialValues: Record<string, any>;
  onSubmit: (values: any) => Promise<void> | void;
}>();

const handleSubmit = async (values: any) => {
  const formattedValues = {
    ...values,
    // The API expects 'waypoint' (singular) for route requests
    waypoint: values.waypoints?.map((wp: any) => ({
      name: wp.name,
      distance: Number(wp.distance || 0),
      isActive: wp.isActive,
      isDefault: wp.isDefault,
    })),
  };

  // Remove the plural waypoints as we mapped it to singular
  delete formattedValues.waypoints;

  await props.onSubmit(formattedValues);
};
</script>
