
export function printAdvance(
  advance: any,
  currentUser: any,
  options: { categories: string[]; types: string[] },
) {
  if (!advance) return;

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

  const getEffectiveAmount = (item: any) => {
    return Number(item?.approvedAmount ?? item?.amount ?? 0);
  };

  const getCategoryDisplayName = (category: string) => {
    const names: Record<string, string> = {
      PERDIEM: "Perdiem",
      OTHER: "Other Expenses",
      FUEL: "Fuel Advances",
    };
    return names[category] || category;
  };

  const filteredTransactions = (advance.transactions || []).filter(
    (t: any) =>
      t.status === "PAID" &&
      options.categories.includes(t.category) &&
      options.types.includes(t.type),
  );

  const categoryTotals: Record<string, number> = {};
  options.categories.forEach((category) => {
    categoryTotals[category] = filteredTransactions
      .filter((t: any) => t.category === category)
      .reduce((sum: number, t: any) => sum + getEffectiveAmount(t), 0);
  });

  const typeTotals: Record<string, number> = {};
  options.types.forEach((type) => {
    typeTotals[type] = filteredTransactions
      .filter((t: any) => t.type === type)
      .reduce((sum: number, t: any) => sum + getEffectiveAmount(t), 0);
  });

  const totalAmount = filteredTransactions.reduce(
    (sum: number, t: any) => sum + getEffectiveAmount(t),
    0,
  );

  const categoryTotalRows = options.categories
    .map(
      (category) => `
    <tr class="category-total">
      <td colspan="4" style="text-align: right;">${getCategoryDisplayName(category)} Total:</td>
      <td style="text-align: right;">${categoryTotals[category].toLocaleString()}</td>
      <td></td>
    </tr>`,
    )
    .join("");

  const typeTotalRows = options.types
    .map(
      (type) => `
    <tr class="type-total">
      <td colspan="4" style="text-align: right;">${type} Total:</td>
      <td style="text-align: right;">${typeTotals[type].toLocaleString()}</td>
      <td></td>
    </tr>`,
    )
    .join("");

  const content = `
<!DOCTYPE html>
<html>
<head>
  <title>Drivers Advance Payment Settlement</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 30px; color: #333; line-height: 1.5; }
    .company-header { display: flex; align-items: center; margin-bottom: 25px; border-bottom: 3px solid #2222FF; padding-bottom: 20px; }
    .company-names { text-align: center; flex-grow: 1; }
    .company-names h1 { margin: 0 0 5px 0; font-size: 24px; color: #2222FF; text-transform: uppercase; letter-spacing: 1px; }
    
    .document-header { text-align: center; margin-bottom: 30px; }
    .document-header h3 { margin: 0 0 8px 0; font-size: 20px; color: #444; border-bottom: 1px solid #eee; display: inline-block; padding: 0 30px 5px; }
    .document-header p { margin: 5px 0; color: #777; font-size: 13px; font-weight: bold; }

    .advance-info { 
      display: grid; 
      grid-template-columns: 1fr 1fr; 
      gap: 15px; 
      margin-bottom: 25px; 
      padding: 20px; 
      background-color: #f9f9fb; 
      border: 1px solid #eaebf0;
      border-radius: 12px; 
      font-size: 13px; 
    }
    .advance-info p { margin: 0; }
    .advance-info strong { color: #555; margin-right: 8px; }

    .summary-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 11px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
    .summary-table th, .summary-table td { border: 1px solid #dfe1e7; padding: 10px 12px; text-align: left; }
    .summary-table th { background-color: #f8f9fc; color: #475467; text-transform: uppercase; font-weight: 700; font-size: 10px; letter-spacing: 0.5px; }
    
    .category-total { font-weight: bold; background-color: #f0f0f0; color: #344054; }
    .type-total { font-weight: bold; background-color: #e8e8e8; color: #344054; }
    .grand-total { font-weight: 800; background-color: #eff8ff; color: #175cd3; font-size: 13px; }
    
    .signature-footer { margin-top: 60px; }
    .signature-section { display: flex; justify-content: space-between; gap: 20px; margin-bottom: 40px; }
    .signature-box { 
      flex: 1; 
      border-top: 1px solid #333; 
      padding-top: 10px; 
      text-align: center; 
      font-size: 12px; 
      font-weight: 600; 
      color: #344054;
    }
    
    .footer-meta { text-align: right; font-size: 10px; color: #98a2b3; border-top: 1px solid #f2f4f7; padding-top: 10px; }

    thead { display: table-header-group; }
    tr { page-break-inside: avoid; break-inside: avoid; }
    @media print {
      body { padding: 0; }
      .signature-footer { page-break-inside: avoid; break-inside: avoid; margin-top: 40px; }
      @page { margin: 1.5cm; }
    }
  </style>
</head>
<body>
  <div class="company-header">
    <div class="company-names">
      <h1>${currentUser?.carrier?.name || currentUser?.user?.carrier?.name || "RaAz Transport"}</h1>
    </div>
  </div>

  <div class="document-header">
    <h3>Drivers Settlement Report</h3>
    <p>PRINTED ON: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</p>
  </div>

  <div class="advance-info">
    <div><p><strong>Advance Number:</strong> ${advance.advanceNumber || "N/A"}</p></div>
    <div><p><strong>Driver:</strong> ${formatDriverName(advance.driver)}</p></div>
    <div><p><strong>Shipment Code:</strong> ${getSafe(advance, "shipment.shipmentCode") || advance.shipmentCode || "N/A"}</p></div>
    <div><p><strong>Route:</strong> ${getSafe(advance, "shipment.route.routeName") || advance.shipment?.routeName || "N/A"}</p></div>
    <div><p><strong>Vehicle:</strong> ${getSafe(advance, "shipment.vehicle.plateNumber") || advance.vehiclePlateNumber || "N/A"}</p></div>
    <div><p><strong>Status:</strong> ${advance.status || "N/A"}</p></div>
  </div>

  <table class="summary-table">
    <thead>
      <tr>
        <th>Date</th>
        <th>Type</th>
        <th>Category</th>
        <th>Description / Notes</th>
        <th style="text-align: right;">Amount (ETB)</th>
        <th style="text-align: center;">Status</th>
      </tr>
    </thead>
    <tbody>
      ${filteredTransactions
        .map(
          (t: any) => `
      <tr>
        <td>${formatDate(t.createdAt)}</td>
        <td style="font-weight: 600;">${t.type || "N/A"}</td>
        <td>${t.category || "N/A"}</td>
        <td>
          <div style="font-weight: 500;">${t.notes || "-"}</div>
          ${t.liters ? `<div style="font-size: 10px; color: #666; margin-top: 2px;">Volume: ${t.liters} Liters</div>` : ""}
        </td>
        <td style="text-align: right; font-weight: 600;">${getEffectiveAmount(t).toLocaleString()}</td>
        <td style="text-align: center;">
          <span style="padding: 2px 8px; border-radius: 4px; background: #ecfdf3; color: #027a48; font-size: 9px; font-weight: 700;">${t.status || "N/A"}</span>
        </td>
      </tr>`,
        )
        .join("")}
      
      ${categoryTotalRows}
      ${typeTotalRows}

      <tr class="grand-total">
        <td colspan="4" style="text-align: right; text-transform: uppercase;">Total Settlement Amount:</td>
        <td style="text-align: right;">${totalAmount.toLocaleString()}</td>
        <td></td>
      </tr>
    </tbody>
  </table>

  <div class="signature-footer">
    <div class="signature-section">
      <div class="signature-box">
        Requested By<br/><br/><br/>
        _________________________
      </div>
      <div class="signature-box">
        Approved By<br/><br/><br/>
        ${advance.approvedBy?.username || "_________________________"}
      </div>
      <div class="signature-box">
        Authorized By (Fin)<br/><br/><br/>
        ${advance.authorizedBy?.username || "_________________________"}
      </div>
      <div class="signature-box">
        Received By<br/><br/><br/>
        _________________________
      </div>
    </div>
    
    <div class="footer-meta">
      <p>System Generated Document | Total Records: ${filteredTransactions.length}</p>
    </div>
  </div>



  <script>
    window.onload = function() {
      setTimeout(function() { window.print(); }, 500);
    };
  <\/script>
</body>
</html>`;

  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(content);
    printWindow.document.close();
  }
}
