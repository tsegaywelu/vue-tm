<template>
  <div class="flex flex-col gap-3">
    <!-- Column search -->
    <div class="relative">
      <input
        v-model="columnSearch"
        type="text"
        placeholder="Search columns..."
        class="w-full text-xs border border-line rounded-lg px-2.5 py-1.5 pl-7 focus:outline-none focus:ring-2 focus:ring-primary-300"
      />
      <svg class="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clip-rule="evenodd" />
      </svg>
    </div>

    <!-- Mobile: horizontal scroll row | Desktop: vertical stack -->
    <div class="flex flex-row gap-8 overflow-x-auto pb-2 xl:flex-col xl:gap-3 xl:overflow-x-visible xl:pb-0">

    <div
      v-for="col in filteredColumns"
      :key="col.id"
      class="group/col relative shrink-0 w-[260px] xl:shrink xl:w-auto"
    >
      <div
        class="rounded-xl border border-line bg-surface shadow-sm p-3 flex flex-col gap-2"
        :class="{ 'border-primary-300 ring-1 ring-primary-100': dragOverIndex === realIndex(col) }"
        draggable="true"
        @dragstart="onDragStart(realIndex(col))"
        @dragover.prevent="dragOverIndex = realIndex(col)"
        @dragleave="dragOverIndex = null"
        @drop.prevent="onDrop(realIndex(col))"
        @dragend="dragOverIndex = null"
      >
      <!-- Row 1: drag handle + field selector + delete -->
      <div class="flex items-center gap-2 min-w-0">
        <span class="cursor-grab text-gray-400 shrink-0" title="Drag to reorder">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <circle cx="4" cy="3" r="1.2"/><circle cx="4" cy="7" r="1.2"/><circle cx="4" cy="11" r="1.2"/>
            <circle cx="10" cy="3" r="1.2"/><circle cx="10" cy="7" r="1.2"/><circle cx="10" cy="11" r="1.2"/>
          </svg>
        </span>
        <div class="flex-1 min-w-0">
          <FieldSelect
            :model-value="col.field"
            :fields="AVAILABLE_FIELDS"
            :used-by-map="usedByMapFor(col.id)"
            @update:model-value="onFieldChange(realIndex(col), $event)"
          />
        </div>
        <button
          class="shrink-0 text-gray-400 hover:text-red-500 transition-colors p-1"
          title="Remove column"
          @click="removeColumn(realIndex(col))"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" stroke="currentColor" fill="none" stroke-width="2">
            <path d="M2 2l10 10M12 2L2 12"/>
          </svg>
        </button>
      </div>

      <!-- Row 2: label + width + type -->
      <div class="grid grid-cols-3 gap-2">
        <div class="col-span-1 flex flex-col gap-1">
          <label class="text-[10px] text-gray-400 uppercase tracking-wide">Label</label>
          <input
            :value="col.label"
            type="text"
            placeholder="Header text"
            class="text-sm border border-line rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-300"
            @input="updateColumn(realIndex(col), 'label', ($event.target as HTMLInputElement).value)"
          />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-[10px] text-gray-400 uppercase tracking-wide">Width</label>
          <input
            :value="col.width"
            type="number"
            min="5"
            max="50"
            class="text-sm border border-line rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-300"
            @input="updateColumn(realIndex(col), 'width', Number(($event.target as HTMLInputElement).value))"
          />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-[10px] text-gray-400 uppercase tracking-wide">Type</label>
          <select
            :value="col.type"
            class="text-sm border border-line rounded-lg px-2 py-1.5 bg-surface focus:outline-none focus:ring-2 focus:ring-primary-300"
            @change="updateColumn(realIndex(col), 'type', ($event.target as HTMLSelectElement).value)"
          >
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="currency">Currency</option>
            <option value="date">Date</option>
            <option value="static">Static</option>
          </select>
        </div>
      </div>

      <!-- Date format options -->
      <div v-if="col.type === 'date'" class="grid grid-cols-2 gap-2">
        <div class="flex flex-col gap-1">
          <label class="text-[10px] text-gray-400 uppercase tracking-wide">Format</label>
          <select
            :value="col.dateFormat ?? 'DMY'"
            class="text-sm border border-line rounded-lg px-2 py-1.5 bg-surface focus:outline-none focus:ring-2 focus:ring-primary-300"
            @change="updateColumn(realIndex(col), 'dateFormat', ($event.target as HTMLSelectElement).value)"
          >
            <option v-for="fmt in DATE_FORMATS" :key="fmt" :value="fmt">
              {{ dateFormatLabel(fmt, NO_SEP_FORMATS.has(fmt!) ? undefined : (col.dateSeparator ?? '/')) }}
            </option>
          </select>
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-[10px] text-gray-400 uppercase tracking-wide">Separator</label>
          <select
            :value="col.dateSeparator ?? '/'"
            :disabled="NO_SEP_FORMATS.has(col.dateFormat ?? '')"
            class="text-sm border border-line rounded-lg px-2 py-1.5 bg-surface focus:outline-none focus:ring-2 focus:ring-primary-300 disabled:opacity-40 disabled:cursor-not-allowed"
            @change="updateColumn(realIndex(col), 'dateSeparator', ($event.target as HTMLSelectElement).value)"
          >
            <option value="/">/  (slash)</option>
            <option value="-">-  (dash)</option>
            <option value=".">. (dot)</option>
          </select>
        </div>
      </div>

      <!-- Style overrides toggle -->
      <button
        class="flex items-center gap-1.5 text-[10px] text-gray-400 hover:text-primary-600 transition-colors border-t border-line pt-2 w-full text-left"
        @click="toggleStyleExpand(col.id)"
      >
        <svg
          class="w-3 h-3 transition-transform duration-150"
          :class="{ 'rotate-90': expandedStyles.has(col.id) }"
          viewBox="0 0 20 20" fill="currentColor"
        >
          <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
        </svg>
        <span class="uppercase tracking-wide font-medium">Style overrides</span>
        <span v-if="styleOverrideCount(col) > 0" class="ml-1 px-1.5 py-0.5 rounded-full bg-primary-100 text-primary-600 font-semibold">
          {{ styleOverrideCount(col) }}
        </span>
      </button>

      <!-- Per-column style overrides -->
      <div v-show="expandedStyles.has(col.id)" class="grid grid-cols-2 gap-x-3 gap-y-0">
        <!-- Header overrides -->
        <div class="flex flex-col gap-1.5">
          <span class="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Header</span>
          <div class="flex items-center gap-1.5">
            <span class="text-[10px] text-gray-400 w-9 shrink-0">Align</span>
            <select
              :value="col.headerStyle?.align ?? ''"
              class="flex-1 text-xs border border-line rounded px-1.5 py-0.5 bg-surface focus:outline-none focus:ring-1 focus:ring-primary-300"
              @change="setColStyle(realIndex(col), 'headerStyle', 'align', ($event.target as HTMLSelectElement).value)"
            >
              <option value="">—</option>
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="text-[10px] text-gray-400 w-9 shrink-0">Text</span>
            <input type="color" :value="hexInput(col.headerStyle?.color)"
              class="w-6 h-6 rounded cursor-pointer border border-line p-0"
              @change="setColStyle(realIndex(col), 'headerStyle', 'color', inputToHex(($event.target as HTMLInputElement).value))" />
            <button v-if="col.headerStyle?.color" class="text-[10px] text-gray-400 hover:text-red-400"
              @click="setColStyle(realIndex(col), 'headerStyle', 'color', '')">×</button>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="text-[10px] text-gray-400 w-9 shrink-0">BG</span>
            <input type="color" :value="hexInput(col.headerStyle?.bgColor)"
              class="w-6 h-6 rounded cursor-pointer border border-line p-0"
              @change="setColStyle(realIndex(col), 'headerStyle', 'bgColor', inputToHex(($event.target as HTMLInputElement).value))" />
            <button v-if="col.headerStyle?.bgColor" class="text-[10px] text-gray-400 hover:text-red-400"
              @click="setColStyle(realIndex(col), 'headerStyle', 'bgColor', '')">×</button>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="text-[10px] text-gray-400 w-9 shrink-0">Size</span>
            <input type="number" min="6" max="24"
              :value="col.headerStyle?.fontSize ?? ''"
              placeholder="—"
              class="w-14 text-xs border border-line rounded px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-primary-300"
              @input="setColStyle(realIndex(col), 'headerStyle', 'fontSize', Number(($event.target as HTMLInputElement).value) || '')" />
          </div>
        </div>

        <!-- Value overrides -->
        <div class="flex flex-col gap-1.5">
          <span class="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Value</span>
          <div class="flex items-center gap-1.5">
            <span class="text-[10px] text-gray-400 w-9 shrink-0">Align</span>
            <select
              :value="col.style?.align ?? ''"
              class="flex-1 text-xs border border-line rounded px-1.5 py-0.5 bg-surface focus:outline-none focus:ring-1 focus:ring-primary-300"
              @change="setColStyle(realIndex(col), 'style', 'align', ($event.target as HTMLSelectElement).value)"
            >
              <option value="">—</option>
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="text-[10px] text-gray-400 w-9 shrink-0">Text</span>
            <input type="color" :value="hexInput(col.style?.color)"
              class="w-6 h-6 rounded cursor-pointer border border-line p-0"
              @change="setColStyle(realIndex(col), 'style', 'color', inputToHex(($event.target as HTMLInputElement).value))" />
            <button v-if="col.style?.color" class="text-[10px] text-gray-400 hover:text-red-400"
              @click="setColStyle(realIndex(col), 'style', 'color', '')">×</button>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="text-[10px] text-gray-400 w-9 shrink-0">BG</span>
            <input type="color" :value="hexInput(col.style?.bgColor)"
              class="w-6 h-6 rounded cursor-pointer border border-line p-0"
              @change="setColStyle(realIndex(col), 'style', 'bgColor', inputToHex(($event.target as HTMLInputElement).value))" />
            <button v-if="col.style?.bgColor" class="text-[10px] text-gray-400 hover:text-red-400"
              @click="setColStyle(realIndex(col), 'style', 'bgColor', '')">×</button>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="text-[10px] text-gray-400 w-9 shrink-0">Size</span>
            <input type="number" min="6" max="24"
              :value="col.style?.fontSize ?? ''"
              placeholder="—"
              class="w-14 text-xs border border-line rounded px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-primary-300"
              @input="setColStyle(realIndex(col), 'style', 'fontSize', Number(($event.target as HTMLInputElement).value) || '')" />
          </div>
        </div>
      </div>

      <!-- Static value input -->
      <div v-if="col.type === 'static'" class="flex flex-col gap-1">
        <label class="text-[10px] text-gray-400 uppercase tracking-wide">Static Value</label>
        <input
          :value="col.staticValue"
          type="text"
          placeholder="Fixed text value"
          class="text-sm border border-line rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-300"
          @input="updateColumn(realIndex(col), 'staticValue', ($event.target as HTMLInputElement).value)"
        />
      </div>
      </div>

      <!-- Mobile: button on right edge between cards, always visible -->
      <button
        class="xl:hidden absolute -right-[18px] top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-6 h-6 rounded-full border border-primary-300 bg-surface text-primary-600 shadow hover:bg-primary-50 transition-colors"
        title="Insert column after"
        @click="insertColumnAfter(realIndex(col))"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" stroke="currentColor" fill="none" stroke-width="2">
          <path d="M5 1v8M1 5h8"/>
        </svg>
      </button>
      <!-- Desktop: button below card, visible on hover -->
      <div class="hidden xl:flex justify-center h-3 opacity-0 group-hover/col:opacity-100 transition-opacity">
        <button
          class="absolute -bottom-3.5 z-10 flex items-center justify-center w-6 h-6 rounded-full border border-primary-300 bg-surface text-primary-600 shadow hover:bg-primary-50 transition-colors"
          title="Insert column after"
          @click="insertColumnAfter(realIndex(col))"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" stroke="currentColor" fill="none" stroke-width="2">
            <path d="M5 1v8M1 5h8"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Add column button — inline on mobile, full-width below on desktop -->
    <button
      class="shrink-0 w-[140px] self-start xl:w-full xl:self-auto rounded-xl border-2 border-dashed border-line py-3 text-sm text-gray-400 hover:border-primary-300 hover:text-primary-600 transition-colors flex items-center justify-center gap-2"
      @click="addColumn"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" stroke="currentColor" fill="none" stroke-width="2">
        <path d="M7 2v10M2 7h10"/>
      </svg>
      <span class="xl:inline">Add Column</span>
    </button>

    </div><!-- end row -->
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { genId } from "@/utils/utils";
import type { ColumnDef, CellStyle } from "@/utils/invoice-template-export";
import { AVAILABLE_FIELDS, FIELD_DEFAULT_TYPE } from "./constants";
import FieldSelect from "./FieldSelect.vue";
import { formatDate } from "@/utils/invoice-template-export";

