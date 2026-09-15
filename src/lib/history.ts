export interface FieldDiff {
  field: string;
  label: string;
  oldValue: string | null;
  newValue: string | null;
}

export const FIELD_LABELS: Record<string, string> = {
  // General Profile
  name: "Name / Title",
  taxId: "Tax ID (EIN)",
  npiNumber: "Group Number",
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

  // B&E - Plan Year & Status
  planYear: "Plan Year",
  startDate: "Plan Start Date",
  endDate: "Plan End Date",
  isCurrent: "Current Plan Year Flag",

  // B&E - Stop-Loss Carrier & Underwriter
  currentStopLossCarrier: "Current Stop-Loss Carrier",
  currentManagingGeneralUnderwriter: "Current Managing General Underwriter",
  priorStopLossCarrier: "Prior Stop-Loss Carrier",
  priorManagingGeneralUnderwriter: "Prior Managing General Underwriter",

  // B&E - Specific Stop-Loss Information
  specificStopLossStatus: "Specific Stop-Loss Status",
  specificContract: "Specific Contract Basis",
  specificDeductible: "Specific Deductible",
  aggregatingSpecificDeductible: "Aggregating Specific Deductible",
  noLaserRenewalGuarantee: "No Laser Renewal Guarantee",
  maxSpecificPremiumRenewalIncrease: "Max Specific Renewal Increase",
  laseredIndividuals: "Lasered Individuals",
  specificTierStructure: "Specific Tier Structure",
  specificPremiumSingle: "Specific Rate (Single)",
  specificPremiumEmployeePlusOne: "Specific Rate (EE+1)",
  specificPremiumEmployeeSpouse: "Specific Rate (EE+Spouse)",
  specificPremiumEmployeeChildren: "Specific Rate (EE+Children)",
  specificPremiumFamily: "Specific Rate (Family)",
  specificBenefitsCovered: "Specific Benefits Covered",

  // B&E - Aggregate Stop-Loss Information
  aggregateContract: "Aggregate Contract Basis",
  aggregateStopLossStatus: "Aggregate Stop-Loss Status",
  aggregatePremium: "Aggregate Premium",
  monthlyAggregateAccommodation: "Monthly Agg Accommodation",
  terminalLiabilityOption: "Terminal Liability Option",
  aggregateFactorSingle: "Aggregate Factor (Single)",
  aggregateFactorEmployeePlusOne: "Aggregate Factor (EE+1)",
  aggregateFactorEmployeeSpouse: "Aggregate Factor (EE+Spouse)",
  aggregateFactorEmployeeChildren: "Aggregate Factor (EE+Children)",
  aggregateFactorFamily: "Aggregate Factor (Family)",
  aggregateMinAttachmentPoint: "Aggregate Min Attachment Point",
  aggregateBenefitsCovered: "Aggregate Benefits Covered",
  aggregateRunInLimit: "Aggregate Run-In Limit",

  // B&E - Composite Administration & PPO Network Information
  compositeAdminFee: "Composite Admin Fee",
  medicalFee: "Medical Admin Fee",
  urFee: "UR Fee",
  amwellFee: "Amwell Telehealth Fee",
  physiciansCareHapFee: "Physicians Care / HAP Fee",
  aetnaSignatureAdminFee: "Aetna Signature Admin Fee",
  networkAccessFee: "Network Access Fee",
  reinsuranceFee: "Reinsurance Fee",
  lcmSpaFee: "LCM / SPA (AHH) Fee",
  agentFee: "Agent Fee",
  wrapNetwork: "Wrap Networks",
  ppoFee: "PPO Fee Notes",

  // B&E - PBM Information
  pbmRx: "PBM Provider",
  rxIncludedInAsrReporting: "Rx in ASR Reporting",
  isRxAsrContract: "Rx ASR Contract",
  pbmAgentCompensation: "PBM Agent Compensation",

  // B&E - Commission Information
  stopLossCommission: "Stop-Loss Commission",
  stopLossOtherCompensation: "Stop-Loss Other Compensation",
  commissionAgentCompensation: "Commission Agent Compensation",

  // B&E - Transplant & Domestic
  organTransplantPolicy: "Organ Transplant Policy",
  domesticClaims: "Domestic Claims",

  // B&E - Census Breakdown
  figuresSingle: "Census: Single",
  figuresEmployeePlusOne: "Census: EE+1",
  figuresEmployeeSpouse: "Census: EE+Spouse",
  figuresEmployeeChildren: "Census: EE+Children",
  figuresFamily: "Census: Family",
  figuresTotal: "Census: Total",

  // B&E - Dedicated Notes
  stopLossNotes: "Stop-Loss Contract Notes",
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
 * Compares two Billing & Enrollment record objects and produces an array of field diffs.
 */
export function computeBillingEnrollmentDiff(
  oldRecord: Record<string, any> | null | undefined,
  newRecord: Record<string, any>
): FieldDiff[] {
  const diffs: FieldDiff[] = [];
  const safeOld = oldRecord || {};

  const formatVal = (val: any) => {
    if (val === undefined || val === null) return "";
    if (typeof val === "boolean") return val ? "Yes" : "No";
    return String(val).trim();
  };

  for (const [key, label] of Object.entries(FIELD_LABELS)) {
    if (key in newRecord || (oldRecord && key in safeOld)) {
      if (["id", "clientId", "createdAt", "updatedAt"].includes(key)) continue;

      const oldVal = formatVal(safeOld[key]);
      const newVal = formatVal(newRecord[key]);

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
 * Creates a clean summary description for B&E changes.
 */
export function generateBillingEnrollmentDiffSummary(
  diffs: FieldDiff[],
  planYear: string,
  isNew: boolean
): string {
  if (isNew) {
    return `Added New B&E Plan Year ${planYear}`;
  }
  if (diffs.length === 0) {
    return `Updated B&E Specifications (Plan Year ${planYear})`;
  }
  if (diffs.length === 1) {
    return `Updated ${diffs[0].label} (Plan Year ${planYear})`;
  }
  if (diffs.length <= 3) {
    return `Updated ${diffs.map((d) => d.label).join(", ")} (Plan Year ${planYear})`;
  }
  return `Updated ${diffs.length} B&E fields (Plan Year ${planYear}): ${diffs.slice(0, 3).map((d) => d.label).join(", ")}...`;
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
