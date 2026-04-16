<template>
  <component
    v-if="form"
    :is="form.Field"
    :name="name"
    :validators="field_validators"
    :listeners="field_listeners"
  >
    <template #default="fieldApi">
      <slot :field="fieldApi.field" :set_dirty_state="set_dirty_state" />
    </template>
  </component>
</template>

<script setup lang="ts">
import { inject, ref, onMounted, onBeforeUnmount, computed } from "vue";
import { validateAll } from "@/utils/validations";

export interface InputParentProps {
  name: string;
  validation?: Record<string, any>;
  match?: string | string[];
  on_change?: (val: any, form: any) => void;
}

const props = withDefaults(defineProps<InputParentProps>(), {
  validation: () => ({}),
  match: "",
});

const formContext = inject("formContext") as any;
const form = formContext?.form;
const is_dirty = ref(false);
const is_mounted = ref(true);

function set_dirty_state(dirty_val: boolean) {
  is_dirty.value = !!dirty_val;
}

const field_validators = computed(() => ({
  onChangeListenTo: Array.isArray(props.match)
    ? props.match
    : [props.match || ""],
  onBlur: ({ value, fieldApi }: any) => {
    if (!is_mounted.value) return undefined;
    is_dirty.value = true;
    const error = validateAll(props.validation, value, form);
    fieldApi.setMeta((prev: any) => ({
      ...prev,
      errors: error ? (Array.isArray(error) ? error : [error]) : [],
      errorMap: { onChange: undefined, onBlur: error, onSubmit: undefined },
    }));
    return error;
  },
  onSubmit: ({ value, fieldApi }: any) => {
    if (!is_mounted.value) return undefined;
    const error = validateAll(props.validation, value, form);
    fieldApi.setMeta((prev: any) => ({
      ...prev,
      errors: error ? (Array.isArray(error) ? error : [error]) : [],
      errorMap: { onChange: undefined, onBlur: undefined, onSubmit: error },
    }));
    return error;
  },
  onChange: ({ value, fieldApi }: any) => {
    if (!is_mounted.value) return undefined;
    if (!is_dirty.value) return undefined;
    const error = validateAll(props.validation, value, form);
    fieldApi.setMeta((prev: any) => ({
      ...prev,
      errors: error ? (Array.isArray(error) ? error : [error]) : [],
      errorMap: { onChange: error, onBlur: undefined, onSubmit: undefined },
    }));
    return error;
  },
}));

const field_listeners = computed(() => ({
  onChange: ({ value }: any) => {
    if (props.on_change) props.on_change(value, form);
  },
}));

onMounted(() => {
  is_mounted.value = true;
});

onBeforeUnmount(() => {
  is_mounted.value = false;
  if (form) {
    form.setFieldValue(props.name, undefined);
    form.setFieldMeta(props.name, (prev: any) => ({
      ...prev,
      errors: [],
      errorMap: {
        onChange: undefined,
        onBlur: undefined,
        onSubmit: undefined,
      },
    }));
  }
});
</script>
