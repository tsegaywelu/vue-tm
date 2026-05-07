import { dateFormatter, currencyFormatter } from "@/utils/utils";

export function printGoodTransfer(transfer: any, currentUser: any) {
  if (!transfer) return;

  const content = `
<!DOCTYPE html>
<html>
<head>
  <title>Goods Receiving & Issue Voucher - ${transfer.referenceNumber || "N/A"}</title>
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
      grid-template-columns: 1fr 1fr 1fr; 
      gap: 15px; 
      margin-bottom: 25px; 
      padding: 20px; 
      background-color: #f9f9fb; 
      border: 1px solid #eaebf0;
      border-radius: 12px; 
      font-size: 12px; 
    }
    .info-group h4 { margin: 0 0 10px 0; color: #2222FF; font-size: 11px; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; }
    .info-group p { margin: 4px 0; }
    .info-group strong { color: #555; margin-right: 8px; font-weight: 600; }

    .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 11px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
    .items-table th, .items-table td { border: 1px solid #dfe1e7; padding: 10px 12px; text-align: left; }
    .items-table th { background-color: #f8f9fc; color: #475467; text-transform: uppercase; font-weight: 700; font-size: 10px; letter-spacing: 0.5px; }
    
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
      .no-print { display: none; } 
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
    <h3>GOODS RECEIVING & ISSUE VOUCHER (GRIV)</h3>
    <p>PRINTED ON: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</p>
  </div>

  <div class="info-section">
    <div class="info-group">
      <h4>Voucher Details</h4>
      <p><strong>Reference No:</strong> ${transfer.referenceNumber || "N/A"}</p>
      <p><strong>Type:</strong> ${transfer.type === 'RECEIVE' ? 'Receiving' : 'Issue'}</p>
      <p><strong>Date:</strong> ${dateFormatter(transfer.createdAt)}</p>
    </div>
    <div class="info-group">
      <h4>Associated Docs</h4>
      <p><strong>SR No:</strong> ${transfer.srv?.referenceNumber || "-"}</p>
      <p><strong>PO No:</strong> ${transfer.po?.referenceNumber || "-"}</p>
      <p><strong>PR No:</strong> ${transfer.pr?.referenceNumber || "-"}</p>
    </div>
    <div class="info-group">
      <h4>Recipient / Source</h4>
      <p><strong>Issued To:</strong> ${transfer.issuedToBody || "-"}</p>
      <p><strong>Recipient:</strong> ${transfer.issuedToContact?.name || transfer.issuedToVehicle?.plateNumber || "-"}</p>
      <p><strong>Supplier:</strong> ${transfer.supplierName?.name || "-"}</p>
    </div>
  </div>

  <table class="items-table">
    <thead>
      <tr>
        <th style="width: 40px;">No</th>
        <th>Item Description</th>
        <th>Serials</th>
        <th style="text-align: right; width: 60px;">Qty</th>
        <th style="text-align: right; width: 80px;">Unit Price</th>
        <th style="text-align: right; width: 90px;">Total Price</th>
        <th>Remark</th>
      </tr>
    </thead>
    <tbody>
      ${(transfer.items || [])
        .map(
          (item: any, index: number) => `
      <tr>
        <td>${index + 1}</td>
        <td style="font-weight: 600;">${item.item?.name || "-"}</td>
        <td style="font-size: 9px; color: #666;">${(item.serials || []).join(", ") || "-"}</td>
        <td style="text-align: right;">${item.quantity || 0}</td>
        <td style="text-align: right;">${currencyFormatter(item.price || 0)}</td>
        <td style="text-align: right; font-weight: 700; color: #2222FF;">${currencyFormatter(item.totalPrice || 0)}</td>
        <td>${item.remark || "-"}</td>
      </tr>`,
        )
        .join("")}
    </tbody>
  </table>

  <div class="signature-footer">
    <div class="signature-section">
      <div class="signature-box">
        Prepared & Issued By<br/><br/><br/>
        ${transfer.preparedBy?.username || "_________________________"}
      </div>
      <div class="signature-box">
        Inspected By<br/><br/><br/>
        ${transfer.inspectedBy?.username || "_________________________"}
      </div>
      <div class="signature-box">
        Checked & Approved By<br/><br/><br/>
        ${transfer.approvedBy?.username || "_________________________"}
      </div>
      <div class="signature-box">
        Received By<br/><br/><br/>
        _________________________
      </div>
    </div>
    
    <div class="footer-meta">
      <p>System Generated Document | Total Items: ${transfer.items?.length || 0}</p>
    </div>
  </div>

  <div class="no-print" style="position: fixed; bottom: 30px; right: 30px; display: flex; gap: 12px;">
    <button onclick="window.print()" style="padding: 12px 24px; background: #2222FF; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 700; box-shadow: 0 4px 12px rgba(34, 34, 255, 0.3);">
      Print Voucher
    </button>
    <button onclick="window.close()" style="padding: 12px 24px; background: #666; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 700;">
      Close
    </button>
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
