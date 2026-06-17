import { currencyFormatter, dateFormatter } from "@/utils/utils";

export function printPayables(
  payables: any[],
  currentUser: any,
  options?: { groupByType?: boolean }
) {
  if (!payables || payables.length === 0) return;

  const getSafe = (obj: any, path: string, defaultValue = "N/A") => {
    return path
      .split(".")
      .reduce((o, p) => (o && o[p] !== undefined ? o[p] : defaultValue), obj);
  };

  const formatDriverName = (driver: any) => {
    if (!driver) return "N/A";
    return (
      [driver.firstName, driver.middleName, driver.lastName]
        .filter(Boolean)
        .join(" ") || "N/A"
    );
  };

  const formatDate = (dateString: string) => {
    return dateString ? new Date(dateString).toLocaleDateString() : "N/A";
  };

  const getPaidTo = (row: any): string => {
    if (row.driver) {
      return formatDriverName(row.driver);
    } else if (row.transporter?.name) {
      return row.transporter.name;
    } else if (row.supplier?.name) {
      return row.supplier.name;
    }
    return "N/A";
  };

  const formatType = (type: string): string => {
    const typeMap: Record<string, string> = {
      advancePayment: "Driver Advance",
      advance: "Driver Advance",
      transactions: "Driver Advance",
      transaction: "Driver Advance",
      vehicleLeaseAgreement: "Vehicle Lease",
      vehicleLeaseAgreements: "Vehicle Lease",
      prePayment: "Pre-Payment",
      prePayments: "Pre-Payment",
      shipment: "Shipment",
      shipments: "Shipment",
      purchaseOrder: "Purchase Order",
      purchaseOrders: "Purchase Order",
    };
    return typeMap[type] || type;
  };

  const normalizeType = (type: string): string => {
    const normalizedMap: Record<string, string> = {
      advancePayment: "advancePayment",
      advance: "advancePayment",
      transactions: "advancePayment",
      transaction: "advancePayment",
      vehicleLeaseAgreement: "vehicleLeaseAgreement",
      vehicleLeaseAgreements: "vehicleLeaseAgreement",
      prePayment: "prePayment",
      prePayments: "prePayment",
      shipment: "shipment",
      shipments: "shipment",
      purchaseOrder: "purchaseOrder",
      purchaseOrders: "purchaseOrder",
    };
    return normalizedMap[type] || type;
  };

  const getDocumentTitle = (): string => {
    if (payables.length === 0) return "Payables Report";

    const uniqueTypes = new Set(payables.map(p => normalizeType(p.payableType)));
    if (uniqueTypes.size === 1) {
      const type = uniqueTypes.values().next().value;
      const titleMap: Record<string, string> = {
        advancePayment: "Driver Advance Settlement Report",
        vehicleLeaseAgreement: "Vehicle Lease Payment Report",
        prePayment: "Pre-Payment Report",
        shipment: "Shipment Payment Report",
        purchaseOrder: "Purchase Order Payment Report",
      };
      return titleMap[type] || "Payables Report";
    }
    return "Payables Report";
  };

  const getGroupDescription = (type: string): string => {
    const descMap: Record<string, string> = {
      advancePayment: "Driver advance settlements for requested fuel, perdiem, and other expenses",
      vehicleLeaseAgreement: "Vehicle lease agreement payments",
      prePayment: "Pre-payment transactions for vendors and suppliers",
      shipment: "Shipment delivery payments to transporters",
      purchaseOrder: "Purchase order payments for inventory items",
    };
    const normalizedType = normalizeType(type);
    return descMap[normalizedType] || "";
  };

  let groupedPayables: Record<string, any[]> = {};
  if (options?.groupByType) {
    payables.forEach((p) => {
      const type = formatType(p.payableType);
      if (!groupedPayables[type]) {
        groupedPayables[type] = [];
      }
      groupedPayables[type].push(p);
    });
  } else {
    groupedPayables["All Payables"] = payables;
  }

  const calculateTotals = (items: any[]) => {
    return {
      fuel: items.reduce((sum, p) => sum + (p.totalFuelAdvances || 0), 0),
      perDiem: items.reduce((sum, p) => sum + (p.totalPerDiemExpenses || 0), 0),
      other: items.reduce((sum, p) => sum + (p.totalOtherExpenses || 0), 0),
      transporter: items.reduce((sum, p) => sum + (p.transporterPrice || 0), 0),
      total: items.reduce((sum, p) => sum + (p.total || 0), 0),
    };
  };

  const generateGroupHTML = (groupName: string, items: any[]) => {
    const totals = calculateTotals(items);
    const description = getGroupDescription(items[0]?.payableType || "");
    const normalizedType = normalizeType(items[0]?.payableType || "");

    return `
      <div>
        <h3 class="group-header">${groupName}</h3>
        ${description ? `<p style="font-size: 9px; color: #666; margin: 0 0 3px 0; font-style: italic;">${description}</p>` : ""}
        <table class="summary-table">
          <thead>
            <tr style="background-color: #f8f9fc;">
              <th>Code</th>
              <th>Date</th>
              <th>Paid To</th>
              <th>Route</th>
              <th style="text-align: right;">Fuel</th>
              <th style="text-align: right;">Perdiem</th>
              <th style="text-align: right;">Other</th>
              <th style="text-align: right;">Total (ETB)</th>
              <th style="text-align: center;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${items
              .map(
                (p) => `
              <tr>
                <td>${p.advanceNumber || p.shipmentCode || "-"}</td>
                <td>${formatDate(p.createdAt)}</td>
                <td>${getPaidTo(p)}</td>
                <td>${p.route?.name || "-"}</td>
                <td style="text-align: right;">${currencyFormatter(p.totalFuelAdvances || 0)}</td>
                <td style="text-align: right;">${currencyFormatter(p.totalPerDiemExpenses || 0)}</td>
                <td style="text-align: right;">${currencyFormatter(p.totalOtherExpenses || 0)}</td>
                <td style="text-align: right; font-weight: 600;">${currencyFormatter(p.total || 0)}</td>
                <td style="text-align: center;">
                  <span style="padding: 1px 4px; border-radius: 2px; background: #ecfdf3; color: #027a48; font-size: 8px; font-weight: 700;">${(p.status || p.payableStatus || "N/A").replace(/_/g, " ")}</span>
                </td>
              </tr>
            `,
              )
              .join("")}
            <tr style="background-color: #eff8ff; font-weight: 800; color: #175cd3;">
              <td colspan="4" style="text-align: right;">Subtotal:</td>
              <td style="text-align: right;">${currencyFormatter(totals.fuel)}</td>
              <td style="text-align: right;">${currencyFormatter(totals.perDiem)}</td>
              <td style="text-align: right;">${currencyFormatter(totals.other)}</td>
              <td style="text-align: right;">${currencyFormatter(totals.total)}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  };

  const grandTotals = calculateTotals(payables);

  const content = `
<!DOCTYPE html>
<html>
<head>
  <title>Payables Report</title>
  <style>
    * {
      box-sizing: border-box;
    }

    @page {
      margin: 0.3cm 0.5cm;
      size: A4;
    }

    @media print {
      html, body {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        border: 0;
      }
      body {
        margin: 0.3cm 0.5cm;
      }
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 0;
      color: #333;
      line-height: 1.4;
    }

    .page-break-container {
      page-break-after: always;
      page-break-inside: avoid;
      margin: 0;
      padding: 0;
    }

    .company-header {
      display: flex;
      align-items: center;
      margin-bottom: 3px;
      border-bottom: 2px solid #2222FF;
      padding-bottom: 3px;
    }
    .company-names {
      text-align: center;
      flex-grow: 1;
    }
    .company-names h1 {
      margin: 0;
      font-size: 18px;
      color: #2222FF;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .document-header {
      text-align: center;
      margin-bottom: 4px;
    }
    .document-header h3 {
      margin: 0 0 2px 0;
      font-size: 14px;
      color: #444;
      border-bottom: 1px solid #eee;
      display: inline-block;
      padding: 0 15px 2px;
    }
    .document-header p {
      margin: 2px 0;
      color: #777;
      font-size: 10px;
      font-weight: bold;
    }

    .summary-info {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 4px;
      margin-bottom: 4px;
      padding: 4px 6px;
      background-color: #f9f9fb;
      border: 1px solid #eaebf0;
      border-radius: 3px;
      font-size: 10px;
    }
    .summary-info p {
      margin: 0;
    }
    .summary-info strong {
      color: #555;
      margin-right: 3px;
    }

    .group-header {
      color: #175cd3;
      margin: 0 0 4px 0;
      border-bottom: 1.5px solid #e0e7ff;
      padding-bottom: 2px;
      page-break-after: avoid;
      font-weight: 600;
      font-size: 11px;
    }

    .summary-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 8px;
      font-size: 9px;
    }
    .summary-table th, .summary-table td {
      border: 0.5px solid #dfe1e7;
      padding: 3px 4px;
      text-align: left;
    }
    .summary-table th {
      background-color: #f8f9fc;
      color: #475467;
      text-transform: uppercase;
      font-weight: 700;
      font-size: 8px;
      letter-spacing: 0.5px;
      page-break-after: avoid;
    }
    .summary-table tr {
      page-break-inside: avoid;
    }

    .footer-meta {
      text-align: right;
      font-size: 9px;
      color: #98a2b3;
      border-top: 1px solid #f2f4f7;
      padding-top: 3px;
      margin-top: 6px;
    }

    thead { display: table-header-group; }
  </style>
</head>
<body>
  <div class="company-header">
    <div class="company-names">
      <h1>${currentUser?.carrier?.name || currentUser?.user?.carrier?.name || "RaAz Transport"}</h1>
    </div>
  </div>

  <div class="document-header">
    <h3>${getDocumentTitle()}</h3>
    <p>PRINTED ON: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</p>
  </div>

  <div class="summary-info">
    <div><p><strong>Total Records:</strong> ${payables.length}</p></div>
    <div><p><strong>Total Amount:</strong> ${currencyFormatter(grandTotals.total)}</p></div>
  </div>

  ${Object.entries(groupedPayables)
    .map(([groupName, items]) => generateGroupHTML(groupName, items as any[]))
    .join("")}

  <div class="footer-meta">
    <p>System Generated Document | Report Generated: ${new Date().toISOString()}</p>
  </div>

  <script>
    if (window.print) {
      setTimeout(window.print, 200);
    }
  </script>
</body>
</html>`;

  try {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      console.error("Print window could not be opened. Check if popups are blocked.");
      alert("Please allow popups for this website to print documents.");
      return;
    }

    printWindow.document.open();
    printWindow.document.write(content);
    printWindow.document.close();

    // Ensure print dialog opens after a short delay
    printWindow.focus();
  } catch (error) {
    console.error("Error opening print window:", error);
    alert("Error opening print dialog: " + (error instanceof Error ? error.message : String(error)));
  }
}
