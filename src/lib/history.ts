export interface FieldDiff {
  field: string;
  label: string;
  oldValue: string | null;
  newValue: string | null;
}

export const FIELD_LABELS: Record<string, string> = {
  name: "Name / Title",
  taxId: "Tax ID (EIN)",
  npiNumber: "NPI Number",
  phone: "Phone Number",
  email: "Email Address",
  address: "Street Address",
  city: "City",
  state: "State",
  zipCode: "ZIP Code",
  specialty: "Medical Specialty",
  vendorType: "Vendor Type",
  status: "Account Status",
  notes: "Internal Notes",
};

/**
 * Compares two profile objects and produces an array of changed field diffs.
 */
export function computeDiff(
  oldRecord: Record<string, any>,
  newRecord: Record<string, any>
): FieldDiff[] {
  const diffs: FieldDiff[] = [];

  for (const [key, label] of Object.entries(FIELD_LABELS)) {
    if (key in newRecord) {
      const oldVal = oldRecord[key] !== undefined && oldRecord[key] !== null ? String(oldRecord[key]).trim() : "";
      const newVal = newRecord[key] !== undefined && newRecord[key] !== null ? String(newRecord[key]).trim() : "";

      if (oldVal !== newVal) {
        diffs.push({
          field: key,
          label,
          oldValue: oldVal || null,
          newValue: newVal || null,
        });
      }
    }
  }

  return diffs;
}

/**
 * Creates a clean JSON summary sentence from diffs.
 */
export function generateDiffSummary(diffs: FieldDiff[], actionType: string): string {
  if (actionType === "CREATE") {
    return "Initial profile created";
  }
  if (actionType === "ASSOCIATION_ADDED") {
    return "New association linked";
  }
  if (actionType === "ASSOCIATION_REMOVED") {
    return "Association removed";
  }
  if (diffs.length === 0) {
    return "Profile updated";
  }
  if (diffs.length === 1) {
    return `Updated ${diffs[0].label}`;
  }
  return `Updated ${diffs.length} fields (${diffs.map((d) => d.label).slice(0, 3).join(", ")}${diffs.length > 3 ? "..." : ""})`;
}

/**
 * Takes a record and strips unnecessary relation objects to save as snapshot JSON.
 */
export function createSnapshot(record: Record<string, any>): string {
  const { vendors, clients, history, ...cleanState } = record;
  return JSON.stringify(cleanState);
}
