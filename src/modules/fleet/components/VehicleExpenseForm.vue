<template>
  <Form :id="formId" :values="initialValues" :onSubmit="handleSubmit" :enable_unsaved_guard="false">
    <template #default="{ form }">
      <Colapsable
        title="Vehicle Expense Details"
        description="Record an expense entry for a vehicle."
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
            :options="expenseTypeOptions"
            :validation="{ required }"
            :attributes="{ placeholder: 'Select expense type' }"
          />

          <Input
            name="amount"
            label="Amount"
            :validation="{ required, number }"
            :attributes="{ placeholder: '0.00', type: 'number' }"
          />

          <DateInput
            name="date"
            label="Expense Date"
            :validation="{ required }"
            :attributes="{ placeholder: 'Select date' }"
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
        </div>

        <div class="mt-6">
          <TextareaInput
            name="notes"
            label="Notes"
            :attributes="{ placeholder: 'Any additional notes...', rows: 3 }"
          />
        </div>
      </Colapsable>

      <Colapsable title="Photos" description="Attach supporting photos or receipts.">
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
import { computed } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { required, number } from "@/utils/validations";
import { useAuthStore } from "@/store/authStore";
import { fetch_expense_types } from "@/modules/operation/api/finance.api";

const authStore = useAuthStore();

const props = defineProps<{
  formId: string;
  initialValues: Record<string, any>;
  labels?: Record<string, string>;
  onSubmit: (data: FormData) => Promise<void> | void;
}>();

const { data: expenseTypeResponse } = useQuery({
  queryKey: ["expense-type-all"],
  queryFn: () => fetch_expense_types({ limit: 200 }),
});

const expenseTypeOptions = computed(() => {
  const list: any[] = (expenseTypeResponse.value?.data as any)?.results ?? [];
  return list
    .filter((e: any) => !e.scope || e.scope === "VEHICLE" || e.scope === "BOTH")
    .map((e: any) => ({ label: e.name, value: e._id }));
});

const handleSubmit = (values: any) => {
  const formData = new FormData();

  const fields = [
    "vehicle", "vehicleExpenseType", "amount", "date",
    "notes", "vendor", "reference",
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
