<template>
  <Form :id="formId" :values="initialValues" :onSubmit="handleSubmit">
    <template #default="{ form }">
      <Colapsable
        title="General Information"
        description="Basic details about the inspection."
      >
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <VehicleInput
            name="vehicle"
            :options="
              initialLabels?.vehicle
                ? [
                    {
                      label: initialLabels.vehicle,
                      value: initialValues?.vehicle,
                    },
                  ]
                : []
            "
            :validation="{ required }"
          />

          <DateInput
            name="inspectionDate"
            label="Inspection Date"
            :attributes="{
              placeholder: 'Select date',
            }"
            :validation="{
              required,
            }"
          />

          <SelectInput
            name="inspectionReason"
            label="Inspection Reason"
            :attributes="{
              placeholder: 'Select reason',
            }"
            :options="[
              { label: 'Routine', value: 'ROUTINE' },
              { label: 'Crash', value: 'CRASH' },
              { label: 'Other', value: 'OTHER' },
            ]"
            :validation="{
              required,
            }"
          />

          <Input
            name="odometerReading"
            label="Odometer Reading"
            :attributes="{
              placeholder: 'Enter reading',
              type: 'number',
            }"
            :validation="{
              required,
            }"
          />

          <ContactInput
            name="inspector"
            label="Inspector"
            :attributes="{
              placeholder: 'Choose inspector',
            }"
            :options="
              initialLabels?.inspector
                ? [
                    {
                      label: initialLabels.inspector,
                      value: initialValues?.inspector,
                    },
                  ]
                : []
            "
            :validation="{
              required,
            }"
          />

          <DateInput
            name="nextInspectionDate"
            label="Next Inspection Date"
            :attributes="{
              placeholder: 'Select date',
            }"
          />
        </div>
      </Colapsable>

      <Colapsable
        title="Issues Found"
        description="List any issues identified during the inspection."
      >
        <div class="space-y-4">
          <IssuesInput name="issuesFound" />
        </div>
      </Colapsable>

      <Colapsable
        title="Remarks"
        description="Additional comments or observations."
      >
        <TextareaInput
          name="remarks"
          label="Remarks"
          :attributes="{
            placeholder: 'Enter any additional remarks here...',
            rows: 4,
          }"
        />
      </Colapsable>

      <!-- Action Footer -->
      <div class="pt-10 flex flex-col sm:flex-row justify-end gap-3 *:w-full sm:*:w-auto *:min-h-[52px] sm:*:min-h-0 *:text-base sm:*:text-sm *:rounded-2xl sm:*:rounded-xl">
        <slot :form="form" name="submit-btn"></slot>
      </div>
    </template>
  </Form>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import Form from "@/components/form/Form.vue";
import Input from "@/components/form/Input.vue";
import SelectInput from "@/components/form/SelectInput.vue";
import DateInput from "@/components/form/DateInput.vue";
import TextareaInput from "@/components/form/TextareaInput.vue";
import Colapsable from "@/components/common/Colapsable.vue";
import VehicleInput from "@/components/common/inputs/VehicleInput.vue";
import ContactInput from "@/components/common/inputs/ContactInput.vue";
import Button from "@/components/Button.vue";
import IssuesInput from "../inputs/IssuesInput.vue";
import { required } from "@/utils/validations";
import { icons } from "@/utils/icons";

const props = defineProps<{
  formId: string;
  initialValues: Record<string, any>;
  initialLabels?: Record<string, any>;
  onSubmit: (values: any) => Promise<void> | void;
}>();

console.log(props.initialValues, "initialValues");
console.log(props.initialLabels, "initialLabels");

const handleSubmit = async (values: any) => {
  const payload = {
    ...values,
    odometerReading: values.odometerReading
      ? Number(values.odometerReading)
      : undefined,
  };
  await props.onSubmit(payload);
};
</script>
