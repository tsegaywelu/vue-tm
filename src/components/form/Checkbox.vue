<template>
  <InputParent
    :name="name"
    :validation="validation"
  >
    <template #default="{ field }">
      <div class="flex items-center gap-2">
        <div class="relative flex items-center">
          <input
            type="checkbox"
            :id="field.name"
            :name="field.name"
            :checked="field.state.value"
            @change="field.handleChange($event.target.checked)"
            class="peer size-5 cursor-pointer appearance-none rounded border border-gray-300 bg-white checked:bg-primary checked:border-primary transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <div
            class="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
            v-html="icons.check"
          ></div>
        </div>
        <label
          :for="field.name"
          class="text-sm font-medium text-gray-700 cursor-pointer select-none"
        >
          {{ label }}
          <span v-if="validation?.required" class="text-error-500">*</span>
        </label>
      </div>
    </template>
  </InputParent>
</template>

<script setup lang="ts">
import InputParent from "./InputParent.vue";

defineProps<{
  name: string;
  label: string;
  validation?: Record<string, any>;
}>();

const icons = {
  check: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="size-3.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
};
</script>
