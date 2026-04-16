<template>
  <div class="flex flex-col" :class="[gapClass, parent_class_name]">
    <span v-if="label" class="flex items-center gap-1" :class="labelClass">
      {{ label }}
      <div v-if="validations?.required">
        <span class="text-xs text-red-500">*</span>
      </div>
      <span v-else-if="show_validation_status" class="text-xs text-grey-600"
        >(Optional)</span
      >
      <span
        v-if="description && show_validation_status"
        class="text-xs text-grey-600 capitalize"
      >
        ({{ description }})
      </span>
    </span>

    <div
      class="input-focus"
      :class="[
        inputClass,
        error_type === 'border' && has_error ? 'border-red-500' : '',
        input_style,
      ]"
      @blur="$emit('blur')"
    >
      <div
        class="flex items-center gap-2 h-full w-full"
        :class="[
          has_left_component ? '[&_input]:pl-0 pl-4' : '',
          has_right_component ? 'pr-4' : '',
        ]"
      >
        <div
          v-if="$slots.left_component || left_component"
          class="h-full max-h-7 min-w-7 flex items-center justify-start"
        >
          <slot name="left_component">
            {{ left_component }}
          </slot>
        </div>

        <slot />

        <div
          v-if="$slots.right_component || right_component"
          class="h-full max-h-7 min-w-7 flex items-center justify-end"
          :class="right_component_class_name"
        >
          <slot name="right_component">
            {{ right_component }}
          </slot>
        </div>
      </div>
    </div>

    <InputError v-if="error_type === 'text' && has_error" :error="error" />
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from "vue";
import InputError from "./InputError.vue";

export interface InputLayoutProps {
  name?: string;
  show_validation_status?: boolean;
  parent_class_name?: string;
  size?: "sm" | "md" | "lg";
  label?: string;
  error?: string | string[];
  validations?: Record<string, any>;
  left_component?: string | object;
  right_component?: string | object;
  input_style?: string;
  right_component_class_name?: string;
  description?: string;
  error_type?: "text" | "border";
}

const props = withDefaults(defineProps<InputLayoutProps>(), {
  name: "",
  show_validation_status: true,
  parent_class_name: "",
  size: "sm",
  label: "",
  error: null as any,
  validations: () => ({}),
  left_component: null as any,
  right_component: null as any,
  input_style: "",
  right_component_class_name: "",
  description: "",
  error_type: "text",
});

defineEmits(["blur"]);
const slots = useSlots();

const has_error = computed(() => {
  if (Array.isArray(props.error)) return props.error.length > 0;
  return !!props.error;
});

const has_left_component = computed(
  () => !!slots.left_component || !!props.left_component,
);
const has_right_component = computed(
  () => !!slots.right_component || !!props.right_component,
);

const gapClass = computed(() => {
  const map: Record<string, string> = {
    sm: "gap-input-gap-sm",
    md: "gap-input-gap-sm",
    lg: "gap-input-gap",
  };
  return map[props.size] || map.md;
});

const labelClass = computed(() => {
  const map: Record<string, string> = {
    sm: "input-label-sm",
    md: "input-label",
  };
  return map[props.size] || map.md;
});

const inputClass = computed(() => {
  const map: Record<string, string> = {
    sm: "input-style-sm",
    md: "input-style",
  };
  return map[props.size] || map.md;
});
</script>
