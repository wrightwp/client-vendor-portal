/**
 * Date formatting and normalization utilities
 * Standard format across the entire application: MM/DD/YYYY
 */

/**
 * Formats user typing into MM/DD/YYYY in real-time.
 * Automatically inserts slashes as the user types digits.
 * Supports pasting ISO (YYYY-MM-DD), standard US (M/D/YYYY), or raw digits.
 */
export function formatDateInput(input: string): string {
  if (!input) return "";

  // If pasted or contains ISO format (YYYY-MM-DD or YYYY/MM/DD)
  const isoMatch = input.trim().match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (isoMatch) {
    const year = isoMatch[1];
    const month = isoMatch[2].padStart(2, "0");
    const day = isoMatch[3].padStart(2, "0");
    return `${month}/${day}/${year}`;
  }

  // If input contains slashes (e.g., "1/1/2027", "1/12/2027", "01/1/2027", "1/")
  if (input.includes("/")) {
    const rawParts = input.split("/");
    let monthStr = rawParts[0].replace(/\D/g, "");
    if (rawParts.length > 1 && monthStr.length > 0) {
      let m = parseInt(monthStr, 10);
      if (m > 12) m = 12;
      if (m === 0) m = 1;
      monthStr = String(m).padStart(2, "0");
    }

    if (rawParts.length === 1) {
      return monthStr;
    }

    let dayStr = "";
    let yearStr = "";

    if (rawParts.length === 2) {
      const restDigits = rawParts[1].replace(/\D/g, "");
      if (restDigits.length > 2) {
        if (restDigits.length === 5) {
          dayStr = restDigits.slice(0, 1).padStart(2, "0");
          yearStr = restDigits.slice(1, 5);
        } else if (restDigits.length === 6) {
          dayStr = restDigits.slice(0, 2);
          yearStr = restDigits.slice(2, 6);
        } else if (restDigits.length === 3) {
          dayStr = restDigits.slice(0, 1).padStart(2, "0");
          yearStr = restDigits.slice(1, 3);
        } else if (restDigits.length === 4) {
          if (restDigits.startsWith("0")) {
            dayStr = restDigits.slice(0, 2);
            yearStr = restDigits.slice(2, 4);
          } else {
            dayStr = restDigits.slice(0, 1).padStart(2, "0");
            yearStr = restDigits.slice(1, 4);
          }
        } else {
          dayStr = restDigits.slice(0, 2);
          yearStr = restDigits.slice(2, 6);
        }

        let d = parseInt(dayStr, 10);
        if (d > 31) d = 31;
        if (d === 0) d = 1;
        dayStr = String(d).padStart(2, "0");

        return `${monthStr}/${dayStr}/${yearStr}`;
      } else {
        dayStr = restDigits.slice(0, 2);
        return `${monthStr}/${dayStr}`;
      }
    }

    const restDayDigits = rawParts[1].replace(/\D/g, "").slice(0, 2);
    if (restDayDigits.length > 0) {
      let d = parseInt(restDayDigits, 10);
      if (d > 31) d = 31;
      if (d === 0) d = 1;
      dayStr = String(d).padStart(2, "0");
    }

    yearStr = rawParts[2].replace(/\D/g, "").slice(0, 4);
    return `${monthStr}/${dayStr}/${yearStr}`;
  }

  // Extract only digits if no slashes typed yet
  const digits = input.replace(/\D/g, "").slice(0, 8);
  if (!digits) return "";

  if (digits.length <= 2) {
    if (digits.length === 1 && parseInt(digits, 10) > 1) {
      return `0${digits}/`;
    }
    if (digits.length === 2) {
      let m = parseInt(digits, 10);
      if (m > 12) m = 12;
      if (m === 0) m = 1;
      return `${String(m).padStart(2, "0")}/`;
    }
    return digits;
  }

  const monthStr = digits.slice(0, 2);
  let m = parseInt(monthStr, 10);
  if (m > 12) m = 12;
  if (m === 0) m = 1;
  const formattedMonth = String(m).padStart(2, "0");

  const rest = digits.slice(2);
  if (rest.length <= 2) {
    if (rest.length === 1 && parseInt(rest, 10) > 3) {
      return `${formattedMonth}/0${rest}/`;
    }
    if (rest.length === 2) {
      let d = parseInt(rest, 10);
      if (d > 31) d = 31;
      if (d === 0) d = 1;
      return `${formattedMonth}/${String(d).padStart(2, "0")}/`;
    }
    return `${formattedMonth}/${rest}`;
  }

  const dayStr = rest.slice(0, 2);
  let d = parseInt(dayStr, 10);
  if (d > 31) d = 31;
  if (d === 0) d = 1;
  const formattedDay = String(d).padStart(2, "0");

  const yearStr = rest.slice(2, 6);
  return `${formattedMonth}/${formattedDay}/${yearStr}`;
}

