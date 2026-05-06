<template>
  <SelectInput
    v-bind="props"
    :show_validation_status="false"
    :label="label || 'Product Type'"
    :options="options || defaultOptions"
    :attributes="{
      placeholder: 'Select Product Type',
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
  options?: { label: string; value: string }[];
  attributes?: any;
  parent_class_name?: string;
}>();

const defaultOptions = [
  { label: "Out Bound", value: "OUT_BOUND" },
  { label: "In Bound", value: "IN_BOUND" },
  { label: "Site Transfer", value: "SITE_TRANSFER" },
];
</script>
