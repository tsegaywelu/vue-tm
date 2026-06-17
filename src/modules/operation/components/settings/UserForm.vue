<template>
  <div class="flex flex-col gap-4">
    <Input
      name="username"
      label="Username"
      :validation="{ required }"
      :attributes="{
        placeholder: 'Enter username...',
      }"
    />

    <template v-if="!isEdit">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
            @click="generatePassword"
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
    :params="
      (state) => ({
        q: undefined,
        limit: undefined,
        'name[regexAny]': state.search,
      })
    "
    searchable
      name="region"
      label="Region"
      url="/region"
      label_key="name"
      value_key="_id"
    />
  </div>
</template>

<script setup lang="ts">
import { inject } from "vue";
import Form from "@/components/form/Form.vue";
import Input from "@/components/form/Input.vue";
import SelectInput from "@/components/form/SelectInput.vue";
import Colapsable from "@/components/common/Colapsable.vue";
import { isEqualTo, password, required } from "@/utils/validations";
import PasswordInput from "@/components/form/PasswordInput.vue";

const props = defineProps<{
  isEdit?: boolean;
}>();

const formContext = inject("formContext") as any;

const generatePassword = () => {
  const charset = "0123456789";
  const retVal = Array(8)
    .fill(0)
    .map(() => charset.charAt(Math.floor(Math.random() * charset.length)))
    .join("");
  formContext.form.setFieldValue("password", retVal);
  formContext.form.setFieldValue("confirmPassword", retVal);
};
</script>
