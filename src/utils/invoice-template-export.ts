import * as XLSXStyle from "xlsx-js-style";
import { generateRouteCode, getBusinessUnit, getMaterialType, getOrigin, getDestination, getRouteDescription } from "./shipment-export-utils";

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
  dateFormat?: "DMY" | "MDY" | "YMD" | "DMY_SHORT" | "D_MMM_Y" | "MMM_D_Y" | "MMM_D" | "D_MMM" | "MMM_YYYY" | "MMM_YY";
  dateSeparator?: "/" | "-" | ".";
  style?: Partial<CellStyle>;
  headerStyle?: Partial<CellStyle>;
}

export interface MetadataRow {
  id: string;
  labelText: string;
  valueSource: "transporterName" | "month" | "invoiceNo" | "poNumber" | "custom" | "none";
  customValue?: string;
  enabled: boolean;
  colspanLabel: number;   // columns the label cell spans horizontally (default 3)
  colspanValue: number;   // columns the value cell spans horizontally (0 = auto)
  rowspanLabel?: number;  // rows the label cell spans vertically (default 1)
  labelStyle?: Partial<CellStyle>;
  valueStyle?: Partial<CellStyle>;
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

// ─── Grid placement ───────────────────────────────────────────────────────────

export interface PlacedMetaItem {
  item: MetadataRow;
  rowIdx: number;
  colOffset: number;
  labelSpan: number;
  valueSpan: number;
  rowspan: number;
}

export function placeMetadataItems(rows: MetadataRow[], colCount: number): PlacedMetaItem[] {
  const occupancy: boolean[][] = [];
  const result: PlacedMetaItem[] = [];

  const ensureRows = (maxRow: number) => {
    while (occupancy.length <= maxRow)
      occupancy.push(new Array(colCount).fill(false));
  };

  for (const item of rows) {
    const rawLabelSpan = Math.max(1, item.colspanLabel || 3);
    const rawValueSpan = item.colspanValue > 0
      ? Math.min(item.colspanValue, colCount - rawLabelSpan)
      : Math.max(1, colCount - rawLabelSpan);
    const itemWidth = Math.min(rawLabelSpan + rawValueSpan, colCount);
    const rowspan = Math.max(1, item.rowspanLabel || 1);
    const isLabelOnly = item.valueSource === "none";
    const labelSpan = isLabelOnly ? itemWidth : rawLabelSpan;
    const valueSpan = isLabelOnly ? 0 : rawValueSpan;

    let placed = false;
    for (let r = 0; !placed; r++) {
      ensureRows(r + rowspan - 1);
      for (let c = 0; c <= colCount - itemWidth; c++) {
        let fits = true;
        outer: for (let dr = 0; dr < rowspan; dr++)
          for (let dc = 0; dc < itemWidth; dc++)
            if (occupancy[r + dr][c + dc]) { fits = false; break outer; }
        if (fits) {
          for (let dr = 0; dr < rowspan; dr++)
            for (let dc = 0; dc < itemWidth; dc++)
              occupancy[r + dr][c + dc] = true;
          result.push({ item, rowIdx: r, colOffset: c, labelSpan, valueSpan, rowspan });
          placed = true;
          break;
        }
      }
    }
  }
  return result;
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
    if (shipment.driverName) return shipment.driverName;
    const d = shipment.driver;
    if (!d) return "";
    return [d.firstName, d.middleName, d.lastName].filter(Boolean).join(" ");
  }
  if (field === "order.agent.name") {
    return shipment.order?.agent?.name || shipment.agent?.name || shipment.agentName || "";
  }
  if (field === "order.agent.agentCode") {
    return shipment.order?.agent?.agentCode || shipment.order?.agent?.code || "";
  }
  if (field === "vehicle.plateNumber") {
    const plate = shipment.vehiclePlateNumber || shipment.vehicle?.plateNumber || "";
    const trailer = shipment.vehicle?.trailerPlate || "";
    return trailer ? `${plate}/${trailer}` : plate;
  }
  if (field === "route.routeCode") return generateRouteCode(shipment);
  if (field === "businessUnit") return getBusinessUnit(shipment);
  if (field === "vehicleTypeName") {
    return shipment.vehicleTypeName || shipment.order?.vehicleTypeName || shipment.vehicleType?.name || "";
  }
  if (field === "routeName") return shipment.routeName || shipment.route?.name || getRouteDescription(shipment);
  if (field === "commodity") {
    const list = shipment.commodity;
    if (Array.isArray(list)) return list.map((c: any) => c.name || c).filter(Boolean).join(", ");
    return "";
  }
  if (field === "materialType") return getMaterialType(shipment);
  if (field === "vehicleOwnership") {
    return shipment.vehicleOwnership || shipment.vehicle?.ownership || "";
  }
  if (field === "order.unitOfMeasurement") {
    return shipment.order?.unitOfMeasurement || shipment.unitOfMeasurement || "";
  }
  if (field === "order.numberOfVehicles") {
    return shipment.order?.numberOfVehicles ?? "";
  }
  if (field === "orderCode") {
    return shipment.orderCode || shipment.order?.orderCode || "";
  }
  return field.split(".").reduce((acc: any, k) => acc?.[k], shipment);
}

