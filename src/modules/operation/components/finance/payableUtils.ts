export const formatType = (val: string) => {
  if (!val) return "-";
  const types: Record<string, string> = {
    all: "Showing all",
    advance: "Driver Advance",
    prePayment: "Sub-Contract Advance",
    transaction: "Drivers Additional",
    shipment: "Shipment",
    purchaseOrders: "Purchase Order",
    vehicleLeaseAgreements: "Vehicle Lease",
    // Fallbacks for old values just in case
    advancePayment: "Driver Advance",
    transactions: "Drivers Additional",
    prePayments: "Sub-Contract Advance",
    vehicleLeaseAgreement: "Vehicle Lease",
    shipments: "Shipment",
    purchaseOrder: "Purchase Order",
  };
  return types[val] || val.replace(/([A-Z])/g, " $1").trim();
};

export const getPaidTo = (row: any) => {
  console.log(row.payableType);
  if (row.payableType === "shipment" || row.payableType === "shipments") {
    return row.transporter?.tradeName || row.transporter?.name || "-";
  } else if (
    row.payableType === "purchaseOrders" ||
    row.payableType === "purchaseOrder"
  ) {
    return row.supplier || row.supplier?.tradeName || "-";
  } else if (["advancePayment", "transactions"].includes(row.payableType)) {
    return (
      `${row.driver?.firstName || ""} ${row.driver?.lastName || ""}`.trim() ||
      "-"
    );
  } else if (row.supplier) {
    return row.supplier?.name || "-";
  } else if (row.payableType === "vehicleLeaseAgreement") {
    return row.transporter?.name || "asd";
  }
  return "f-";
};
