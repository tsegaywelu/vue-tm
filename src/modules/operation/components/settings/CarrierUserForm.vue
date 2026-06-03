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
            @click="genPassword"
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
      :display_value="labels?.role"
      :validation="{ required }"
    />

    <SelectInput
      name="regions"
      label="Region"
      url="/region/myRegions"
      label_key="name"
      value_key="_id"
      searchable
      multiple
    />
  </div>
</template>

<script setup lang="ts">
import { inject } from "vue";
import Input from "@/components/form/Input.vue";
import SelectInput from "@/components/form/SelectInput.vue";
import { isEqualTo, password, required } from "@/utils/validations";
import PasswordInput from "@/components/form/PasswordInput.vue";
import { generatePassword } from "@/utils/utils";

const props = defineProps<{
  isEdit?: boolean;
  labels?: { role?: string; region?: string };
}>();

const formContext = inject("formContext") as any;

const genPassword = () => {
  generatePassword((val: string) => {
    formContext.form.setFieldValue("password", val);
    formContext.form.setFieldValue("confirmPassword", val);
  });
};
</script>
