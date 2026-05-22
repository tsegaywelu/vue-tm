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
import { ref } from "vue";
import { genId } from "@/utils/utils";
import type { ColumnDef } from "@/utils/invoice-template-export";
import { AVAILABLE_FIELDS, FIELD_DEFAULT_TYPE } from "./constants";

const props = defineProps<{ modelValue: ColumnDef[] }>();
const emit = defineEmits<{ (e: "update:modelValue", val: ColumnDef[]): void }>();

const dragIndex = ref<number | null>(null);
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
