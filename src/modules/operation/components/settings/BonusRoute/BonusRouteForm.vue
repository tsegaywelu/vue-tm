<template>
  <Form :id="formId" :values="initialValues" :onSubmit="onSubmit">
    <template #default="{ form }">
      <Colapsable
        title="Bonus Route Information"
        description="Provide details about the bonus route."
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectInput
            name="route"
            label="Route"
            url="/route"
            label_key="routeName"
            value_key="_id"
            searchable
            :initial-labels="initialLabels"
            :validation="{ required }"
          />

          <Input
            name="amount"
            label="Bonus Amount (ETB)"
            :attributes="{
              type: 'number',
              step: '0.01',
              placeholder: 'Bonus Amount (ETB)'
            }"
            :validation="{ required }"
          />

          <div class="md:col-span-2">
            <Input
              name="description"
              label="Description (Optional)"
              :attributes="{
                placeholder: 'Description'
              }"
            />
          </div>
        </div>
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
import Colapsable from "@/components/common/Colapsable.vue";
import { required } from "@/utils/validations";

defineProps<{
  formId: string;
  initialValues: Record<string, any>;
  initialLabels?: Record<string, string>;
  onSubmit: (values: any) => Promise<void> | void;
}>();
</script>