/**
 * Normalizes any completed or partial date string into standard MM/DD/YYYY format.
 * Returns empty string if invalid.
 */
export function normalizeDate(dateStr: string | null | undefined): string {
  if (!dateStr || !dateStr.trim()) return "";
  const clean = dateStr.trim();

  // 1. ISO format YYYY-MM-DD or YYYY/MM/DD
  const isoMatch = clean.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (isoMatch) {
    const year = isoMatch[1];
    const month = isoMatch[2].padStart(2, "0");
    const day = isoMatch[3].padStart(2, "0");
    return `${month}/${day}/${year}`;
  }

  // 2. US format M/D/YYYY or M/D/YY
  const usMatch = clean.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{2,4})/);
  if (usMatch) {
    let month = parseInt(usMatch[1], 10);
    let day = parseInt(usMatch[2], 10);
    let year = usMatch[3];

    if (month < 1) month = 1;
    if (month > 12) month = 12;
    if (day < 1) day = 1;
    if (day > 31) day = 31;

    if (year.length === 2) {
      year = `20${year}`;
    }

    return `${String(month).padStart(2, "0")}/${String(day).padStart(2, "0")}/${year}`;
  }

  // 3. Partial M/D format (e.g. 1/1 or 01/01)
  const partialUsMatch = clean.match(/^(\d{1,2})[-/](\d{1,2})$/);
  if (partialUsMatch) {
    let month = parseInt(partialUsMatch[1], 10);
    let day = parseInt(partialUsMatch[2], 10);
    if (month < 1) month = 1;
    if (month > 12) month = 12;
    if (day < 1) day = 1;
    if (day > 31) day = 31;
    const currentYear = new Date().getFullYear();
    return `${String(month).padStart(2, "0")}/${String(day).padStart(2, "0")}/${currentYear}`;
  }

  // 4. Pure digits (8 digits MMDDYYYY or 6 digits MMDDYY)
  const digits = clean.replace(/\D/g, "");
  if (digits.length === 8) {
    const m = digits.slice(0, 2);
    const d = digits.slice(2, 4);
    const y = digits.slice(4, 8);
    return `${m}/${d}/${y}`;
  }
  if (digits.length === 6) {
    const m = digits.slice(0, 2);
    const d = digits.slice(2, 4);
    const y = `20${digits.slice(4, 6)}`;
    return `${m}/${d}/${y}`;
  }

  return clean;
}

/**
 * Formats any stored date (string, Date, ISO timestamp, or YYYY-MM-DD) for display
 * consistently as MM/DD/YYYY.
 */
export function formatDisplayDate(dateVal: string | Date | null | undefined, fallback: string = ""): string {
  if (!dateVal) return fallback;

  if (dateVal instanceof Date) {
    if (isNaN(dateVal.getTime())) return fallback;
    const m = String(dateVal.getMonth() + 1).padStart(2, "0");
    const d = String(dateVal.getDate()).padStart(2, "0");
    const y = dateVal.getFullYear();
    return `${m}/${d}/${y}`;
  }

  const str = String(dateVal).trim();
  if (!str) return fallback;

  // If plain YYYY-MM-DD
  const isoDateOnly = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoDateOnly) {
    return `${isoDateOnly[2]}/${isoDateOnly[3]}/${isoDateOnly[1]}`;
  }

  // If ISO timestamp with time (e.g. 2026-09-13T18:37:47.610Z)
  if (str.includes("T") || str.includes("Z")) {
    const d = new Date(str);
    if (!isNaN(d.getTime())) {
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const y = d.getFullYear();
      return `${m}/${day}/${y}`;
    }
  }

  // If already standard US format MM/DD/YYYY or M/D/YYYY
  const normalized = normalizeDate(str);
  if (normalized) return normalized;

  return str;
}

/**
 * Formats a timestamp into standard MM/DD/YYYY, hh:mm A
 */
export function formatDisplayDateTime(dateVal: string | Date | null | undefined, fallback: string = ""): string {
  if (!dateVal) return fallback;
  const d = dateVal instanceof Date ? dateVal : new Date(dateVal);
  if (isNaN(d.getTime())) return String(dateVal) || fallback;

  const datePart = formatDisplayDate(d);
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const timePart = `${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;

  return `${datePart}, ${timePart}`;
}
