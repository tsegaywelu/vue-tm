<template>
  <Form :id="formId" :values="initialValues" :onSubmit="handleSubmit">
    <template #default="{ form }">
      <Colapsable
        title="General Information"
        description="Basic details about the service type."
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            name="name"
            label="Name"
            :attributes="{
              placeholder: 'Enter service type name',
            }"
            :validation="{
              required,
            }"
          />
        </div>
        <div class="mt-6">
          <TextareaInput
            name="description"
            label="Description"
            :attributes="{
              placeholder: 'Enter description',
              rows: 3,
            }"
          />
        </div>
      </Colapsable>

      <ServiceTaskSelectInput
        name="serviceTasks"
        :initial-value="initialValues.serviceTasks"
        :initial-labels="initialLabels"
      />

      <!-- Action Footer -->
      <div class="pt-10 flex flex-col sm:flex-row justify-end gap-3 *:w-full sm:*:w-auto *:min-h-[52px] sm:*:min-h-0 *:text-base sm:*:text-sm *:rounded-2xl sm:*:rounded-xl">
        <slot :form="form" name="submit-btn"></slot>
      </div>
    </template>
  </Form>
</template>

<script setup lang="ts">
import Form from "@/components/form/Form.vue";
import Input from "@/components/form/Input.vue";
import TextareaInput from "@/components/form/TextareaInput.vue";
import Colapsable from "@/components/common/Colapsable.vue";
import ServiceTaskSelectInput from "./ServiceTaskSelectInput.vue";
import { required } from "@/utils/validations";
import { icons } from "@/utils/icons";

const props = defineProps<{
  formId: string;
  initialValues: Record<string, any>;
  initialLabels?: Record<string, string>;
  onSubmit: (values: any) => Promise<void> | void;
}>();

const handleSubmit = async (values: any) => {
  const payload = {
    ...values,
    serviceTasks: values.serviceTasks?.filter((id: string) => !!id) || [],
  };
  await props.onSubmit(payload);
};
</script>
