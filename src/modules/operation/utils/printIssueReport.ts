import { dateFormatter } from "@/utils/utils";

export function printIssueReport(report: any, currentUser: any) {
  if (!report) return;

  const content = `
<!DOCTYPE html>
<html>
<head>
  <title>Issue Report - ${report._id?.slice(-6) || "N/A"}</title>
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

    .description-box { 
      margin-top: 20px; 
      padding: 15px; 
      background-color: #fff; 
      border: 1px solid #dfe1e7; 
      border-radius: 8px; 
      font-size: 14px; 
      min-height: 100px;
    }
    .description-box h4 { margin: 0 0 10px 0; font-size: 12px; color: #2222FF; text-transform: uppercase; border-bottom: 1px solid #eee; padding-bottom: 5px; }

    .picture-section {
      margin-top: 25px;
      text-align: center;
    }
    .picture-section img {
      max-width: 100%;
      max-height: 400px;
      border-radius: 8px;
      border: 1px solid #eaebf0;
    }

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

    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-weight: bold;
      text-transform: uppercase;
      font-size: 11px;
    }
    .status-OPEN { background: #fee2e2; color: #991b1b; }
    .status-IN_PROGRESS { background: #fef3c7; color: #92400e; }
    .status-RESOLVED { background: #dcfce7; color: #166534; }
    .status-CLOSED { background: #f3f4f6; color: #374151; }

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
    <h3>ISSUE REPORT</h3>
    <p>REPORT ID: ${report._id || "N/A"}</p>
    <p>PRINTED ON: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</p>
  </div>

  <div class="info-section">
    <div class="info-group">
      <h4>General Information</h4>
      <p><strong>Status:</strong> <span class="status-badge status-${report.status}">${report.status || "N/A"}</span></p>
      <p><strong>Severity:</strong> ${report.severity || "N/A"}</p>
      <p><strong>Type:</strong> ${report.type || "N/A"}</p>
      <p><strong>Date Reported:</strong> ${dateFormatter(report.createdAt)}</p>
    </div>
    <div class="info-group">
      <h4>Involved Parties</h4>
      <p><strong>Driver:</strong> ${report.driver?.firstName || ""} ${report.driver?.lastName || ""}</p>
      <p><strong>Driver Email:</strong> ${report.driver?.email || "-"}</p>
      <p><strong>Carrier:</strong> ${report.carrier?.name || "-"}</p>
      <p><strong>Shipment:</strong> ${report.shipment?.shipmentNumber || report.shipment?._id || "-"}</p>
    </div>
    <div class="info-group" style="grid-column: span 2;">
      <h4>Location</h4>
      <p><strong>Address:</strong> ${report.location || "Not specified"}</p>
      ${report.lat && report.long ? `<p><strong>Coordinates:</strong> ${report.lat}, ${report.long}</p>` : ""}
    </div>
  </div>

  <div class="description-box">
    <h4>Description</h4>
    <p>${report.description || "No description provided."}</p>
  </div>

  ${report.picture ? `
  <div class="picture-section">
    <h4>Attached Evidence</h4>
    <img src="${import.meta.env.VITE_API_URL}/${report.picture.replace(/\\/g, "/")}" alt="Evidence">
  </div>
  ` : ""}

  <div class="signature-footer">
    <div class="signature-section">
      <div class="signature-box">
        Reported By (Driver)<br/><br/><br/>
        _________________________
      </div>
      <div class="signature-box">
        Reviewed By (Operations)<br/><br/><br/>
        _________________________
      </div>
      <div class="signature-box">
        Action Taken By<br/><br/><br/>
        _________________________
      </div>
    </div>
    
    <div class="footer-meta">
      <p>System Generated Document | RaAz TMS</p>
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
