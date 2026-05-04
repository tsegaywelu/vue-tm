import { currencyFormatter } from "@/utils/utils";

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
      <td colspan="3"></td>
      <td>${getCategoryDisplayName(category)} Total:</td>
      <td>${categoryTotals[category].toLocaleString()}</td>
      <td></td>
    </tr>`,
    )
    .join("");

  const typeTotalRows = options.types
    .map(
      (type) => `
    <tr class="type-total">
      <td colspan="3"></td>
      <td>${type} Total:</td>
      <td>${typeTotals[type].toLocaleString()}</td>
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
    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
    .company-names { text-align: center; margin-bottom: 20px; }
    .company-names h1 { margin: 0; font-size: 20px; color: #2222FF; }
    .document-header { text-align: center; margin-bottom: 20px; }
    .document-header h3 { margin: 0; font-size: 18px; }
    .document-header p { margin: 5px 0; color: #555; font-size: 14px; }
    .advance-info { margin-bottom: 15px; padding: 15px; background-color: #f5f5f5; border-radius: 8px; font-size: 14px; }
    .advance-info p { margin: 5px 0; }
    .summary-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px; }
    .summary-table th, .summary-table td { border: 1px solid #000; padding: 8px; text-align: left; }
    .summary-table th { background-color: #f2f2f2; }
    .category-total { font-weight: bold; background-color: #f0f0f0; }
    .type-total { font-weight: bold; background-color: #e8e8e8; }
    .grand-total { font-weight: bold; background-color: #e0e0e0; }
    .signature-section { display: flex; justify-content: center; margin-top: 50px; }
    .signature-box { width: 200px; border-top: 1px solid #000; padding-top: 5px; text-align: center; }
    @media print { .no-print { display: none; } }
  </style>
</head>
<body>
  <div class="company-names">
    <h1>${currentUser?.carrier?.name || "Carrier Name"}</h1>
  </div>

  <div class="document-header">
    <h3>Drivers Settlement</h3>
    <p>Printed on ${new Date().toLocaleDateString()}</p>
  </div>

  <div class="advance-info">
    <p><strong>Advance Number:</strong> ${advance.advanceNumber || "N/A"}</p>
    <p><strong>Driver:</strong> ${formatDriverName(advance.driver)}</p>
    <p><strong>Shipment Code:</strong> ${getSafe(advance, "shipment.shipmentCode")}</p>
    <p><strong>Route:</strong> ${getSafe(advance, "shipment.route.routeName")}</p>
    <p><strong>Vehicle:</strong> ${getSafe(advance, "shipment.vehicle.plateNumber")}</p>
  </div>

  <table class="summary-table">
    <thead>
      <tr>
        <th>Date</th>
        <th>Type</th>
        <th>Category</th>
        <th>Description</th>
        <th>Amount</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      ${filteredTransactions
        .map(
          (t: any) => `
      <tr>
        <td>${formatDate(t.createdAt)}</td>
        <td>${t.type || "N/A"}</td>
        <td>${t.category || "N/A"}</td>
        <td>${t.notes || "-"} ${t.liters ? `(${t.liters} liters)` : ""}</td>
        <td>${getEffectiveAmount(t).toLocaleString()}</td>
        <td>${t.status || "N/A"}</td>
      </tr>`,
        )
        .join("")}
      ${categoryTotalRows}
      ${typeTotalRows}
      <tr class="grand-total">
        <td colspan="3"></td>
        <td>Total Advance Amount:</td>
        <td>${totalAmount.toLocaleString()}</td>
        <td></td>
      </tr>
    </tbody>
  </table>

  <div class="signature-section">
    <div class="signature-box">
      Authorized By: ${advance.authorizedBy?.username || ""}
    </div>
  </div>

  <button class="no-print" onclick="window.print()" style="padding: 10px 20px; background: #2222FF; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 20px;">
    Print Transactions
  </button>
</body>
</html>`;

  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(content);
    printWindow.document.close();
  }
}
