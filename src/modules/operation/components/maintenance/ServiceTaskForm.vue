<template>
  <Form :id="formId" :values="initialValues" :onSubmit="handleSubmit">
    <template #default="{ form }">
      <Colapsable
        title="General Information"
        description="Basic details about the service task."
      >
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FormInput
            name="name"
            label="Name"
            :attributes="{
              placeholder: 'Enter task name',
            }"
            :validation="{
              required,
            }"
          />

          <FormInput
            name="code"
            label="Code"
            :attributes="{
              placeholder: 'Enter task code',
            }"
            :validation="{
              required,
            }"
          />

          <FormInput
            name="estimatedDuration"
            label="Estimated Duration (Days)"
            :attributes="{
              placeholder: 'Enter duration in days',
              type: 'number',
            }"
            :validation="{
              required,
            }"
          />

          <SelectInput
            name="priority"
            label="Priority"
            :options="[
              { label: 'High', value: 'HIGH' },
              { label: 'Medium', value: 'MEDIUM' },
              { label: 'Low', value: 'LOW' },
            ]"
            :attributes="{
              placeholder: 'Select priority',
            }"
            :validation="{
              required,
            }"
          />

          <FormInput
            name="estimatedCost"
            label="Estimated Cost"
            :attributes="{
              placeholder: 'Enter estimated cost',
              type: 'number',
            }"
            :validation="{
              required,
            }"
          />
        </div>
      </Colapsable>

      <RequiredPartsInput
        name="requiredParts"
        :initial-value="initialValues.requiredParts"
      />

      <Colapsable
        title="Description"
        description="Additional details about the service task."
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
import Form from "@/components/form/Form.vue";
import FormInput from "@/components/form/Input.vue";
import SelectInput from "@/components/form/SelectInput.vue";
import TextareaInput from "@/components/form/TextareaInput.vue";
import Colapsable from "@/components/common/Colapsable.vue";
import RequiredPartsInput from "./RequiredPartsInput.vue";
import { required } from "@/utils/validations";
import { icons } from "@/utils/icons";

const props = defineProps<{
  formId: string;
  initialValues: Record<string, any>;
  onSubmit: (values: any) => Promise<void> | void;
}>();

const handleSubmit = async (values: any) => {
  const payload = {
    ...values,
    estimatedDuration: values.estimatedDuration ? Number(values.estimatedDuration) : 0,
    estimatedCost: values.estimatedCost ? Number(values.estimatedCost) : 0,
    requiredParts: (values.requiredParts || []).filter((p: string) => p.trim() !== ""),
  };
  await props.onSubmit(payload);
};
</script>
