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
        <span
          v-if="isSubmitting"
          class="*:size-6 absolute inset-0 z-10 backdrop-blur-3xl rounded-[inherit] grid place-items-center"
        >
          <i v-html="icons.spinner"></i>
        </span>
      </Button>
    </template>
  </component>
</template>

<script setup lang="ts">
import { inject, computed } from "vue";
import Button from "@/components/common/Button.vue";
import type { ButtonVariant, ButtonSize } from "@/components/common/Button.vue";
import { icons } from "@/utils/icons";

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
