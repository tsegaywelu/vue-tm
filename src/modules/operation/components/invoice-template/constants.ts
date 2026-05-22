import type { ColumnDef, CellStyle, InvoiceTemplate, MetadataRow, TotalRowConfig } from "@/utils/invoice-template-export";

export const AVAILABLE_FIELDS: { value: string; label: string }[] = [
  { value: "row_number", label: "No. (Row Number)" },
  { value: "shipmentCode", label: "Shipment Code" },
  { value: "dispatchDate", label: "Date" },
  { value: "route.origin", label: "Origin" },
  { value: "route.destination", label: "Destination" },
  { value: "route.routeCode", label: "Route Code" },
  { value: "route.routeName", label: "Route Description" },
  { value: "order.allocationNumber", label: "Allocation Number" },
  { value: "order.totalRequest", label: "Quantity" },
  { value: "order.agent.agentCode", label: "Agent Code / Distributor No." },
  { value: "order.agent.name", label: "Agent / Distributor Name" },
  { value: "order.packaging.name", label: "Packaging / Material Type" },
  { value: "vehicleTypeName", label: "Truck / Vehicle Type" },
  { value: "vehicle.plateNumber", label: "Plate Number" },
  { value: "vehicle.trailerPlate", label: "Trailer Plate" },
  { value: "driver", label: "Driver Name" },
  { value: "shipperIssueVoucher", label: "Shipper Issue Voucher / Original Doc" },
  { value: "shipperReceiveVoucher", label: "Shipper Receive Voucher / For Doc No." },
  { value: "agentReceiveVoucher", label: "GRN / Agent Receive Voucher" },
  { value: "agentIssueVoucher", label: "Agent Issue Voucher" },
  { value: "totalPrice", label: "Total Price / Payment Amount" },
  { value: "dispatchWeight", label: "Dispatch Weight" },
  { value: "returnQty", label: "Return Qty" },
  { value: "remark", label: "Remark" },
  { value: "static", label: "Static Text" },
];

export const FIELD_DEFAULT_TYPE: Record<string, ColumnDef["type"]> = {
  row_number: "number",
  dispatchDate: "date",
  "order.totalRequest": "number",
  totalPrice: "currency",
  dispatchWeight: "number",
  returnQty: "number",
  static: "static",
};

export function makeDefaultTemplate(): InvoiceTemplate {
  return {
    name: "",
    ownerId: "",
    ownerType: "shipper",
    productType: "IN_BOUND",
    titleRow: { enabled: false, text: "", style: { bold: true, fontSize: 14, align: "center", bgColor: "FFFFFF" } },
    metadataRows: [
      { id: "meta_1", labelText: "Transporter Name", valueSource: "transporterName", enabled: true, colspanLabel: 3, colspanValue: 0 },
      { id: "meta_2", labelText: "REQUESTING MONTH", valueSource: "month", enabled: true, colspanLabel: 3, colspanValue: 0 },
      { id: "meta_3", labelText: "INVOICE NO", valueSource: "invoiceNo", enabled: true, colspanLabel: 3, colspanValue: 0 },
      { id: "meta_4", labelText: "PO Number", valueSource: "poNumber", enabled: true, colspanLabel: 3, colspanValue: 0 },
    ] as MetadataRow[],
    columns: [
      { id: "col_no", field: "row_number", label: "No", width: 6, type: "number" },
      { id: "col_date", field: "dispatchDate", label: "Date", width: 14, type: "date" },
      { id: "col_origin", field: "route.origin", label: "Origin", width: 16, type: "text" },
      { id: "col_destination", field: "route.destination", label: "Destination", width: 16, type: "text" },
      { id: "col_plate", field: "vehicle.plateNumber", label: "Truck Plate", width: 14, type: "text" },
      { id: "col_driver", field: "driver", label: "Driver Name", width: 20, type: "text" },
      { id: "col_qty", field: "order.totalRequest", label: "QTY", width: 10, type: "number" },
      { id: "col_price", field: "totalPrice", label: "Payment Amount", width: 16, type: "currency" },
    ],
    styles: {
      header: { bold: true, color: "FFFFFF", bgColor: "1565C0", align: "center", wrapText: true, border: true },
      dataRow: { border: true, align: "left" },
      alternateRow: { bgColor: "F5F5F5", border: true },
      totalRow: { bold: true, bgColor: "E8E8E8", border: true },
    },
    totalRows: [
      { id: "total_1", label: "TOTAL", columns: ["totalPrice"] } as TotalRowConfig,
    ],
  };
}
