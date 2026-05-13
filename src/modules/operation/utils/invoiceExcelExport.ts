import * as XLSX from "xlsx-js-style";

export function exportInvoiceToExcel(invoice: any) {
  const { carrier, reference, shipments } = invoice;
  if (!shipments || shipments.length === 0) return;

  const productType = shipments[0].productType;
  const isOutbound = productType === "OUT_BOUND";

  const wb = XLSX.utils.book_new();
  const wsData: any[] = [];

  // Styles
  const styles = {
    title: {
      font: { bold: true, size: 14 },
      alignment: { horizontal: "center" },
    },
    headerLabel: {
      fill: { fgColor: { rgb: "FFC107" } }, // Yellow
      font: { bold: true, color: { rgb: "000000" } }, // Black
      alignment: { horizontal: "center" },
      border: {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      },
    },
    headerContent: {
      font: { color: { rgb: "333333" } },
      alignment: { horizontal: "left" },
      border: {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      },
    },
    columnHeader: {
      fill: { fgColor: { rgb: isOutbound ? "1E530A" : "3B82F6" } }, // Green for outbound, Blue for inbound
      font: { bold: true, color: { rgb: "FFFFFF" } },
      alignment: { horizontal: "center", vertical: "center" },
      border: {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      },
    },
    cell: {
      border: {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      },
      font: { size: 10 },
    },
    cellBold: {
      font: { bold: true, size: 10 },
      border: {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      },
    },
  };

  // Title
  wsData.push([
    {
      v: isOutbound ? "OUTBOUND SHIPMENT INVOICE" : "INBOUND SHIPMENT INVOICE",
      t: "s",
      s: styles.title,
    },
  ]);
  wsData.push([""]);

  // Header Info
  const addHeaderRow = (label: string, value: string) => {
    wsData.push([
      { v: label, t: "s", s: styles.headerLabel },
      { v: "", t: "s", s: styles.headerLabel },
      { v: "", t: "s", s: styles.headerLabel },
      { v: value, t: "s", s: styles.headerContent },
    ]);
  };

  addHeaderRow("Transporter Name", carrier?.name || "-");
  addHeaderRow("REQUESTING MONTH", "-"); // Placeholder or calculated if needed
  addHeaderRow("INVOICE NO", reference || "-");
  addHeaderRow("PO Number", "TBA");
  wsData.push([""]);

  // Column Headers
  let headers: string[] = [];
  if (isOutbound) {
    headers = [
      "No", "Service Date", "Plate Number", "Truck Ownership", "GPS Status",
      "Origin", "Destination", "Distributor Name", "FPIV", "Loaded Qty",
      "Trips", "Receiving Voucher", "CKRF", "Container Issue", "Container Receive",
      "Returned Qty", "Tariff", "Payment Request", "Remark"
    ];
  } else {
    headers = [
      "No", "Business Unit", "Date", "Allocation Num", "Material Type",
      "Truck Type", "Supplier Name", "Origin", "Destination", "Route",
      "Truck Plate Number", "Driver Name", "GRN", "QTY", "Tariff", "Remark"
    ];
  }

  wsData.push(headers.map(h => ({ v: h, t: "s", s: styles.columnHeader })));

  // Data Rows
  shipments.forEach((s: any, index: number) => {
    let row: any[] = [];
    if (isOutbound) {
      row = [
        index + 1,
        s.dispatchDate?.split("T")[0] || "-",
        s.vehiclePlateNumber || s.vehicle?.plateNumber || "-",
        s.vehicleOwnership || (s.vehicle?.ownership === "Owned" ? "Own" : "Subcontracted"),
        s.vehicle?.ownership === "Owned" ? "Yes" : "No",
        s.routeOrigin || s.route?.origin || "-",
        s.routeDestination || s.route?.destination || "-",
        s.agentName || s.agent?.name || "-",
        s.shipperIssueVoucher || "-",
        s.quantity || s.order?.totalRequest || 0,
        1,
        s.agentReceiveVoucher || "-",
        s.CKRFCode || "-",
        s.agentIssueVoucher || "-",
        s.shipperReceiveVoucher || "-",
        "-",
        s.totalPrice || 0,
        s.totalPrice || 0,
        s.remark || ""
      ];
    } else {
      row = [
        index + 1,
        s.routeDestination || s.route?.destination || "-",
        s.dispatchDate?.split("T")[0] || "-",
        s.allocationNumber || s.order?.allocationNumber || "-",
        s.materialType || s.order?.commodity?.[0]?.name || "-",
        s.vehicleTypeName || "-",
        s.agentName || s.agent?.name || "-",
        s.routeOrigin || s.route?.origin || "-",
        s.routeDestination || s.route?.destination || "-",
        `${s.routeOrigin || s.route?.origin}_${s.routeDestination || s.route?.destination}`,
        s.vehiclePlateNumber || s.vehicle?.plateNumber || "-",
        s.driverName || "-",
        s.agentReceiveVoucher || "-",
        s.quantity || s.order?.totalRequest || 0,
        s.totalPrice || 0,
        s.remark || ""
      ];
    }
    wsData.push(row.map(v => ({ v, t: typeof v === "number" ? "n" : "s", s: styles.cell })));
  });

  // Total Row
  const totalAmount = shipments.reduce((sum: number, s: any) => sum + (s.totalPrice || 0), 0);
  const totalRowIndex = wsData.length;
  const totalRow = new Array(headers.length).fill("");
  totalRow[headers.length - 3] = "TOTAL";
  totalRow[headers.length - 2] = totalAmount;
  
  wsData.push(totalRow.map((v, i) => ({
    v, 
    t: typeof v === "number" ? "n" : "s", 
    s: i >= headers.length - 3 ? styles.cellBold : styles.cell 
  })));

  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Column Widths
  ws["!cols"] = headers.map(() => ({ wch: 15 }));

  // Merges
  ws["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } }, // Title
    { s: { r: 2, c: 0 }, e: { r: 2, c: 2 } }, // Transporter label
    { s: { r: 3, c: 0 }, e: { r: 3, c: 2 } }, // Month label
    { s: { r: 4, c: 0 }, e: { r: 4, c: 2 } }, // Invoice label
    { s: { r: 5, c: 0 }, e: { r: 5, c: 2 } }, // PO label
  ];

  XLSX.utils.book_append_sheet(wb, ws, "Invoice");
  XLSX.writeFile(wb, `${reference || "Invoice"}.xlsx`);
}
