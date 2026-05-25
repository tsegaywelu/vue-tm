<template>
  <Form :id="formId" :values="initialValues" :onSubmit="handleSubmit">
    <template #default="{ form }">
      <Colapsable
        title="Recurring Rule Details"
        description="Define a schedule for automatically generating vehicle expense entries."
      >
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <VehicleInput
            name="vehicle"
            label="Vehicle"
            :validation="{ required }"
            :options="props.labels?.vehicle ? [{ label: props.labels.vehicle, value: props.initialValues.vehicle }] : []"
          />

          <SelectInput
            name="vehicleExpenseType"
            label="Expense Type"
            url="/expense-type"
            label_key="name"
            value_key="_id"
            searchable
            :params="expenseTypeParams"
            :validation="{ required }"
            :attributes="{ placeholder: 'Select expense type' }"
            :options="props.labels?.vehicleExpenseType ? [{ label: props.labels.vehicleExpenseType, value: props.initialValues.vehicleExpenseType }] : []"
          />

          <Input
            name="amount"
            label="Amount"
            :validation="{ required, number }"
            :attributes="{ placeholder: '0.00', type: 'number' }"
          />

          <SelectInput
            name="frequency"
            label="Frequency"
            :options="frequencyOptions"
            :validation="{ required }"
            :attributes="{ placeholder: 'Select frequency' }"
          />

          <Input
            name="interval"
            label="Interval"
            :attributes="{ placeholder: '1', type: 'number', min: 1 }"
          />

          <DateInput
            name="startDate"
            label="Start Date"
            :validation="{ required }"
            :attributes="{ placeholder: 'Select start date' }"
          />

          <DateInput
            name="endDate"
            label="End Date"
            :attributes="{ placeholder: 'Select end date (optional)' }"
          />

          <Input
            name="vendor"
            label="Vendor"
            :attributes="{ placeholder: 'Enter vendor name' }"
          />

          <Input
            name="reference"
            label="Reference No."
            :attributes="{ placeholder: 'Enter reference number' }"
          />

          <ToggleInput name="autopost" label="Auto-Post Entries" />
        </div>

        <div class="mt-6">
          <TextareaInput
            name="notes"
            label="Notes"
            :attributes="{ placeholder: 'Any additional notes...', rows: 3 }"
          />
        </div>
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
import Colapsable from "@/components/common/Colapsable.vue";
import VehicleInput from "@/components/common/inputs/VehicleInput.vue";
import { required, number } from "@/utils/validations";
import { useAuthStore } from "@/store/authStore";

const authStore = useAuthStore();

const props = defineProps<{
  formId: string;
  initialValues: Record<string, any>;
  labels?: Record<string, string>;
  onSubmit: (data: Record<string, any>) => Promise<void> | void;
}>();

const frequencyOptions = [
  { label: "Daily", value: "DAILY" },
  { label: "Weekly", value: "WEEKLY" },
  { label: "Monthly", value: "MONTHLY" },
];

const expenseTypeParams = (state: any) => ({
  name: { regex: state.search },
  scope: "VEHICLE,BOTH",
  q: undefined,
});

const handleSubmit = (values: any) => {
  const payload: Record<string, any> = {
    carrier: authStore.carrierId,
  };

  const fields = [
    "vehicle", "vehicleExpenseType", "amount", "frequency",
    "startDate", "endDate", "vendor", "reference", "notes",
    "autopost",
  ];

  fields.forEach((key) => {
    if (values[key] !== undefined && values[key] !== null && values[key] !== "") {
      payload[key] = values[key];
    }
  });

  if (values.interval && Number(values.interval) >= 1) {
    payload.interval = Number(values.interval);
  }

  if (payload.amount) payload.amount = Number(payload.amount);

  props.onSubmit(payload);
};
</script>
