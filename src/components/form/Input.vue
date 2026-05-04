<template>
  <InputParent
    :name="name"
    :validation="validation"
    :match="match"
    :on_change="on_change"
  >
    <template #default="{ field }">
      <BaseInput
        :name="name"
        :show_validation_status="show_validation_status"
        :parent_class_name="parent_class_name"
        :size="size"
        :label="label"
        :error="field.state.meta.errors.length ? field.state.meta.errors[0] : undefined"
        :validations="validation"
        :left_component="left_component"
        :right_component="right_component"
        :input_style="input_style"
        :right_component_class_name="right_component_class_name"
        :description="description"
        :error_type="error_type"
        :input_class="input_class"
        :type="type"
        :step="step"
        :placeholder="placeholder"
        :disabled="disabled"
        :modelValue="field.state.value ?? ''"
        @update:modelValue="handleInput($event, field)"
        @blur="field.handleBlur"
        :attributes="attributes"
      >
        <template #left_component v-if="$slots.left_component">
          <slot name="left_component" />
        </template>
        <template #right_component v-if="$slots.right_component">
          <slot name="right_component" />
        </template>
      </BaseInput>
    </template>
  </InputParent>
</template>

<script setup lang="ts">
import { type InputHTMLAttributes } from "vue";
import InputParent from "./InputParent.vue";
import type { InputLayoutProps } from "./InputLayout.vue";
import BaseInput from "@/components/common/Input.vue";

export interface InputProps extends InputLayoutProps {
  name: string;
  match?: string | string[];
  on_change?: (val: any, form: any) => void;
  validation?: Record<string, any>;
  attributes?: InputHTMLAttributes;
  capitalize?: boolean;
  text_length?: number;
  input_class?: string;
  type?: string;
  step?: string | number;
  placeholder?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<InputProps>(), {
  match: "",
  on_change: undefined,
  validation: () => ({}),
  attributes: () => ({}),
  capitalize: false,
  text_length: 0,
  show_validation_status: true,
  parent_class_name: "",
  size: "sm",
  label: "",
  left_component: null as any,
  right_component: null as any,
  input_style: "",
  right_component_class_name: "",
  description: "",
  error_type: "text",
  input_class: "",
});

function handleInput(val: any, field: any) {
  if (typeof val !== 'string') val = String(val);
  if (val.length < props.text_length) return;
  if (props.capitalize && val) {
    val = val.trim().charAt(0).toUpperCase() + val.slice(1);
  }
  field.handleChange(val);
}
</script>
