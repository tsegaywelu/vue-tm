<template>
  <Input
    v-bind="props"
    :attributes="{ ...attributes, type: showPassword ? 'text' : 'password' }"
    :validation="{ required: requiredValidation, ...validation }"
    :capitalize="false"
  >
    <template #left_component>
      <i class="size-5 block text-grey-400" v-html="icons.lock"></i>
    </template>
    <template #right_component>
      <div
        class="select-none text-grey-400 cursor-pointer grid place-items-center rounded-full size-8 hover:text-primary transition-colors"
        @click="showPassword = !showPassword"
      >
        <i
          class="size-6 block"
          v-html="showPassword ? icons.eye : icons.eyeClose"
        ></i>
      </div>
    </template>
  </Input>
</template>

<script setup lang="ts">
import Input, { type InputProps } from "./Input.vue";
import { required, password } from "@/utils/validations";
import { icons } from "@/utils/icons";

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
