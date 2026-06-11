<template>
  <div
    v-if="loading"
    class="flex justify-center items-center py-2 animate-fade-in"
  >
    <i class="mdi mdi-loading mdi-spin text-xl text-primary"></i>
  </div>

  <div
    v-else
    class="my-2 ml-2 flex items-end gap-2 overflow-x-auto whitespace-nowrap scrollbar-none animate-fade-in text-sm py-1"
  >
    <template v-for="stat in stats" :key="stat.label">

      <!-- Group card: parent on top, children row below -->
      <div
        v-if="stat.children?.length"
        class="stat-card-group shrink-0 flex flex-col gap-2 px-3 py-2.5 rounded-2xl border border-line transition-all"
      >
        <div class="flex items-center gap-2 px-1">
          <span class="text-base-text font-semibold text-base">{{ stat.label }}</span>
          <span v-if="stat.value != null" :class="['font-extrabold text-base', stat.class || 'text-grey-800']">
            {{ stat.value }}
          </span>
        </div>
        <div class="flex items-center gap-1.5">
          <div
            v-for="child in stat.children"
            :key="child.label"
            :class="[
              'stat-card shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all cursor-pointer',
              active_label === child.label
                ? 'stat-card--active stat-card--clickable border-primary/60'
                : child.clickable
                  ? 'stat-card--clickable border-primary/25'
                  : 'border-grey-100',
            ]"
            @click="$emit('click', child)"
          >
            <span class="text-grey-600 font-medium">{{ child.label }}</span>
            <span :class="['font-extrabold', child.class || 'text-grey-800']">
              {{ child.value || 0 }}
            </span>
          </div>
        </div>
      </div>

      <!-- Regular pill card -->
      <div
        v-else
        :class="[
          'stat-card shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full border transition-all cursor-pointer',
          active_label === stat.label
            ? 'stat-card--active stat-card--clickable border-primary/60'
            : stat.clickable
              ? 'stat-card--clickable border-primary/25'
              : 'border-grey-100',
        ]"
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

    </template>
  </div>
</template>

<script setup lang="ts">
export interface StatItem {
  label: string;
  value: string | number | null;
  class?: string;
  clickable?: boolean;
  children?: StatItem[];
  [key: string]: any;
}

defineProps<{
  stats: StatItem[];
  loading?: boolean;
  active_label?: string | null;
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
    color-mix(in srgb, var(--color-primary) 6%, transparent) 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-1px);
  background: linear-gradient(135deg, var(--color-surface) 0%, var(--color-surface-hover) 100%);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  border-color: color-mix(in srgb, var(--color-primary) 30%, transparent);
}

.stat-card:hover::before {
  opacity: 1;
}

/* Light mode */
.stat-card--clickable {
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--color-primary) 8%, white) 0%,
    color-mix(in srgb, var(--color-primary) 14%, white) 100%
  );
}

.stat-card--active,
.stat-card--active:hover {
  transform: translateY(-1px);
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--color-primary) 16%, white) 0%,
    color-mix(in srgb, var(--color-primary) 26%, white) 100%
  );
  box-shadow: 0 2px 8px color-mix(in srgb, var(--color-primary) 12%, transparent);
}

/* Dark mode */
.dark .stat-card--clickable {
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--color-primary) 10%, transparent) 0%,
    color-mix(in srgb, var(--color-primary) 16%, transparent) 100%
  );
}

.dark .stat-card--active,
.dark .stat-card--active:hover {
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--color-primary) 18%, transparent) 0%,
    color-mix(in srgb, var(--color-primary) 28%, transparent) 100%
  );
  box-shadow: 0 4px 16px color-mix(in srgb, var(--color-primary) 25%, transparent);
}

.stat-card--active::before {
  opacity: 1;
}

.stat-card-group {
  background: var(--color-surface);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
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
