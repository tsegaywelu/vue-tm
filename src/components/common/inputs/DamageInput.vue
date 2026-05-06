<template>
  <SelectInput
    v-bind="props"
    :show_validation_status="false"
    :label="label || 'Damage'"
    :options="options || Damage"
    :attributes="{
      placeholder: 'Select Damage',
      ...attributes,
    }"
  />
</template>

<script setup lang="ts">
import SelectInput from "@/components/form/SelectInput.vue";
import { Damage } from "@/utils/utils";

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
