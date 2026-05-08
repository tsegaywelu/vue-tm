<template>
  <Form :id="formId" :values="initialValues" :onSubmit="handleSubmit">
    <template #default="{ form }">
      <Colapsable
        title="General Information"
        description="Basic details about the service reminder."
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

          <SelectInput
            name="serviceTask"
            label="Service Task"
            :attributes="{
              placeholder: 'Choose service task',
            }"
            searchable
            label_key="name"
            value_key="_id"
            url="/service-task"
            :options="
              initialLabels?.serviceTask
                ? [
                    {
                      label: initialLabels.serviceTask,
                      value: initialValues?.serviceTask,
                    },
                  ]
                : []
            "
            :validation="{
              required,
            }"
          />

          <SelectInput
            name="type"
            label="Type"
            :options="[
              { value: 'kilometer', label: 'Based on Kilometers' },
              { value: 'time', label: 'Based on Time intervals' },
            ]"
            :attributes="{
              placeholder: 'Select type',
            }"
            :validation="{
              required,
            }"
          />
        </div>
      </Colapsable>

      <!-- Conditional Fields Wrapper -->
      <component
        :is="form.Subscribe"
        :selector="(state: any) => [state.values.type]"
      >
        <template #default="[type]">
          <!-- Time Based Fields -->
          <Colapsable
            v-if="type === 'time'"
            title="Time Intervals"
            description="Settings for time-based reminders."
          >
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Input
                name="interval"
                label="Time Interval"
                :attributes="{
                  placeholder: 'Enter interval',
                  type: 'number',
                }"
                :validation="{
                  required,
                }"
              />

              <DateInput
                name="lastServiceDate"
                label="Last Service Date"
                :attributes="{
                  placeholder: 'Select date',
                }"
                :validation="{
                  required,
                }"
              />

              <Input
                name="reminderDays"
                label="Reminder Days"
                :attributes="{
                  placeholder: 'Enter reminder days',
                  type: 'number',
                }"
                :validation="{
                  required,
                }"
              />
            </div>
          </Colapsable>

          <!-- Kilometer Based Fields -->
          <Colapsable
            v-if="type === 'kilometer'"
            title="Mileage Intervals"
            description="Settings for kilometer-based reminders."
          >
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Input
                name="mileageInterval"
                label="Mileage Interval"
                :attributes="{
                  placeholder: 'Enter mileage interval',
                  type: 'number',
                }"
                :validation="{
                  required,
                }"
              />

              <Input
                name="lastServiceMileage"
                label="Last Service Mileage"
                :attributes="{
                  placeholder: 'Enter last service mileage',
                  type: 'number',
                }"
                :validation="{
                  required,
                }"
              />

              <Input
                name="reminderMileage"
                label="Reminder Mileage"
                :attributes="{
                  placeholder: 'Enter reminder mileage',
                  type: 'number',
                }"
                :validation="{
                  required,
                }"
              />
            </div>
          </Colapsable>
        </template>
      </component>

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
import DateInput from "@/components/form/DateInput.vue";
import Colapsable from "@/components/common/Colapsable.vue";
import VehicleInput from "@/components/common/inputs/VehicleInput.vue";
import { required } from "@/utils/validations";

const props = defineProps<{
  formId: string;
  initialValues: Record<string, any>;
  initialLabels?: Record<string, any>;
  onSubmit: (values: any) => Promise<void> | void;
}>();

const handleSubmit = async (values: any) => {
  const payload = { ...values };

  // Convert string numbers to Number
  if (payload.interval) payload.interval = Number(payload.interval);
  if (payload.reminderDays) payload.reminderDays = Number(payload.reminderDays);
  if (payload.mileageInterval) payload.mileageInterval = Number(payload.mileageInterval);
  if (payload.lastServiceMileage) payload.lastServiceMileage = Number(payload.lastServiceMileage);
  if (payload.reminderMileage) payload.reminderMileage = Number(payload.reminderMileage);

  // Clean up unused fields based on type
  if (payload.type === "time") {
    delete payload.mileageInterval;
    delete payload.lastServiceMileage;
    delete payload.reminderMileage;
  } else {
    delete payload.interval;
    delete payload.lastServiceDate;
    delete payload.reminderDays;
  }

  // Remove UI-only 'type' field before sending to backend
  delete payload.type;

  await props.onSubmit(payload);
};
</script>
