<template>
  <Form :id="formId" :values="initialValues" :onSubmit="handleSubmit">
    <template #default="{ form }">
      <Colapsable
        title="Meter Entry Details"
        description="Record an odometer or engine hour reading for a vehicle."
      >
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <VehicleInput
            name="vehicle"
            label="Vehicle"
            :validation="{ required }"
            :options="props.labels?.vehicle ? [{ label: props.labels.vehicle, value: props.initialValues.vehicle }] : []"
          />

          <SelectInput
            name="meterType"
            label="Meter Type"
            :options="meterTypeOptions"
            :attributes="{ placeholder: 'Select meter type' }"
          />

          <Input
            name="reading"
            label="Reading"
            :validation="{ required, number }"
            :attributes="{ placeholder: '0', type: 'number' }"
          />

          <DateInput
            name="entryDate"
            label="Entry Date"
            :validation="{ required }"
            :attributes="{ placeholder: 'Select date' }"
          />

          <SelectInput
            name="entrySource"
            label="Entry Source"
            :options="entrySourceOptions"
            :attributes="{ placeholder: 'Select source' }"
          />

          <ToggleInput
            name="isOverride"
            label="Override Previous Reading"
          />
        </div>

        <component
          :is="form.Subscribe"
          :selector="(state: any) => [state.values.isOverride]"
          v-slot="[isOverride]"
        >
          <div v-if="isOverride" class="mt-6">
            <Input
              name="overrideReason"
              label="Override Reason"
              :validation="{ required }"
              :attributes="{ placeholder: 'Explain why this reading overrides the previous one' }"
            />
          </div>
        </component>

        <div class="mt-6">
          <TextareaInput
            name="comment"
            label="Comment"
            :attributes="{ placeholder: 'Any additional notes...', rows: 3 }"
          />
        </div>
      </Colapsable>

      <Colapsable title="Photos" description="Attach photos of the meter reading.">
        <FileInput name="photos" label="Photos" multiple />
      </Colapsable>

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
import DateInput from "@/components/form/DateInput.vue";
import TextareaInput from "@/components/form/TextareaInput.vue";
import ToggleInput from "@/components/form/ToggleInput.vue";
import FileInput from "@/components/form/FileInput.vue";
import Colapsable from "@/components/common/Colapsable.vue";
import VehicleInput from "@/components/common/inputs/VehicleInput.vue";
import { required, number } from "@/utils/validations";
import { useAuthStore } from "@/store/authStore";

const authStore = useAuthStore();

const props = defineProps<{
  formId: string;
  initialValues: Record<string, any>;
  labels?: Record<string, string>;
  onSubmit: (data: FormData) => Promise<void> | void;
}>();

const meterTypeOptions = [
  { label: "Odometer", value: "ODOMETER" },
  { label: "Engine Hours", value: "ENGINE_HOURS" },
];

const entrySourceOptions = [
  { label: "Manual", value: "MANUAL" },
  { label: "Inspection", value: "INSPECTION" },
  { label: "Work Order", value: "WORK_ORDER" },
  { label: "Service Reminder", value: "SERVICE_REMINDER" },
  { label: "Service Record", value: "SERVICE_RECORD" },
  { label: "Fuel Entry", value: "FUEL_ENTRY" },
];

const handleSubmit = (values: any) => {
  const formData = new FormData();

  const fields = [
    "vehicle", "reading", "entryDate", "meterType",
    "entrySource", "sourceId", "comment", "isOverride",
  ];

  fields.forEach((key) => {
    if (values[key] !== undefined && values[key] !== null && values[key] !== "") {
      formData.append(key, values[key]);
    }
  });

  if (values.isOverride && values.overrideReason) {
    formData.append("overrideReason", values.overrideReason);
  }

  formData.append("carrier", authStore.carrierId);

  if (values.photos?.length) {
    values.photos.forEach((file: File) => {
      if (file instanceof File) formData.append("photos", file);
    });
  }

  props.onSubmit(formData);
};
</script>
