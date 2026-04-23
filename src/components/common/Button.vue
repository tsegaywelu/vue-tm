<template>
  <button
    :type="type"
    :disabled="disabled"
    :title="title"
    :form="form"
    :class="[
      'relative btn-hover isolate flex items-center justify-center gap-1 transition-all duration-200',
      sizeStyles[size],
      variantStyles[variant],
      className,
    ]"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
export type ButtonSize =
  | "sm"
  | "default"
  | "md"
  | "lg"
  | "lg-md"
  | "lg-sm"
  | "xl";
export type ButtonVariant =
  | "outline"
  | "secondary"
  | "destructive"
  | "link"
  | "ghost"
  | "primary"
  | "inactive"
  | "default";

export interface ButtonProps {
  disabled?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
  type?: "button" | "submit" | "reset";
  className?: string;
  title?: string;
  form?: string;
}

const props = withDefaults(defineProps<ButtonProps>(), {
  disabled: false,
  size: "default",
  variant: "default",
  type: "button",
  className: "",
  title: "",
  form: "",
});

defineEmits(["click"]);

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-7 px-[7px] rounded-3xl text-xs",
  default: "h-9 px-3 rounded-3xl text-sm",
  md: "min-w-0 xl:min-w-[182px] h-[42px] xl:h-12 px-3 xl:px-4 font-medium text-sm xl:text-base",
  lg: "h-12 xl:h-14 px-3 xl:px-4 text-sm xl:text-base rounded-[100px]",
  "lg-md":
    "h-10 xl:h-[3.125rem] w-auto xl:w-[7.375rem] px-4 text-sm rounded-[100px]",
  "lg-sm":
    "h-10 xl:h-12 min-w-0 xl:min-w-[6.75rem] px-4 text-xs rounded-[100px]",
  xl: "h-[3rem] xl:h-[3.5625rem] px-4 text-base xl:text-xl rounded-[100px]",
};

const variantStyles: Record<ButtonVariant, string> = {
  default: "primary-gradient text-white",
  primary: "primary-gradient text-white",
  outline: "border border-primary text-primary bg-transparent",
  secondary: "secondary-gradient text-gray-900 border border-gray-200",
  destructive: "destructive-gradient text-white",
  link: "text-primary hover:underline bg-transparent",
  ghost: "bg-transparent hover:bg-gray-100",
  inactive:
    "bg-[#B7B7B7] text-white border border-[#B7B7B7] shadow-none cursor-not-allowed opacity-50",
};
</script>

<style scoped>
.primary-gradient {
  background: var(--color-primary-gradient);
}

.secondary-gradient {
  background: var(--color-secondary-gradient);
}
.destructive-gradient {
  background: var(--color-destructive-gradient);
}
</style>
