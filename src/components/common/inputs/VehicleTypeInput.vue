<template>
  <SelectInput
    v-bind="props"
    searchable
    :show_validation_status="show_validation_status ?? false"
    :label="label || 'Vehicle Type'"
    value_key="_id"
    label_key="name"
    :url="url || '/vehicle-type'"
    :params="params || { limit: 20 }"
    :attributes="{
      placeholder: 'Select Vehicle Type',
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
}>();
</script>
