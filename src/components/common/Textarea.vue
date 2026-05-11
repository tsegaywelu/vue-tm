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
    <textarea
      autocomplete="off"
      class="focus:shadow-none bg-transparent flex-1 w-full outline-none resize-y"
      :id="name"
      :name="name"
      :data-name="name"
      :placeholder="placeholder"
      :disabled="disabled"
      :value="modelValue"
      :rows="rows"
      @input="handleInput($event)"
      @blur="$emit('blur')"
      v-bind="attributes"
    />
  </InputLayout>
</template>

<script setup lang="ts">
import { type TextareaHTMLAttributes } from "vue";
import InputLayout from "@/components/form/InputLayout.vue";
import type { InputLayoutProps } from "@/components/form/InputLayout.vue";

export interface CommonTextareaProps extends Omit<
  InputLayoutProps,
  "error" | "validations"
> {
  name?: string;
  modelValue?: string | null;
  error?: string | any[];
  validations?: Record<string, any>;
  attributes?: TextareaHTMLAttributes;
  capitalize?: boolean;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
}

const props = withDefaults(defineProps<CommonTextareaProps>(), {
  name: "",
  modelValue: "",
  error: undefined,
  validations: () => ({}),
  attributes: () => ({}),
  capitalize: false,
  show_validation_status: false,
  parent_class_name: "",
  size: "sm",
  label: "",
  left_component: null as any,
  right_component: null as any,
  input_style: "!h-auto border-[#DFE1E7] p-2.5 px-3",
  right_component_class_name: "",
  description: "",
  error_type: "text",
  rows: 4,
});

const emit = defineEmits(["update:modelValue", "blur"]);

function handleInput(ev: Event) {
  const target = ev.target as HTMLTextAreaElement;
  let val = target.value;
  if (props.capitalize && val) {
    val = val.trim().charAt(0).toUpperCase() + val.slice(1);
    target.value = val;
  }
  emit("update:modelValue", val);
}
</script>
