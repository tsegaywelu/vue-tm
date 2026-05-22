<template>
  <div class="overflow-auto rounded-xl border border-gray-200 bg-gray-50 p-3">
    <table class="text-xs border-collapse" style="min-width: 100%">
      <!-- Title row -->
      <tr v-if="template.titleRow.enabled && template.titleRow.text">
        <td
          :colspan="template.columns.length"
          class="px-2 py-1 border border-gray-300 text-center"
          :style="cellCss(template.titleRow.style)"
        >{{ template.titleRow.text }}</td>
      </tr>

      <!-- Metadata rows -->
      <template v-for="meta in visibleMeta" :key="meta.id">
        <tr>
          <!-- Label cell: omitted for rows whose label is covered by a prior rowspan -->
          <td
            v-if="!meta.labelCovered"
            :colspan="meta.colspanLabel || 3"
            :rowspan="meta.effectiveRowspan > 1 ? meta.effectiveRowspan : undefined"
            class="px-2 py-1 border border-gray-300 font-semibold text-center bg-yellow-100 align-middle"
          >{{ meta.labelText }}</td>
          <!-- Value cell: always rendered -->
          <td
            :colspan="meta.colspanValue > 0 ? meta.colspanValue : Math.max(1, template.columns.length - (meta.colspanLabel || 3))"
            class="px-2 py-1 border border-gray-300 bg-gray-50 text-gray-500"
          >{{ metaSampleValue(meta.valueSource) }}</td>
        </tr>
      </template>

      <!-- Header row -->
      <tr>
        <th
          v-for="col in template.columns"
          :key="col.id"
          class="px-2 py-1.5 border border-gray-300 whitespace-nowrap"
          :style="cellCss(template.styles.header)"
        >{{ col.label || '—' }}</th>
      </tr>

      <!-- Sample data rows -->
      <tr v-for="(row, ri) in sampleRows" :key="ri">
        <td
          v-for="(col, ci) in template.columns"
          :key="ci"
          class="px-2 py-1 border border-gray-300 whitespace-nowrap"
          :style="cellCss(ri % 2 === 0 ? template.styles.dataRow : template.styles.alternateRow)"
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
import type { InvoiceTemplate, CellStyle, MetadataRow } from "@/utils/invoice-template-export";
import type { TotalRowConfig } from "@/utils/invoice-template-export";
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
};

const metaSampleValue = (src: MetadataRow["valueSource"]) => META_SAMPLES[src] ?? "";

const visibleMeta = computed(() => {
  const enabled = props.template.metadataRows.filter((r) => r.enabled);

  // Mark rows whose label is covered by a previous rowspan
  const covered = new Array(enabled.length).fill(false);
  for (let i = 0; i < enabled.length; i++) {
    if (covered[i]) continue;
    const rs = Math.max(1, enabled[i].rowspanLabel || 1);
    for (let j = 1; j < rs && i + j < enabled.length; j++) {
      covered[i + j] = true;
    }
  }

  return enabled.map((row, i) => ({
    ...row,
    labelCovered: covered[i],
    effectiveRowspan: covered[i] ? 1 : Math.min(Math.max(1, row.rowspanLabel || 1), enabled.length - i),
  }));
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

function cellCss(style: CellStyle): Record<string, string> {
  const css: Record<string, string> = {};
  if (style.bgColor) css.backgroundColor = `#${style.bgColor}`;
  if (style.color) css.color = `#${style.color}`;
  if (style.bold) css.fontWeight = "bold";
  if (style.italic) css.fontStyle = "italic";
  if (style.fontSize) css.fontSize = `${style.fontSize}px`;
  if (style.align) css.textAlign = style.align;
  return css;
}
</script>
