import * as XLSX from "xlsx";
import { formatDisplayDate } from "./dateUtils";

export function exportBEToExcel(clientName: string, data: any) {
  const bAndE = data || {};

  const effectiveDatesStr =
    bAndE.startDate || bAndE.endDate
      ? `${formatDisplayDate(bAndE.startDate) || "N/A"} to ${formatDisplayDate(bAndE.endDate) || "N/A"}`
      : "Not specified";

  const rows: (string | number)[][] = [
    ["BILLING & ENROLLMENT (B&E) SPECIFICATION SUMMARY"],
    ["Group Name", clientName],
    ["Plan Year", bAndE.planYear || "2026"],
    ["Effective Dates", effectiveDatesStr],
    ["Current Active Plan Year?", bAndE.isCurrent ? "Yes" : "No"],
    ["Export Date", formatDisplayDate(new Date())],
    [""], // blank row

    ["1. STOP-LOSS CARRIER & MANAGING GENERAL UNDERWRITER"],
    ["Current Stop-Loss Carrier", bAndE.currentStopLossCarrier || "Not specified"],
    ["Current Managing General Underwriter", bAndE.currentManagingGeneralUnderwriter || "Not specified"],
    ["Prior Stop-Loss Carrier", bAndE.priorStopLossCarrier || "—"],
    ["Prior Managing General Underwriter", bAndE.priorManagingGeneralUnderwriter || "—"],
    [""],

    ["2. ENROLLMENT CENSUS / TIER BREAKDOWN"],
    ["Single Tier Count", bAndE.figuresSingle ?? 0],
    ["Employee + 1 Tier Count", bAndE.figuresEmployeePlusOne ?? 0],
    ["Family Tier Count", bAndE.figuresFamily ?? 0],
    ["Total Census Count", bAndE.figuresTotal ?? 0],
    [""],

    ["3. SPECIFIC STOP-LOSS INFORMATION"],
    ["Specific Deductible", bAndE.specificDeductible || "—"],
    ["Aggregating Specific Deductible", bAndE.aggregatingSpecificDeductible || "No"],
    ["No-Laser Renewal Guarantee", bAndE.noLaserRenewalGuarantee || "No"],
    ["Max Specific Premium Renewal Increase", bAndE.maxSpecificPremiumRenewalIncrease || "—"],
    ["Lasered Individuals", bAndE.laseredIndividuals || "No"],
    ["Specific Contract", bAndE.specificContract || "12/12"],
    ["Specific Benefits Covered", bAndE.specificBenefitsCovered || "Med/Rx"],
    ["Specific Rate - Single", bAndE.specificPremiumSingle || "—"],
    ["Specific Rate - Employee + 1", bAndE.specificPremiumEmployeePlusOne || "—"],
    ["Specific Rate - Family", bAndE.specificPremiumFamily || "—"],
    [""],

    ["4. AGGREGATE STOP-LOSS INFORMATION"],
    ["Aggregate Premium", bAndE.aggregatePremium || "—"],
    ["Monthly Aggregate Accommodation", bAndE.monthlyAggregateAccommodation || "—"],
    ["Aggregate Contract", bAndE.aggregateContract || "12/12"],
    ["Min Attachment Point", bAndE.aggregateMinAttachmentPoint || "—"],
    ["Aggregate Run-In Limit", bAndE.aggregateRunInLimit || "No"],
    ["Aggregate Benefits Covered", bAndE.aggregateBenefitsCovered || "Med/Rx"],
    ["Aggregate Factor - Single", bAndE.aggregateFactorSingle || "—"],
    ["Aggregate Factor - Employee + 1", bAndE.aggregateFactorEmployeePlusOne || "—"],
    ["Aggregate Factor - Family", bAndE.aggregateFactorFamily || "—"],
    [""],

    ["5. COMPOSITE ADMINISTRATION & PPO NETWORK INFORMATION"],
    ["Composite Admin Fee", bAndE.compositeAdminFee || "—"],
    ["Medical Administration Fee", bAndE.medicalFee || "—"],
    ["Utilization Review (UR) Fee", bAndE.urFee || "—"],
    ["Amwell Telehealth Fee", bAndE.amwellFee || "—"],
    ["Physicians Care / HAP Fee", bAndE.physiciansCareHapFee || "—"],
    ["Aetna Signature Admin Fee", bAndE.aetnaSignatureAdminFee || "—"],
    ["Network Access Fee", bAndE.networkAccessFee || "—"],
    ["Reinsurance Fee", bAndE.reinsuranceFee || "—"],
    ["LCM / SPA Fee (AHH)", bAndE.lcmSpaFee || "—"],
    ["Agent Fee", bAndE.agentFee || "—"],
    ["Wrap Networks", bAndE.wrapNetwork || "—"],
    ["PPO Fee Notes", bAndE.ppoFee || "—"],
    [""],

    ["6. PBM (PHARMACY BENEFIT MANAGER) INFORMATION"],
    ["PBM Provider / Rx", bAndE.pbmRx || "—"],
    ["Rx Included in ASR Reporting?", bAndE.rxIncludedInAsrReporting || "No"],
    ["Rx ASR Contract?", bAndE.isRxAsrContract || "No"],
    ["PBM Agent Compensation?", bAndE.pbmAgentCompensation || "No"],
    [""],

    ["7. COMMISSION INFORMATION"],
    ["Stop-Loss Commission %", bAndE.stopLossCommission || "0%"],
    ["Stop-Loss Other Compensation", bAndE.stopLossOtherCompensation || "—"],
    ["Commission Agent Compensation?", bAndE.commissionAgentCompensation || "No"],
    [""],

    ["8. ORGAN TRANSPLANT & DOMESTIC CLAIMS"],
    ["Organ Transplant Policy?", bAndE.organTransplantPolicy || "No"],
    ["Domestic Claims?", bAndE.domesticClaims || "No"],
    [""],

    ["9. SPECIFICATION NOTES"],
    ["Stop-Loss Notes & Guarantees", bAndE.stopLossNotes || "None"],
    ["B&E Operational Notes", bAndE.notes || "None"],
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(rows);

  // Set column widths
  worksheet["!cols"] = [
    { wch: 44 }, // Field Title Column Width
    { wch: 48 }, // Field Value Column Width
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, `B&E ${bAndE.planYear || "2026"}`);

  // Format output filename
  const sanitizedClientName = clientName.replace(/[^a-zA-Z0-9_-]/g, "_");
  const yearStr = bAndE.planYear ? `_${bAndE.planYear}` : "";
  const fileName = `BE_Summary_${sanitizedClientName}${yearStr}_${new Date().toISOString().slice(0, 10)}.xlsx`;

  XLSX.writeFile(workbook, fileName);
}
