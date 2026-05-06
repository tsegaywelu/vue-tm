import * as XLSX from "xlsx-js-style";
import { currencyFormatter, numberFormatter, dateFormatter } from "@/utils/utils";

export function exportVehicleMetrics(data: any[]) {
  const headers = [
    "Plate Number", "Total Revenue", "Ownership", "Vehicle Use", "Fuel Cost",
    "Fuel Used (L)", "Last Fuel Reading", "Dist (Route)", "Dist (Covered)",
    "FC (Route)", "FC (Covered)", "Tyre Cost", "Maint. Cost", "Lease Cost",
    "Per Diem", "Other Adv.", "Total Cost", "Trips", "Available Days", "Garage Days"
  ];

  const formattedData = data.map(item => [
    item.plateNumber, item.totalRevenue, item.ownership, item.productType, item.totalFuelCost,
    item.totalFuelLiters, item.lastFuelReading, item.totalDistanceRoute, item.totalDistanceCovered,
    item.fuelConsumptionRoute, item.fuelConsumptionCovered, item.tyreCost, item.maintenanceCost, item.leaseCost,
    item.perDiemCost, item.otherAdvances, item.totalCost, item.completedTrips, item.availableDays, item.garageDays
  ]);

  generateExcel(headers, formattedData, "Vehicle Metrics");
}

export function exportFinancialKpis(data: any[]) {
  const headers = [
    "Plate Number", "Use", "Revenue", "Lease Rev.", "Fuel Cost", "Maint. Cost",
    "Tyre Cost", "In-Lease", "Per Diem", "Other", "Total Cost", "Total Km",
    "Trips", "Cost/Km", "Op. Margin (%)", "Net Profit (%)", "Fuel (%)", "Driver/Km"
  ];

  const formattedData = data.map(item => [
    item.plateNumber, item.vehicleUseType, item.totalRevenue, item.outwardLeaseRevenue, item.totalFuelCost, item.maintenanceCost,
    item.tyreCost, item.totalInwardLeaseCost, item.perDiemCost, item.otherAdvances, item.totalCost, item.totalDistanceCovered,
    item.completedTrips, item.costPerKm, item.operatingMargin, item.netProfitPercentage, item.fuelCostPercentage, item.driverCostPerKm
  ]);

  generateExcel(headers, formattedData, "Financial KPIs");
}

export function exportProductivityKpis(data: any[]) {
  const headers = [
    "Plate Number", "Driver", "Ownership", "Vehicle Use", "Utilization (%)",
    "ERR (%)", "TAT (Days)", "Load Factor (%)", "Km / Day", "Idle Days", "Total Km", "Trips"
  ];

  const formattedData = data.map(item => [
    item.plateNumber, item.driver, item.ownership, item.productType, item.utilization,
    item.err, item.tat, item.loadFactor, item.kmPerDay, item.idleDays, item.totalDistanceCovered, item.completedTrips
  ]);

  generateExcel(headers, formattedData, "Productivity KPIs");
}

export function exportGoalAchievement(data: any[]) {
  const headers = [
    "Plate", "Region", "Ownership", "Vehicle Use", "Revenue",
    "Km Goal", "Km Actual", "Km %", "Ship Goal", "Ship Actual", "Ship %",
    "Fuel Goal", "Fuel Actual", "Fuel %"
  ];

  const formattedData = data.map(item => [
    item.plateNumber, item.region, item.ownership, item.productType, item.totalRevenue,
    item.kmGoal, item.kmActual, item.kmPercentage, item.shipmentGoal, item.shipmentActual, item.shipmentPercentage,
    item.fuelEfficiencyGoal, item.fuelEfficiencyActual, item.fuelEfficiencyPercentage
  ]);

  generateExcel(headers, formattedData, "Goal Achievement");
}

function generateExcel(headers: string[], data: any[][], fileName: string) {
  const headerStyle = {
    fill: { fgColor: { rgb: "3B82F6" } },
    font: { bold: true, color: { rgb: "FFFFFF" } },
    alignment: { horizontal: "center" },
    border: {
      top: { style: "thin" },
      bottom: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" }
    }
  };

  const wsData = [headers, ...data];
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Apply header styles
  headers.forEach((_, i) => {
    const cellRef = XLSX.utils.encode_cell({ r: 0, c: i });
    if (ws[cellRef]) ws[cellRef].s = headerStyle;
  });

  ws["!cols"] = headers.map(() => ({ wch: 18 }));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, fileName);
  
  const timestamp = new Date().toISOString().split('T')[0];
  XLSX.writeFile(wb, `${fileName.replace(/\s+/g, '_')}_${timestamp}.xlsx`);
}
