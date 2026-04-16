<template>
  <InputParent
    :name="name"
    :validation="validation"
    :match="match"
    :on_change="on_change"
  >
    <template #default="{ field }">
      <InputLayout
        :name="name"
        input_style="!h-auto border-[#DFE1E7] p-2.5 px-3"
        :show_validation_status="show_validation_status"
        :parent_class_name="parent_class_name"
        :size="size"
        :label="label"
        :error="field.state.meta.errors.length ? field.state.meta.errors : undefined"
        :validations="validation"
        :left_component="left_component"
        :right_component="right_component"
        :description="description"
        :error_type="error_type"
      >
        <template #left_component v-if="$slots.left_component">
          <slot name="left_component" />
        </template>
        
        <textarea
          autocomplete="off"
          class="focus:shadow-none w-full bg-transparent outline-none resize-y"
          :id="field.name"
          :name="field.name"
          :data-name="name"
          :value="field.state.value ?? ''"
          :cols="cols"
          :rows="rows"
          @input="handleInput($event, field)"
          @blur="field.handleBlur"
          v-bind="attributes"
        />

        <template #right_component v-if="$slots.right_component">
          <slot name="right_component" />
        </template>
      </InputLayout>
    </template>
  </InputParent>
</template>

<script setup lang="ts">
import { type TextareaHTMLAttributes } from 'vue';
import InputParent from "./InputParent.vue";
import InputLayout from "./InputLayout.vue";
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

function handleInput(ev: Event, field: any) {
  const target = ev.target as HTMLTextAreaElement;
  let val = target.value;
  if (props.capitalize && val) {
    val = val.trim().charAt(0).toUpperCase() + val.slice(1);
    target.value = val;
  }
  field.handleChange(val);
}
</script>
