<template>
  <div
    v-if="loading"
    class="flex justify-center items-center py-2 animate-fade-in"
  >
    <i class="mdi mdi-loading mdi-spin text-xl text-primary"></i>
  </div>

  <div
    v-else
    class="my-2 ml-2 flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none animate-fade-in text-sm py-1"
  >
    <div
      v-for="stat in stats"
      :key="stat.label"
      class="flex items-center gap-1.5 bg-white border border-grey-100 px-4 py-2 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all hover:bg-grey-25 cursor-pointer"
      @click="$emit('click', stat)"
    >
      <span class="text-grey-600 font-medium">{{ stat.label }}</span>
      <slot :name="`value-${stat.label.toLowerCase().replace(/\s+/g, '-')}`" :stat="stat">
        <span :class="['font-extrabold', stat.class || 'text-grey-800']">
          {{ stat.value || 0 }}
        </span>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface StatItem {
  label: string;
  value: string | number;
  class?: string;
  [key: string]: any;
}

defineProps<{
  stats: StatItem[];
  loading?: boolean;
}>();

defineEmits<{
  (e: "click", stat: StatItem): void;
}>();
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
