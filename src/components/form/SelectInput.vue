<template>
  <InputParent
    :name="name"
    :validation="validation"
    :match="match"
    :on_change="on_change"
  >
    <template #default="{ field }">
      <BaseSelect
        :name="name"
        :show_validation_status="show_validation_status"
        :parent_class_name="parent_class_name"
        :size="size"
        :label="label"
        :error="
          field.state.meta.errors.length
            ? field.state.meta.errors[0]
            : undefined
        "
        :validations="validation"
        :left_component="left_component"
        :description="description"
        :error_type="error_type"
        :modelValue="field.state.value"
        @update:modelValue="field.handleChange($event)"
        @blur="field.handleBlur"
        @select="emit('select', $event)"
        @search="emit('search', $event)"
        :options="options"
        :pending="pending"
        :searchable="searchable"
        :multiple="multiple"
        :url="url"
        :base_url="base_url"
        :search_key="search_key"
        :params="params"
        :label_key="label_key"
        :value_key="value_key"
        :display_label_fn="display_label_fn"
        :hide_icon="hide_icon"
        :display_value="display_value"
        :initial_labels="initial_labels"
        :attributes="attributes"
      >
        <template #item="slotProps" v-if="$slots.item">
          <slot name="item" v-bind="slotProps" />
        </template>
      </BaseSelect>
    </template>
  </InputParent>
</template>

<script setup lang="ts">
import { type SelectHTMLAttributes } from "vue";
import InputParent from "./InputParent.vue";
import type { InputLayoutProps } from "./InputLayout.vue";
import BaseSelect from "@/components/common/Select.vue";

const emit = defineEmits(["select", "search"]);

export interface SelectInputProps extends InputLayoutProps {
  name: string;
  match?: string | string[];
  on_change?: (val: any, form: any) => void;
  validation?: Record<string, any>;
  attributes?: SelectHTMLAttributes;

  options?: any[];
  pending?: boolean;
  searchable?: boolean;
  multiple?: boolean;
  url?: string;
  base_url?: string;
  search_key?: string;
  params?:
    | Record<string, any>
    | ((data: {
        value: any;
        search: string;
        form: any;
      }) => Record<string, any>);
  label_key?: string | ((item: any) => string);
  value_key?: string | ((item: any) => any);
  display_label_fn?: (item: any) => string;
  hide_icon?: boolean;
  display_value?: string;
  initial_labels?: Record<string, string>;
}

const props = withDefaults(defineProps<SelectInputProps>(), {
  match: "",
  on_change: undefined,
  validation: () => ({}),
  attributes: () => ({}),
  options: () => [],
  pending: false,
  searchable: false,
  multiple: false,
  url: "",
  base_url: undefined,
  params: () => ({}),
  label_key: "label",
  value_key: "value",
  display_label_fn: undefined,
  hide_icon: false,

  show_validation_status: true,
  parent_class_name: "",
  size: "sm",
  label: "",
  left_component: null as any,
  description: "",
  error_type: "text",
  display_value: "",
  initial_labels: () => ({}),
});
</script>
