<template>
  <Form :id="formId" :values="initialValues" :onSubmit="onSubmit">
    <template #default="{ form }">
      <Colapsable
        title="Packaging Information"
        description="Provide details about the packaging type."
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectInput
            name="shipper"
            label="Shipper"
            url="/shipper"
            label_key="name"
            value_key="_id"
            :validation="{ required }"
            :attributes="{ placeholder: 'Select shipper' }"
          />
          <Input
            name="name"
            label="Name"
            :validation="{ required }"
            :attributes="{
              placeholder: 'Enter packaging name'
            }"
          />
        </div>
      </Colapsable>

      <div class="pt-10 flex flex-col sm:flex-row justify-end gap-3 *:w-full sm:*:w-auto *:min-h-[52px] sm:*:min-h-0 *:text-base sm:*:text-sm *:rounded-2xl sm:*:rounded-xl">
        <slot :form="form" name="submit-btn"></slot>
      </div>
    </template>
  </Form>
</template>

<script setup lang="ts">
import Form from "@/components/form/Form.vue";
import Input from "@/components/form/Input.vue";
import SelectInput from "@/components/form/SelectInput.vue";
import Colapsable from "@/components/common/Colapsable.vue";
import { required } from "@/utils/validations";

defineProps<{
  formId: string;
  initialValues: Record<string, any>;
  onSubmit: (values: any) => Promise<void> | void;
}>();
</script>
