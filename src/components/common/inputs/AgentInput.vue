<template>
  <SelectInput
    v-bind="props"
    searchable
    :show_validation_status="show_validation_status ?? false"
    :label="label || 'Agent'"
    :value_key="value_key || '_id'"
    :label_key="label_key || 'name'"
    :url="url || '/agent/shipper/carrier'"
    :params="
      params ||
      ((state) => ({
        limit: 20,
        q: undefined,
        ...(state.search ? { name: { regex: state.search } } : {}),
      }))
    "
    :attributes="{
      placeholder: 'Search and Select Agent',
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
  value_key?: string;
  label_key?: string | ((item: any) => string);
  size?: "xs" | "sm" | "md" | "lg";
  attributes?: any;
  parent_class_name?: string;
  show_validation_status?: boolean;
}>();
</script>
