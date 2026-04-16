<template>
  <Input
    v-bind="props"
    :attributes="{ type: 'tel', ...attributes }"
    :validation="{ number: numberValidation, ...validation }"
  >
    <template #left_component>
      <div class="pointer-events-none flex items-center gap-2">
        <div class="grid place-items-center size-7.5 text-gray-500 pb-0.5">
          <slot name="left_component">
            <i class="mdi mdi-flag text-lg"></i>
          </slot>
        </div>
        <span class="text-gray-500 text-sm whitespace-nowrap">(+251)-(9/7)-</span>
      </div>
    </template>
  </Input>
</template>

<script setup lang="ts">
import Input, { type InputProps } from './Input.vue';
import { number } from '@/utils/validations';

export interface PhoneInputProps extends InputProps {}

const props = withDefaults(defineProps<PhoneInputProps>(), {
  attributes: () => ({}),
  validation: () => ({})
});

function numberValidation(v: any) { return number(v); }
</script>
