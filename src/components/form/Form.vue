<template>
  <form
    :id="id"
    :class="class_name"
    autocomplete="off"
    @submit.prevent="handleSubmit"
  >
    <slot :form="form" />
  </form>
</template>

<script setup lang="ts">
import { useForm } from "@tanstack/vue-form";
import {
  provide,
  watch,
  computed,
  ref,
  inject,
  onMounted,
  onUnmounted,
} from "vue";
import { onBeforeRouteLeave, matchedRouteKey } from "vue-router";
import { openModal } from "@customizer/modal-x";

export interface FormProps {
  id: string;
  class_name?: string;
  values?: Record<string, any>;
  enable_unsaved_guard?: boolean;
  /** Optional pre-initialized form instance */
  instance?: any;
  onSubmit?: (value: any, resetCb: () => void) => Promise<void> | void;
}

const props = withDefaults(defineProps<FormProps>(), {
  class_name: "",
  values: () => ({}),
  enable_unsaved_guard: true,
  instance: null,
});

const emit = defineEmits<{
  (e: "submit", value: any, resetCb: () => void): void;
  (e: "change", value: any): void;
}>();

function hashForCompare(val: any): string {
  if (val === null) return "null";
  if (val === undefined) return "undefined";
  if (val instanceof File) {
    return `File:${val.name}:${val.size}:${val.lastModified || ""}:${val.type || ""}`;
  }
  if (val instanceof Date) {
    return `Date:${val.toISOString()}`;
  }
  if (Array.isArray(val)) {
    return `[${val.map((v) => hashForCompare(v)).join(",")}]`;
  }
  if (typeof val === "object") {
    const keys = Object.keys(val).sort();
    const parts = keys.map((k) => `${k}:${hashForCompare(val[k])}`);
    return `{${parts.join(",")}}`;
  }
  return String(val);
}

// Use provided instance or create local one
const localForm = !props.instance
  ? (useForm({
      defaultValues: props.values,
      onSubmit: async ({ value }) => {
        if (props.onSubmit) {
          await props.onSubmit(value, () => form.value.reset());
        } else {
          emit("submit", value, () => form.value.reset());
        }
      },
    }) as any)
  : null;

const form = computed(() => props.instance || localForm);

const is_syncing = ref(false);
const currentValuesRef = ref(form.value.state.values);
let emit_timeout: any = null;

form.value.store.subscribe(() => {
  currentValuesRef.value = form.value.state.values;
  if (!is_syncing.value) {
    if (emit_timeout) clearTimeout(emit_timeout);
    emit_timeout = setTimeout(() => {
      emit("change", form.value.state.values);
    }, 0);
  }
});

const is_actually_dirty = computed(() => {
  const keys = Object.keys(props.values || {});
  for (let key of keys) {
    if (
      hashForCompare(props.values[key]) !==
      hashForCompare(currentValuesRef.value[key])
    ) {
      return true;
    }
  }
  return false;
});

watch(
  () => props.values,
  (newValues) => {
    if (newValues) {
      is_syncing.value = true;
      Object.keys(newValues).forEach((key) => {
        const currentValue = form.value.getFieldValue(key);
        const newValue = newValues[key];
        const isDifferent =
          hashForCompare(currentValue) !== hashForCompare(newValue);

        if (isDifferent) {
          form.value.setFieldValue(key, newValue);
        }
      });
      is_syncing.value = false;
      emit("change", form.value.state.values);
    }
  },
  { deep: true },
);

// Route navigation guard — only register when inside a <RouterView>.
// When Form is used inside a modal (not a route child), matchedRouteKey is null.
const matchedRoute = inject(matchedRouteKey, null);
if (matchedRoute) {
  onBeforeRouteLeave(async (to, from, next) => {
    if (
      !props.enable_unsaved_guard ||
      !is_actually_dirty.value ||
      form.value.state.isSubmitting
    ) {
      next();
      return;
    }

    const res = await openModal("ConfirmationModal", {
      title: "Alert",
      message:
        "You have unsaved changes. Are you sure you want to discard them?",
      confirmText: "Proceed",
      cancelText: "Cancel",
    });

    if (res) next();
    else next(false);
  });
}

// Browser tab/window close guard (matches raaz's enableBeforeUnload)
function onBeforeUnload(e: BeforeUnloadEvent) {
  if (
    props.enable_unsaved_guard &&
    is_actually_dirty.value &&
    !form.value.state.isSubmitting
  ) {
    e.preventDefault();
  }
}

onMounted(() => {
  window.addEventListener("beforeunload", onBeforeUnload);
});

onUnmounted(() => {
  window.removeEventListener("beforeunload", onBeforeUnload);
});

async function handleSubmit() {
  await form.value.validateAllFields("submit");

  const fieldMeta = form.value.state.fieldMeta;
  const errorFields = Object.keys(fieldMeta).filter(
    (name) => fieldMeta[name].errors.length > 0,
  );

  const errorField = errorFields[0];

  if (errorField) {
    // Delay to let Vue re-render error messages
    requestAnimationFrame(() => {
      const formEl = document.getElementById(props.id);

      // Try to find the focusable element by data-name or name attribute
      let fieldEl = formEl?.querySelector(
        `[data-name="${errorField}"]`,
      ) as HTMLElement;

      // Fallback: search for a native input/textarea/select with matching name
      if (!fieldEl) {
        fieldEl = formEl?.querySelector(
          `input[name="${errorField}"], textarea[name="${errorField}"], select[name="${errorField}"]`,
        ) as HTMLElement;
      }

      // Last resort: search full document
      if (!fieldEl) {
        fieldEl = document.querySelector(
          `[data-name="${errorField}"]`,
        ) as HTMLElement;
      }

      if (fieldEl) {
        // Use instant scroll to avoid the race condition with smooth animation
        fieldEl.scrollIntoView({ behavior: "smooth", block: "center" });
        fieldEl.focus({ preventScroll: true });
      }
    });

    // Don't proceed with form submission
    return;
  }

  await form.value.handleSubmit();
}

provide("formContext", {
  id: props.id,
  form: form.value,
  is_dirty: is_actually_dirty,
});

defineExpose({
  form: form.value,
  is_dirty: is_actually_dirty,
});
</script>
