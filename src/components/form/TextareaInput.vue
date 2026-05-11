<template>
  <InputParent
    :name="name"
    :validation="validation"
    :match="match"
    :on_change="on_change"
  >
    <template #default="{ field }">
      <Textarea
        v-bind="props"
        :name="field.name"
        :modelValue="field.state.value ?? ''"
        :error="
          field.state.meta.errors.length ? field.state.meta.errors : undefined
        "
        @update:modelValue="field.handleChange"
        @blur="field.handleBlur"
      >
        <template #left_component v-if="$slots.left_component">
          <slot name="left_component" />
        </template>
        <template #right_component v-if="$slots.right_component">
          <slot name="right_component" />
        </template>
      </Textarea>
    </template>
  </InputParent>
</template>

<script setup lang="ts">
import { type TextareaHTMLAttributes } from 'vue';
import InputParent from "./InputParent.vue";
import Textarea from "../common/Textarea.vue";
import { type InputProps } from "./Input.vue";

export interface TextareaInputProps extends InputProps {
  attributes?: TextareaHTMLAttributes;
  cols?: number;
  rows?: number;
}

const props = withDefaults(defineProps<TextareaInputProps>(), {
  match: "",
  on_change: undefined,
  validation: () => ({}),
  attributes: () => ({}),
  capitalize: false,
  cols: undefined,
  rows: 4,

  show_validation_status: true,
  parent_class_name: "",
  size: "sm",
  label: "",
  left_component: null as any,
  right_component: null as any,
  description: "",
  error_type: "text",
});
</script>
