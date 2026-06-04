<template>
  <Form :id="formId" :values="initialValues" :onSubmit="handleSubmit">
    <template #default="{ form }">
      <Colapsable
        title="General Information"
        description="Basic details about the service record."
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
            name="maintenanceDate"
            label="Maintenance Date"
            :attributes="{
              placeholder: 'Select date',
            }"
            :validation="{
              required,
            }"
          />

          <WorkshopInput
            name="workshop"
            :attributes="{ placeholder: 'Choose workshop' }"
            :options="
              initialLabels?.workshop
                ? [{ label: initialLabels.workshop, value: initialValues?.workshop }]
                : []
            "
          />

          <Input
            name="mileageAtService"
            label="Mileage At Service"
            :attributes="{
              placeholder: 'Enter mileage',
              type: 'number',
            }"
            :validation="{
              required,
            }"
          />

          <Input
            name="totalCost"
            label="Total Cost"
            :attributes="{
              placeholder: 'Enter total cost',
              type: 'number',
            }"
            :validation="{
              required,
            }"
          />
        </div>
      </Colapsable>

      <Colapsable
        title="Mechanics"
        description="List any mechanics or contacts involved in the service."
      >
        <div class="space-y-4">
          <MechanicsInput
            name="mechanics"
            :initialLabels="props.initialLabels?.mechanics"
          />
        </div>
      </Colapsable>

      <Colapsable
        title="Description"
        description="Additional comments or details about the service."
      >
        <TextareaInput
          name="description"
          label="Description"
          :attributes="{
            placeholder: 'Enter any additional details here...',
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
import WorkshopInput from "@/components/common/inputs/WorkshopInput.vue";
import DateInput from "@/components/form/DateInput.vue";
import TextareaInput from "@/components/form/TextareaInput.vue";
import Colapsable from "@/components/common/Colapsable.vue";
import VehicleInput from "@/components/common/inputs/VehicleInput.vue";
import MechanicsInput from "../inputs/MechanicsInput.vue";
import Button from "@/components/Button.vue";
import { required } from "@/utils/validations";
import { icons } from "@/utils/icons";

const props = defineProps<{
  formId: string;
  initialValues: Record<string, any>;
  initialLabels?: Record<string, any>;
  onSubmit: (values: any) => Promise<void> | void;
}>();

const handleSubmit = async (values: any) => {
  const payload = {
    ...values,
    mileageAtService: values.mileageAtService
      ? Number(values.mileageAtService)
      : undefined,
    totalCost: values.totalCost ? Number(values.totalCost) : undefined,
  };
  await props.onSubmit(payload);
};
</script>
