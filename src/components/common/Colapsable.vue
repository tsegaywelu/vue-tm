<template>
  <div
    class="flex flex-col rounded-[20px] overflow-hidden bg-surface mb-6 border border-line"
    style="box-shadow: 0px 0px 24px 0px #00000014"
  >
    <div
      class="rounded-t-[20px] flex items-center justify-between p-5 border-b border-line bg-surface-muted"
      @click="isExpanded = !isExpanded"
    >
      <div class="text-left">
        <h2 class="text-xl font-bold text-gray-900 tracking-tight">
          {{ title }}
        </h2>
        <p v-if="description" class="mt-1 text-sm text-gray-500 font-medium">
          {{ description }}
        </p>
      </div>
      <button
        type="button"
        class="size-10 rounded-full flex items-center justify-center bg-surface border border-line shadow-sm group-hover:border-primary/30 group-hover:text-primary transition-all duration-300"
      >
        <div
          class="transition-all duration-300 transform"
          :class="isExpanded ? 'rotate-90' : '-rotate-90'"
          v-html="all_icons.leftAngle"
        ></div>
      </button>
    </div>
    <div
      :class="`${!isExpanded ? 'h-auto p-3 md:p-5' : 'h-0! overflow-hidden p-0'} duration-200 transition-all rounded-b-[20px]`"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { icons } from "@/utils/icons";
import { raaz_icons } from "@/utils/raaz_icons";

const all_icons = { ...icons, ...raaz_icons };

const props = defineProps<{
  title: string;
  description?: string;
  open?: boolean;
}>();

const isExpanded = ref(props.open ?? true);

watch(
  () => props.open,
  (newVal) => {
    if (newVal !== undefined) {
      isExpanded.value = newVal;
    }
  },
);
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
