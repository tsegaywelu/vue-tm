<template>
  <Form :id="formId" :values="initialValues" :onSubmit="handleSubmit">
    <template #default="{ form }">
      <Colapsable
        title="Tyre Information"
        description="Enter the core details of the tyre including serial number and position."
      >
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Input
            name="serialNumber"
            label="Serial Number"
            :attributes="{
              placeholder: 'Enter serial number',
            }"
            :validation="{
              required,
            }"
          />

          <SelectInput
            name="vehicle"
            label="Vehicle"
            :attributes="{
              placeholder: 'Choose vehicle',
            }"
            searchable
            label_key="plateNumber"
            value_key="_id"
            url="/vehicle"
            :initial_labels="initialLabels"
            :validation="{
              required,
            }"
          />

          <ToggleInput
            name="trailer"
            label="Is Trailer"
            :on_change="(val) => handleTrailerToggle(val, form)"
          />

          <SelectInput
            name="tyrePosition"
            label="Tyre Position"
            :attributes="{
              placeholder: 'Select position',
            }"
            :options="currentTyrePositions"
            :validation="{
              required,
            }"
          />

          <Input
            name="brand"
            label="Brand"
            :attributes="{
              placeholder: 'Enter brand',
            }"
            :validation="{
              required,
            }"
          />

          <Input
            name="tyreStandard"
            label="Standard (KM)"
            :attributes="{
              placeholder: '0',
              type: 'number',
            }"
            :validation="{
              required,
            }"
          />
        </div>
      </Colapsable>

      <Colapsable
        title="Technical Details"
        description="Provide additional specifications such as tread depth, pressure, and installation info."
      >
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Input
            name="treadDepth"
            label="Tread Depth"
            :attributes="{
              placeholder: ' depth',
              type: 'number',
            }"
          />

          <Input
            name="TPI"
            label="TPI"
            :attributes="{
              placeholder: ' TPI',
              type: 'number',
            }"
          />

          <Input
            name="pressure"
            label="Pressure"
            :attributes="{
              placeholder: ' Pressure',
              type: 'number',
            }"
          />

          <Input
            name="price"
            label="Price"
            :attributes="{
              placeholder: ' Price',
              type: 'number',
            }"
            :validation="{
              required,
            }"
          />

          <Input
            name="type"
            label="Type"
            :attributes="{
              placeholder: 'Enter tyre type',
            }"
          />

          <DateInput
            name="installationDate"
            label="Installation Date"
            :attributes="{
              placeholder: 'Select date',
            }"
            :validation="{
              required,
            }"
          />

          <Input
            name="installationMileage"
            label="Installation Mileage"
            :attributes="{
              placeholder: 'Installation Mileage',
              type: 'number',
            }"
            :validation="{
              required,
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
import { ref, computed, watch } from "vue";
import Form from "@/components/form/Form.vue";
import Input from "@/components/form/Input.vue";
import SelectInput from "@/components/form/SelectInput.vue";
import DateInput from "@/components/form/DateInput.vue";
import ToggleInput from "@/components/form/ToggleInput.vue";
import Colapsable from "@/components/common/Colapsable.vue";
import { required } from "@/utils/validations";

const props = defineProps<{
  formId: string;
  initialValues: Record<string, any>;
  initialLabels?: Record<string, any>;
  onSubmit: (values: any) => Promise<void> | void;
}>();

const isTrailer = ref(props.initialValues.trailer || false);

const tyrePositions = [
  { value: "FRONT_LEFT", label: "Front Left" },
  { value: "FRONT_RIGHT", label: "Front Right" },
  { value: "FRONT_RIGHT_OUTER", label: "Front Right Outer" },
  { value: "FRONT_RIGHT_INNER", label: "Front Right Inner" },
  { value: "FRONT_LEFT_OUTER", label: "Front Left Outer" },
  { value: "FRONT_LEFT_INNER", label: "Front Left Inner" },
  { value: "MID_LEFT_INNER", label: "Mid Left Inner" },
  { value: "MID_LEFT_OUTER", label: "Mid Left Outer" },
  { value: "MID_RIGHT_INNER", label: "Mid Right Inner" },
  { value: "MID_RIGHT_OUTER", label: "Mid Right Outer" },
  { value: "REAR_LEFT_INNER", label: "Rear Left Inner" },
  { value: "REAR_LEFT_OUTER", label: "Rear Left Outer" },
  { value: "REAR_RIGHT_INNER", label: "Rear Right Inner" },
  { value: "REAR_RIGHT_OUTER", label: "Rear Right Outer" },
  { value: "PRIMARY_SQUART", label: "Primary Squart" },
  { value: "SECONDARY_SQUART", label: "Secondary Squart" },
];

const currentTyrePositions = computed(() => {
  if (isTrailer.value) {
    return [
      { value: "FRONT_RIGHT_OUTER", label: "Front Right Outer" },
      { value: "FRONT_RIGHT_INNER", label: "Front Right Inner" },
      { value: "FRONT_LEFT_OUTER", label: "Front Left Outer" },
      { value: "FRONT_LEFT_INNER", label: "Front Left Inner" },
      { value: "MID_LEFT_INNER", label: "Mid Left Inner" },
      { value: "MID_LEFT_OUTER", label: "Mid Left Outer" },
      { value: "MID_RIGHT_INNER", label: "Mid Right Inner" },
      { value: "MID_RIGHT_OUTER", label: "Mid Right Outer" },
      { value: "REAR_LEFT_INNER", label: "Rear Left Inner" },
      { value: "REAR_LEFT_OUTER", label: "Rear Left Outer" },
      { value: "REAR_RIGHT_INNER", label: "Rear Right Inner" },
      { value: "REAR_RIGHT_OUTER", label: "Rear Right Outer" },
      { value: "PRIMARY_SQUART", label: "Primary Squart" },
      { value: "SECONDARY_SQUART", label: "Secondary Squart" },
    ];
  } else {
    return [
      { value: "FRONT_LEFT", label: "Front Left" },
      { value: "FRONT_RIGHT", label: "Front Right" },
      { value: "MID_LEFT_INNER", label: "Mid Left Inner" },
      { value: "MID_LEFT_OUTER", label: "Mid Left Outer" },
      { value: "MID_RIGHT_INNER", label: "Mid Right Inner" },
      { value: "MID_RIGHT_OUTER", label: "Mid Right Outer" },
      { value: "REAR_LEFT_INNER", label: "Rear Left Inner" },
      { value: "REAR_LEFT_OUTER", label: "Rear Left Outer" },
      { value: "REAR_RIGHT_INNER", label: "Rear Right Inner" },
      { value: "REAR_RIGHT_OUTER", label: "Rear Right Outer" },
    ];
  }
});

const handleTrailerToggle = (val: boolean, form: any) => {
  isTrailer.value = val;
  form.setFieldValue("tyrePosition", "");
};

const handleSubmit = async (values: any) => {
  const payload = {
    ...values,
    tyreStandard: Number(values.tyreStandard),
    treadDepth: values.treadDepth ? Number(values.treadDepth) : undefined,
    TPI: values.TPI ? Number(values.TPI) : undefined,
    pressure: values.pressure ? Number(values.pressure) : undefined,
    price: Number(values.price),
    installationMileage: Number(values.installationMileage),
  };
  await props.onSubmit(payload);
};

// Sync isTrailer with initial values if they change (e.g. in edit mode after fetch)
watch(() => props.initialValues.trailer, (newVal) => {
  isTrailer.value = !!newVal;
}, { immediate: true });

</script>
