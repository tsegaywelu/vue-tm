<template>
  <div class="flex flex-col gap-4">
    <!-- Title row toggle -->
    <div class="rounded-xl border border-line bg-white p-4 flex flex-col gap-3">
      <div class="flex items-center justify-between">
        <span class="text-sm font-semibold text-gray-700">Title Row</span>
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" :checked="modelValue.titleRow.enabled" class="sr-only peer"
            @change="update('titleRow', { ...modelValue.titleRow, enabled: ($event.target as HTMLInputElement).checked })" />
          <div class="w-9 h-5 bg-gray-200 peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-600"></div>
        </label>
      </div>
      <div v-if="modelValue.titleRow.enabled" class="flex flex-col gap-2">
        <input
          :value="modelValue.titleRow.text"
          type="text"
          placeholder="Title text"
          class="text-sm border border-line rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-300"
          @input="update('titleRow', { ...modelValue.titleRow, text: ($event.target as HTMLInputElement).value })"
        />
        <StyleRow :modelValue="modelValue.titleRow.style" @update:modelValue="update('titleRow', { ...modelValue.titleRow, style: $event })" />
      </div>
    </div>

    <!-- Metadata rows builder -->
    <div class="rounded-xl border border-line bg-white overflow-hidden">
      <!-- Section header (always visible) -->
      <button
        class="w-full flex items-center justify-between px-4 py-3 hover:bg-surface-hover transition-colors"
        @click="metaOpen = !metaOpen"
      >
        <span class="text-sm font-semibold text-gray-700">Metadata Rows</span>
        <div class="flex items-center gap-2">
          <span class="text-xs text-gray-400">{{ modelValue.metadataRows.filter(r => r.enabled).length }}/{{ modelValue.metadataRows.length }}</span>
          <svg
            class="w-4 h-4 text-gray-400 transition-transform duration-200"
            :class="{ 'rotate-180': metaOpen }"
            viewBox="0 0 20 20" fill="currentColor"
          >
            <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
          </svg>
        </div>
      </button>

      <!-- Collapsible content -->
      <div v-show="metaOpen" class="px-4 pb-4 flex flex-col gap-3 border-t border-gray-100">
        <div class="flex justify-end pt-3">
          <button class="text-xs text-primary-600 hover:text-primary-700 font-medium" @click="addMetaRow">+ Add Row</button>
        </div>

        <div v-if="modelValue.metadataRows.length === 0" class="text-xs text-gray-400 text-center py-2">No metadata rows</div>

        <div
          v-for="(row, idx) in modelValue.metadataRows"
          :key="row.id"
          class="rounded-lg border border-gray-100 bg-gray-50 overflow-hidden"
        >
          <!-- Row header: always visible, click to expand -->
          <div class="flex items-center gap-2 px-3 py-2">
            <label class="relative inline-flex items-center cursor-pointer shrink-0" @click.stop>
              <input type="checkbox" :checked="row.enabled" class="sr-only peer"
                @change="updateMetaRow(idx, 'enabled', ($event.target as HTMLInputElement).checked)" />
              <div class="w-8 h-4 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
            <button class="flex-1 text-left" @click="toggleRowExpand(row.id)">
              <span class="text-xs font-medium text-gray-600 truncate block">{{ row.labelText || `Row ${idx + 1}` }}</span>
            </button>
            <button :disabled="idx === 0" class="text-xs text-gray-400 hover:text-gray-600 disabled:opacity-30 px-1" @click="moveMetaRow(idx, -1)">↑</button>
            <button :disabled="idx === modelValue.metadataRows.length - 1" class="text-xs text-gray-400 hover:text-gray-600 disabled:opacity-30 px-1" @click="moveMetaRow(idx, 1)">↓</button>
            <button class="text-xs text-red-400 hover:text-red-500 px-1" @click="removeMetaRow(idx)">✕</button>
            <svg
              class="w-3 h-3 text-gray-400 transition-transform duration-200 shrink-0"
              :class="{ 'rotate-180': expandedRows.has(row.id) }"
              viewBox="0 0 20 20" fill="currentColor"
              @click="toggleRowExpand(row.id)"
            >
              <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
            </svg>
          </div>

          <!-- Row details (collapsible) -->
          <div v-show="expandedRows.has(row.id)" class="px-3 pb-3 flex flex-col gap-2 border-t border-line">
            <!-- Label text + value source -->
            <div class="grid grid-cols-2 gap-2 pt-2">
              <div class="flex flex-col gap-1">
                <label class="text-[10px] text-gray-400 uppercase tracking-wide">Label Text</label>
                <input
                  :value="row.labelText"
                  type="text"
                  placeholder="Label"
                  class="text-xs border border-line rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-300"
                  @input="updateMetaRow(idx, 'labelText', ($event.target as HTMLInputElement).value)"
                />
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-[10px] text-gray-400 uppercase tracking-wide">Value Source</label>
                <select
                  :value="row.valueSource"
                  class="text-xs border border-line rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary-300"
                  @change="updateMetaRow(idx, 'valueSource', ($event.target as HTMLSelectElement).value)"
                >
                  <option value="transporterName">Transporter Name</option>
                  <option value="month">Requesting Month</option>
                  <option value="invoiceNo">Invoice No.</option>
                  <option value="poNumber">PO Number</option>
                  <option value="custom">Custom Text</option>
                  <option value="none">None (label only)</option>
                </select>
              </div>
            </div>

            <!-- Custom value input -->
            <div v-if="row.valueSource === 'custom'" class="flex flex-col gap-1">
              <label class="text-[10px] text-gray-400 uppercase tracking-wide">Custom Value</label>
              <input
                :value="row.customValue"
                type="text"
                placeholder="Static text value"
                class="text-xs border border-line rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-300"
                @input="updateMetaRow(idx, 'customValue', ($event.target as HTMLInputElement).value)"
              />
            </div>

            <!-- Label Cols + Value Cols -->
            <div class="grid grid-cols-2 gap-2">
              <div class="flex flex-col gap-1">
                <label class="text-[10px] text-gray-400 uppercase tracking-wide">Label Cols</label>
                <input
                  :value="row.colspanLabel"
                  type="number"
                  min="1"
                  max="20"
                  class="text-xs border border-line rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-300"
                  @input="updateMetaRow(idx, 'colspanLabel', Number(($event.target as HTMLInputElement).value))"
                />
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-[10px] text-gray-400 uppercase tracking-wide">Value Cols (0=auto)</label>
                <input
                  :value="row.colspanValue"
                  :disabled="row.valueSource === 'none'"
                  type="number"
                  min="0"
                  max="20"
                  class="text-xs border border-line rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-300 disabled:opacity-40"
                  @input="updateMetaRow(idx, 'colspanValue', Number(($event.target as HTMLInputElement).value))"
                />
              </div>
            </div>

            <!-- Row Span — own row -->
            <div class="flex flex-col gap-1">
              <label class="text-[10px] text-gray-400 uppercase tracking-wide">Row Span</label>
              <input
                :value="row.rowspanLabel || 1"
                type="number"
                min="1"
                max="10"
                class="text-xs border border-line rounded-lg px-2 py-1.5 w-24 focus:outline-none focus:ring-2 focus:ring-primary-300"
                @input="updateMetaRow(idx, 'rowspanLabel', Number(($event.target as HTMLInputElement).value))"
              />
            </div>

            <!-- Label style -->
            <div class="flex flex-col gap-1.5 pt-1 border-t border-gray-100">
              <span class="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Label Style</span>
              <div class="flex flex-wrap items-center gap-3">
                <div class="flex items-center gap-1.5">
                  <span class="text-[10px] text-gray-400 w-6 shrink-0">BG</span>
                  <input type="color" :value="metaHex(row.labelStyle?.bgColor)"
                    class="w-6 h-6 rounded cursor-pointer border border-line p-0"
                    @change="updateMetaStyle(idx, 'labelStyle', 'bgColor', inputToHex(($event.target as HTMLInputElement).value))" />
                  <button v-if="row.labelStyle?.bgColor" class="text-[10px] text-gray-400 hover:text-red-400"
                    @click="updateMetaStyle(idx, 'labelStyle', 'bgColor', '')">×</button>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="text-[10px] text-gray-400 w-7 shrink-0">Text</span>
                  <input type="color" :value="metaHex(row.labelStyle?.color)"
                    class="w-6 h-6 rounded cursor-pointer border border-line p-0"
                    @change="updateMetaStyle(idx, 'labelStyle', 'color', inputToHex(($event.target as HTMLInputElement).value))" />
                  <button v-if="row.labelStyle?.color" class="text-[10px] text-gray-400 hover:text-red-400"
                    @click="updateMetaStyle(idx, 'labelStyle', 'color', '')">×</button>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="text-[10px] text-gray-400 w-6 shrink-0">Size</span>
                  <input type="number" min="6" max="24" :value="row.labelStyle?.fontSize ?? ''" placeholder="—"
                    class="w-12 text-xs border border-line rounded px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-primary-300"
                    @input="updateMetaStyle(idx, 'labelStyle', 'fontSize', Number(($event.target as HTMLInputElement).value) || '')" />
                </div>
              </div>
            </div>

            <!-- Value style (hidden when valueSource === 'none') -->
            <div v-if="row.valueSource !== 'none'" class="flex flex-col gap-1.5 pt-1 border-t border-gray-100">
              <span class="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Value Style</span>
              <div class="flex flex-wrap items-center gap-3">
                <div class="flex items-center gap-1.5">
                  <span class="text-[10px] text-gray-400 w-6 shrink-0">BG</span>
                  <input type="color" :value="metaHex(row.valueStyle?.bgColor)"
                    class="w-6 h-6 rounded cursor-pointer border border-line p-0"
                    @change="updateMetaStyle(idx, 'valueStyle', 'bgColor', inputToHex(($event.target as HTMLInputElement).value))" />
                  <button v-if="row.valueStyle?.bgColor" class="text-[10px] text-gray-400 hover:text-red-400"
                    @click="updateMetaStyle(idx, 'valueStyle', 'bgColor', '')">×</button>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="text-[10px] text-gray-400 w-7 shrink-0">Text</span>
                  <input type="color" :value="metaHex(row.valueStyle?.color)"
                    class="w-6 h-6 rounded cursor-pointer border border-line p-0"
                    @change="updateMetaStyle(idx, 'valueStyle', 'color', inputToHex(($event.target as HTMLInputElement).value))" />
                  <button v-if="row.valueStyle?.color" class="text-[10px] text-gray-400 hover:text-red-400"
                    @click="updateMetaStyle(idx, 'valueStyle', 'color', '')">×</button>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="text-[10px] text-gray-400 w-6 shrink-0">Size</span>
                  <input type="number" min="6" max="24" :value="row.valueStyle?.fontSize ?? ''" placeholder="—"
                    class="w-12 text-xs border border-line rounded px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-primary-300"
                    @input="updateMetaStyle(idx, 'valueStyle', 'fontSize', Number(($event.target as HTMLInputElement).value) || '')" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Section styles -->
    <StyleSection title="Header Row" :modelValue="modelValue.styles.header" @update:modelValue="updateStyle('header', $event)" />
    <StyleSection title="Data Row" :modelValue="modelValue.styles.dataRow" @update:modelValue="updateStyle('dataRow', $event)" />
    <StyleSection title="Alternate Row" :modelValue="modelValue.styles.alternateRow" @update:modelValue="updateStyle('alternateRow', $event)" />
    <StyleSection title="Total Row" :modelValue="modelValue.styles.totalRow" @update:modelValue="updateStyle('totalRow', $event)" />

    <!-- Total row config -->
    <div class="rounded-xl border border-line bg-white p-4 flex flex-col gap-3">
      <span class="text-sm font-semibold text-gray-700">Total Row</span>

      <div class="flex flex-col gap-1">
        <label class="text-[10px] text-gray-400 uppercase tracking-wide">Row Label</label>
        <input
          :value="totalRowLabel"
          type="text"
          placeholder="e.g. TOTAL"
          class="text-xs border border-line rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-300"
          @input="setTotalLabel(($event.target as HTMLInputElement).value)"
        />
      </div>

      <div class="flex flex-col gap-1.5">
        <label class="text-[10px] text-gray-400 uppercase tracking-wide">Sum Columns</label>
        <div v-if="numericCols.length === 0" class="text-xs text-gray-400">No numeric or currency columns defined yet</div>
        <div class="flex flex-col gap-1.5">
          <label
            v-for="col in numericCols"
            :key="col.field"
            class="flex items-center gap-2 text-xs text-gray-700 cursor-pointer select-none"
          >
            <input
              type="checkbox"
              :checked="totalSelectedCols.includes(col.field)"
              class="rounded border-gray-300 text-primary-600"
              @change="toggleTotalCol(col.field, ($event.target as HTMLInputElement).checked)"
            />
            {{ col.label || col.field }}
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, ref, reactive } from "vue";
import type { InvoiceTemplate, CellStyle, MetadataRow, TotalRowConfig } from "@/utils/invoice-template-export";

