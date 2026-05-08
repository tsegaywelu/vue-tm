<script setup lang="ts">
import SelectInput from "@/components/form/SelectInput.vue";

const props = defineProps<{
  name: string;
  label?: string;
  validation?: any;
  multiple?: boolean;
  options?: any[];
  group?: string; // Optional: e.g., 'MECHANIC'
  attributes?: Record<string, any>;
}>();
</script>

<template>
  <SelectInput
    :name="props.name"
    :label="props.label || 'Contact'"
    :options="props.options"
    :validation="props.validation"
    :multiple="props.multiple"
    searchable
    label_key="name"
    value_key="_id"
    :url="props.group ? `/contact?group=${props.group}` : '/contact'"
    :params="
      (state: any) => ({
        name: { regexAny: state.search },
        q: undefined,
      })
    "
    :attributes="{
      placeholder: 'Choose contact',
      ...props.attributes,
    }"
  />
</template>
