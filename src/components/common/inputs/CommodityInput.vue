<template>
  <SelectInput
    v-bind="props"
    searchable
    :show_validation_status="show_validation_status ?? false"
    :label="label || 'Commodity'"
    value_key="_id"
    label_key="name"
    :url="url || '/commodity/contracted'"
    :params="
      params ||
      ((state) => ({
        limit: 20,
        q: undefined,
        name: state.search,
      }))
    "
    :attributes="{
      placeholder: 'Select Commodity',
      ...attributes,
    }"
  />
</template>

<script setup lang="ts">
import SelectInput from "@/components/form/SelectInput.vue";

const props = defineProps<{
  name: string;
  label?: string;
  multiple?: boolean;
  url?: string;
  params?: any;
  options?: any[];
  validation?: any;
  on_change?: (val: any, form: any) => void;
  size?: "xs" | "sm" | "md" | "lg";
  attributes?: any;
  parent_class_name?: string;
  show_validation_status?: boolean;
  display_value?: string;
  initial_labels?: Record<string, string>;
}>();
</script>