const props = defineProps<{ modelValue: InvoiceTemplate }>();
const emit = defineEmits<{ (e: "update:modelValue", val: InvoiceTemplate): void }>();

const metaOpen = ref(true);
const expandedRows = reactive(new Set<string>());

const toggleRowExpand = (id: string) => {
  if (expandedRows.has(id)) expandedRows.delete(id);
  else expandedRows.add(id);
};

const update = (key: keyof InvoiceTemplate, value: any) => {
  emit("update:modelValue", { ...props.modelValue, [key]: value });
};

const updateStyle = (key: keyof InvoiceTemplate["styles"], value: CellStyle) => {
  emit("update:modelValue", { ...props.modelValue, styles: { ...props.modelValue.styles, [key]: value } });
};

// ─── Metadata rows ────────────────────────────────────────────────────────────

const addMetaRow = () => {
  const newRow: MetadataRow = {
    id: `meta_${Date.now()}`,
    labelText: "New Row",
    valueSource: "custom",
    customValue: "",
    enabled: true,
    colspanLabel: 3,
    colspanValue: 0,
  };
  emit("update:modelValue", { ...props.modelValue, metadataRows: [...props.modelValue.metadataRows, newRow] });
};

const updateMetaRow = (index: number, key: keyof MetadataRow, value: any) => {
  const updated = props.modelValue.metadataRows.map((r, i) => i === index ? { ...r, [key]: value } : r);
  emit("update:modelValue", { ...props.modelValue, metadataRows: updated });
};

