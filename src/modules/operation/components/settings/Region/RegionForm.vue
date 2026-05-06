<template>
  <Form :id="formId" :values="initialValues" :onSubmit="onSubmit">
    <template #default="{ form }">
      <Colapsable
        title="Region Information"
        description="Provide details about the region."
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            name="name"
            label="Name"
            :validation="{ required }"
            :attributes="{
              placeholder: 'Name',
            }"
          />
          <Input
            name="odometerRouteToleranceKilometer"
            label="Odometer route tolerance (km)"
            :attributes="{
              placeholder: 'Odometer route tolerance (km)',
            }"
            type="number"
          />
        </div>

        <div class="mt-6 space-y-4">
          <Checkbox
            name="notificationEnabled"
            label="Enable SMS/Notification for this region"
          />
          <Checkbox
            name="enforceOdometerRouteTolerance"
            label="Enforce odometer vs route distance tolerance"
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
import Checkbox from "@/components/form/Checkbox.vue";
import Colapsable from "@/components/common/Colapsable.vue";
import { required } from "@/utils/validations";

defineProps<{
  formId: string;
  initialValues: Record<string, any>;
  onSubmit: (values: any) => Promise<void> | void;
}>();
</script>
