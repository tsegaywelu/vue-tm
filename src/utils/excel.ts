import * as XLSX from "xlsx";
import * as XLSXStyle from "xlsx-js-style";

export function exportToExcel(data: any[], filename: string, sheetName: string = "Sheet1") {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

export function mapShipmentsForExcel(shipments: any[]) {
  return shipments.map((s, index) => ({
    "No": index + 1,
    "Shipment Code": s.shipmentCode || "-",
    "Date": s.dispatchDate ? new Date(s.dispatchDate).toLocaleDateString() : "-",
    "Vehicle": s.vehicle?.plateNumber || "-",
    "Origin": s.route?.origin || "-",
    "Destination": s.route?.destination || "-",
    "Quantity": s.order?.totalRequest || "-",
    "Price (ETB)": s.totalPrice || 0,
  }));
}

function fmtDate(date: string) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function fmtPrice(price: number) {
  if (!price) return "0";
  return new Intl.NumberFormat("en-US").format(Math.round(price));
}

function fmtVehicleType(name: string) {
  if (!name) return "";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].toUpperCase();
  return parts.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
}

function fmtDriverName(name: string) {
  if (!name) return "";
  return name.trim().split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
}

function fmtRequestingMonth(shipments: any[]) {
  const dates = shipments.map((s) => new Date(s.dispatchDate).getTime()).filter(Boolean);
  if (!dates.length) return "";
  const min = new Date(Math.min(...dates));
  const max = new Date(Math.max(...dates));
  const ordinal = (d: number) => {
    if (d % 10 === 1 && d !== 11) return "st";
    if (d % 10 === 2 && d !== 12) return "nd";
    if (d % 10 === 3 && d !== 13) return "rd";
    return "th";
  };
  const label = `${min.toLocaleDateString("en-US", { month: "short" })}_${min.getFullYear()}`;
  return `${label} (${min.getDate()}${ordinal(min.getDate())} To ${max.getDate()}${ordinal(max.getDate())})`;
}

const S = {
  labelHeader: {
    fill: { fgColor: { rgb: "FFC107" } },
    font: { bold: true, color: { rgb: "000000" } },
    alignment: { horizontal: "center" },
    border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } },
  },
  labelValue: {
    fill: { fgColor: { rgb: "F5F5F5" } },
    font: { color: { rgb: "555555" } },
    alignment: { horizontal: "left" },
    border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } },
  },
  colHeaderInbound: {
    fill: { fgColor: { rgb: "1565C0" } },
    font: { bold: true, color: { rgb: "FFFFFF" } },
    alignment: { horizontal: "center", wrapText: true },
    border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } },
  },
  colHeaderOutbound: {
    fill: { fgColor: { rgb: "1E530A" } },
    font: { bold: true, color: { rgb: "FFFFFF" } },
    alignment: { horizontal: "center", wrapText: true },
    border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } },
  },
  cell: {
    font: { bold: true },
    border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } },
  },
  totalLabel: {
    font: { bold: true },
    alignment: { horizontal: "right" },
  },
  totalValue: {
    font: { bold: true, underline: true },
  },
};

