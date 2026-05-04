<template>
  <Form :id="formId" :values="initialValues" :onSubmit="handleSubmit">
    <template #default="{ form }">
      <Colapsable
        title="Vendor Information"
        description="Contact and location details for the vendor."
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            name="name"
            label="Name"
            :attributes="{
              placeholder: 'Enter vendor name',
            }"
            :validation="{
              required,
            }"
          />
          <Input
            name="telephone"
            label="Telephone"
            :attributes="{
              placeholder: 'Enter telephone number',
            }"
            :validation="{
              required,
            }"
          />
          <Input
            name="address"
            label="Address"
            :attributes="{
              placeholder: 'Enter address',
            }"
            :validation="{
              required,
            }"
          />
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
import { required } from "@/utils/validations";

defineProps<{
  formId: string;
  initialValues: Record<string, any>;
  onSubmit: (values: any) => Promise<void> | void;
}>();

const handleSubmit = async (values: any) => {
  await props.onSubmit(values);
};
</script>
