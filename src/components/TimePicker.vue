<template>
  <div class="bg-white rounded-2xl p-4 flex flex-col gap-4 select-none w-full sm:shadow-lg sm:min-w-[240px] sm:w-auto">
    <!-- Range tab switcher -->
    <div v-if="isRange" class="flex bg-gray-50 p-1 rounded-xl">
      <button
        type="button"
        @click="activeTab = 'start'"
        :class="[
          'flex-1 py-1.5 rounded-lg text-xs font-medium transition-all',
          activeTab === 'start' ? 'bg-white shadow-sm text-primary' : 'text-gray-500',
        ]"
      >
        Start Time
      </button>
      <button
        type="button"
        @click="activeTab = 'end'"
        :class="[
          'flex-1 py-1.5 rounded-lg text-xs font-medium transition-all',
          activeTab === 'end' ? 'bg-white shadow-sm text-primary' : 'text-gray-500',
        ]"
      >
        End Time
      </button>
    </div>

    <!-- Scrollable columns -->
    <div class="flex justify-center items-center gap-4">
      <!-- Hours -->
      <div class="flex flex-col items-center">
        <span class="text-xs text-gray-600 mb-1">Hour</span>
        <div class="flex flex-col gap-1 max-h-[150px] overflow-y-auto no-scrollbar py-10 px-2 border border-gray-100 rounded-lg">
          <button
            v-for="h in hourOptions"
            :key="h"
            type="button"
            @click="selectHour(h)"
            :class="[
              'w-10 h-10 flex items-center justify-center rounded-lg transition-colors text-sm',
              hours === h ? 'bg-primary text-white' : 'hover:bg-surface-hover text-gray-800',
            ]"
          >
            {{ h.toString().padStart(2, '0') }}
          </button>
        </div>
      </div>

      <span class="text-2xl font-bold mt-4">:</span>

      <!-- Minutes -->
      <div class="flex flex-col items-center">
        <span class="text-xs text-gray-600 mb-1">Min</span>
        <div class="flex flex-col gap-1 max-h-[150px] overflow-y-auto no-scrollbar py-10 px-2 border border-gray-100 rounded-lg">
          <button
            v-for="m in minuteOptions"
            :key="m"
            type="button"
            @click="selectMinute(m)"
            :class="[
              'w-10 h-10 flex items-center justify-center rounded-lg transition-colors text-sm',
              minutes === m ? 'bg-primary text-white' : 'hover:bg-surface-hover text-gray-800',
            ]"
          >
            {{ m.toString().padStart(2, '0') }}
          </button>
        </div>
      </div>

      <!-- AM / PM -->
      <div v-if="!is24Hour" class="flex flex-col gap-2 mt-4 ml-2">
        <button
          v-for="p in ['AM', 'PM']"
          :key="p"
          type="button"
          @click="selectPeriod(p as 'AM' | 'PM')"
          :class="[
            'px-3 py-2 rounded-lg text-sm font-semibold transition-colors',
            period === p ? 'bg-primary text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100',
          ]"
        >
          {{ p }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

const props = withDefaults(defineProps<{
  value?: string | { startTime: string; endTime: string };
  isRange?: boolean;
  useObjectValue?: boolean;
  is24Hour?: boolean;
}>(), {
  isRange: false,
  useObjectValue: false,
  is24Hour: false,
});

const emit = defineEmits<{ change: [value: any] }>();

const activeTab = ref<'start' | 'end'>('start');
const hours = ref(12);
const minutes = ref(0);
const period = ref<'AM' | 'PM'>('AM');

// Track each side separately so switching tabs restores the right values
const startTime = ref('12:00');
const endTime = ref('13:00');

const hourOptions = computed(() =>
  props.is24Hour
    ? Array.from({ length: 24 }, (_, i) => i)
    : Array.from({ length: 12 }, (_, i) => i + 1),
);
const minuteOptions = Array.from({ length: 12 }, (_, i) => i * 5);

function parseInto(val: string) {
  const [h, m] = val.split(':').map(Number);
  if (isNaN(h) || isNaN(m)) return;
  if (props.is24Hour) {
    hours.value = h;
  } else {
    period.value = h >= 12 ? 'PM' : 'AM';
    hours.value = h % 12 || 12;
  }
  minutes.value = m;
}

function resolveActiveTime(): string {
  return activeTab.value === 'start' ? startTime.value : endTime.value;
}

watch(
  () => props.value,
  (val) => {
    if (!val) return;
    if (props.isRange) {
      if (typeof val === 'string' && val.includes('-')) {
        [startTime.value, endTime.value] = val.split('-');
      } else if (typeof val === 'object') {
        startTime.value = val.startTime || '12:00';
        endTime.value = val.endTime || '13:00';
      }
      parseInto(resolveActiveTime());
    } else {
      parseInto(typeof val === 'string' ? val : '12:00');
    }
  },
  { immediate: true },
);

watch(activeTab, () => {
  parseInto(resolveActiveTime());
});

function buildTimeStr(h: number, m: number, p: 'AM' | 'PM'): string {
  let finalH = h;
  if (!props.is24Hour) {
    if (p === 'PM' && h !== 12) finalH = h + 12;
    if (p === 'AM' && h === 12) finalH = 0;
  }
  return `${finalH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

function emit_change(h: number, m: number, p: 'AM' | 'PM') {
  const timeStr = buildTimeStr(h, m, p);
  if (props.isRange) {
    const newStart = activeTab.value === 'start' ? timeStr : startTime.value;
    const newEnd = activeTab.value === 'end' ? timeStr : endTime.value;
    startTime.value = newStart;
    endTime.value = newEnd;
    emit('change', props.useObjectValue
      ? { startTime: newStart, endTime: newEnd }
      : `${newStart}-${newEnd}`);
  } else {
    emit('change', timeStr);
  }
}

function selectHour(h: number) {
  hours.value = h;
  emit_change(h, minutes.value, period.value);
}
function selectMinute(m: number) {
  minutes.value = m;
  emit_change(hours.value, m, period.value);
}
function selectPeriod(p: 'AM' | 'PM') {
  period.value = p;
  emit_change(hours.value, minutes.value, p);
}
</script>