export function exportInvoiceToExcel(invoice: any) {
  const shipments: any[] = invoice?.shipments || [];
  if (!shipments.length) return;

  const firstType = shipments[0]?.productType || "";
  const isInbound = firstType === "IN_BOUND" || firstType === "SITE_TRANSFER";
  const shipperName = shipments[0]?.order?.shipper?.name || "Shipper";
  const totalSum = Math.round(shipments.reduce((a, s) => a + (s.totalPrice || 0), 0));
  const requestingMonth = fmtRequestingMonth(shipments);

  const inboundHeaders = ["No", "Business Unit", "Date", "Allocation Num", "Material Type", "Truck Type", "Supplier Name", "Origin", "Destination", "Route", "Truck Plate Number", "Driver Name", "GRN", "QTY", "Tarrif", "Remark"];
  const outboundHeaders = ["No", "Service Date (MM, DD, YYY)", "PLATE NUMBER", "Truck Ownership", "GPS Status", "Origin", "Destination", "Distributer Name", `FPIV (${shipperName})`, "Loaded Quantity", "Number of Trip", "Receiving Voucher (Agent)", "CKRF", "Container ISSUE Voucher (Agent)", `Container Receiving Voucher (${shipperName})`, "Returned Quantity", "Tariff", "Payment Request", "Remark"];
  const headers = isInbound ? inboundHeaders : outboundHeaders;
  const colHeaderStyle = isInbound ? S.colHeaderInbound : S.colHeaderOutbound;

  const wsData: any[][] = [];

  // Metadata rows (label | value)
  const metaRows = [
    ["Transporter Name", invoice?.carrier?.name || ""],
    ["REQUESTING MONTH", requestingMonth],
    ["INVOICE NO", invoice?.reference || ""],
    ["PO Number", "TBA"],
  ];
  for (const [label, value] of metaRows) {
    const row: any[] = [{ v: label, t: "s", s: S.labelHeader }, { v: "", t: "s", s: S.labelHeader }, { v: "", t: "s", s: S.labelHeader }, { v: value, t: "s", s: S.labelValue }];
    for (let i = 4; i < headers.length; i++) row.push({ v: "", t: "s", s: S.labelValue });
    wsData.push(row);
  }

  // Column headers
  wsData.push(headers.map((h) => ({ v: h, t: "s", s: colHeaderStyle })));

  // Data rows
  for (const [i, s] of shipments.entries()) {
    let row: any[];
    if (isInbound) {
      row = [
        i + 1,
        s.route?.destination || "",
        fmtDate(s.dispatchDate),
        s.order?.allocationNumber || "",
        s.agent ? s.agent.name : (s.productType === "SITE_TRANSFER" ? "Site Transfer" : s.productType),
        fmtVehicleType(s.vehicleTypeName),
        s.productType === "SITE_TRANSFER" ? "Site Transfer" : (s.agent?.name || ""),
        s.route?.origin || "",
        s.route?.destination || "",
        `${s.route?.origin || ""}_${s.route?.destination || ""}`,
        `${s.vehicle?.plateNumber || ""}/${s.vehicle?.trailerPlate || ""}`,
        fmtDriverName(s.driverName || `${s.driver?.firstName || ""} ${s.driver?.lastName || ""}`),
        s.agentReceiveVoucher || "",
        s.order?.totalRequest || "",
        fmtPrice(s.totalPrice),
        s.remark || "",
      ];
    } else {
      row = [
        i + 1,
        fmtDate(s.dispatchDate),
        `${s.vehicle?.plateNumber || ""}/${s.vehicle?.trailerPlate || ""}`,
        s.vehicle?.ownership === "Owned" ? "Own" : "Subcontracted",
        s.vehicle?.ownership === "Owned" ? "Yes" : "No",
        s.route?.origin || "",
        `${s.route?.origin || ""}_${s.route?.destination || ""}`,
        s.order?.agent?.name || "",
        s.shipperIssueVoucher || "",
        s.order?.totalRequest || "",
        1,
        s.agentReceiveVoucher || "",
        s.CKRFCode || "",
        s.tripType === "round_trip" ? s.agentIssueVoucher || "" : "",
        s.tripType === "round_trip" ? s.shipperReceiveVoucher || "" : "",
        "",
        fmtPrice(s.totalPrice),
        s.totalPrice || "",
        s.remark || "",
      ];
    }
    wsData.push(row.map((v) => ({ v, t: typeof v === "number" ? "n" : "s", s: S.cell })));
  }

  // Total row
  const totalRow: any[] = Array(headers.length - 2).fill({ v: "", t: "s" });
  totalRow.push({ v: "TOTAL", t: "s", s: S.totalLabel });
  totalRow.push({ v: new Intl.NumberFormat("en-US").format(totalSum), t: "s", s: S.totalValue });
  wsData.push(totalRow);

  const ws = XLSXStyle.utils.aoa_to_sheet(wsData);

  // Merges for metadata rows (label spans cols 0-2, value spans 3 to end)
  ws["!merges"] = metaRows.map((_, r) => [
    { s: { r, c: 0 }, e: { r, c: 2 } },
    { s: { r, c: 3 }, e: { r, c: headers.length - 1 } },
  ]).flat();

  // Column widths
  ws["!cols"] = headers.map((h) => ({ wch: Math.max(h.length + 2, 12) }));

  const wb = XLSXStyle.utils.book_new();
  XLSXStyle.utils.book_append_sheet(wb, ws, "Invoice");
  XLSXStyle.writeFile(wb, `Invoice_${invoice?.reference || "Details"}.xlsx`);
}