const SAMPLE_DATE = new Date(2025, 0, 25); // Jan 25, 2025
const DATE_FORMATS: ColumnDef["dateFormat"][] = [
  "DMY", "MDY", "YMD", "DMY_SHORT", "D_MMM_Y", "MMM_D_Y", "MMM_D", "D_MMM", "MMM_YYYY", "MMM_YY",
];
const NO_SEP_FORMATS = new Set(["D_MMM_Y", "MMM_D_Y", "MMM_D", "D_MMM", "MMM_YYYY", "MMM_YY"]);

function dateFormatLabel(fmt: ColumnDef["dateFormat"], sep: ColumnDef["dateSeparator"]): string {
  return formatDate(SAMPLE_DATE, fmt, sep);
}

const props = defineProps<{ modelValue: ColumnDef[] }>();
const emit = defineEmits<{ (e: "update:modelValue", val: ColumnDef[]): void }>();

const columnSearch = ref("");
const filteredColumns = computed(() => {
  const q = columnSearch.value.toLowerCase().trim();
  return q
    ? props.modelValue.filter((c) => c.label.toLowerCase().includes(q))
    : props.modelValue;
});

const realIndex = (col: ColumnDef) => props.modelValue.indexOf(col);

const dragIndex = ref<number | null>(null);
const expandedStyles = reactive(new Set<string>());

