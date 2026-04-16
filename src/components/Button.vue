<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    class="relative inline-flex items-center justify-center gap-2 overflow-hidden transition-all duration-300 ease-in-out focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed group active:scale-95"
    :class="[
      sizeClasses[size],
      variantClasses[variant],
      { 'pointer-events-none': loading }
    ]"
    @click="$emit('click', $event)"
  >
    <!-- Loading Spinner -->
    <div
      v-if="loading"
      class="absolute inset-0 flex items-center justify-center bg-inherit z-10"
    >
      <svg class="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <!-- Content slot -->
    <span :class="{ 'opacity-0': loading }" class="flex items-center gap-2 whitespace-nowrap">
      <slot></slot>
    </span>

    <!-- Hover overlay (micro-animation) -->
    <div class="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
  </button>
</template>

<script setup lang="ts">
type ButtonSize = 'sm' | 'default' | 'md' | 'lg' | 'xl'
type BtnVariants = 'primary' | 'outline' | 'secondary' | 'destructive' | 'ghost' | 'inactive' | 'default'

interface Props {
  size?: ButtonSize
  variant?: BtnVariants
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'default',
  variant: 'default',
  type: 'button',
  disabled: false,
  loading: false
})

defineEmits(['click'])

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 rounded-full text-xs font-medium',
  default: 'h-10 px-4 rounded-full text-sm font-medium',
  md: 'h-12 px-6 rounded-full text-base font-semibold min-w-[140px]',
  lg: 'h-14 px-8 rounded-[100px] text-lg font-bold',
  xl: 'h-16 px-10 rounded-[100px] text-xl font-extrabold'
}

const variantClasses: Record<BtnVariants, string> = {
  default: 'primary-gradient text-white shadow-lg shadow-primary/20',
  primary: 'primary-gradient text-white shadow-lg shadow-primary/20',
  outline: 'border-2 border-primary text-primary hover:bg-primary/5',
  secondary: 'bg-white text-gray-800 border border-gray-200 hover:border-gray-300 shadow-sm',
  destructive: 'bg-error text-white shadow-lg shadow-error/20 hover:brightness-110',
  ghost: 'bg-transparent text-gray-600 hover:bg-gray-100',
  inactive: 'bg-gray-200 text-gray-500 cursor-not-allowed border-none shadow-none hover:bg-gray-200'
}
</script>

<style scoped>
.primary-gradient {
  background: var(--color-primary-gradient);
}
</style>
