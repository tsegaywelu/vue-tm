<template>
  <Form :id="formId" :values="initialValues" :onSubmit="handleSubmit" :enable_unsaved_guard="false">
    <template #default="{ form }">
      <Colapsable
        title="Fuel Entry Details"
        description="Record fuel purchase information for a vehicle."
      >
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <VehicleInput
            name="vehicle"
            label="Vehicle"
            :validation="{ required }"
            :options="props.labels?.vehicle ? [{ label: props.labels.vehicle, value: props.initialValues.vehicle }] : []"
          />

          <DateInput
            name="date"
            label="Fuel Date"
            :validation="{ required }"
            :attributes="{ placeholder: 'Select date' }"
          />

          <SelectInput
            name="usageType"
            label="Usage Type"
            :options="usageTypeOptions"
            :validation="{ required }"
            :attributes="{ placeholder: 'Select usage type' }"
          />

          <Input
            name="odometer"
            label="Odometer Reading"
            :validation="{ required, number }"
            :attributes="{ placeholder: '0', type: 'number' }"
          />

          <Input
            name="quantity"
            label="Quantity (L)"
            :validation="{ required, number }"
            :attributes="{ placeholder: '0.00', type: 'number' }"
            :on_change="(val) => updateAmount(form, { quantity: val })"
          />

          <Input
            name="unitPrice"
            label="Unit Price"
            :validation="{ required, number }"
            :attributes="{ placeholder: '0.00', type: 'number' }"
            :on_change="(val) => updateAmount(form, { unitPrice: val })"
          />

          <Input
            name="amount"
            label="Total Amount"
            :attributes="{ placeholder: '0.00', type: 'number' }"
          />

          <Input
            name="vendor"
            label="Vendor / Station"
            :attributes="{ placeholder: 'Enter vendor name' }"
          />

          <Input
            name="reference"
            label="Reference No."
            :attributes="{ placeholder: 'Enter reference number' }"
          />
        </div>

        <div class="mt-6">
          <TextareaInput
            name="comment"
            label="Comment"
            :attributes="{ placeholder: 'Any additional notes...', rows: 3 }"
          />
        </div>
      </Colapsable>

      <Colapsable
        title="Photos"
        description="Attach photos of the fuel receipt or pump."
      >
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

const usageTypeOptions = [
  { label: "Business", value: "BUSINESS" },
  { label: "Personal", value: "PERSONAL" },
];

const updateAmount = (form: any, override: Record<string, any>) => {
  const values = { ...form.state.values, ...override };
  const qty = parseFloat(values.quantity);
  const price = parseFloat(values.unitPrice);
  if (qty > 0 && price > 0) {
    form.setFieldValue("amount", (qty * price).toFixed(2));
  }
};

const handleSubmit = (values: any) => {
  const formData = new FormData();

  const fields = [
    "vehicle", "date", "odometer", "quantity", "unitPrice",
    "amount", "vendor", "reference", "usageType", "comment",
  ];

  fields.forEach((key) => {
    if (values[key] !== undefined && values[key] !== null && values[key] !== "") {
      formData.append(key, values[key]);
    }
  });

  formData.append("carrier", authStore.carrierId);

  if (values.photos?.length) {
    values.photos.forEach((file: File) => {
      if (file instanceof File) formData.append("photos", file);
    });
  }

  props.onSubmit(formData);
};
</script>
