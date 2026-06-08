<template>
  <SelectInput
    v-bind="props"
    searchable
    :show_validation_status="false"
    :label="label || 'Driver'"
    :value_key="value_key || '_id'"
    :label_key="label_key || ((item: any) => `${item.firstName} ${item.middleName || ''} ${item.lastName || ''}`.trim())"
    :url="url || '/driver'"
    :attributes="{
      placeholder: 'Search and Select Driver',
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
  label_key?: string | ((item: any) => string);
  url?: string;
  attributes?: any;
  parent_class_name?: string;
  display_value?: string;
  validation?: any;
}>();
</script>
