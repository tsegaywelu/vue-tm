import * as XLSXStyle from "xlsx-js-style";

export interface CellStyle {
  bold?: boolean;
  italic?: boolean;
  fontSize?: number;
  color?: string;    // hex RGB without #, e.g. "FFFFFF"
  bgColor?: string;  // hex RGB without #
  align?: "left" | "center" | "right";
  wrapText?: boolean;
  border?: boolean;
}

export interface ColumnDef {
  id: string;
  field: string;     // dot-path into shipment, "row_number", or "static"
  label: string;
  width: number;
  type: "text" | "number" | "currency" | "date" | "static";
  staticValue?: string;
  style?: Partial<CellStyle>;
}

export interface MetadataRow {
  id: string;
  labelText: string;
  valueSource: "transporterName" | "month" | "invoiceNo" | "poNumber" | "custom";
  customValue?: string;
  enabled: boolean;
  colspanLabel: number;   // columns the label cell spans horizontally (default 3)
  colspanValue: number;   // columns the value cell spans horizontally (0 = auto)
  rowspanLabel?: number;  // rows the label cell spans vertically (default 1)
}

export interface TotalRowConfig {
  id: string;
  label: string;      // e.g. "TOTAL PAYMENT"
  columns: string[];  // field paths to sum
}

export interface InvoiceTemplate {
  _id?: string;
  name: string;
  ownerId: string;
  ownerType: "shipper" | "carrier";
  productType: "IN_BOUND" | "OUT_BOUND" | "ALL";
  titleRow: { enabled: boolean; text: string; style: CellStyle };
  metadataRows: MetadataRow[];
  columns: ColumnDef[];
  styles: {
    header: CellStyle;
    dataRow: CellStyle;
    alternateRow: CellStyle;
    totalRow: CellStyle;
  };
  totalRows: TotalRowConfig[];
}

// ─── Style helpers ────────────────────────────────────────────────────────────

const thinBorder = {
  top: { style: "thin" },
  bottom: { style: "thin" },
  left: { style: "thin" },
  right: { style: "thin" },
};

export function toXlsxStyle(s: CellStyle): any {
  const style: any = {};
  style.font = {
    bold: s.bold || false,
    italic: s.italic || false,
    sz: s.fontSize ?? 10,
  };
  if (s.color) style.font.color = { rgb: s.color };
  if (s.bgColor) style.fill = { fgColor: { rgb: s.bgColor } };
  style.alignment = {
    horizontal: s.align ?? "left",
    wrapText: s.wrapText ?? false,
    vertical: "center",
  };
  if (s.border !== false) style.border = thinBorder;
  return style;
}

// ─── Field resolver ───────────────────────────────────────────────────────────

function resolveField(shipment: any, field: string, rowIndex: number): any {
  if (field === "row_number") return rowIndex + 1;
  if (field === "driver") {
    const d = shipment.driver;
    if (!d) return "";
    return [d.firstName, d.middleName, d.lastName].filter(Boolean).join(" ");
  }
  return field.split(".").reduce((acc: any, k) => acc?.[k], shipment);
}

function formatValue(raw: any, type: ColumnDef["type"]): { v: any; t: "s" | "n" } {
  if (raw == null || raw === "") return { v: "", t: "s" };
  switch (type) {
    case "number":
      return { v: Number(raw) || 0, t: "n" };
    case "currency": {
      const n = Number(raw) || 0;
      return { v: new Intl.NumberFormat("en-US").format(Math.round(n)), t: "s" };
    }
    case "date": {
      const d = new Date(raw);
      if (isNaN(d.getTime())) return { v: String(raw), t: "s" };
      return { v: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), t: "s" };
    }
    default:
      return { v: String(raw), t: "s" };
  }
}

// ─── Metadata helpers ─────────────────────────────────────────────────────────

