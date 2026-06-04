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
      class="stat-card shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full border border-grey-100 transition-all cursor-pointer"
      @click="$emit('click', stat)"
    >
      <span class="text-grey-600 font-medium">{{ stat.label }}</span>
      <slot
        :name="`value-${stat.label.toLowerCase().replace(/\s+/g, '-')}`"
        :stat="stat"
      >
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
<style>
.stat-card {
  background: linear-gradient(135deg, var(--color-surface) 0%, var(--color-surface-muted) 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    45deg,
    transparent 0%,
    rgba(var(--primary-rgb, 59, 130, 246), 0.03) 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-1px);
  background: linear-gradient(135deg, var(--color-surface) 0%, var(--color-surface-hover) 100%);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border-color: rgba(var(--primary-rgb, 59, 130, 246), 0.2);
}

.stat-card:hover::before {
  opacity: 1;
}

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
