import { dateFormatter } from "@/utils/utils";

export function printPurchaseRequisition(requisition: any, currentUser: any) {
  if (!requisition) return;

  const content = `
<!DOCTYPE html>
<html>
<head>
  <title>Purchase Requisition - ${requisition.referenceNumber || "N/A"}</title>
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
    <h3>PURCHASE REQUISITION (PR)</h3>
    <p>PRINTED ON: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</p>
  </div>

  <div class="info-section">
    <div class="info-group">
      <h4>General Information</h4>
      <p><strong>Reference No:</strong> ${requisition.referenceNumber || "N/A"}</p>
      <p><strong>Date:</strong> ${dateFormatter(requisition.date)}</p>
      <p><strong>Status:</strong> ${requisition.status || "N/A"}</p>
      <p><strong>Prepared By:</strong> ${requisition.preparedBy?.username || "N/A"}</p>
    </div>
    <div class="info-group">
      <h4>Approval Information</h4>
      <p><strong>SRV Reference:</strong> ${requisition.srv?.referenceNumber || "N/A"}</p>
      <p><strong>Approved STR Date:</strong> ${dateFormatter(requisition.approvedSTRDate)}</p>
      <p><strong>Approved By:</strong> ${requisition.approvedBy?.username || "N/A"}</p>
      <p><strong>Approved Date:</strong> ${requisition.approvedAt ? dateFormatter(requisition.approvedAt) : "N/A"}</p>
      <p><strong>Authorized By:</strong> ${requisition.authorizedBy?.username || "N/A"}</p>
      <p><strong>Authorized Date:</strong> ${requisition.authorizedAt ? dateFormatter(requisition.authorizedAt) : "N/A"}</p>
    </div>
  </div>

  <table class="items-table">
    <thead>
      <tr>
        <th style="width: 40px;">No</th>
        <th>Item Description</th>
        <th style="width: 60px;">U/M</th>
        <th style="text-align: right; width: 60px;">Qty</th>
        <th style="width: 80px;">SRV No</th>
        <th style="width: 100px;">Lead Time</th>
        <th>Remark</th>
      </tr>
    </thead>
    <tbody>
      ${(requisition.items || [])
        .map(
          (item: any, index: number) => `
      <tr>
        <td>${index + 1}</td>
        <td style="font-weight: 600;">${item.item?.name || "-"}</td>
        <td>${item.item?.uom || "-"}</td>
        <td style="text-align: right; font-weight: 700; color: #2222FF;">${item.quantity || 0}</td>
        <td>${requisition.srv?.referenceNumber || "-"}</td>
        <td>${item.leadTime || "-"}</td>
        <td>${item.remark || "-"}</td>
      </tr>`,
        )
        .join("")}
      ${
        !requisition.items?.length
          ? '<tr><td colspan="6" style="text-align: center; padding: 20px; color: #666; font-style: italic;">No items found</td></tr>'
          : ""
      }
    </tbody>
  </table>

  <div class="signature-footer">
    <div class="signature-section">
      <div class="signature-box">
        Requested By<br/>
        <span style="font-size:11px; color:#444;">${requisition.preparedBy?.username || ""}</span><br/><br/>
        _________________________
      </div>
      <div class="signature-box">
        Store Keeper<br/><br/><br/>
        _________________________
      </div>
      <div class="signature-box">
        Authorized By<br/>
        <span style="font-size:11px; color:#444;">${requisition.authorizedBy?.username || ""}</span><br/><br/>
        _________________________
      </div>
      <div class="signature-box">
        Approved By<br/>
        <span style="font-size:11px; color:#444;">${requisition.approvedBy?.username || ""}</span><br/><br/>
        _________________________
      </div>
    </div>
    
    <div class="footer-meta">
      <p>System Generated Document | Total Items: ${requisition.items?.length || 0}</p>
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
