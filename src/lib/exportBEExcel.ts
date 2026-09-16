import * as XLSX from "xlsx";
import { formatDisplayDate } from "./dateUtils";
import { formatTloDisplay } from "../components/TerminalLiabilityInput";
import { formatCurrencyDisplay } from "../components/CurrencyInput";
import { formatRunInLimitDisplay } from "../components/AggregateRunInLimitInput";
import { formatMonthlyAccommodationDisplay } from "../components/MonthlyAccommodationInput";

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
    ...(() => {
      if (!bAndE.stopLossCustomFields) return [];
      try {
        const fields = JSON.parse(bAndE.stopLossCustomFields);
        if (Array.isArray(fields)) {
          return fields.map((f: any) => [
            f.indented ? `   ↳ ${f.label}` : f.label,
            f.defaultValue || "—",
          ]);
        }
      } catch (e) {}
      return [];
    })(),
    [""],

    ["2. ENROLLMENT CENSUS / TIER BREAKDOWN"],
    ["Tier Structure", bAndE.specificTierStructure || "3-Tier"],
    ["Single Tier Count", bAndE.figuresSingle ?? 0],
    ["Employee + 1 Tier Count", bAndE.figuresEmployeePlusOne ?? "—"],
    ["Employee + Spouse Tier Count", bAndE.figuresEmployeeSpouse ?? "—"],
    ["Employee + Child(ren) Tier Count", bAndE.figuresEmployeeChildren ?? "—"],
    ["Family Tier Count", bAndE.figuresFamily ?? 0],
    ["Total Census Count", bAndE.figuresTotal ?? 0],
    [""],

    ["3. SPECIFIC STOP-LOSS INFORMATION"],
    ["Specific Coverage Status", (bAndE.specificStopLossStatus === "None" || bAndE.specificContract?.trim().toLowerCase() === "none") ? "None (No Specific Coverage)" : "Included"],
    ["Tier Structure", bAndE.specificTierStructure || "3-Tier"],
    ["Specific Deductible", (bAndE.specificStopLossStatus === "None") ? "None" : (bAndE.specificDeductible || "—")],
    ["Aggregating Specific Deductible", (bAndE.specificStopLossStatus === "None") ? "None" : (bAndE.aggregatingSpecificDeductible || "No")],
    ["No-Laser Renewal Guarantee", (bAndE.specificStopLossStatus === "None") ? "None" : (bAndE.noLaserRenewalGuarantee || "No")],
    ["Max Specific Premium Renewal Increase", (bAndE.specificStopLossStatus === "None") ? "None" : (bAndE.maxSpecificPremiumRenewalIncrease || "—")],
    ["Lasered Individuals", (bAndE.specificStopLossStatus === "None") ? "None" : (bAndE.laseredIndividuals || "No")],
    ["Specific Contract", (bAndE.specificStopLossStatus === "None") ? "None" : (bAndE.specificContract || "12/12")],
    ["Specific Benefits Covered", (bAndE.specificStopLossStatus === "None") ? "None" : (bAndE.specificBenefitsCovered || "Med/Rx")],
    ...(() => {
      if (!bAndE.specificCustomFields) return [];
      try {
        const fields = JSON.parse(bAndE.specificCustomFields);
        if (Array.isArray(fields)) {
          return fields.map((f: any) => [
            f.indented ? `   ↳ ${f.label}` : f.label,
            f.defaultValue || "—",
          ]);
        }
      } catch (e) {}
      return [];
    })(),
    ["Specific Rate - Single", (bAndE.specificStopLossStatus === "None") ? "None" : (bAndE.specificPremiumSingle || "—")],
    ["Specific Rate - Employee + 1", (bAndE.specificStopLossStatus === "None") ? "None" : (bAndE.specificPremiumEmployeePlusOne || "—")],
    ["Specific Rate - EE + Spouse", (bAndE.specificStopLossStatus === "None") ? "None" : (bAndE.specificPremiumEmployeeSpouse || "—")],
    ["Specific Rate - EE + Child(ren)", (bAndE.specificStopLossStatus === "None") ? "None" : (bAndE.specificPremiumEmployeeChildren || "—")],
    ["Specific Rate - Family", (bAndE.specificStopLossStatus === "None") ? "None" : (bAndE.specificPremiumFamily || "—")],
    [""],

    ["4. AGGREGATE STOP-LOSS INFORMATION"],
    ["Aggregate Coverage Status", (bAndE.aggregateStopLossStatus === "None" || bAndE.aggregatePremium?.trim().toLowerCase() === "none") ? "None (No Aggregate Coverage)" : "Included"],
    ["Aggregate Premium", (bAndE.aggregateStopLossStatus === "None" || bAndE.aggregatePremium?.trim().toLowerCase() === "none") ? "None" : (bAndE.aggregatePremium || "—")],
    ["Monthly Aggregate Accommodation", (bAndE.aggregateStopLossStatus === "None" || bAndE.aggregatePremium?.trim().toLowerCase() === "none") ? "None" : formatMonthlyAccommodationDisplay(bAndE.monthlyAggregateAccommodation)],
    ["Terminal Liability Option (TLO)", formatTloDisplay(bAndE.terminalLiabilityOption)],
    ["Aggregate Contract", bAndE.aggregateContract || "12/12"],
    ["Min Attachment Point", (bAndE.aggregateStopLossStatus === "None" || bAndE.aggregatePremium?.trim().toLowerCase() === "none") ? "None" : (bAndE.aggregateMinAttachmentPoint || "—")],
    ["Aggregate Run-In Limit", formatRunInLimitDisplay(bAndE.aggregateRunInLimit)],
    ["Aggregate Benefits Covered", bAndE.aggregateBenefitsCovered || "Med/Rx"],
    ...(() => {
      if (!bAndE.aggregateCustomFields) return [];
      try {
        const fields = JSON.parse(bAndE.aggregateCustomFields);
        if (Array.isArray(fields)) {
          return fields.map((f: any) => [
            f.indented ? `   ↳ ${f.label}` : f.label,
            f.defaultValue || "—",
          ]);
        }
      } catch (e) {}
      return [];
    })(),
    ["Aggregate Factor - Single", (bAndE.aggregateStopLossStatus === "None" || bAndE.aggregatePremium?.trim().toLowerCase() === "none") ? "None" : formatCurrencyDisplay(bAndE.aggregateFactorSingle)],
    ["Aggregate Factor - Employee + 1", (bAndE.aggregateStopLossStatus === "None" || bAndE.aggregatePremium?.trim().toLowerCase() === "none") ? "None" : formatCurrencyDisplay(bAndE.aggregateFactorEmployeePlusOne)],
    ["Aggregate Factor - EE + Spouse", (bAndE.aggregateStopLossStatus === "None" || bAndE.aggregatePremium?.trim().toLowerCase() === "none") ? "None" : formatCurrencyDisplay(bAndE.aggregateFactorEmployeeSpouse)],
    ["Aggregate Factor - EE + Child(ren)", (bAndE.aggregateStopLossStatus === "None" || bAndE.aggregatePremium?.trim().toLowerCase() === "none") ? "None" : formatCurrencyDisplay(bAndE.aggregateFactorEmployeeChildren)],
    ["Aggregate Factor - Family", (bAndE.aggregateStopLossStatus === "None" || bAndE.aggregatePremium?.trim().toLowerCase() === "none") ? "None" : formatCurrencyDisplay(bAndE.aggregateFactorFamily)],
    [""],

    ...(() => {
      let sections: any[] = [];
      if (bAndE.adminSections) {
        try {
          sections = JSON.parse(bAndE.adminSections);
        } catch (e) {}
      }
      if (!sections || sections.length === 0) {
        // Fallback default
        sections = [
          {
            title: "Administration & Network Information",
            fields: [
              { label: "Composite Admin Fee", defaultValue: bAndE.compositeAdminFee || "—" },
              { label: "Medical Administration Fee", defaultValue: bAndE.medicalFee || "—" },
              { label: "Utilization Review (UR) Fee", defaultValue: bAndE.urFee || "—" },
              { label: "Amwell Telehealth Fee", defaultValue: bAndE.amwellFee || "—" },
              { label: "Physicians Care / HAP Fee", defaultValue: bAndE.physiciansCareHapFee || "—" },
              { label: "Aetna Signature Admin Fee", defaultValue: bAndE.aetnaSignatureAdminFee || "—" },
              { label: "Network Access Fee", defaultValue: bAndE.networkAccessFee || "—" },
              { label: "Reinsurance Fee", defaultValue: bAndE.reinsuranceFee || "—" },
              { label: "LCM / SPA Fee (AHH)", defaultValue: bAndE.lcmSpaFee || "—" },
              { label: "Agent Fee", defaultValue: bAndE.agentFee || "—" },
              { label: "Wrap Networks", defaultValue: bAndE.wrapNetwork || "—" },
              { label: "PPO Fee Notes", defaultValue: bAndE.ppoFee || "—" },
            ],
          },
        ];
      }

      const headerTitle = (() => {
        const norm = (bAndE.adminMasterType || "COMPOSITE").toUpperCase();
        if (norm === "NON_COMPOSITE") return "NON-COMPOSITE ADMINISTRATION & NETWORK INFORMATION";
        if (norm === "NON_MED") return "NON-MED";
        return "COMPOSITE ADMINISTRATION & NETWORK INFORMATION";
      })();

      const rows: (string | number)[][] = [
        [`5. ${headerTitle}`],
      ];

      sections.forEach((sec: any) => {
        if (sections.length > 1) {
          rows.push([`[ ${sec.title} ]`, ""]);
        }
        (sec.fields || []).forEach((f: any) => {
          rows.push([
            f.indented ? `   ↳ ${f.label}` : f.label,
            f.defaultValue && f.defaultValue.trim() !== "" ? f.defaultValue : "—",
          ]);
        });
      });

      rows.push([""]);
      return rows;
    })(),

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
