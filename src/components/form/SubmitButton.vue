<template>
  <component
    v-if="form"
    :is="form.Subscribe"
    :selector="(state: any) => [state.canSubmit, state.isSubmitting]"
  >
    <template #default="[canSubmit, isSubmitting]">
      <Button
        :type="type"
        :form="formId"
        :disabled="isSubmitting || !canSubmit || disabled"
        :variant="variant"
        :size="size"
        :class_name="class_name"
      >
        <slot />
        <div
          v-if="isSubmitting"
          class="absolute inset-0 z-10 backdrop-blur-sm rounded-[inherit] grid place-items-center"
        >
          <i class="mdi mdi-loading mdi-spin text-white text-xl"></i>
        </div>
      </Button>
    </template>
  </component>
  <Button
    v-else
    :type="type"
    :disabled="disabled"
    :variant="variant"
    :size="size"
    :class_name="class_name"
  >
    <slot />
  </Button>
</template>

<script setup lang="ts">
import { inject, computed } from "vue";
import Button from "@/components/common/Button.vue";
import type { ButtonVariant, ButtonSize } from "@/components/common/Button.vue";

export interface SubmitButtonProps {
  type?: "submit" | "button";
  class_name?: string;
  disabled?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const props = withDefaults(defineProps<SubmitButtonProps>(), {
  type: "submit",
  class_name: "",
  disabled: false,
  variant: "primary",
  size: "default",
});

const formContext = inject("formContext", null) as any;
const form = computed(() => formContext?.form);
const formId = computed(() => formContext?.id ?? "");
</script>
