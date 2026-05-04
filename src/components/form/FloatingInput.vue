<template>
  <div class="relative w-full">
    <input
      :id="id"
      :value="modelValue"
      :type="type"
      class="peer block w-full h-10 px-4 py-2 pt-4 pb-2 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 ease-in-out appearance-none bg-white"
      placeholder=" "
      v-bind="$attrs"
      @input="onInput"
    />
    <label
      :for="id"
      class="absolute left-4 top-0.5 text-gray-500 text-sm transition-all duration-200 ease-in-out peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:text-sm peer-focus:text-primary bg-white px-1 -translate-y-1/2 cursor-text"
    >
      {{ label }}
    </label>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  modelValue: string | number | null;
  label: string;
  type?: string;
  id?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  id: () => `input-${Math.random().toString(36).slice(2, 9)}`,
});

const emit = defineEmits(['update:modelValue']);

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', props.type === 'number' ? Number(target.value) : target.value);
};
</script>
