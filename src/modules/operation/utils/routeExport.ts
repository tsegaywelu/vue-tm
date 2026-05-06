import * as XLSX from "xlsx-js-style";

export function exportRoutesToExcel(routes: any[]) {
  try {
    // Prepare data (Matching legacy routes.vue logic)
    const excelData = routes.map((route) => ({
      Origin: route.origin,
      Destination: route.destination,
      Distance: route.waypoints?.[0]?.distance || "N/A",
    }));

    // Create workbook
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Set column widths (in characters)
    const colWidths = [
      { wch: 25 }, // Origin
      { wch: 25 }, // Destination
      { wch: 20 }, // Distance
    ];
    worksheet["!cols"] = colWidths;

    // Style headers with green background and bold text
    const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1:A1");

    for (let C = range.s.c; C <= range.e.c; ++C) {
      const headerCell = XLSX.utils.encode_cell({ r: range.s.r, c: C });

      // If cell doesn't exist, create it
      if (!worksheet[headerCell]) {
        worksheet[headerCell] = { t: "s", v: "" };
      }

      // Apply style
      worksheet[headerCell].s = {
        fill: { fgColor: { rgb: "00FF00" } }, // Green background
        font: { bold: true }, // Bold text
        alignment: { horizontal: "center" }, // Center aligned
      };
    }

    XLSX.utils.book_append_sheet(workbook, worksheet, "Routes");
    XLSX.writeFile(workbook, "Routes_Export.xlsx");
  } catch (error) {
    console.error("Export error:", error);
    alert("Failed to export: " + (error instanceof Error ? error.message : String(error)));
  }
}
