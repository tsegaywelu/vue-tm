<template>
  <InputLayout
    :name="name"
    :show_validation_status="show_validation_status"
    :parent_class_name="parent_class_name"
    :size="size"
    :label="label"
    :error="error"
    :validations="validations"
    :left_component="left_component"
    :right_component="right_component"
    :input_style="input_style"
    :right_component_class_name="right_component_class_name"
    :description="description"
    :error_type="error_type"
  >
    <template #left_component v-if="$slots.left_component">
      <slot name="left_component" />
    </template>

    <input
      autocomplete="off"
      class="focus:shadow-none bg-transparent flex-1 w-full"
      :class="input_class"
      :id="name"
      :name="name"
      :data-name="name"
      :type="type"
      :step="step"
      :placeholder="placeholder"
      :disabled="disabled"
      :value="modelValue"
      @input="handleInput($event)"
      @blur="$emit('blur')"
      v-bind="attributes"
    />

    <template #right_component v-if="$slots.right_component">
      <slot name="right_component" />
    </template>
  </InputLayout>
</template>

<script setup lang="ts">
import { type InputHTMLAttributes } from "vue";
import InputLayout from "@/components/form/InputLayout.vue";
import type { InputLayoutProps } from "@/components/form/InputLayout.vue";

export interface CommonInputProps extends Omit<InputLayoutProps, 'error' | 'validations'> {
  name?: string;
  modelValue?: string | number | null;
  error?: string | any[];
  validations?: Record<string, any>;
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

const props = withDefaults(defineProps<CommonInputProps>(), {
  name: "",
  modelValue: "",
  error: undefined,
  validations: () => ({}),
  attributes: () => ({}),
  capitalize: false,
  text_length: 0,
  show_validation_status: false,
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

const emit = defineEmits(["update:modelValue", "blur"]);

function handleInput(ev: Event) {
  const target = ev.target as HTMLInputElement;
  let val = target.value;
  if (val.length < props.text_length) return;
  if (props.capitalize && val) {
    val = val.trim().charAt(0).toUpperCase() + val.slice(1);
    target.value = val;
  }
  emit("update:modelValue", val);
}
</script>
