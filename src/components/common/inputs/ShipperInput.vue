<template>
  <SelectInput
    v-bind="props"
    searchable
    :show_validation_status="false"
    :label="label || 'Shipper'"
    :value_key="value_key || 'shipper._id'"
    :label_key="label_key || 'shipper.name'"
    :url="url || '/shipper/contractedShippers'"
    :attributes="{
      placeholder: 'Search and Select Shipper',
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