const toggleStyleExpand = (id: string) => {
  if (expandedStyles.has(id)) expandedStyles.delete(id);
  else expandedStyles.add(id);
};

const styleOverrideCount = (col: ColumnDef) =>
  Object.keys(col.headerStyle || {}).length + Object.keys(col.style || {}).length;
const dragOverIndex = ref<number | null>(null);

const usedByMapFor = (excludeId: string): Record<string, string> => {
  const map: Record<string, string> = {};
  for (const c of props.modelValue) {
    if (c.id === excludeId || c.field === "static" || !c.field) continue;
    map[c.field] = c.label || c.field;
  }
  return map;
};

const onFieldChange = (index: number, field: string) => {
  const updated = props.modelValue.map((c, i) => {
    if (i !== index) return c;
    const col: ColumnDef = { ...c, field, type: FIELD_DEFAULT_TYPE[field] ?? "text" };
    if (field !== "static") delete col.staticValue;
    return col;
  });
  emit("update:modelValue", updated);
};

const updateColumn = (index: number, key: keyof ColumnDef, value: any) => {
  emit("update:modelValue", props.modelValue.map((c, i) => i === index ? { ...c, [key]: value } : c));
};

const hexInput = (hex?: string) => hex ? `#${hex}` : "#000000";
const inputToHex = (v: string) => v.replace("#", "").toUpperCase();

