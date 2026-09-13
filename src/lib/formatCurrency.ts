/**
 * Formats values as clean US Currency for View Mode pages (e.g. 50000 -> "$50,000.00", 7.7 -> "$7.70", "45" -> "$45.00")
 */
export function formatCurrency(val: any, fallback = "—", suffix = ""): string {
  if (val === null || val === undefined || val === "" || val === "—") {
    return fallback;
  }

  const str = String(val).trim();
  if (!str) return fallback;

  // Handle non-numeric text like "No", "None", "False"
  if (str.toLowerCase() === "no" || str.toLowerCase() === "none" || str.toLowerCase() === "false") {
    return str;
  }

  // Check if string already contains formatted currency e.g. "$150,000" or "$1.50 PEPM"
  if (str.startsWith("$") && (str.includes(",") || str.includes("."))) {
    return suffix && !str.toLowerCase().includes(suffix.toLowerCase()) ? `${str} ${suffix}` : str;
  }

  // Extract pure numerical digits and decimal point
  const cleanNumberStr = str.replace(/[^0-9.-]/g, "");
  if (!cleanNumberStr || isNaN(Number(cleanNumberStr))) {
    return str; // Return raw text if not convertible
  }

  const num = Number(cleanNumberStr);
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);

  if (suffix) {
    if (str.toLowerCase().includes(suffix.toLowerCase())) {
      return str.startsWith("$") ? str : `${formatted} ${suffix}`;
    }
    return `${formatted} ${suffix}`;
  }

  return formatted;
}

export default formatCurrency;
