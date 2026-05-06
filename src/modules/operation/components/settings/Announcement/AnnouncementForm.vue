<template>
  <Form :id="formId" :values="initialValues" :onSubmit="onSubmit">
    <template #default="{ form }">
      <Colapsable
        title="Announcement Details"
        description="Fill in the information for the announcement."
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            name="title"
            label="Title"
            :validation="{ required }"
          />

          <SelectInput
            name="targetAudience"
            label="Target Audience"
            :options="[
              { value: 'ALL', label: 'All Users' },
              { value: 'DRIVER', label: 'Drivers' },
              { value: 'MECHANIC', label: 'Mechanics' },
              { value: 'ADMIN', label: 'Admins' }
            ]"
            :validation="{ required }"
          />

          <div class="md:col-span-2">
            <Input
              name="message"
              label="Message"
              :attributes="{
                as: 'textarea',
                rows: '4',
                placeholder: 'Write your message here...'
              }"
              :validation="{ required }"
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
  onSubmit: (values: any) => Promise<void> | void;
}>();
</script>
