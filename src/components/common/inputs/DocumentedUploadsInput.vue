<template>
  <SelectInput
    v-bind="props"
    :show_validation_status="false"
    :label="label || 'Documented Uploads'"
    :options="options || DocumentedUploads"
    :attributes="{
      placeholder: 'Select Documented Uploads',
      ...attributes,
    }"
  />
</template>

<script setup lang="ts">
import SelectInput from "@/components/form/SelectInput.vue";
import { DocumentedUploads } from "@/utils/utils";

const props = defineProps<{
  name: string;
  label?: string;
  multiple?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
  options?: { label: string; value: string }[];
  attributes?: any;
  parent_class_name?: string;
}>();
</script>
