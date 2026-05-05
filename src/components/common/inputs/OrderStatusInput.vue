<template>
  <SelectInput
    v-bind="props"
    :show_validation_status="false"
    :label="label || 'Status'"
    :options="options || defaultOptions"
    :attributes="{
      placeholder: 'Select Status',
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
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Shipped", value: "shipped" },
  { label: "Rejected", value: "rejected" },
];
</script>
