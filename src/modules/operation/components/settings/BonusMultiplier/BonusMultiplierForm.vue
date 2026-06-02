<template>
  <Form :id="formId" :values="initialValues" :onSubmit="onSubmit">
    <template #default="{ form }">
      <Colapsable
        title="Bonus Multiplier Information"
        description="Provide details about the bonus multiplier."
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectInput
            name="metric"
            label="Metric"
            :options="[
              { value: 'totalTrips', label: 'Trip Count' },
              { value: 'distanceCovered', label: 'Distance (KM)' },
              { value: 'fuelUsage', label: 'Fuel Usage (KM/L)' }
            ]"
            :validation="{ required }"
          />

          <Input
            name="multiplier"
            label="Multiplier"
            :attributes="{
              type: 'number',
              step: '0.01',
              placeholder: 'Multiplier'
            }"
            :validation="{ required }"
          />

          <Input
            name="minValue"
            label="Min Value (Inclusive)"
            :attributes="{
              type: 'number',
              step: '0.01',
              min: '0',
              placeholder: 'Min Value (Inclusive)'
            }"
            :validation="{ required }"
          />

          <Input
            name="maxValue"
            label="Max Value (Inclusive)"
            :attributes="{
              type: 'number',
              step: '0.01',
              min: '0',
              placeholder: 'Max Value (Inclusive)'
            }"
          />

          <SelectInput
            name="region"
            label="Region"
            url="/region/myRegions"
            label_key="name"
            value_key="_id"
            :attributes="{ placeholder: 'Select region' }"
          />

          <div class="md:col-span-2">
            <TextareaInput
              name="description"
              label="Description (Optional)"
              :attributes="{
                rows: 4,
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
import TextareaInput from "@/components/form/TextareaInput.vue";

defineProps<{
  formId: string;
  initialValues: Record<string, any>;
  onSubmit: (values: any) => Promise<void> | void;
}>();
</script>
