<template>
  <Form :id="formId" :values="initialValues" :onSubmit="handleSubmit">
    <template #default="{ form }">
      <Colapsable
        title="Expense Type Information"
        description="Basic details about the expense type."
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            name="name"
            label="Name"
            :attributes="{
              placeholder: 'Enter expense type name',
            }"
            :validation="{
              required,
            }"
          />
          <Input
            name="typicalPrice"
            label="Typical Price"
            :attributes="{
              placeholder: 'Enter typical price',
              type: 'number',
            }"
            :validation="{
              required,
              number,
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
import TextareaInput from "@/components/form/TextareaInput.vue";
import Colapsable from "@/components/common/Colapsable.vue";
import { required, number } from "@/utils/validations";

defineProps<{
  formId: string;
  initialValues: Record<string, any>;
  onSubmit: (values: any) => Promise<void> | void;
}>();

const handleSubmit = async (values: any) => {
  await props.onSubmit(values);
};
</script>
