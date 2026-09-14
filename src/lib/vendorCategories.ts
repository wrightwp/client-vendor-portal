/**
 * Vendor Categories — Helpers for multi-tag category system.
 *
 * Categories are stored as a comma-separated string in `Vendor.vendorType`.
 * All values are human-readable (no underscores, no ALL_CAPS keys).
 */

/** Standard preset categories available to all vendors */
export const PRESET_CATEGORIES: string[] = [
  "Medical Supplies & Equipment",
  "IT & EHR Telehealth",
  "Lab & Pathology Services",
  "Medical Billing & Revenue Cycle",
  "Pharmaceutical Distribution",
  "General Services",
  "Stoploss",
  "Stoploss MGU",
];

/**
 * Legacy key → human-readable label mapping.
 * Used only as a fallback when old underscore-based keys are encountered
 * (e.g. from stale API responses or un-migrated records).
 */
const LEGACY_MAP: Record<string, string> = {
  MEDICAL_SUPPLIES: "Medical Supplies & Equipment",
  IT_SERVICES: "IT & EHR Telehealth",
  LAB_SERVICES: "Lab & Pathology Services",
  BILLING: "Medical Billing & Revenue Cycle",
  PHARMACY: "Pharmaceutical Distribution",
  GENERAL: "General Services",
};

/**
 * Convert a legacy UPPER_SNAKE_CASE tag or any underscored string to a clean,
 * human-readable label.  Known presets are mapped explicitly; unknown tags are
 * title-cased with underscores replaced by spaces.
 */
export function humanizeTag(tag: string): string {
  const trimmed = tag.trim();
  if (!trimmed) return "";

  // Check if it's a known legacy key
  const upper = trimmed.toUpperCase();
  if (LEGACY_MAP[upper]) return LEGACY_MAP[upper];

  // If it contains underscores, convert UPPER_SNAKE or lower_snake to Title Case
  if (trimmed.includes("_")) {
    return trimmed
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");
  }

  // Already human-readable
  return trimmed;
}

/**
 * Parse a raw vendorType string (possibly comma-separated, possibly legacy keys)
 * into an array of clean, human-readable category labels.
 */
export function parseVendorCategories(raw: string | null | undefined): string[] {
  if (!raw || !raw.trim()) return [];

  return raw
    .split(",")
    .map((t) => humanizeTag(t))
    .filter((t) => t.length > 0);
}

/**
 * Serialize an array of category labels into a comma-separated string for storage.
 * Deduplicates (case-insensitive) and preserves insertion order.
 */
export function serializeVendorCategories(tags: string[]): string {
  const seen = new Set<string>();
  const unique: string[] = [];
  for (const tag of tags) {
    const t = tag.trim();
    if (!t) continue;
    const key = t.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(t);
    }
  }
  return unique.join(", ");
}
