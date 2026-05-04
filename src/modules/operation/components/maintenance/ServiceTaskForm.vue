<template>
  <Form :id="formId" :values="initialValues" :onSubmit="handleSubmit">
    <template #default="{ form }">
      <Colapsable
        title="General Information"
        description="Basic details about the service task."
      >
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Input
            name="name"
            label="Name"
            :attributes="{
              placeholder: 'Enter task name',
            }"
            :validation="{
              required,
            }"
          />

          <Input
            name="code"
            label="Code"
            :attributes="{
              placeholder: 'Enter task code',
            }"
            :validation="{
              required,
            }"
          />

          <Input
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

          <Input
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

      <Colapsable
        title="Required Parts"
        description="List any parts required to complete this task."
      >
        <div class="space-y-4">
          <div
            v-for="(part, index) in parts"
            :key="index"
            class="flex items-end gap-4 bg-gray-50 p-4 rounded-lg relative"
          >
            <div class="flex-1">
              <Input
                :name="`requiredParts.${index}`"
                label="Part Name"
                :attributes="{ placeholder: 'Enter part name' }"
                :validation="{ required }"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              class="w-fit text-error-600 border-error-200 hover:bg-error-50"
              @click="removePart(index, form)"
            >
              Remove
            </Button>
          </div>

          <Button
            type="button"
            variant="outline"
            class="mt-2"
            @click="addPart(form)"
          >
            <template #leading>
              <div class="size-4" v-html="icons.plus"></div>
            </template>
            Add Part
          </Button>
        </div>
      </Colapsable>

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

const parts = ref<string[]>(props.initialValues.requiredParts || [""]);

// Watch for changes in initialValues (especially for edit mode)
watch(() => props.initialValues.requiredParts, (newVal) => {
  parts.value = newVal && newVal.length > 0 ? newVal : [""];
}, { deep: true });

const addPart = (form: any) => {
  const currentParts = form.getFieldValue("requiredParts") || [];
  const updatedParts = [...currentParts, ""];
  parts.value = updatedParts;
  form.setFieldValue("requiredParts", updatedParts);
};

const removePart = (index: number, form: any) => {
  const currentParts = form.getFieldValue("requiredParts") || [];
  const updatedParts = currentParts.filter((_: any, i: number) => i !== index);
  parts.value = updatedParts;
  form.setFieldValue("requiredParts", updatedParts);
};

const handleSubmit = async (values: any) => {
  const payload = {
    ...values,
    estimatedDuration: values.estimatedDuration ? Number(values.estimatedDuration) : 0,
    estimatedCost: values.estimatedCost ? Number(values.estimatedCost) : 0,
    requiredParts: values.requiredParts?.filter((p: string) => p.trim() !== "") || [],
  };
  await props.onSubmit(payload);
};
</script>
