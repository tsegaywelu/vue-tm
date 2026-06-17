<template>
  <SelectInput
    v-bind="props"
    searchable
    :show_validation_status="false"
    :label="label || 'Region'"
    value_key="_id"
    label_key="name"
    :params="
      (state) => ({
        q: undefined,
        limit: undefined,
        'name[regexAny]': state.search,
      })
    "
    url="/region"
    :attributes="{
      placeholder: 'Select Region',
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
  attributes?: any;
  parent_class_name?: string;
  display_value?: string;
}>();
</script>
