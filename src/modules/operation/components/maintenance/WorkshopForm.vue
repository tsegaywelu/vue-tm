<template>
  <Form :id="formId" :values="normalizedValues" :onSubmit="handleSubmit">
    <template #default="{ form }">
      <Colapsable
        title="General Information"
        description="Basic details about the workshop."
      >
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Input
            name="name"
            label="Name"
            :attributes="{ placeholder: 'Enter workshop name' }"
            :validation="{ required }"
          />

          <Input
            name="tradeName"
            label="Trade Name"
            :attributes="{ placeholder: 'Enter trade name' }"
            :validation="{ required }"
          />

          <Input
            name="contactPerson"
            label="Contact Person"
            :attributes="{ placeholder: 'Enter contact person name' }"
            :validation="{ required }"
          />

          <PhoneInput
            name="contactPhone"
            label="Phone Number"
            :attributes="{ placeholder: '+251 XXX XXX XXX' }"
            :validation="{ required }"
          />

          <Input
            name="specialization"
            label="Specialization"
            :attributes="{ placeholder: 'e.g. Engine, Tyres, General' }"
            :validation="{ required }"
          />

          <Input
            name="tin"
            label="TIN"
            :attributes="{ placeholder: 'Enter TIN number' }"
          />
        </div>
      </Colapsable>

      <Colapsable
        title="Location Details"
        description="Address and geographic coordinates."
      >
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Input
            name="location.street"
            label="Street Address"
            :attributes="{ placeholder: 'Enter street address' }"
          />

          <Input
            name="location.city"
            label="City"
            :attributes="{ placeholder: 'Enter city' }"
            :validation="{ required }"
          />

          <SelectInput
            name="location.region"
            label="Region"
            url="/region/myRegions"
            label_key="name"
            value_key="_id"
            :attributes="{ placeholder: 'Select region' }"
            :validation="{ required }"
            :options="
              props.initialValues.location?.region?.name
                ? [{ label: props.initialValues.location.region.name, value: props.initialValues.location.region._id }]
                : []
            "
          />

          <Input
            name="latitude"
            label="Latitude"
            :attributes="{
              placeholder: 'e.g. 9.03',
              type: 'number',
              step: 'any',
            }"
          />

          <Input
            name="longitude"
            label="Longitude"
            :attributes="{
              placeholder: 'e.g. 38.74',
              type: 'number',
              step: 'any',
            }"
          />
        </div>
      </Colapsable>

      <!-- Action Footer -->
      <div class="pt-10 flex flex-col sm:flex-row justify-end gap-3 *:w-full sm:*:w-auto *:min-h-[52px] sm:*:min-h-0 *:text-base sm:*:text-sm *:rounded-2xl sm:*:rounded-xl">
        <slot :form="form" name="submit-btn"></slot>
      </div>
    </template>
  </Form>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Form from "@/components/form/Form.vue";
import Input from "@/components/form/Input.vue";
import SelectInput from "@/components/form/SelectInput.vue";
import PhoneInput from "@/components/form/PhoneInput.vue";
import Colapsable from "@/components/common/Colapsable.vue";
import { required } from "@/utils/validations";

const props = defineProps<{
  formId: string;
  initialValues: Record<string, any>;
  onSubmit: (values: any) => Promise<void> | void;
}>();

const normalizedValues = computed(() => {
  const loc = props.initialValues.location || {};
  return {
    ...props.initialValues,
    location: {
      ...loc,
      region: loc.region?._id || loc.region || "",
    },
  };
});

const handleSubmit = async (values: any) => {
  const payload = {
    ...values,
    latitude: values.latitude ? Number(values.latitude) : undefined,
    longitude: values.longitude ? Number(values.longitude) : undefined,
  };
  await props.onSubmit(payload);
};
</script>