export function formatDate(raw: any, fmt: ColumnDef["dateFormat"], sep: ColumnDef["dateSeparator"]): string {
  const d = new Date(raw);
  if (isNaN(d.getTime())) return String(raw);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = String(d.getFullYear());
  const yy = yyyy.slice(2);
  const s = sep ?? "/";
  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const mon = MONTHS[d.getMonth()];
  switch (fmt ?? "DMY") {
    case "DMY":       return `${dd}${s}${mm}${s}${yyyy}`;
    case "MDY":       return `${mm}${s}${dd}${s}${yyyy}`;
    case "YMD":       return `${yyyy}${s}${mm}${s}${dd}`;
    case "DMY_SHORT": return `${dd}${s}${mm}${s}${yy}`;
    case "D_MMM_Y":   return `${dd} ${mon} ${yyyy}`;
    case "MMM_D_Y":   return `${mon} ${dd}, ${yyyy}`;
    case "MMM_D":     return `${mon} ${dd}`;
    case "D_MMM":     return `${dd} ${mon}`;
    case "MMM_YYYY":  return `${mon} ${yyyy}`;
    case "MMM_YY":    return `${mon} '${yy}`;
    default:          return `${dd}${s}${mm}${s}${yyyy}`;
  }
}

function formatValue(raw: any, type: ColumnDef["type"], col?: Pick<ColumnDef, "dateFormat" | "dateSeparator">): { v: any; t: "s" | "n" } {
  if (raw == null || raw === "") return { v: "", t: "s" };
  switch (type) {
    case "number":
      return { v: Number(raw) || 0, t: "n" };
    case "currency": {
      const n = Number(raw) || 0;
      return { v: new Intl.NumberFormat("en-US").format(Math.round(n)), t: "s" };
    }
    case "date":
      return { v: formatDate(raw, col?.dateFormat, col?.dateSeparator), t: "s" };
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
    case "none": return "";
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

function mergeXlsxStyle(base: any, override?: Partial<CellStyle>): any {
  if (!override || !Object.keys(override).length) return base;
  const o = toXlsxStyle(override as CellStyle);
  return {
    fill: o.fill ?? base.fill,
    font: { ...base.font, ...o.font },
    alignment: { ...base.alignment, ...o.alignment },
    border: base.border,
  };
}

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

  // Metadata rows — grid packing
  const enabledMeta = template.metadataRows.filter((r) => r.enabled);
  const placed = placeMetadataItems(enabledMeta, colCount);
  const numMetaRows = placed.length === 0 ? 0 : Math.max(...placed.map((p) => p.rowIdx + p.rowspan));
  const metaBaseRow = wsData.length;

  const metaGrid: any[][] = Array.from({ length: numMetaRows }, () =>
    new Array(colCount).fill(null).map(() => ({ v: "", t: "s", s: S_META_VALUE })));

  for (const p of placed) {
    const value = resolveMetaValue(p.item, invoice, shipments);
    const sLabel = mergeXlsxStyle(S_META_LABEL, p.item.labelStyle);
    const sValue = mergeXlsxStyle(S_META_VALUE, p.item.valueStyle);
    for (let dr = 0; dr < p.rowspan; dr++) {
      for (let dc = 0; dc < p.labelSpan; dc++)
        metaGrid[p.rowIdx + dr][p.colOffset + dc] =
          { v: dr === 0 && dc === 0 ? p.item.labelText : "", t: "s", s: sLabel };
      for (let dc = 0; dc < p.valueSpan; dc++)
        metaGrid[p.rowIdx + dr][p.colOffset + p.labelSpan + dc] =
          { v: dr === 0 && dc === 0 ? value : "", t: "s", s: sValue };
    }
    const r = metaBaseRow + p.rowIdx;
    if (p.labelSpan > 1 || p.rowspan > 1)
      merges.push({ s: { r, c: p.colOffset }, e: { r: r + p.rowspan - 1, c: p.colOffset + p.labelSpan - 1 } });
    if (p.valueSpan > 1 || p.rowspan > 1)
      merges.push({ s: { r, c: p.colOffset + p.labelSpan }, e: { r: r + p.rowspan - 1, c: p.colOffset + p.labelSpan + p.valueSpan - 1 } });
  }

  for (const row of metaGrid) wsData.push(row);

  // Header row — per-column headerStyle overrides global header style
  wsData.push(template.columns.map((col) => {
    const s = toXlsxStyle({ wrapText: true, border: true, ...template.styles.header, ...(col.headerStyle || {}) });
    return { v: col.label, t: "s", s };
  }));

  // Data rows
  for (let i = 0; i < shipments.length; i++) {
    const shipment = shipments[i];
    const isAlt = i % 2 === 1;
    const baseStyle = isAlt ? template.styles.alternateRow : template.styles.dataRow;
    const row = template.columns.map((col) => {
      const cellStyle = toXlsxStyle({ border: true, ...baseStyle, ...(col.style || {}) });
      if (col.type === "static") return { v: col.staticValue ?? "", t: "s", s: cellStyle };
      const raw = resolveField(shipment, col.field, i);
      const { v, t } = formatValue(raw, col.type, col);
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
  ws["!cols"] = template.columns.map((col) => ({ wch: Number(col.width) || 15 }));

  const wb = XLSXStyle.utils.book_new();
  XLSXStyle.utils.book_append_sheet(wb, ws, "Invoice");
  XLSXStyle.writeFile(wb, `Invoice_${invoice?.reference || "Export"}.xlsx`);
}
