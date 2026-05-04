<template>
  <Form :id="formId" :values="initialValues" :onSubmit="onSubmit">
    <template #default="{ form }">
      <Colapsable
        title="User Information"
        description="Basic account details and access levels."
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            name="username"
            label="Username"
            :validation="{ required }"
          />
          
          <template v-if="!isEdit">
            <div class="space-y-1">
              <Input
                name="password"
                label="Password"
                type="password"
                :validation="{ required }"
              />
              <button
                type="button"
                @click="generatePassword(form)"
                class="text-[10px] text-primary font-bold hover:underline ml-1"
              >
                Generate Random
              </button>
            </div>
            <Input
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              :validation="{ required }"
            />
          </template>

          <SelectInput
            name="role"
            label="Role"
            url="/role"
            label_key="name"
            value_key="_id"
            searchable
            :validation="{ required }"
          />

          <SelectInput
            name="region"
            label="Region"
            url="/region"
            label_key="name"
            value_key="_id"
            searchable
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
import SelectInput from "@/components/form/SelectInput.vue";
import Colapsable from "@/components/common/Colapsable.vue";
import { required } from "@/utils/validations";

const props = defineProps<{
  formId: string;
  initialValues: Record<string, any>;
  onSubmit: (values: any) => Promise<void> | void;
  isEdit?: boolean;
}>();

const generatePassword = (form: any) => {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  const retVal = Array.from({ length: 12 }, () => charset.charAt(Math.floor(Math.random() * charset.length))).join("");
  form.setFieldValue("password", retVal);
  form.setFieldValue("confirmPassword", retVal);
};
</script>
