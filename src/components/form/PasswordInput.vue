<template>
  <Input
    v-bind="props"
    :attributes="{ ...attributes, type: showPassword ? 'text' : 'password' }"
    :validation="{ required: requiredValidation, ...validation }"
    :capitalize="false"
  >
    <template #left_component>
      <div><i class="mdi mdi-lock text-xl"></i></div>
    </template>
    <template #right_component>
      <div
        class="select-none text-gray-500 cursor-pointer grid place-items-center rounded-full size-8"
        @click="showPassword = !showPassword"
      >
        <i
          :class="
            showPassword ? 'mdi mdi-eye-outline' : 'mdi mdi-eye-off-outline'
          "
          class="text-xl"
        ></i>
      </div>
    </template>
  </Input>
</template>

<script setup lang="ts">
import Input, { type InputProps } from "./Input.vue";
import { required, password } from "@/utils/validations";

export interface PasswordInputProps extends InputProps {}

const props = withDefaults(defineProps<PasswordInputProps>(), {
  attributes: () => ({}),
  validation: () => ({}),
});

import { ref } from "vue";
const showPassword = ref(false);

function requiredValidation(v: any) {
  return required(v);
}
function passwordValidation(v: any) {
  return password(v);
}
</script>
