<template>
  <SelectInput
    v-bind="props"
    searchable
    :show_validation_status="false"
    :label="label || 'Agent'"
    :value_key="value_key || '_id'"
    :label_key="label_key || 'name'"
    :url="url || '/agent/shipper/carrier'"
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
  size?: "xs" | "sm" | "md" | "lg";
  params?: any;
  value_key?: string;
  label_key?: string;
  url?: string;
  attributes?: any;
  parent_class_name?: string;
}>();
</script>