function fmtRequestingMonth(shipments: any[]): string {
  const dates = shipments.map((s) => new Date(s.dispatchDate).getTime()).filter(Boolean);
  if (!dates.length) return "";
  const min = new Date(Math.min(...dates));
  const max = new Date(Math.max(...dates));
  const ord = (d: number) => {
    if (d % 10 === 1 && d !== 11) return "st";
    if (d % 10 === 2 && d !== 12) return "nd";
    if (d % 10 === 3 && d !== 13) return "rd";
    return "th";
  };
  const label = `${min.toLocaleDateString("en-US", { month: "short" })}_${min.getFullYear()}`;
  return `${label} (${min.getDate()}${ord(min.getDate())} To ${max.getDate()}${ord(max.getDate())})`;
}

function resolveMetaValue(row: MetadataRow, invoice: any, shipments: any[]): string {
  switch (row.valueSource) {
    case "transporterName": return invoice?.carrier?.name || "";
    case "month": return fmtRequestingMonth(shipments);
    case "invoiceNo": return invoice?.reference || "";
    case "poNumber": return "TBA";
    case "custom": return row.customValue || "";
    default: return "";
  }
}

const S_META_LABEL: any = {
  fill: { fgColor: { rgb: "FFC107" } },
  font: { bold: true, color: { rgb: "000000" } },
  alignment: { horizontal: "center" },
  border: thinBorder,
};
const S_META_VALUE: any = {
  fill: { fgColor: { rgb: "F5F5F5" } },
  font: { color: { rgb: "555555" } },
  alignment: { horizontal: "left" },
  border: thinBorder,
};

// ─── Backward compat migration ────────────────────────────────────────────────

function migrateTemplate(template: any): InvoiceTemplate {
  const t = { ...template };

  if (!Array.isArray(t.metadataRows)) {
    const old = t.metadataRows || {};
    t.metadataRows = [
      { id: "m1", labelText: "Transporter Name", valueSource: "transporterName", enabled: !!old.transporterName, colspanLabel: 3, colspanValue: 0 },
      { id: "m2", labelText: "REQUESTING MONTH", valueSource: "month", enabled: !!old.month, colspanLabel: 3, colspanValue: 0 },
      { id: "m3", labelText: "INVOICE NO", valueSource: "invoiceNo", enabled: !!old.invoiceNo, colspanLabel: 3, colspanValue: 0 },
      { id: "m4", labelText: "PO Number", valueSource: "poNumber", enabled: !!old.poNumber, colspanLabel: 3, colspanValue: 0 },
    ] as MetadataRow[];
  }

  if (!Array.isArray(t.totalRows)) {
    t.totalRows = t.showTotalRow
      ? [{ id: "t1", label: "TOTAL", columns: t.totalColumns || [] }] as TotalRowConfig[]
      : [] as TotalRowConfig[];
  }

  return t as InvoiceTemplate;
}

// ─── Main export function ─────────────────────────────────────────────────────

