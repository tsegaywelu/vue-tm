<template>
  <SelectInput
    v-bind="props"
    :show_validation_status="false"
    :label="label || 'Trip Type'"
    :options="options || defaultOptions"
    :attributes="{
      placeholder: 'Select Trip Type',
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
  { label: "Round Trip", value: "round_trip" },
  { label: "Single Trip", value: "single_trip" },
];
</script>
