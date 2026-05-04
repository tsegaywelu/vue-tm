import * as XLSX from "xlsx-js-style";

function formatDateTime(isoString: string | null | undefined): string {
  if (!isoString) return " ";
  const date = new Date(isoString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

function formatDate(isoString: string | null | undefined): string {
  if (!isoString) return " ";
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
}

function formatTime(isoString: string | null | undefined): string {
  if (!isoString) return " ";
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
}

function shiftDateByMinusThreeHours(isoString: string | null | undefined): Date | null {
  if (!isoString) return null;
  const parsedDate = new Date(isoString);
  if (Number.isNaN(parsedDate.getTime())) return null;
  return new Date(parsedDate.getTime() - 3 * 60 * 60 * 1000);
}

export function exportToExcel(shipments: any[]) {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).replace(/\//g, "-");

  const filteredShipments = shipments.filter(
    (shipment) =>
      shipment.productType === "IN_BOUND" ||
      shipment.productType === "SITE_TRANSFER"
  );

  const headers = [
    "S.N",
    "Allocation Nr",
    "Request Date",
    "Actual Loading Date",
    "Date of Arrival at Destination",
    "Truck Type",
    "Supplier Name",
    "Material Type",
    "Origin",
    "Destination",
    "Truck Plate Number",
    "Driver Name",
    "Phone Number",
    "Loading Document Number",
    "GRN",
    "Status",
    "Freight Order",
  ];

  const formattedData = filteredShipments.map((shipment, index) => ({
    sn: index + 1,
    allocationNr: shipment.allocationNr || "",
    requestDate: formatDateTime(shipment.dispatchDate),
    actualLoadingDate: formatDateTime(shipment.statusTime?.departedTime),
    arrivalAtDestination: formatDateTime(shipment.statusTime?.arrivedAtDestinationTime),
    truckType: shipment.vehicleType?.name || "",
    supplierName: shipment?.agent
      ? shipment.agent?.name
      : shipment?.order?.agent?.name || "SITE_TRANSFER",
    materialType:
      shipment?.commodity?.length > 0
        ? shipment.commodity[0].name
        : shipment?.order?.commodity?.length > 0
        ? shipment.order.commodity[0].name
        : "",
    origin: shipment.route?.origin || "",
    destination: shipment.route?.destination || "",
    plateNumber: shipment.vehicle?.plateNumber
      ? `${shipment.vehicle.plateNumber}/${shipment.vehicle.trailerPlate || ""}`
      : "",
    driverName: `${shipment.driver?.firstName || ""} ${shipment.driver?.middleName || ""} ${shipment.driver?.lastName || ""}`.trim(),
    phoneNumber: shipment.driver?.phoneNumber || "",
    loadingDocNumber: shipment.shipperIssueVoucher || "",
    grn: shipment.agentReceiveVoucher || "",
    status: shipment.status || "",
    freightOrder: shipment?.freightOrder || " ",
  }));

  const headerStyle = {
    fill: { fgColor: { rgb: "92D050" } },
    font: { bold: true, color: { rgb: "FFFFFF" } },
    alignment: { horizontal: "center", vertical: "center" },
    border: {
      top: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } },
    },
  };

  const titleStyle = {
    fill: { fgColor: { rgb: "92D050" } },
    font: { bold: true, sz: 14, color: { rgb: "FFFFFF" } },
    alignment: { horizontal: "center", vertical: "center" },
  };

  const subtitleStyle = {
    fill: { fgColor: { rgb: "92D050" } },
    font: { bold: true, sz: 12, color: { rgb: "FFFFFF" } },
    alignment: { horizontal: "center", vertical: "center" },
  };

  const titleRows = [
    [
      {
        v: "Raaz Transporter",
        s: titleStyle,
      },
    ],
    [
      {
        v: "BGI Master Sheet - All Inbound Shipments",
        s: subtitleStyle,
      },
    ],
  ];

  const headerRow = headers.map((text) => ({
    v: text,
    s: headerStyle,
  }));

  const dataRows = formattedData.map((item) => Object.values(item));

  const worksheetData = [...titleRows, headerRow, ...dataRows];
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  worksheet["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: headers.length - 1 } },
  ];

  worksheet["!cols"] = headers.map(() => ({ wch: 22 }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "All Inbound Shipments".substring(0, 31));

  XLSX.writeFile(workbook, `BGI_Master_Sheet_${currentDate}.xlsx`);
}

export function exportToExcelFullProduct(shipments: any[]) {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const filteredShipments = shipments.filter(
    (shipment) =>
      shipment.productType === "OUT_BOUND" &&
      shipment.status !== "terminated"
  );

  const formattedData = filteredShipments.map((shipment) => ({
    dateOfRequest: formatDate(shipment.dispatchDate),
    transporterName: shipment.carrier?.name || "",
    typeOfCollection: "DD",
    AgentName: shipment.agent?.name
      ? shipment.agent?.name
      : shipment.order?.agent?.name || "",
    origin: shipment.route?.origin || "N/A",
    destination: shipment.route?.destination || "N/A",
    plateNumber: shipment.vehicle?.plateNumber
      ? `${shipment.vehicle.plateNumber}/${shipment.vehicle.trailerPlate || "N/A"}`
      : "N/A",
    driverName: `${shipment?.driver?.firstName || ""} ${shipment?.driver?.middleName || ""} ${shipment?.driver?.lastName || ""}`.trim(),
    phoneNumber: shipment.driver?.phoneNumber || "N/A",
    dateOfArrivalAtOrigin: formatDate(shipment.statusTime?.waitingToLoadAtOriginTime) || " ",
    depatureDateFromThePointOfOrigin: formatDate(shipment.statusTime?.departedTime) || " ",
    dateOfArrivalAtDestination: formatDate(shipment.statusTime?.arrivedAtDestinationTime) || " ",
    timeOfArrivalAtDestination: formatTime(shipment.statusTime?.arrivedAtDestinationTime) || " ",
    depatureDateFromThePointOfDestination: formatDate(shipment.statusTime?.enRouteToOriginTime) || " ",
    dateOfReturnAtOrigin: formatDate(shipment.statusTime?.arrivedAtOriginTime) || " ",
    issueVoucher: shipment.shipperIssueVoucher || " ",
    TATBrewery: "",
    TATTruck: "",
    TATAgent: "",
    freightOrder: shipment?.freightOrder || " ",
    commodity: Array.isArray(shipment.commodity)
      ? shipment.commodity.map((c) => c.name).join(", ") || "N/A"
      : shipment.commodity?.name || "N/A",
    estimatedTimeOfArrival: shipment.dispatchDate
      ? formatDate(new Date(new Date(shipment.dispatchDate).setDate(new Date(shipment.dispatchDate).getDate() + (shipment.waypoint?.TAT || 0))))
      : " ",
    remark: [
      "waiting_to_load_at_destination",
      "waiting_to_offload_at_destination",
      "loading_started_at_destination",
      "loaded_at_destination",
      "offloading_started_at_destination",
      "arrived_at_destination",
    ].includes(shipment.status)
      ? "arrived_at_destination"
      : [
          "waiting_to_offload_at_origin",
          "offloading_started_at_origin",
        ].includes(shipment.status)
      ? "arrived_at_origin"
      : shipment.status || " ",
  }));

  const headers = [
    "Date of Request",
    "Transporter Name",
    "Type of Collection",
    "Agent Name",
    "Origin",
    "Destination",
    "Plate Number",
    "Driver Name",
    "Phone Number",
    "Date of Arrival at Origin",
    "Departure Date from the Point of Origin",
    "Date of Arrival at Destination",
    "Time of Arrival at Destination",
    "Departure Date from the Point of Destination",
    "Date of Return at Origin",
    "Issue Voucher",
    "TAT (Brewery)",
    "TAT (Truck)",
    "TAT (Agent)",
    "Freight Order",
    "Commodity",
    "Estimated Time of Arrival",
    "Remark",
  ];

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: "A1" });

  worksheet["!cols"] = headers.map((header) => ({
    wch: Math.max(header.length, 20),
  }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Shipments");

  XLSX.writeFile(workbook, `Shipments_${currentDate}.xlsx`);
}

export function exportToExcelAll(shipments: any[]) {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedData = shipments.map((shipment) => ({
    dateOfRequest: formatDate(shipment.dispatchDate),
    origin: shipment.route?.origin || "N/A",
    destination: shipment.route?.destination || "N/A",
    plateNumber: shipment.vehicle?.plateNumber
      ? `${shipment.vehicle?.plateNumber}/${shipment.vehicle?.trailerPlate || "N/A"}`
      : "N/A",
    driverName: `${shipment?.driver?.firstName || ""} ${shipment?.driver?.middleName || ""} ${shipment?.driver?.lastName || ""}`.trim(),
    customerIssueVoucher: shipment?.shipperIssueVoucher || " ",
    AgentReceive: shipment?.agentReceiveVoucher || " ",
    agentIssueVoucher: shipment?.agentIssueVoucher || " ",
    customerReceiveVoucher: shipment?.shipperReceiveVoucher || " ",
    transporter: shipment.transporter?.name || " ",
    transporterPrice: shipment?.transporterPrice || " ",
    areDocumentsUploaded: shipment.areDocumentsUploaded || " ",
    productType: shipment.productType || " ",
    shipper: shipment?.shipper?.name || " ",
    status: shipment.status || " ",
    price: shipment?.pricingType?.pricePerUnit || " ",
    shipmentCode: shipment?.shipmentCode || "",
    freightOrder: shipment?.freightOrder || " ",
    totalPrice: shipment?.totalPrice || " ",
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedData);

  const headers = [
    "Date of Request",
    "Origin",
    "Destination",
    "Plate Number",
    "Driver Name",
    "Customer Issue Voucher",
    "Agent Receive Voucher",
    "Agent Issue Voucher",
    "Customer Receive Voucher",
    "Transporter",
    "Transporter Price",
    "Documents Uploaded",
    "Product Type",
    "Shipper",
    "Status",
    "Price",
    "Shipment Code",
    "Freight Order",
    "Total Price",
  ];

  XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: "A1" });

  worksheet["!cols"] = headers.map((header) => ({
    wch: Math.max(header.length, 20),
  }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Shipments");

  XLSX.writeFile(workbook, `Shipments_${currentDate}.xlsx`);
}

export function exportToExcelReport(shipments: any[]) {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).replace(/\//g, "-");

  const headers = [
    "Customer Name",
    "Order No.",
    "Document No.",
    "Origin",
    "Shipment Date",
    "Plate #",
    "Arrival at the customer",
    "Departure from Customer",
    "Arrival at site",
  ];

  const rows: any[] = [];

  shipments.forEach((shipment) => {
    const documentNumbers = String(shipment?.shipperIssueVoucher || "")
      .split("/")
      .map((doc) => doc.trim())
      .filter(Boolean);

    const orderNumbers = String(shipment?.shipperReceiveVoucher || "")
      .split("/")
      .map((doc) => doc.trim())
      .filter(Boolean);

    const normalizedDocumentNumbers = documentNumbers.length > 0 ? documentNumbers : [""];
    const normalizedOrderNumbers = orderNumbers.length > 0 ? orderNumbers : [""];

    normalizedDocumentNumbers.forEach((documentNumber) => {
      rows.push([
        shipment?.agent?.name || shipment?.order?.agent?.name || "",
        normalizedOrderNumbers[0] || "",
        documentNumber || "",
        shipment?.route?.origin || "",
        shiftDateByMinusThreeHours(shipment?.statusTime?.departedTime || shipment?.dispatchDate),
        shipment?.vehicle?.plateNumber
          ? `${shipment.vehicle.plateNumber}/${shipment.vehicle.trailerPlate || ""}`
          : "",
        shiftDateByMinusThreeHours(shipment?.statusTime?.arrivedAtDestinationTime),
        shiftDateByMinusThreeHours(shipment?.statusTime?.enRouteToOriginTime),
        shiftDateByMinusThreeHours(shipment?.statusTime?.arrivedAtOriginTime),
      ]);
    });
  });

  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows], { cellDates: true });

  const headerStyle = {
    fill: {
      patternType: "solid",
      fgColor: { rgb: "2222FF" },
    },
    font: {
      color: { rgb: "FFFFFF" },
      bold: true,
    },
    alignment: {
      horizontal: "center",
      vertical: "center",
      wrapText: true,
    },
  };

  for (let columnIndex = 0; columnIndex < headers.length; columnIndex += 1) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: columnIndex });
    if (worksheet[cellAddress]) worksheet[cellAddress].s = headerStyle;
  }

  const dateColumnIndexes = [4, 5, 7, 8, 9];
  for (let rowIndex = 1; rowIndex <= rows.length; rowIndex += 1) {
    dateColumnIndexes.forEach((columnIndex) => {
      const cellAddress = XLSX.utils.encode_cell({
        r: rowIndex,
        c: columnIndex,
      });
      const cell = worksheet[cellAddress];

      if (cell && cell.v instanceof Date) {
        cell.t = "d";
        cell.z = "mm/dd/yyyy";
      }
    });
  }

  worksheet["!cols"] = [
    { wch: 28 },
    { wch: 18 },
    { wch: 20 },
    { wch: 20 },
    { wch: 18 },
    { wch: 18 },
    { wch: 26 },
    { wch: 26 },
    { wch: 18 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

  XLSX.writeFile(workbook, `Shipment_Report_${currentDate}.xlsx`, { cellDates: true });
}
