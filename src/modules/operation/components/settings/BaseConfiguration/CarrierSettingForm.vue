<template>
  <Form :id="formId" :values="initialValues" :onSubmit="onSubmit">
    <template #default="{ form }">
      <Colapsable
        title="Carrier Settings"
        description="Configure movement alerts and speed thresholds for the fleet."
      >
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input
            name="movementAlertStartHour"
            label="Movement Alert Start Hour"
            type="number"
            :validation="{ required }"
            :attributes="{
              placeholder: 'Enter movement alert start hour',
             
            }"
          />
          <Input
            name="movementAlertEndHour"
            label="Movement Alert End Hour"
            type="number"
            :validation="{ required }"
             :attributes="{
              placeholder: 'Enter movement alert end hour',
             
            }"
          />
          <Input
            name="speedAlertThreshold"
            label="Speed Alert Threshold (km/h)"
            type="number"
            :validation="{ required }"
             :attributes="{
              placeholder: 'Enter speed alert threshold',
             
            }"
          />
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
import Colapsable from "@/components/common/Colapsable.vue";
import { required } from "@/utils/validations";

defineProps<{
  formId: string;
  initialValues: Record<string, any>;
  onSubmit: (values: any) => Promise<void> | void;
}>();
</script>
