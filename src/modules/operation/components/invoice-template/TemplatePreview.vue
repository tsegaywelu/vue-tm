<template>
  <div class="overflow-auto rounded-xl border border-line p-3" style="background: #f3f4f6">
    <table class="text-xs border-collapse" style="min-width: 100%; background: white; color: #111111">
      <!-- Column widths -->
      <colgroup>
        <col
          v-for="col in template.columns"
          :key="col.id"
          :style="{ width: (Number(col.width) * 7) + 'px', minWidth: (Number(col.width) * 7) + 'px' }"
        />
      </colgroup>

      <!-- Title row -->
      <tr v-if="template.titleRow.enabled && template.titleRow.text">
        <td
          :colspan="template.columns.length"
          class="px-2 py-1 border border-gray-300 text-center"
          :style="cellCss(template.titleRow.style)"
        >{{ template.titleRow.text }}</td>
      </tr>

      <!-- Metadata rows -->
      <template v-for="(rowItems, rIdx) in metaRowGroups" :key="rIdx">
        <tr :style="rowItems.length === 0 ? 'height:28px' : ''">
          <template v-for="p in rowItems" :key="p.item.id">
            <td
              :colspan="p.labelSpan"
              :rowspan="p.rowspan > 1 ? p.rowspan : undefined"
              class="px-2 py-1 border border-gray-300 font-semibold align-middle"
              :style="metaLabelCss(p.item)"
            >{{ p.item.labelText }}</td>
            <td
              v-if="p.valueSpan > 0"
              :colspan="p.valueSpan"
              :rowspan="p.rowspan > 1 ? p.rowspan : undefined"
              class="px-2 py-1 border border-gray-300"
              :style="metaValueCss(p.item)"
            >{{ metaSampleValue(p.item.valueSource) }}</td>
          </template>
        </tr>
      </template>

      <!-- Header row -->
      <tr>
        <th
          v-for="col in template.columns"
          :key="col.id"
          class="px-2 py-1.5 border border-gray-300 whitespace-nowrap"
          :style="cellCss(template.styles.header, col.headerStyle)"
        >{{ col.label || '—' }}</th>
      </tr>

      <!-- Sample data rows -->
      <tr v-for="(row, ri) in sampleRows" :key="ri">
        <td
          v-for="(col, ci) in template.columns"
          :key="ci"
          class="px-2 py-1 border border-gray-300 whitespace-nowrap"
          :style="cellCss(ri % 2 === 0 ? template.styles.dataRow : template.styles.alternateRow, col.style)"
        >{{ row[ci] }}</td>
      </tr>

      <!-- Total rows -->
      <tr v-for="trConfig in template.totalRows" :key="trConfig.id">
        <td
          v-for="(col, ci) in template.columns"
          :key="ci"
          class="px-2 py-1 border border-gray-300"
          :style="cellCss(template.styles.totalRow)"
        >
          <template v-if="trConfig.columns.includes(col.field)">1,234</template>
          <template v-else-if="ci === firstTotalIdxFor(trConfig) - 1">
            <span class="font-bold">{{ trConfig.label }}</span>
          </template>
          <template v-else-if="firstTotalIdxFor(trConfig) === -1 && ci === 0">
            <span class="font-bold">{{ trConfig.label }}</span>
          </template>
        </td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { InvoiceTemplate, CellStyle, MetadataRow, TotalRowConfig } from "@/utils/invoice-template-export";
import { placeMetadataItems } from "@/utils/invoice-template-export";
import { AVAILABLE_FIELDS } from "./constants";

const props = defineProps<{ template: InvoiceTemplate }>();

