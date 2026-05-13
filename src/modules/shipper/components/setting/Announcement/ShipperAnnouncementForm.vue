<template>
  <Form :id="formId" :values="initialValues" :onSubmit="onSubmit">
    <template #default="{ form }">
      <Colapsable
        title="Announcement Information"
        description="Provide details about the announcement."
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            name="title"
            label="Title"
            :validation="{ required }"
            :attributes="{
              placeholder: 'Enter announcement title'
            }"
          />
          <SelectInput
            name="targetAudience"
            label="Target Audience"
            :options="[
              { label: 'All Users', value: 'ALL' },
              { label: 'Drivers', value: 'DRIVER' },
              { label: 'Mechanics', value: 'MECHANIC' },
            ]"
            :validation="{ required }"
          />
          <div class="md:col-span-2">
            <TextareaInput
              name="message"
              label="Message"
              :validation="{ required }"
              :attributes="{
                placeholder: 'Enter announcement message',
                rows: 4
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
import TextareaInput from "@/components/form/TextareaInput.vue";
import SelectInput from "@/components/form/SelectInput.vue";
import Colapsable from "@/components/common/Colapsable.vue";
import { required } from "@/utils/validations";

defineProps<{
  formId: string;
  initialValues: Record<string, any>;
  onSubmit: (values: any) => Promise<void> | void;
}>();
</script>
