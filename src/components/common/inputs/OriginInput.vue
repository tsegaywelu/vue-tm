<template>
  <SelectInput
    :name="name"
    :multiple="multiple"
    :size="size"
    :parent_class_name="parent_class_name"
    :initial_labels="initial_labels"
    searchable
    :show_validation_status="false"
    :label="label || 'Origin City'"
    url="/city"
    value_key="name"
    label_key="name"
    :display_label_fn="(city: any) => city.code || city.name"
    :params="(values: any) => ({
      q: undefined,
      ...(values.search ? { name: { regexAny: values.search } } : {}),
    })"
    :attributes="{
      placeholder: 'Search and Select Origin City',
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
  attributes?: any;
  parent_class_name?: string;
  initial_labels?: Record<string, string>;
}>();
</script>