const removeMetaRow = (index: number) => {
  emit("update:modelValue", { ...props.modelValue, metadataRows: props.modelValue.metadataRows.filter((_, i) => i !== index) });
};

const metaHex = (hex?: string) => hex ? `#${hex}` : "#000000";
const inputToHex = (v: string) => v.replace("#", "").toUpperCase();

const updateMetaStyle = (
  index: number,
  styleKey: "labelStyle" | "valueStyle",
  prop: keyof CellStyle,
  value: string | number,
) => {
  const row = props.modelValue.metadataRows[index];
  let updated: Partial<CellStyle>;
  if (value === "" || value === 0) {
    const current = { ...(row[styleKey] || {}) } as Record<string, any>;
    delete current[prop as string];
    updated = Object.keys(current).length ? current : {};
  } else {
    updated = { ...(row[styleKey] || {}), [prop]: value };
  }
  updateMetaRow(index, styleKey, Object.keys(updated).length ? updated : undefined);
};

const moveMetaRow = (index: number, dir: -1 | 1) => {
  const arr = [...props.modelValue.metadataRows];
  const newIdx = index + dir;
  if (newIdx < 0 || newIdx >= arr.length) return;
  [arr[index], arr[newIdx]] = [arr[newIdx], arr[index]];
  emit("update:modelValue", { ...props.modelValue, metadataRows: arr });
};