const setColStyle = (
  index: number,
  styleKey: "style" | "headerStyle",
  prop: keyof CellStyle,
  value: string | number,
) => {
  emit("update:modelValue", props.modelValue.map((c, i) => {
    if (i !== index) return c;
    if (value === "" || value === 0) {
      const current = { ...(c[styleKey] || {}) } as Record<string, any>;
      delete current[prop as string];
      return { ...c, [styleKey]: Object.keys(current).length ? current : undefined };
    }
    return { ...c, [styleKey]: { ...(c[styleKey] || {}), [prop]: value } };
  }));
};

const removeColumn = (index: number) => {
  emit("update:modelValue", props.modelValue.filter((_, i) => i !== index));
};

const addColumn = () => {
  emit("update:modelValue", [
    ...props.modelValue,
    { id: `col_${genId.next().value}`, field: "", label: "", width: 14, type: "text" },
  ]);
};

const insertColumnAfter = (index: number) => {
  const arr = [...props.modelValue];
  arr.splice(index + 1, 0, { id: `col_${genId.next().value}`, field: "", label: "", width: 14, type: "text" });
  emit("update:modelValue", arr);
};

const onDragStart = (index: number) => { dragIndex.value = index; };
const onDrop = (targetIndex: number) => {
  if (dragIndex.value === null || dragIndex.value === targetIndex) return;
  const arr = [...props.modelValue];
  const [item] = arr.splice(dragIndex.value, 1);
  arr.splice(targetIndex, 0, item);
  emit("update:modelValue", arr);
  dragIndex.value = null;
};
</script>
