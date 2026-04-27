<template>
  <span
    v-if="hasErrors"
    class="text-red-500 text-sm self-start rounded-full"
    :class="class_name"
  >
    <div v-if="Array.isArray(error)" class="flex flex-col gap-1">
      <span v-for="(e, idx) in error" :key="idx">{{
        typeof e === "string" ? e : ""
      }}</span>
    </div>
    <template v-else-if="typeof error === 'string'">{{ error }}</template>

  </span>
</template>

<script setup lang="ts">
import { computed } from "vue";

export interface InputErrorProps {
  error?: string | string[] | null;
  class_name?: string;
}

const props = withDefaults(defineProps<InputErrorProps>(), {
  error: null,
  class_name: ""
});

const hasErrors = computed(() => {
  if (Array.isArray(props.error)) return props.error.length > 0;
  return !!props.error;
});
</script>
