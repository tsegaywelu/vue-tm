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
            :attributes="{
              placeholder: 'Enter username...',
            }"
          />

          <template v-if="!isEdit">
            <div class="grid grid-cols-2 gap-2">
              <div class="space-y-1">
                <PasswordInput
                  name="password"
                  label="Password"
                  type="password"
                  :attributes="{ placeholder: 'Enter password' }"
                  :validation="{ required, password }"
                />
                <button
                  type="button"
                  @click="generatePassword(form)"
                  class="text-[10px] text-primary font-bold hover:underline ml-1"
                >
                  Generate Random
                </button>
              </div>
              <PasswordInput
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                :attributes="{ placeholder: 'Confirm your password' }"
                :validation="{
                  required,
                  fun: (value: string, msg: any, form: any) => {
                    return isEqualTo(value, form.state.values.password);
                  },
                }"
              />
            </div>
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
import { isEqualTo, password, required } from "@/utils/validations";
import PasswordInput from "@/components/form/PasswordInput.vue";

const props = defineProps<{
  formId: string;
  initialValues: Record<string, any>;
  onSubmit: (values: any) => Promise<void> | void;
  isEdit?: boolean;
}>();

const generatePassword = (form: any) => {
  const charset = "0123456789";
  const retVal = Array.from({ length: 6 }, () =>
    charset.charAt(Math.floor(Math.random() * charset.length)),
  ).join("");
  form.setFieldValue("password", retVal);
  form.setFieldValue("confirmPassword", retVal);
};
</script>
