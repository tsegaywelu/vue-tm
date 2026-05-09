import * as XLSX from "xlsx";

/**
 * Exports data to an Excel file.
 * @param data Array of objects to export.
 * @param filename Name of the file (without extension).
 * @param sheetName Name of the worksheet.
 */
export function exportToExcel(data: any[], filename: string, sheetName: string = "Sheet1") {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  
  // Create binary string
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

/**
 * Maps shipment data to a flat format suitable for Excel.
 */
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