const SAMPLE_VALUES: Record<string, string> = {
  row_number: "1",
  shipmentCode: "SHP-001",
  dispatchDate: "Jan 15",
  "route.origin": "Addis Ababa",
  "route.destination": "Dire Dawa",
  "route.routeCode": "RT-01",
  "route.routeName": "AA - DD",
  "order.allocationNumber": "ALN-001",
  "order.totalRequest": "250",
  "order.agent.agentCode": "D001",
  "order.agent.name": "Distributor A",
  "order.packaging.name": "25kg Bag",
  vehicleTypeName: "Tanker",
  "vehicle.plateNumber": "AA-1234",
  "vehicle.trailerPlate": "TR-001",
  driver: "Abebe Bekele",
  shipperIssueVoucher: "SIV-001",
  shipperReceiveVoucher: "SRV-001",
  agentReceiveVoucher: "GRN-001",
  agentIssueVoucher: "AIV-001",
  totalPrice: "12,500",
  dispatchWeight: "500",
  returnQty: "0",
  remark: "",
};

const META_SAMPLES: Record<MetadataRow["valueSource"], string> = {
  transporterName: "Sample Carrier Co.",
  month: "Jan_2025 (1st To 31st)",
  invoiceNo: "INV-2025-001",
  poNumber: "TBA",
  custom: "(custom text)",
  none: "",
};

const metaSampleValue = (src: MetadataRow["valueSource"]) => META_SAMPLES[src] ?? "";

const metaRowGroups = computed(() => {
  const enabled = props.template.metadataRows.filter((r) => r.enabled);
  const colCount = props.template.columns.length;
  const placed = placeMetadataItems(enabled, colCount);
  const groups: (typeof placed)[] = [];
  for (const p of placed) {
    while (groups.length <= p.rowIdx) groups.push([]);
    groups[p.rowIdx].push(p);
  }
  for (const g of groups) g.sort((a, b) => a.colOffset - b.colOffset);
  return groups;
});

const sampleRows = computed(() =>
  [0, 1, 2].map(() =>
    props.template.columns.map((col) => {
      if (col.type === "static") return col.staticValue ?? "";
      return SAMPLE_VALUES[col.field] ?? "";
    }),
  ),
);

const firstTotalIdxFor = (trConfig: TotalRowConfig) =>
  props.template.columns.findIndex((c) => trConfig.columns.includes(c.field));

function metaLabelCss(item: MetadataRow): Record<string, string> {
  const base: Partial<CellStyle> = { bgColor: "FFC107", bold: true, align: "center" };
  const merged = { ...base, ...(item.labelStyle || {}) };
  const css: Record<string, string> = {};
  if (merged.bgColor) css.backgroundColor = `#${merged.bgColor}`;
  if (merged.color) css.color = `#${merged.color}`;
  if (merged.bold) css.fontWeight = "bold";
  if (merged.italic) css.fontStyle = "italic";
  if (merged.fontSize) css.fontSize = `${merged.fontSize}px`;
  if (merged.align) css.textAlign = merged.align;
  return css;
}

function metaValueCss(item: MetadataRow): Record<string, string> {
  const base: Partial<CellStyle> = { bgColor: "F5F5F5", color: "555555" };
  const merged = { ...base, ...(item.valueStyle || {}) };
  const css: Record<string, string> = {};
  if (merged.bgColor) css.backgroundColor = `#${merged.bgColor}`;
  if (merged.color) css.color = `#${merged.color}`;
  if (merged.bold) css.fontWeight = "bold";
  if (merged.italic) css.fontStyle = "italic";
  if (merged.fontSize) css.fontSize = `${merged.fontSize}px`;
  if (merged.align) css.textAlign = merged.align;
  return css;
}

function cellCss(style: CellStyle, override?: Partial<CellStyle>): Record<string, string> {
  const s: CellStyle = override ? { ...style, ...override } : style;
  const css: Record<string, string> = {};
  if (s.bgColor) css.backgroundColor = `#${s.bgColor}`;
  if (s.color) css.color = `#${s.color}`;
  if (s.bold) css.fontWeight = "bold";
  if (s.italic) css.fontStyle = "italic";
  if (s.fontSize) css.fontSize = `${s.fontSize}px`;
  if (s.align) css.textAlign = s.align;
  return css;
}
</script>
