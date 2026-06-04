import { dateFormatter, currencyFormatter } from "@/utils/utils";

export function printPurchaseOrder(order: any, currentUser: any) {
  if (!order) return;

  const content = `
<!DOCTYPE html>
<html>
<head>
  <title>Purchase Order - ${order.referenceNumber || "N/A"}</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 30px; color: #333; line-height: 1.5; }
    .company-header { display: flex; align-items: center; margin-bottom: 25px; border-bottom: 3px solid #2222FF; padding-bottom: 20px; }
    .company-names { text-align: center; flex-grow: 1; }
    .company-names h1 { margin: 0 0 5px 0; font-size: 24px; color: #2222FF; text-transform: uppercase; letter-spacing: 1px; }
    
    .document-header { text-align: center; margin-bottom: 30px; }
    .document-header h3 { margin: 0 0 8px 0; font-size: 20px; color: #444; border-bottom: 1px solid #eee; display: inline-block; padding: 0 30px 5px; }
    .document-header p { margin: 5px 0; color: #777; font-size: 13px; font-weight: bold; }

    .info-section { 
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
    .info-group h4 { margin: 0 0 10px 0; color: #2222FF; font-size: 12px; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; }
    .info-group p { margin: 4px 0; }
    .info-group strong { color: #555; margin-right: 8px; font-weight: 600; }

    .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 11px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
    .items-table th, .items-table td { border: 1px solid #dfe1e7; padding: 10px 12px; text-align: left; }
    .items-table th { background-color: #f8f9fc; color: #475467; text-transform: uppercase; font-weight: 700; font-size: 10px; letter-spacing: 0.5px; }
    
    .summary-section { display: flex; justify-content: flex-end; margin-bottom: 40px; }
    .summary-table { width: 250px; font-size: 13px; }
    .summary-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f2f4f7; }
    .summary-row.total { border-bottom: none; font-weight: 800; font-size: 16px; color: #2222FF; padding-top: 15px; }

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

    @media print {
      body { padding: 0; }
      .signature-footer { position: fixed; bottom: 40px; width: calc(100% - 60px); }
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
    <h3>PURCHASE ORDER (PO)</h3>
    <p>PRINTED ON: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</p>
  </div>

  <div class="info-section">
    <div class="info-group">
      <h4>General Information</h4>
      <p><strong>PO Reference:</strong> ${order.referenceNumber || "N/A"}</p>
      <p><strong>Date:</strong> ${dateFormatter(order.date)}</p>
      <p><strong>PR Reference:</strong> ${order.pr?.referenceNumber || "N/A"}</p>
    </div>
    <div class="info-group">
      <h4>Supplier Information</h4>
      <p><strong>Supplier:</strong> ${order.to?.name || "N/A"}</p>
      <p><strong>Contact:</strong> ${order.to?.contactPerson || "-"}</p>
      <p><strong>Phone:</strong> ${order.to?.phone || "-"}</p>
    </div>
  </div>

  <table class="items-table">
    <thead>
      <tr>
        <th style="width: 40px;">No</th>
        <th>Item Description</th>
        <th style="width: 60px;">U/M</th>
        <th style="text-align: right; width: 60px;">Qty</th>
        <th style="text-align: right; width: 100px;">Unit Price</th>
        <th style="text-align: right; width: 100px;">Total Price</th>
        <th style="text-align: right; width: 100px;">Remark</th>
      </tr>
    </thead>
    <tbody>
      ${(order.items || [])
        .map(
          (item: any, index: number) => `
      <tr>
        <td>${index + 1}</td>
        <td style="font-weight: 600;">${item.item?.name || "-"}</td>
        <td>${item.item?.uom || "-"}</td>
        <td style="text-align: right;">${item.quantity || 0}</td>
        <td style="text-align: right;">${currencyFormatter(item.price || 0)}</td>
        <td style="text-align: right; font-weight: 700;">${currencyFormatter(item.totalPrice || 0)}</td>
        <td style="text-align: right;">${item.remark || "-"}</td>
      </tr>`,
        )
        .join("")}
    </tbody>
  </table>

  <div class="summary-section">
    <div class="summary-table">
      <div class="summary-row">
        <span>Subtotal:</span>
        <span>${currencyFormatter(order.total || 0)}</span>
      </div>
      <div class="summary-row">
        <span>VAT (${order.vatRate || 0}%):</span>
        <span>${currencyFormatter(order.vat || 0)}</span>
      </div>
      <div class="summary-row total">
        <span>Grand Total:</span>
        <span>${currencyFormatter(order.grandTotal || 0)}</span>
      </div>
    </div>
  </div>

  <div class="signature-footer">
    <div class="signature-section">
      <div class="signature-box">
        Purchasing Officer<br/><br/><br/>
        _________________________
      </div>
      <div class="signature-box">
        Finance Manager<br/><br/><br/>
        _________________________
      </div>
      <div class="signature-box">
        General Manager<br/><br/><br/>
        _________________________
      </div>
    </div>
    
    <div class="footer-meta">
      <p>System Generated Document | Total Items: ${order.items?.length || 0}</p>
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
