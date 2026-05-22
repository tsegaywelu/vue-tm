<template>
  <div class="flex flex-col gap-3">
    <div
      v-for="(col, index) in modelValue"
      :key="col.id"
      class="rounded-xl border border-gray-200 bg-white shadow-sm p-3 flex flex-col gap-2"
      :class="{ 'border-primary-300 ring-1 ring-primary-100': dragOverIndex === index }"
      draggable="true"
      @dragstart="onDragStart(index)"
      @dragover.prevent="dragOverIndex = index"
      @dragleave="dragOverIndex = null"
      @drop.prevent="onDrop(index)"
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
          <select
            :value="col.field"
            class="w-full text-sm border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary-300"
            @change="onFieldChange(index, ($event.target as HTMLSelectElement).value)"
          >
            <option value="" disabled>Select field...</option>
            <option
              v-for="f in availableFieldsFor(col.id, col.field)"
              :key="f.value"
              :value="f.value"
            >{{ f.label }}</option>
          </select>
        </div>
        <button
          class="shrink-0 text-gray-400 hover:text-red-500 transition-colors p-1"
          title="Remove column"
          @click="removeColumn(index)"
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
            class="text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-300"
            @input="updateColumn(index, 'label', ($event.target as HTMLInputElement).value)"
          />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-[10px] text-gray-400 uppercase tracking-wide">Width</label>
          <input
            :value="col.width"
            type="number"
            min="5"
            max="50"
            class="text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-300"
            @input="updateColumn(index, 'width', Number(($event.target as HTMLInputElement).value))"
          />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-[10px] text-gray-400 uppercase tracking-wide">Type</label>
          <select
            :value="col.type"
            class="text-sm border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary-300"
            @change="updateColumn(index, 'type', ($event.target as HTMLSelectElement).value)"
          >
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="currency">Currency</option>
            <option value="date">Date</option>
            <option value="static">Static</option>
          </select>
        </div>
      </div>

      <!-- Style overrides toggle -->
      <button
        class="flex items-center gap-1.5 text-[10px] text-gray-400 hover:text-primary-600 transition-colors border-t border-gray-100 pt-2 w-full text-left"
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
              class="flex-1 text-xs border border-gray-200 rounded px-1.5 py-0.5 bg-white focus:outline-none focus:ring-1 focus:ring-primary-300"
              @change="setColStyle(index, 'headerStyle', 'align', ($event.target as HTMLSelectElement).value)"
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
              class="w-6 h-6 rounded cursor-pointer border border-gray-200 p-0"
              @change="setColStyle(index, 'headerStyle', 'color', inputToHex(($event.target as HTMLInputElement).value))" />
            <button v-if="col.headerStyle?.color" class="text-[10px] text-gray-400 hover:text-red-400"
              @click="setColStyle(index, 'headerStyle', 'color', '')">×</button>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="text-[10px] text-gray-400 w-9 shrink-0">BG</span>
            <input type="color" :value="hexInput(col.headerStyle?.bgColor)"
              class="w-6 h-6 rounded cursor-pointer border border-gray-200 p-0"
              @change="setColStyle(index, 'headerStyle', 'bgColor', inputToHex(($event.target as HTMLInputElement).value))" />
            <button v-if="col.headerStyle?.bgColor" class="text-[10px] text-gray-400 hover:text-red-400"
              @click="setColStyle(index, 'headerStyle', 'bgColor', '')">×</button>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="text-[10px] text-gray-400 w-9 shrink-0">Size</span>
            <input type="number" min="6" max="24"
              :value="col.headerStyle?.fontSize ?? ''"
              placeholder="—"
              class="w-14 text-xs border border-gray-200 rounded px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-primary-300"
              @input="setColStyle(index, 'headerStyle', 'fontSize', Number(($event.target as HTMLInputElement).value) || '')" />
          </div>
        </div>

        <!-- Value overrides -->
        <div class="flex flex-col gap-1.5">
          <span class="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Value</span>
          <div class="flex items-center gap-1.5">
            <span class="text-[10px] text-gray-400 w-9 shrink-0">Align</span>
            <select
              :value="col.style?.align ?? ''"
              class="flex-1 text-xs border border-gray-200 rounded px-1.5 py-0.5 bg-white focus:outline-none focus:ring-1 focus:ring-primary-300"
              @change="setColStyle(index, 'style', 'align', ($event.target as HTMLSelectElement).value)"
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
              class="w-6 h-6 rounded cursor-pointer border border-gray-200 p-0"
              @change="setColStyle(index, 'style', 'color', inputToHex(($event.target as HTMLInputElement).value))" />
            <button v-if="col.style?.color" class="text-[10px] text-gray-400 hover:text-red-400"
              @click="setColStyle(index, 'style', 'color', '')">×</button>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="text-[10px] text-gray-400 w-9 shrink-0">BG</span>
            <input type="color" :value="hexInput(col.style?.bgColor)"
              class="w-6 h-6 rounded cursor-pointer border border-gray-200 p-0"
              @change="setColStyle(index, 'style', 'bgColor', inputToHex(($event.target as HTMLInputElement).value))" />
            <button v-if="col.style?.bgColor" class="text-[10px] text-gray-400 hover:text-red-400"
              @click="setColStyle(index, 'style', 'bgColor', '')">×</button>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="text-[10px] text-gray-400 w-9 shrink-0">Size</span>
            <input type="number" min="6" max="24"
              :value="col.style?.fontSize ?? ''"
              placeholder="—"
              class="w-14 text-xs border border-gray-200 rounded px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-primary-300"
              @input="setColStyle(index, 'style', 'fontSize', Number(($event.target as HTMLInputElement).value) || '')" />
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
          class="text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-300"
          @input="updateColumn(index, 'staticValue', ($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>

    <!-- Add column button -->
    <button
      class="rounded-xl border-2 border-dashed border-gray-200 py-3 text-sm text-gray-400 hover:border-primary-300 hover:text-primary-600 transition-colors flex items-center justify-center gap-2"
      @click="addColumn"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" stroke="currentColor" fill="none" stroke-width="2">
        <path d="M7 2v10M2 7h10"/>
      </svg>
      Add Column
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { genId } from "@/utils/utils";
import type { ColumnDef, CellStyle } from "@/utils/invoice-template-export";
import { AVAILABLE_FIELDS, FIELD_DEFAULT_TYPE } from "./constants";

const props = defineProps<{ modelValue: ColumnDef[] }>();
const emit = defineEmits<{ (e: "update:modelValue", val: ColumnDef[]): void }>();

const dragIndex = ref<number | null>(null);
const expandedStyles = reactive(new Set<string>());

const toggleStyleExpand = (id: string) => {
  if (expandedStyles.has(id)) expandedStyles.delete(id);
  else expandedStyles.add(id);
};

const styleOverrideCount = (col: ColumnDef) =>
  Object.keys(col.headerStyle || {}).length + Object.keys(col.style || {}).length;
const dragOverIndex = ref<number | null>(null);

const usedFields = (excludeId: string) =>
  props.modelValue.filter((c) => c.id !== excludeId && c.field !== "static").map((c) => c.field);

const availableFieldsFor = (colId: string, currentField: string) =>
  AVAILABLE_FIELDS.filter(
    (f) => f.value === currentField || f.value === "static" || !usedFields(colId).includes(f.value),
  );

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
