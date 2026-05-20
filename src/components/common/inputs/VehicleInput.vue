<template>
  <SelectInput
    v-bind="props"
    searchable
    :label="label || 'Vehicle'"
    :params="
      (state) => {
        return {
          vehiclePlateNumber: state.search,
          q: undefined,
          ...params,
        };
      }
    "
    :value_key="value_key || '_id'"
    :label_key="label_key || 'plateNumber'"
    :url="url || '/vehicle'"
    :attributes="{
      placeholder: 'Choose vehicle',
      ...attributes,
    }"
    :options="options"
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
  validation?: any;
  initial_labels?: Record<string, any>;
  options?: any[];
  display_value?: string;
}>();

console.log(props.options, "options");
</script>
