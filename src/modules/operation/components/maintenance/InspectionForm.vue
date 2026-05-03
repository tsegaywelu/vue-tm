<template>
  <Form :id="formId" :values="initialValues" :onSubmit="handleSubmit">
    <template #default="{ form }">
      <Colapsable
        title="General Information"
        description="Basic details about the inspection."
      >
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            :validation="{
              required,
            }"
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

          <SelectInput
            name="inspector"
            label="Inspector"
            :attributes="{
              placeholder: 'Choose inspector',
            }"
            searchable
            label_key="name"
            value_key="_id"
            url="/contact"
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
          <div
            v-for="(issue, index) in issues"
            :key="index"
            class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-gray-50 p-4 rounded-lg relative"
          >
            <Input
              :name="`issuesFound.${index}.description`"
              label="Description"
              :attributes="{ placeholder: 'Describe the issue' }"
            />
            <SelectInput
              :name="`issuesFound.${index}.severity`"
              label="Severity"
              :options="[
                { label: 'Minor', value: 'MINOR' },
                { label: 'Moderate', value: 'MODERATE' },
                { label: 'Critical', value: 'CRITICAL' },
              ]"
            />
            <SelectInput
              :name="`issuesFound.${index}.issueType`"
              label="Type"
              :options="[
                { label: 'Damage', value: 'DAMAGE' },
                { label: 'Fault', value: 'FAULT' },
                { label: 'Other', value: 'OTHER' },
              ]"
            />
            <Button
              type="button"
              variant="outline"
              class="w-fit text-error-600 border-error-200 hover:bg-error-50"
              @click="removeIssue(index, form)"
            >
              Remove
            </Button>
          </div>

          <Button
            type="button"
            variant="outline"
            class="mt-2"
            @click="addIssue(form)"
          >
            <template #leading>
              <div class="size-4" v-html="icons.plus"></div>
            </template>
            Add Issue
          </Button>
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
      <div class="pt-10 flex justify-end gap-4">
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
import Button from "@/components/Button.vue";
import { required } from "@/utils/validations";
import { icons } from "@/utils/icons";

const props = defineProps<{
  formId: string;
  initialValues: Record<string, any>;
  onSubmit: (values: any) => Promise<void> | void;
}>();

const issues = ref<any[]>(props.initialValues.issuesFound || []);

// Watch for changes in initialValues (especially for edit mode)
watch(() => props.initialValues.issuesFound, (newVal) => {
  issues.value = newVal || [];
}, { deep: true });

const addIssue = (form: any) => {
  const currentIssues = form.getFieldValue("issuesFound") || [];
  const updatedIssues = [
    ...currentIssues,
    { description: "", severity: "MINOR", issueType: "FAULT" },
  ];
  issues.value = updatedIssues;
  form.setFieldValue("issuesFound", updatedIssues);
};

const removeIssue = (index: number, form: any) => {
  const currentIssues = form.getFieldValue("issuesFound") || [];
  const updatedIssues = currentIssues.filter((_: any, i: number) => i !== index);
  issues.value = updatedIssues;
  form.setFieldValue("issuesFound", updatedIssues);
};

const handleSubmit = async (values: any) => {
  const payload = {
    ...values,
    odometerReading: values.odometerReading ? Number(values.odometerReading) : undefined,
  };
  await props.onSubmit(payload);
};
</script>
