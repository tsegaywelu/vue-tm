<template>
  <SelectInput
    v-bind="props"
    searchable
    :show_validation_status="false"
    :label="label || 'Origin'"
    :params="
      (values) => {
        return {
          sort: '-shipmentCount',
          q: undefined,
          ...(values.search
            ? {
                routeName: {
                  regexAny: values.search,
                },
              }
            : {}),
          ...params,
        };
      }
    "
    :multiple='multiple'
    :value_key="value_key || 'destination'"
    :label_key="label_key || 'routeName'"
    :url="url || '/route'"
    :attributes="{
      placeholder: 'Search and Select Origin',
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