export function exportInvoiceWithTemplate(invoiceRaw: any, templateRaw: any): void {
  const invoice = invoiceRaw;
  const template = migrateTemplate(templateRaw);
  const shipments: any[] = invoice?.shipments || [];
  if (!shipments.length) return;

  const colCount = template.columns.length;
  const wsData: any[][] = [];
  const merges: any[] = [];

  // Title row
  if (template.titleRow.enabled && template.titleRow.text) {
    const s = toXlsxStyle(template.titleRow.style);
    const row = [
      { v: template.titleRow.text, t: "s", s },
      ...Array(colCount - 1).fill({ v: "", t: "s", s }),
    ];
    merges.push({ s: { r: wsData.length, c: 0 }, e: { r: wsData.length, c: colCount - 1 } });
    wsData.push(row);
  }

  // Metadata rows (with colspan + rowspan support)
  const enabledMeta = template.metadataRows.filter((r) => r.enabled);

  // Pre-compute which rows have their label covered by a prior rowspan
  const labelCovered = new Array(enabledMeta.length).fill(false);
  for (let ei = 0; ei < enabledMeta.length; ei++) {
    if (labelCovered[ei]) continue;
    const rs = Math.max(1, enabledMeta[ei].rowspanLabel || 1);
    for (let j = 1; j < rs && ei + j < enabledMeta.length; j++) {
      labelCovered[ei + j] = true;
    }
  }

  for (let ei = 0; ei < enabledMeta.length; ei++) {
    const metaRow = enabledMeta[ei];
    const labelSpan = Math.max(1, metaRow.colspanLabel || 3);
    const remaining = Math.max(1, colCount - labelSpan);
    const value = resolveMetaValue(metaRow, invoice, shipments);
    const isCovered = labelCovered[ei];
    const r = wsData.length;

    const cells: any[] = [];
    for (let i = 0; i < colCount; i++) {
      if (i < labelSpan) {
        cells.push({ v: !isCovered && i === 0 ? metaRow.labelText : "", t: "s", s: S_META_LABEL });
      } else if (i === labelSpan) {
        cells.push({ v: value, t: "s", s: S_META_VALUE });
      } else {
        cells.push({ v: "", t: "s", s: S_META_VALUE });
      }
    }

    // Label merge: colspan + rowspan (only for the row that owns the label)
    if (!isCovered) {
      const rs = Math.max(1, metaRow.rowspanLabel || 1);
      const actualRows = Math.min(rs, enabledMeta.length - ei);
      const rEnd = r + actualRows - 1;
      if (labelSpan > 1 || actualRows > 1) {
        merges.push({ s: { r, c: 0 }, e: { r: rEnd, c: labelSpan - 1 } });
      }
    }
    // Value colspan merge
    if (remaining > 1) merges.push({ s: { r, c: labelSpan }, e: { r, c: colCount - 1 } });

    wsData.push(cells);
  }

  // Header row
  const headerStyle = toXlsxStyle({ wrapText: true, border: true, ...template.styles.header });
  wsData.push(template.columns.map((col) => ({ v: col.label, t: "s", s: headerStyle })));

  // Data rows
  for (let i = 0; i < shipments.length; i++) {
    const shipment = shipments[i];
    const isAlt = i % 2 === 1;
    const baseStyle = isAlt ? template.styles.alternateRow : template.styles.dataRow;
    const row = template.columns.map((col) => {
      const cellStyle = toXlsxStyle({ border: true, ...baseStyle, ...(col.style || {}) });
      if (col.type === "static") return { v: col.staticValue ?? "", t: "s", s: cellStyle };
      const raw = resolveField(shipment, col.field, i);
      const { v, t } = formatValue(raw, col.type);
      return { v, t, s: cellStyle };
    });
    wsData.push(row);
  }

  // Total rows
  for (const trConfig of template.totalRows) {
    const totalStyle = toXlsxStyle({ border: true, ...template.styles.totalRow });
    const boldRightStyle = {
      ...totalStyle,
      font: { ...(totalStyle.font || {}), bold: true },
      alignment: { ...(totalStyle.alignment || {}), horizontal: "right" },
    };

    const firstTotalIdx = template.columns.findIndex((c) => trConfig.columns.includes(c.field));

    const row = template.columns.map((col, i) => {
      if (trConfig.columns.includes(col.field)) {
        const sum = shipments.reduce((acc, s) => acc + (Number(resolveField(s, col.field, 0)) || 0), 0);
        const { v } = formatValue(sum, col.type === "currency" ? "currency" : "number");
        return { v, t: "s", s: totalStyle };
      }
      if (firstTotalIdx > 0 && i === firstTotalIdx - 1) {
        return { v: trConfig.label, t: "s", s: boldRightStyle };
      }
      if (firstTotalIdx === -1 && i === 0) {
        return { v: trConfig.label, t: "s", s: boldRightStyle };
      }
      return { v: "", t: "s", s: totalStyle };
    });
    wsData.push(row);
  }

  const ws = XLSXStyle.utils.aoa_to_sheet(wsData);
  if (merges.length) ws["!merges"] = merges;
  ws["!cols"] = template.columns.map((col) => ({ wch: col.width || 15 }));

  const wb = XLSXStyle.utils.book_new();
  XLSXStyle.utils.book_append_sheet(wb, ws, "Invoice");
  XLSXStyle.writeFile(wb, `Invoice_${invoice?.reference || "Export"}.xlsx`);
}
