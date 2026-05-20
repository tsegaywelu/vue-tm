import type { TableColumn } from "@/components/common/Table.vue";

export const printSummary = (
  title: string,
  columns: TableColumn[],
  rows: any[],
  carrierName: string,
  signatures?: { approvedBy?: string; authorizedBy?: string },
) => {
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Print window was blocked. Please allow popups for this site.");
    return;
  }

  const getSafe = (obj: any, path: string, defaultValue = "N/A") => {
    if (!path) return defaultValue;
    return path
      .split(".")
      .reduce((o, p) => (o && o[p] !== undefined ? o[p] : defaultValue), obj);
  };

  const formatDate = (dateString: string) => {
    try {
      return dateString ? new Date(dateString).toLocaleDateString() : "N/A";
    } catch {
      return "N/A";
    }
  };

  const totalAmount = rows.reduce((sum, item) => {
    const amount = Number(item.TOTAL || item.amount) || 0;
    return sum + amount;
  }, 0);

  const content = `
<!DOCTYPE html>
<html>
<head>
  <title>${title}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
    .company-header { display: flex; align-items: center; margin-bottom: 20px; border-bottom: 2px solid #2222FF; padding-bottom: 15px; }
    .company-names { text-align: center; flex-grow: 1; }
    .company-names h1 { margin: 0 0 5px 0; font-size: 22px; color: #2222FF; text-transform: uppercase; }
    .document-header { text-align: center; margin-bottom: 25px; }
    .document-header h3 { margin: 0 0 5px 0; font-size: 18px; border-bottom: 1px solid #ddd; display: inline-block; padding: 0 20px 5px; }
    .document-header p { margin: 10px 0 0; color: #666; font-size: 13px; font-weight: bold; }
    .summary-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 11px; }
    .summary-table th, .summary-table td { border: 1px solid #000; padding: 6px 8px; text-align: left; }
    .summary-table th { background-color: #f8f8f8; text-transform: uppercase; font-weight: bold; text-align: center; }
    .total-row { font-weight: bold; background-color: #eee; }
    .total-row td { font-size: 12px; }
    .signature-section { display: flex; justify-content: space-between; margin-top: 50px; width: 100%; gap: 15px; }
    .signature-box { width: 23%; border-top: 1px solid #000; padding-top: 8px; text-align: center; font-size: 12px; font-weight: bold; }
    .footer { text-align: right; font-size: 11px; color: #888; margin-top: 25px; border-top: 1px solid #eee; padding-top: 10px; }
    @media print {
      .signature-footer { position: fixed; bottom: 30px; width: calc(100% - 40px); }
      body { padding-bottom: 150px; }
      @page { margin: 1.5cm; }
    }
  </style>
</head>
<body>
  <div class="company-header">
    <div class="company-names">
      <h1>${carrierName || "Carrier Name"}</h1>
    </div>
  </div>

  <div class="document-header">
    <h3>${title}</h3>
    <p>PRINTED ON: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</p>
  </div>

  <table class="summary-table">
    <thead>
      <tr>
        ${columns.map((col) => `<th>${col.label}</th>`).join("")}
      </tr>
    </thead>
    <tbody>
      ${rows
        .map(
          (row) => `
        <tr>
          ${columns
            .map((col) => {
              let val = getSafe(row, (col.field || col.key) as string);
              if (col.key === "date" || col.key === "createdAt" || col.field === "date" || col.field === "createdAt") val = formatDate(val);
              if (typeof val === "number" && !isNaN(val)) val = val.toLocaleString();
              return `<td>${val}</td>`;
            })
            .join("")}
        </tr>
      `,
        )
        .join("")}
      <tr class="total-row">
        <td colspan="${columns.length - 2}" style="text-align: right;">GRAND TOTAL (ETB): </td>
        <td style="text-align: right;">${totalAmount.toLocaleString()}</td>
        <td></td>
      </tr>
    </tbody>
  </table>

  <div class="signature-footer">
    <div class="signature-section">
      <div class="signature-box">Requested By: <br/><br/> ____________________</div>
      <div class="signature-box">Approved By: <br/><br/> ${signatures?.approvedBy || "____________________"}</div>
      <div class="signature-box">Authorized By (Fin): <br/><br/> ${signatures?.authorizedBy || "____________________"}</div>
      <div class="signature-box">Received By: <br/><br/> ____________________</div>
    </div>

    <div class="footer">
      <p>Total Records: ${rows.length} | System Generated Report</p>
    </div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 500);
    };
    window.onafterprint = function() {
      setTimeout(function() {
        if (!window.closed) window.close();
      }, 1000);
    };
  <\/script>
</body>
</html>
  `;

  printWindow.document.open();
  printWindow.document.write(content);
  printWindow.document.close();
};