// ─── Total row (single, always index 0) ──────────────────────────────────────

const numericCols = computed(() =>
  props.modelValue.columns.filter((c) => c.type === "number" || c.type === "currency"),
);

const totalRow0 = computed(() =>
  props.modelValue.totalRows[0] ?? { id: "total_1", label: "TOTAL", columns: [] },
);

const totalRowLabel = computed(() => totalRow0.value.label);
const totalSelectedCols = computed(() => totalRow0.value.columns);

const emitTotalRow = (patch: Partial<TotalRowConfig>) => {
  const updated = { ...totalRow0.value, ...patch };
  emit("update:modelValue", { ...props.modelValue, totalRows: [updated] });
};

const setTotalLabel = (label: string) => emitTotalRow({ label });

const toggleTotalCol = (field: string, checked: boolean) => {
  const cols = checked
    ? [...new Set([...totalSelectedCols.value, field])]
    : totalSelectedCols.value.filter((f) => f !== field);
  emitTotalRow({ columns: cols });
};

// ─── Inline sub-components ────────────────────────────────────────────────────

const StyleRow = defineComponent({
  props: { modelValue: { type: Object as () => CellStyle, required: true } },
  emits: ["update:modelValue"],
  setup(p, { emit: e }) {
    const upd = (key: keyof CellStyle, val: any) => e("update:modelValue", { ...p.modelValue, [key]: val });
    const hexToInput = (hex?: string) => hex ? `#${hex}` : "#ffffff";
    const inputToHex = (v: string) => v.replace("#", "").toUpperCase();
    return () =>
      h("div", { class: "flex flex-wrap items-center gap-3" }, [
        h("label", { class: "flex items-center gap-1.5 text-xs text-gray-500" }, [
          "BG",
          h("input", {
            type: "color",
            value: hexToInput(p.modelValue.bgColor),
            class: "w-7 h-7 rounded cursor-pointer border-0",
            onChange: (ev: any) => upd("bgColor", inputToHex(ev.target.value)),
          }),
        ]),
        h("label", { class: "flex items-center gap-1.5 text-xs text-gray-500" }, [
          "Text",
          h("input", {
            type: "color",
            value: hexToInput(p.modelValue.color),
            class: "w-7 h-7 rounded cursor-pointer border-0",
            onChange: (ev: any) => upd("color", inputToHex(ev.target.value)),
          }),
        ]),
        h("label", { class: "flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer" }, [
          h("input", {
            type: "checkbox",
            checked: p.modelValue.bold,
            class: "rounded border-gray-300 text-primary-600",
            onChange: (ev: any) => upd("bold", ev.target.checked),
          }),
          "Bold",
        ]),
        h("label", { class: "flex items-center gap-1.5 text-xs text-gray-500" }, [
          "Size",
          h("input", {
            type: "number",
            value: p.modelValue.fontSize ?? 10,
            min: 8,
            max: 24,
            class: "w-14 border border-line rounded px-1.5 py-0.5 text-xs",
            onInput: (ev: any) => upd("fontSize", Number(ev.target.value)),
          }),
        ]),
        h("select", {
          value: p.modelValue.align ?? "left",
          class: "text-xs border border-line rounded px-1.5 py-0.5",
          onChange: (ev: any) => upd("align", ev.target.value),
        }, [
          h("option", { value: "left" }, "Left"),
          h("option", { value: "center" }, "Center"),
          h("option", { value: "right" }, "Right"),
        ]),
      ]);
  },
});

const StyleSection = defineComponent({
  props: {
    title: String,
    modelValue: { type: Object as () => CellStyle, required: true },
  },
  emits: ["update:modelValue"],
  setup(p, { emit: e, slots }) {
    return () =>
      h("div", { class: "rounded-xl border border-line bg-white p-4 flex flex-col gap-3" }, [
        h("span", { class: "text-sm font-semibold text-gray-700" }, p.title),
        h(StyleRow, { modelValue: p.modelValue, "onUpdate:modelValue": (v: CellStyle) => e("update:modelValue", v) }),
        slots.extra?.(),
      ]);
  },
});
</script>
