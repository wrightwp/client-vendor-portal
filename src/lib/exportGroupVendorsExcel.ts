import * as XLSX from "xlsx";
import { formatDisplayDate } from "./dateUtils";
import { formatGroupFeeDisplay } from "@/components/CurrencyInput";

export function exportGroupVendorsToExcel(groupName: string, vendors: any[]) {
  const list = vendors || [];

  const rows: (string | number)[][] = [
    [`ASSOCIATED VENDORS FOR GROUP: ${groupName.toUpperCase()}`],
    [`Export Date`, formatDisplayDate(new Date())],
    [`Total Linked Vendors`, list.length],
    [""], // blank row

    [
      "Vendor Name",
      "Category",
      "Group-Specific Fee",
      "Tax ID (EIN)",
      "Phone",
      "Email",
      "Address",
      "City",
      "State",
      "Zip Code",
      "Status",
      "Group-Specific Notes",
      "Vendor Notes",
    ],
  ];

  list.forEach((item) => {
    const v = item.vendor || {};
    rows.push([
      v.name || "—",
      v.vendorType || "—",
      formatGroupFeeDisplay(item.fee) || "—",
      v.taxId || "—",
      v.phone || "—",
      v.email || "—",
      v.address || "—",
      v.city || "—",
      v.state || "—",
      v.zipCode || "—",
      v.status || "ACTIVE",
      item.notes || "—",
      v.notes || "—",
    ]);
  });

  const worksheet = XLSX.utils.aoa_to_sheet(rows);

  // Set column widths for optimal spreadsheet layout
  worksheet["!cols"] = [
    { wch: 32 }, // Vendor Name
    { wch: 24 }, // Category
    { wch: 22 }, // Group-Specific Fee
    { wch: 18 }, // Tax ID
    { wch: 18 }, // Phone
    { wch: 28 }, // Email
    { wch: 28 }, // Address
    { wch: 18 }, // City
    { wch: 10 }, // State
    { wch: 12 }, // Zip Code
    { wch: 12 }, // Status
    { wch: 40 }, // Association Notes
    { wch: 40 }, // Vendor Notes
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Associated Vendors");

  const sanitizedGroupName = groupName.replace(/[^a-zA-Z0-9_-]/g, "_");
  const fileName = `Associated_Vendors_${sanitizedGroupName}_${new Date().toISOString().slice(0, 10)}.xlsx`;

  XLSX.writeFile(workbook, fileName);
}
