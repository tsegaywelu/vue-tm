<template>
  <Form :id="formId" :values="initialValues" :onSubmit="handleSubmit">
    <template #default="{ form }">
      <Colapsable
        title="Mechanic Information"
        description="Enter the personal details of the mechanic."
      >
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Input
            name="firstName"
            label="First Name"
            :attributes="{
              placeholder: 'Enter first name',
            }"
            :validation="{
              required,
            }"
          />

          <Input
            name="middleName"
            label="Middle Name"
            :attributes="{
              placeholder: 'Enter middle name',
            }"
            :validation="{
              required,
            }"
          />

          <Input
            name="lastName"
            label="Last Name"
            :attributes="{
              placeholder: 'Enter last name',
            }"
          />

          <Input
            name="employeeNumber"
            label="Employee Number"
            :attributes="{
              placeholder: 'Enter employee number',
              type: 'text',
            }"
          />

          <Input
            name="phoneNumber"
            label="Phone Number"
            :attributes="{
              placeholder: '+251...',
            }"
            :validation="{
              required,
              phone,
            }"
          />

          <DateInput
            name="dateOfBirth"
            label="Date of Birth"
            :attributes="{
              placeholder: 'Select date',
            }"
          />
        </div>
      </Colapsable>

      <Colapsable
        title="Professional Details"
        description="Provide professional details such as certification and experience."
      >
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Input
            name="certification"
            label="Certification"
            :attributes="{
              placeholder: 'Enter certification',
            }"
          />

          <Input
            name="experience"
            label="Experience (Years)"
            :attributes="{
              placeholder: 'Enter years of experience',
              type: 'number',
            }"
            :validation="{
              required,
            }"
          />

          <ToggleInput
            name="isInternal"
            label="Internal Mechanic"
            :on_change="(val) => handleInternalToggle(val, form)"
          />

          <WorkshopInput
            v-if="!isInternal"
            name="workshop"
            :attributes="{ placeholder: 'Choose workshop' }"
            :validation="{ required }"
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
import { ref, watch } from "vue";
import Form from "@/components/form/Form.vue";
import Input from "@/components/form/Input.vue";
import SelectInput from "@/components/form/SelectInput.vue";
import WorkshopInput from "@/components/common/inputs/WorkshopInput.vue";
import DateInput from "@/components/form/DateInput.vue";
import ToggleInput from "@/components/form/ToggleInput.vue";
import Colapsable from "@/components/common/Colapsable.vue";
import { phone, required } from "@/utils/validations";

const props = defineProps<{
  formId: string;
  initialValues: Record<string, any>;
  onSubmit: (values: any) => Promise<void> | void;
}>();

const isInternal = ref(props.initialValues.isInternal !== false);

const handleInternalToggle = (val: boolean, form: any) => {
  isInternal.value = val;
  form.setFieldValue("workshop", "");
};

const handleSubmit = async (values: any) => {
  const payload = {
    ...values,
    experience: values.experience ? Number(values.experience) : undefined,
    // If internal, remove workshop
    workshop: values.isInternal ? undefined : values.workshop,
  };
  await props.onSubmit(payload);
};

// Sync isInternal with initial values if they change
watch(
  () => props.initialValues.isInternal,
  (newVal) => {
    isInternal.value = newVal !== false;
  },
  { immediate: true },
);
</script>
