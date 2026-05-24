<template>
  <div class="relative" ref="wrapperRef">
    <!-- Trigger -->
    <button
      type="button"
      class="w-full text-sm border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary-300 flex items-center justify-between text-left gap-1 min-w-0"
      @click="open = !open"
    >
      <span class="truncate flex-1" :class="modelValue ? 'text-gray-800' : 'text-gray-400'">
        {{ selectedLabel || 'Select field...' }}
      </span>
      <svg
        class="shrink-0 w-3.5 h-3.5 text-gray-400 transition-transform duration-150"
        :class="{ 'rotate-180': open }"
        viewBox="0 0 20 20" fill="currentColor"
      >
        <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
      </svg>
    </button>

    <!-- Dropdown -->
    <Teleport to="body">
      <div
        v-if="open"
        class="fixed z-9999 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden"
        :style="dropdownStyle"
      >
        <!-- Search -->
        <div class="p-2 border-b border-gray-100">
          <input
            ref="searchRef"
            v-model="search"
            type="text"
            placeholder="Search fields..."
            class="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary-300"
            @click.stop
          />
        </div>

        <!-- Options -->
        <div class="max-h-56 overflow-y-auto">
          <div
            v-for="f in filteredFields"
            :key="f.value"
            class="flex items-center justify-between gap-2 px-3 py-2 cursor-pointer transition-colors hover:bg-gray-50"
            :class="{ 'bg-primary-50': f.value === modelValue }"
            @mousedown.prevent="select(f.value)"
            @mouseenter="(e) => onOptionHover(e, f.value)"
            @mouseleave="tooltip = null"
          >
            <span class="text-xs flex-1" :class="f.value === modelValue ? 'font-semibold text-primary-700' : 'text-gray-700'">
              {{ f.label }}
            </span>
            <span
              v-if="usedByMap[f.value] && f.value !== modelValue"
              class="shrink-0 w-2 h-2 rounded-full bg-amber-400"
            />
          </div>
          <div v-if="filteredFields.length === 0" class="px-3 py-3 text-xs text-gray-400 text-center">
            No fields match
          </div>
        </div>
      </div>

      <!-- Hover tooltip — shown outside the dropdown box -->
      <div
        v-if="tooltip"
        class="fixed z-10000 pointer-events-none"
        :style="{ top: `${tooltip.top}px`, left: `${tooltip.left}px` }"
      >
        <div class="bg-gray-900 text-white text-[11px] px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
          Used by: <span class="font-semibold text-amber-300">{{ tooltip.label }}</span>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from "vue";

const props = defineProps<{
  modelValue: string;
  fields: { value: string; label: string }[];
  usedByMap: Record<string, string>;
}>();

const emit = defineEmits<{ (e: "update:modelValue", val: string): void }>();

const open = ref(false);
const search = ref("");
const wrapperRef = ref<HTMLElement | null>(null);
const searchRef = ref<HTMLInputElement | null>(null);
const dropdownStyle = ref<Record<string, string>>({});
const tooltip = ref<{ label: string; top: number; left: number } | null>(null);

const selectedLabel = computed(
  () => props.fields.find((f) => f.value === props.modelValue)?.label ?? "",
);

const filteredFields = computed(() => {
  const q = search.value.toLowerCase();
  return q ? props.fields.filter((f) => f.label.toLowerCase().includes(q)) : props.fields;
});

function select(val: string) {
  emit("update:modelValue", val);
  open.value = false;
  search.value = "";
}

function onOptionHover(e: MouseEvent, fieldValue: string) {
  const label = props.usedByMap[fieldValue];
  if (!label) { tooltip.value = null; return; }
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
  const dropW = parseFloat(dropdownStyle.value.width || "0");
  const dropL = parseFloat(dropdownStyle.value.left || "0");
  tooltip.value = {
    label,
    top: rect.top + rect.height / 2 - 14,
    left: dropL + dropW + 8,
  };
}

function positionDropdown() {
  const el = wrapperRef.value;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const spaceBelow = window.innerHeight - rect.bottom;
  const dropdownH = Math.min(320, window.innerHeight * 0.4);
  const top = spaceBelow >= dropdownH ? rect.bottom + 4 : rect.top - dropdownH - 4;
  dropdownStyle.value = {
    top: `${top}px`,
    left: `${rect.left}px`,
    width: `${Math.max(rect.width, 220)}px`,
  };
}

watch(open, (val) => {
  if (val) {
    nextTick(() => {
      positionDropdown();
      searchRef.value?.focus();
    });
  } else {
    search.value = "";
    tooltip.value = null;
  }
});

function onOutsideClick(e: MouseEvent) {
  if (!wrapperRef.value?.contains(e.target as Node)) {
    open.value = false;
  }
}

onMounted(() => document.addEventListener("mousedown", onOutsideClick));
onUnmounted(() => document.removeEventListener("mousedown", onOutsideClick));
</script>
