"use client";

import { useState, useEffect, useMemo } from "react";
import {
  FileText,
  Edit3,
  Printer,
  Shield,
  Percent,
  Layers,
  HeartHandshake,
  Network,
  Pill,
  DollarSign,
  Users,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  Plus,
  Calendar,
  CheckCircle2,
  Save,
  X,
  Copy,
  ShieldAlert,
  SlidersHorizontal,
} from "lucide-react";
import EditBillingEnrollmentModal from "./EditBillingEnrollmentModal";
import VendorTypeahead from "./VendorTypeahead";
import PrintBillingEnrollmentModal from "./PrintBillingEnrollmentModal";
import BEAssociatedVendorsTable from "./BEAssociatedVendorsTable";
import { MarkdownNoteRenderer } from "./MarkdownNotes";
import { exportBEToExcel } from "@/lib/exportBEExcel";
import DateInput from "./DateInput";
import { formatDisplayDate, normalizeDate } from "@/lib/dateUtils";
import YesNoToggle from "./YesNoToggle";
import CurrencyInput, { formatCurrencyDisplay } from "./CurrencyInput";
import PercentInput from "./PercentInput";
import ContractSelect from "./ContractSelect";
import LaseredIndividualsInput, { LaseredIndividualsView, parseLaserString } from "./LaseredIndividualsInput";
import MonthlyAccommodationInput, { parseMonthlyAccommodationDisplay } from "./MonthlyAccommodationInput";
import AggregatingSpecificInput from "./AggregatingSpecificInput";
import MaxSpecificRenewalIncreaseInput from "./MaxSpecificRenewalIncreaseInput";
import SpecificDeductibleInput, { formatDisplaySpecificDeductible } from "./SpecificDeductibleInput";
import SpecificPremiumRatesInput from "./SpecificPremiumRatesInput";
import AggregateFactorsInput from "./AggregateFactorsInput";
import EnrollmentCensusInput, { calculateCensusTotal } from "./EnrollmentCensusInput";
import { TierStructure, detectTierStructure } from "./TierStructureSelector";
import BenefitsCoveredSelect from "./BenefitsCoveredSelect";
import IncludedNoneToggle from "./IncludedNoneToggle";
import TerminalLiabilityInput, { formatTloDisplay } from "./TerminalLiabilityInput";
import AggregateRunInLimitInput, { formatRunInLimitDisplay } from "./AggregateRunInLimitInput";

interface BillingEnrollmentSectionProps {
  clientId: string;
  clientName: string;
  data: any;
  vendors?: any[];
  allVendors?: any[];
  onRefresh: () => void;
}

export default function BillingEnrollmentSection({
  clientId,
  clientName,
  data,
  vendors = [],
  allVendors = [],
  onRefresh,
}: BillingEnrollmentSectionProps) {
  const [isNewYearMode, setIsNewYearMode] = useState(false);
  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true); // Default open so user immediately sees B&E tabs and specs

  // View Tabs: BOTH | BILLING | STOP_LOSS
  const [viewTab, setViewTab] = useState<"BOTH" | "BILLING" | "STOP_LOSS">("BOTH");

  // Inline In-Page Edit State
  const [isInlineEditing, setIsInlineEditing] = useState(false);
  const [savingInline, setSavingInline] = useState(false);
  const [inlineError, setInlineError] = useState("");
  const [copySourceYear, setCopySourceYear] = useState("");

  // Normalize data into array of plan year records
  const enrollmentsList: any[] = useMemo(
    () => (Array.isArray(data) ? data : data ? [data] : []),
    [data]
  );

  // Sort descending by planYear
  const sortedEnrollments = useMemo(
    () =>
      [...enrollmentsList].sort((a, b) =>
        (b.planYear || "").localeCompare(a.planYear || "")
      ),
    [enrollmentsList]
  );

  // Determine active plan year
  const currentRecord = useMemo(
    () => sortedEnrollments.find((e) => e.isCurrent) || sortedEnrollments[0],
    [sortedEnrollments]
  );
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  const activeYear =
    selectedYear && sortedEnrollments.some((e) => e.planYear === selectedYear)
      ? selectedYear
      : currentRecord?.planYear || "2026";

  const activeBAndE = useMemo(
    () =>
      sortedEnrollments.find((e) => e.planYear === activeYear) || currentRecord || {},
    [sortedEnrollments, activeYear, currentRecord]
  );

  // Form State for Inline Editing
  const [editFormData, setEditFormData] = useState({
    planYear: activeBAndE.planYear || "2026",
    startDate: formatDisplayDate(activeBAndE.startDate),
    endDate: formatDisplayDate(activeBAndE.endDate),
    isCurrent: activeBAndE.isCurrent ?? true,

    currentStopLossCarrier: activeBAndE.currentStopLossCarrier || "",
    currentManagingGeneralUnderwriter: activeBAndE.currentManagingGeneralUnderwriter || "",
    priorStopLossCarrier: activeBAndE.priorStopLossCarrier || "",
    priorManagingGeneralUnderwriter: activeBAndE.priorManagingGeneralUnderwriter || "",

    specificStopLossStatus: activeBAndE.specificStopLossStatus || (activeBAndE.specificContract?.trim().toLowerCase() === "none" ? "None" : "Included"),
    specificDeductible: activeBAndE.specificDeductible || "",
    aggregatingSpecificDeductible: activeBAndE.aggregatingSpecificDeductible || "",
    noLaserRenewalGuarantee: activeBAndE.noLaserRenewalGuarantee || "",
    maxSpecificPremiumRenewalIncrease: activeBAndE.maxSpecificPremiumRenewalIncrease || "",
    laseredIndividuals: activeBAndE.laseredIndividuals || "",
    specificTierStructure: activeBAndE.specificTierStructure || "",
    specificPremiumSingle: activeBAndE.specificPremiumSingle || "",
    specificPremiumEmployeePlusOne: activeBAndE.specificPremiumEmployeePlusOne || "",
    specificPremiumEmployeeSpouse: activeBAndE.specificPremiumEmployeeSpouse || "",
    specificPremiumEmployeeChildren: activeBAndE.specificPremiumEmployeeChildren || "",
    specificPremiumFamily: activeBAndE.specificPremiumFamily || "",
    specificBenefitsCovered: activeBAndE.specificBenefitsCovered || "",
    specificContract: activeBAndE.specificContract || "",

    aggregateStopLossStatus: activeBAndE.aggregateStopLossStatus || (activeBAndE.aggregatePremium?.trim().toLowerCase() === "none" ? "None" : "Included"),
    aggregatePremium: activeBAndE.aggregatePremium || "",
    monthlyAggregateAccommodation: activeBAndE.monthlyAggregateAccommodation || "",
    terminalLiabilityOption: activeBAndE.terminalLiabilityOption || "",
    aggregateFactorSingle: activeBAndE.aggregateFactorSingle || "",
    aggregateFactorEmployeePlusOne: activeBAndE.aggregateFactorEmployeePlusOne || "",
    aggregateFactorEmployeeSpouse: activeBAndE.aggregateFactorEmployeeSpouse || "",
    aggregateFactorEmployeeChildren: activeBAndE.aggregateFactorEmployeeChildren || "",
    aggregateFactorFamily: activeBAndE.aggregateFactorFamily || "",
    aggregateMinAttachmentPoint: activeBAndE.aggregateMinAttachmentPoint || "",
    aggregateBenefitsCovered: activeBAndE.aggregateBenefitsCovered || "",
    aggregateContract: activeBAndE.aggregateContract || "",
    aggregateRunInLimit: activeBAndE.aggregateRunInLimit || "",

    stopLossNotes: activeBAndE.stopLossNotes || "",

    organTransplantPolicy: activeBAndE.organTransplantPolicy || "",

    compositeAdminFee: activeBAndE.compositeAdminFee || "",
    medicalFee: activeBAndE.medicalFee || "",
    urFee: activeBAndE.urFee || "",
    amwellFee: activeBAndE.amwellFee || "",
    physiciansCareHapFee: activeBAndE.physiciansCareHapFee || "",
    wrapNetwork: activeBAndE.wrapNetwork || "",
    aetnaSignatureAdminFee: activeBAndE.aetnaSignatureAdminFee || "",
    networkAccessFee: activeBAndE.networkAccessFee || "",
    reinsuranceFee: activeBAndE.reinsuranceFee || "",
    lcmSpaFee: activeBAndE.lcmSpaFee || "",
    agentFee: activeBAndE.agentFee || "",
    ppoFee: activeBAndE.ppoFee || "",

    pbmRx: activeBAndE.pbmRx || "",
    rxIncludedInAsrReporting: activeBAndE.rxIncludedInAsrReporting || "",
    isRxAsrContract: activeBAndE.isRxAsrContract || "",
    pbmAgentCompensation: activeBAndE.pbmAgentCompensation || "",

    stopLossCommission: activeBAndE.stopLossCommission || "",
    stopLossOtherCompensation: activeBAndE.stopLossOtherCompensation || "",
    commissionAgentCompensation: activeBAndE.commissionAgentCompensation || "",

    figuresSingle: activeBAndE.figuresSingle || "",
    figuresEmployeePlusOne: activeBAndE.figuresEmployeePlusOne || "",
    figuresEmployeeSpouse: activeBAndE.figuresEmployeeSpouse || "",
    figuresEmployeeChildren: activeBAndE.figuresEmployeeChildren || "",
    figuresFamily: activeBAndE.figuresFamily || "",
    figuresTotal: activeBAndE.figuresTotal || "",

    domesticClaims: activeBAndE.domesticClaims || "",
    notes: activeBAndE.notes || "",
  });

  // Sync edit form state whenever active record changes
  useEffect(() => {
    if (isInlineEditing) return;
    const rec = activeBAndE || {};
    setEditFormData({
      planYear: rec.planYear || activeYear || "2026",
      startDate: formatDisplayDate(rec.startDate),
      endDate: formatDisplayDate(rec.endDate),
      isCurrent: rec.isCurrent ?? true,

      currentStopLossCarrier: rec.currentStopLossCarrier || "",
      currentManagingGeneralUnderwriter: rec.currentManagingGeneralUnderwriter || "",
      priorStopLossCarrier: rec.priorStopLossCarrier || "",
      priorManagingGeneralUnderwriter: rec.priorManagingGeneralUnderwriter || "",

      specificStopLossStatus: rec.specificStopLossStatus || (rec.specificContract?.trim().toLowerCase() === "none" ? "None" : "Included"),
      specificDeductible: rec.specificDeductible || "",
      aggregatingSpecificDeductible: rec.aggregatingSpecificDeductible || "",
      noLaserRenewalGuarantee: rec.noLaserRenewalGuarantee || "",
      maxSpecificPremiumRenewalIncrease: rec.maxSpecificPremiumRenewalIncrease || "",
      laseredIndividuals: rec.laseredIndividuals || "",
      specificTierStructure: rec.specificTierStructure || "",
      specificPremiumSingle: rec.specificPremiumSingle || "",
      specificPremiumEmployeePlusOne: rec.specificPremiumEmployeePlusOne || "",
      specificPremiumEmployeeSpouse: rec.specificPremiumEmployeeSpouse || "",
      specificPremiumEmployeeChildren: rec.specificPremiumEmployeeChildren || "",
      specificPremiumFamily: rec.specificPremiumFamily || "",
      specificBenefitsCovered: rec.specificBenefitsCovered || "",
      specificContract: rec.specificContract || "",

      aggregateStopLossStatus: rec.aggregateStopLossStatus || (rec.aggregatePremium?.trim().toLowerCase() === "none" ? "None" : "Included"),
      aggregatePremium: rec.aggregatePremium || "",
      monthlyAggregateAccommodation: rec.monthlyAggregateAccommodation || "",
      terminalLiabilityOption: rec.terminalLiabilityOption || "",
      aggregateFactorSingle: rec.aggregateFactorSingle || "",
      aggregateFactorEmployeePlusOne: rec.aggregateFactorEmployeePlusOne || "",
      aggregateFactorEmployeeSpouse: rec.aggregateFactorEmployeeSpouse || "",
      aggregateFactorEmployeeChildren: rec.aggregateFactorEmployeeChildren || "",
      aggregateFactorFamily: rec.aggregateFactorFamily || "",
      aggregateMinAttachmentPoint: rec.aggregateMinAttachmentPoint || "",
      aggregateBenefitsCovered: rec.aggregateBenefitsCovered || "",
      aggregateContract: rec.aggregateContract || "",
      aggregateRunInLimit: rec.aggregateRunInLimit || "",

      stopLossNotes: rec.stopLossNotes || "",

      organTransplantPolicy: rec.organTransplantPolicy || "",

      compositeAdminFee: rec.compositeAdminFee || "",
      medicalFee: rec.medicalFee || "",
      urFee: rec.urFee || "",
      amwellFee: rec.amwellFee || "",
      physiciansCareHapFee: rec.physiciansCareHapFee || "",
      wrapNetwork: rec.wrapNetwork || "",
      aetnaSignatureAdminFee: rec.aetnaSignatureAdminFee || "",
      networkAccessFee: rec.networkAccessFee || "",
      reinsuranceFee: rec.reinsuranceFee || "",
      lcmSpaFee: rec.lcmSpaFee || "",
      agentFee: rec.agentFee || "",
      ppoFee: rec.ppoFee || "",

      pbmRx: rec.pbmRx || "",
      rxIncludedInAsrReporting: rec.rxIncludedInAsrReporting || "",
      isRxAsrContract: rec.isRxAsrContract || "",
      pbmAgentCompensation: rec.pbmAgentCompensation || "",

      stopLossCommission: rec.stopLossCommission || "",
      stopLossOtherCompensation: rec.stopLossOtherCompensation || "",
      commissionAgentCompensation: rec.commissionAgentCompensation || "",

      figuresSingle: rec.figuresSingle || "",
      figuresEmployeePlusOne: rec.figuresEmployeePlusOne || "",
      figuresEmployeeSpouse: rec.figuresEmployeeSpouse || "",
      figuresEmployeeChildren: rec.figuresEmployeeChildren || "",
      figuresFamily: rec.figuresFamily || "",
      figuresTotal: rec.figuresTotal || "",

      domesticClaims: rec.domesticClaims || "",
      notes: rec.notes || "",
    });
  }, [activeBAndE, activeYear, isInlineEditing]);

  // Unified Tier Structure Change across Census, Specific Rates, and Aggregate Factors
  const handleTierStructureChange = (newTier: TierStructure) => {
    setEditFormData((prev) => {
      const newTotal = calculateCensusTotal(newTier, {
        single: prev.figuresSingle,
        eePlusOne: prev.figuresEmployeePlusOne,
        eeSpouse: prev.figuresEmployeeSpouse,
        eeChildren: prev.figuresEmployeeChildren,
        family: prev.figuresFamily,
      });
      return {
        ...prev,
        specificTierStructure: newTier,
        figuresTotal: String(newTotal),
      };
    });
  };

  // Handle Copy from Prior Year into inline edit form
  const handleCopyFromPriorYear = (sourceYear: string) => {
    const sourceRecord = sortedEnrollments.find((e) => e.planYear === sourceYear);
    if (!sourceRecord) return;

    setEditFormData((prev) => ({
      ...prev,
      currentStopLossCarrier: sourceRecord.currentStopLossCarrier || "",
      currentManagingGeneralUnderwriter: sourceRecord.currentManagingGeneralUnderwriter || "",
      priorStopLossCarrier: sourceRecord.priorStopLossCarrier || "",
      priorManagingGeneralUnderwriter: sourceRecord.priorManagingGeneralUnderwriter || "",

      specificStopLossStatus: sourceRecord.specificStopLossStatus || (sourceRecord.specificContract?.trim().toLowerCase() === "none" ? "None" : "Included"),
      specificDeductible: sourceRecord.specificDeductible || "",
      aggregatingSpecificDeductible: sourceRecord.aggregatingSpecificDeductible || "",
      noLaserRenewalGuarantee: sourceRecord.noLaserRenewalGuarantee || "",
      maxSpecificPremiumRenewalIncrease: sourceRecord.maxSpecificPremiumRenewalIncrease || "",
      laseredIndividuals: sourceRecord.laseredIndividuals || "",
      specificTierStructure: sourceRecord.specificTierStructure || "",
      specificPremiumSingle: sourceRecord.specificPremiumSingle || "",
      specificPremiumEmployeePlusOne: sourceRecord.specificPremiumEmployeePlusOne || "",
      specificPremiumEmployeeSpouse: sourceRecord.specificPremiumEmployeeSpouse || "",
      specificPremiumEmployeeChildren: sourceRecord.specificPremiumEmployeeChildren || "",
      specificPremiumFamily: sourceRecord.specificPremiumFamily || "",
      specificBenefitsCovered: sourceRecord.specificBenefitsCovered || "",
      specificContract: sourceRecord.specificContract || "",

      aggregatePremium: sourceRecord.aggregatePremium || "",
      monthlyAggregateAccommodation: sourceRecord.monthlyAggregateAccommodation || "",
      aggregateFactorSingle: sourceRecord.aggregateFactorSingle || "",
      aggregateFactorEmployeePlusOne: sourceRecord.aggregateFactorEmployeePlusOne || "",
      aggregateFactorEmployeeSpouse: sourceRecord.aggregateFactorEmployeeSpouse || "",
      aggregateFactorEmployeeChildren: sourceRecord.aggregateFactorEmployeeChildren || "",
      aggregateFactorFamily: sourceRecord.aggregateFactorFamily || "",
      aggregateMinAttachmentPoint: sourceRecord.aggregateMinAttachmentPoint || "",
      aggregateBenefitsCovered: sourceRecord.aggregateBenefitsCovered || "",
      aggregateContract: sourceRecord.aggregateContract || "",
      aggregateRunInLimit: sourceRecord.aggregateRunInLimit || "",

      stopLossNotes: sourceRecord.stopLossNotes || "",

      organTransplantPolicy: sourceRecord.organTransplantPolicy || "",

      compositeAdminFee: sourceRecord.compositeAdminFee || "",
      medicalFee: sourceRecord.medicalFee || "",
      urFee: sourceRecord.urFee || "",
      amwellFee: sourceRecord.amwellFee || "",
      physiciansCareHapFee: sourceRecord.physiciansCareHapFee || "",
      wrapNetwork: sourceRecord.wrapNetwork || "",
      aetnaSignatureAdminFee: sourceRecord.aetnaSignatureAdminFee || "",
      networkAccessFee: sourceRecord.networkAccessFee || "",
      reinsuranceFee: sourceRecord.reinsuranceFee || "",
      lcmSpaFee: sourceRecord.lcmSpaFee || "",
      agentFee: sourceRecord.agentFee || "",
      ppoFee: sourceRecord.ppoFee || "",

      pbmRx: sourceRecord.pbmRx || "",
      rxIncludedInAsrReporting: sourceRecord.rxIncludedInAsrReporting || "",
      isRxAsrContract: sourceRecord.isRxAsrContract || "",
      pbmAgentCompensation: sourceRecord.pbmAgentCompensation || "",

      stopLossCommission: sourceRecord.stopLossCommission || "",
      stopLossOtherCompensation: sourceRecord.stopLossOtherCompensation || "",
      commissionAgentCompensation: sourceRecord.commissionAgentCompensation || "",

      figuresSingle: sourceRecord.figuresSingle || "",
      figuresEmployeePlusOne: sourceRecord.figuresEmployeePlusOne || "",
      figuresEmployeeSpouse: sourceRecord.figuresEmployeeSpouse || "",
      figuresEmployeeChildren: sourceRecord.figuresEmployeeChildren || "",
      figuresFamily: sourceRecord.figuresFamily || "",
      figuresTotal: sourceRecord.figuresTotal || "",

      domesticClaims: sourceRecord.domesticClaims || "",
      notes: sourceRecord.notes || "",
    }));
  };

  // Handle Save Inline Page Edit
  const handleSaveInline = async () => {
    setSavingInline(true);
    setInlineError("");

    try {
      const { planYear, startDate, endDate, isCurrent, ...restData } = editFormData;
      const payload = {
        id: activeBAndE.id,
        planYear: planYear.trim(),
        startDate: normalizeDate(startDate) || null,
        endDate: normalizeDate(endDate) || null,
        isCurrent,
        ...restData,
      };

      const res = await fetch(`/api/clients/${clientId}/billing-enrollment`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setIsInlineEditing(false);
        onRefresh();
      } else {
        setInlineError(data.error || "Failed to save B&E specifications.");
      }
    } catch (err: any) {
      setInlineError(err.message || "Failed to save specifications.");
    } finally {
      setSavingInline(false);
    }
  };

  // Keyboard Shortcut: Ctrl+S / Cmd+S to save when inline editing is active
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        if (isInlineEditing && !savingInline) {
          e.preventDefault();
          handleSaveInline();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isInlineEditing, savingInline, editFormData, activeBAndE]);

  const showStopLoss = viewTab === "BOTH" || viewTab === "STOP_LOSS";
  const showBilling = viewTab === "BOTH" || viewTab === "BILLING";

  return (
    <div className="glass-panel" style={{ padding: "1.25rem 1.5rem", border: "1px solid rgba(184, 28, 102, 0.35)" }}>
      {/* Header with Title & Action Buttons */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          marginBottom: isExpanded ? "1.25rem" : "0",
          cursor: "pointer",
          flexWrap: "wrap",
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Left: Icon, Title, Description (Standardized with Contacts and Associated Vendors) */}
        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "800", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FileText size={22} style={{ color: "var(--accent-pink)" }} />
            <span>B&E (Billing & Enrollment Summary)</span>
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "0.1rem" }}>
            Complete stop-loss, administrative fees, PBM network, and census specifications for {clientName}.
          </p>
        </div>

        {/* Right Actions: Export, Print, Edit next to Expander */}
        {/* Right Actions: Standardized Section Level Buttons next to Expander */}
        <div
          style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsPrintOpen(true);
            }}
            className="btn btn-secondary btn-sm"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
            title="Open Print & Export dialog (includes Excel & Print options)"
          >
            <Printer size={15} style={{ color: "var(--accent-pink)" }} />
            <span>Print/Export</span>
          </button>

          {/* Edit Button: Switches to In-Page Editing without a modal popup */}
          {!isInlineEditing ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(true);
                setIsInlineEditing(true);
              }}
              className="btn btn-primary btn-sm"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
              title="Edit all fields directly on the page without a popup"
            >
              <Edit3 size={15} />
              <span>Edit ({activeBAndE.planYear || "2026"})</span>
            </button>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }} onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                disabled={savingInline}
                onClick={handleSaveInline}
                className="btn btn-primary btn-sm"
                style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "#10b981", borderColor: "#10b981" }}
              >
                <Save size={15} />
                <span>{savingInline ? "Saving..." : "Save Changes"}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsInlineEditing(false)}
                className="btn btn-secondary btn-sm"
                style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
              >
                <X size={15} />
                <span>Cancel</span>
              </button>
            </div>
          )}

          {/* Expander Button (Top Right Anchor) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="btn btn-secondary btn-sm"
            style={{ padding: "0.4rem 0.6rem", flexShrink: 0 }}
            title={isExpanded ? "Collapse Section" : "Expand Section"}
          >
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      {/* Expanded Content View */}
      {isExpanded && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Plan Year Selector Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "0.75rem",
              padding: "0.75rem 1rem",
              background: "rgba(255, 255, 255, 0.025)",
              border: "1px solid var(--border)",
              borderRadius: "10px",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.8rem", fontWeight: "700", color: "var(--text-muted)", marginRight: "0.25rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <Calendar size={15} style={{ color: "var(--accent-pink)" }} />
                Plan Years:
              </span>

              {sortedEnrollments.map((item) => {
                const isActive = item.planYear === activeYear;
                return (
                  <button
                    key={item.id || item.planYear}
                    type="button"
                    onClick={() => {
                      if (isInlineEditing) {
                        if (confirm("You have unsaved edits. Discard and switch plan year?")) {
                          setIsInlineEditing(false);
                          setSelectedYear(item.planYear);
                        }
                      } else {
                        setSelectedYear(item.planYear);
                      }
                    }}
                    className={`btn btn-sm ${isActive ? "btn-primary" : "btn-secondary"}`}
                    style={{
                      fontSize: "0.8rem",
                      padding: "0.35rem 0.75rem",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      border: isActive ? "1px solid var(--accent-pink)" : undefined,
                    }}
                  >
                    <span>{item.planYear}</span>
                    {item.isCurrent && (
                      <span
                        style={{
                          fontSize: "0.65rem",
                          background: isActive ? "#ffffff" : "rgba(244, 114, 182, 0.2)",
                          color: isActive ? "#b81c66" : "#f472b6",
                          padding: "0.1rem 0.35rem",
                          borderRadius: "4px",
                          fontWeight: "800",
                        }}
                      >
                        Current
                      </span>
                    )}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => {
                  setIsNewYearMode(true);
                }}
                className="btn btn-secondary btn-sm"
                style={{
                  fontSize: "0.8rem",
                  padding: "0.35rem 0.65rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  borderColor: "#38bdf8",
                  color: "#38bdf8",
                }}
                title="Add a new B&E Plan Year for this group"
              >
                <Plus size={14} />
                <span>Add Plan Year</span>
              </button>
            </div>

            {/* Effective Dates Badge / Edit Inputs */}
            {!isInlineEditing ? (
              (activeBAndE.startDate || activeBAndE.endDate) && (
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span style={{ color: "var(--text-muted)" }}>Effective Period:</span>
                  <strong style={{ color: "var(--text-primary)" }}>
                    {formatDisplayDate(activeBAndE.startDate) || "N/A"}
                  </strong>
                  <span>to</span>
                  <strong style={{ color: "var(--text-primary)" }}>
                    {formatDisplayDate(activeBAndE.endDate) || "N/A"}
                  </strong>
                </div>
              )
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem" }}>
                <span style={{ color: "var(--text-muted)" }}>Effective:</span>
                <DateInput
                  className="form-input"
                  style={{ width: "115px", padding: "0.25rem 0.5rem", fontSize: "0.75rem" }}
                  placeholder=""
                  value={editFormData.startDate}
                  onChange={(val) => setEditFormData({ ...editFormData, startDate: val })}
                />
                <span style={{ color: "var(--text-muted)" }}>to</span>
                <DateInput
                  className="form-input"
                  style={{ width: "115px", padding: "0.25rem 0.5rem", fontSize: "0.75rem" }}
                  placeholder=""
                  value={editFormData.endDate}
                  onChange={(val) => setEditFormData({ ...editFormData, endDate: val })}
                />
              </div>
            )}
          </div>

          {/* VIEW TABS BAR: Both Combined | Billing | Stop-Loss */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "0.5rem",
              background: "var(--bg-card-hover, rgba(0, 0, 0, 0.05))",
              padding: "0.4rem 0.6rem",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "var(--text-muted)", marginRight: "0.3rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <SlidersHorizontal size={14} style={{ color: "var(--accent-pink)" }} />
                View:
              </span>

              <button
                type="button"
                onClick={() => setViewTab("BOTH")}
                className={`btn btn-sm ${viewTab === "BOTH" ? "btn-primary" : "btn-secondary"}`}
                style={{
                  fontSize: "0.78rem",
                  padding: "0.28rem 0.75rem",
                  borderRadius: "6px",
                  fontWeight: viewTab === "BOTH" ? "700" : "500",
                }}
              >
                Both Combined
              </button>

              <button
                type="button"
                onClick={() => setViewTab("BILLING")}
                className={`btn btn-sm ${viewTab === "BILLING" ? "btn-primary" : "btn-secondary"}`}
                style={{
                  fontSize: "0.78rem",
                  padding: "0.28rem 0.75rem",
                  borderRadius: "6px",
                  fontWeight: viewTab === "BILLING" ? "700" : "500",
                }}
              >
                Billing Only
              </button>

              <button
                type="button"
                onClick={() => setViewTab("STOP_LOSS")}
                className={`btn btn-sm ${viewTab === "STOP_LOSS" ? "btn-primary" : "btn-secondary"}`}
                style={{
                  fontSize: "0.78rem",
                  padding: "0.28rem 0.75rem",
                  borderRadius: "6px",
                  fontWeight: viewTab === "STOP_LOSS" ? "700" : "500",
                }}
              >
                Stop-Loss Only
              </button>
            </div>

            {/* Editing Mode Banner & Prior Year Copy Quick-Fill */}
            {isInlineEditing && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.75rem", color: "#38bdf8", fontWeight: "600", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <Edit3 size={12} />
                  Editing On-Page
                </span>

                {sortedEnrollments.length > 1 && (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <select
                      className="form-select"
                      style={{ fontSize: "0.75rem", padding: "0.2rem 0.5rem", height: "26px" }}
                      value={copySourceYear}
                      onChange={(e) => setCopySourceYear(e.target.value)}
                    >
                      <option value="">Copy specs from year...</option>
                      {sortedEnrollments
                        .filter((e) => e.planYear !== activeYear)
                        .map((e) => (
                          <option key={e.id} value={e.planYear}>
                            Plan Year {e.planYear}
                          </option>
                        ))}
                    </select>

                    <button
                      type="button"
                      disabled={!copySourceYear}
                      onClick={() => handleCopyFromPriorYear(copySourceYear)}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: "0.7rem", padding: "0.2rem 0.5rem", height: "26px", color: "#38bdf8" }}
                      title="Copy all specs from selected year into current edit form"
                    >
                      <Copy size={12} />
                      <span>Copy</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Inline Edit Error Alert */}
          {inlineError && (
            <div
              style={{
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                background: "rgba(239, 68, 68, 0.15)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                color: "#ef4444",
                fontSize: "0.85rem",
              }}
            >
              {inlineError}
            </div>
          )}

          {/* Top Overview Cards Grid */}
          <div className="grid-cols-2" style={{ gap: "1.25rem" }}>
            {/* Carrier & Managing Underwriter (Shown in BOTH and STOP_LOSS) */}
            {showStopLoss && (
              <div
                className="glass-card"
                style={{
                  padding: "1.25rem",
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid var(--border)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Shield size={18} style={{ color: "var(--accent-pink)" }} />
                    <h3 style={{ fontSize: "1rem", fontWeight: "700" }}>Stop-Loss Carrier & Underwriter</h3>
                  </div>
                  {!isInlineEditing && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsExpanded(true);
                        setIsInlineEditing(true);
                      }}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: "0.72rem", padding: "0.2rem 0.5rem", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
                      title="Edit section"
                    >
                      <Edit3 size={12} />
                      <span>Edit</span>
                    </button>
                  )}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", fontSize: "0.85rem" }}>
                  <div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>Current Carrier</div>
                    {isInlineEditing ? (
                      <VendorTypeahead
                        style={{ marginTop: "0.2rem", fontSize: "0.85rem", padding: "0.3rem 0.5rem" }}
                        value={editFormData.currentStopLossCarrier}
                        onChange={(val) => setEditFormData({ ...editFormData, currentStopLossCarrier: val })}
                        placeholder="e.g. Tokio Marine, Sun Life"
                        allVendors={allVendors}
                        allowedCategories={["Stoploss", "Stoploss MGU"]}
                      />
                    ) : (
                      <div style={{ fontWeight: "700", marginTop: "0.2rem" }}>
                        {activeBAndE.currentStopLossCarrier || "Not specified"}
                      </div>
                    )}
                  </div>

                  <div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>Current MGU</div>
                    {isInlineEditing ? (
                      <VendorTypeahead
                        style={{ marginTop: "0.2rem", fontSize: "0.85rem", padding: "0.3rem 0.5rem" }}
                        value={editFormData.currentManagingGeneralUnderwriter}
                        onChange={(val) => setEditFormData({ ...editFormData, currentManagingGeneralUnderwriter: val })}
                        placeholder="e.g. SLU, Berkley"
                        allVendors={allVendors}
                        allowedCategories={["Stoploss", "Stoploss MGU"]}
                      />
                    ) : (
                      <div style={{ fontWeight: "700", marginTop: "0.2rem" }}>
                        {activeBAndE.currentManagingGeneralUnderwriter || "Not specified"}
                      </div>
                    )}
                  </div>

                  <div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>Prior Carrier</div>
                    {isInlineEditing ? (
                      <VendorTypeahead
                        style={{ marginTop: "0.2rem", fontSize: "0.85rem", padding: "0.3rem 0.5rem" }}
                        value={editFormData.priorStopLossCarrier}
                        onChange={(val) => setEditFormData({ ...editFormData, priorStopLossCarrier: val })}
                        placeholder="Prior carrier name"
                        allVendors={allVendors}
                        allowedCategories={["Stoploss", "Stoploss MGU"]}
                      />
                    ) : (
                      <div style={{ marginTop: "0.2rem" }}>
                        {activeBAndE.priorStopLossCarrier || "—"}
                      </div>
                    )}
                  </div>

                  <div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>Prior MGU</div>
                    {isInlineEditing ? (
                      <VendorTypeahead
                        style={{ marginTop: "0.2rem", fontSize: "0.85rem", padding: "0.3rem 0.5rem" }}
                        value={editFormData.priorManagingGeneralUnderwriter}
                        onChange={(val) => setEditFormData({ ...editFormData, priorManagingGeneralUnderwriter: val })}
                        placeholder="Prior MGU name"
                        allVendors={allVendors}
                        allowedCategories={["Stoploss", "Stoploss MGU"]}
                      />
                    ) : (
                      <div style={{ marginTop: "0.2rem" }}>
                        {activeBAndE.priorManagingGeneralUnderwriter || "—"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Census / Enrollment Figures */}
            <div
              className="glass-card"
              style={{
                padding: "1.25rem",
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid var(--border)",
                gridColumn: showStopLoss ? undefined : "span 2",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Users size={18} style={{ color: "var(--accent-pink)" }} />
                  <h3 style={{ fontSize: "1rem", fontWeight: "700" }}>Enrollment Census / Tier Breakdown</h3>
                </div>
                {!isInlineEditing && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsExpanded(true);
                      setIsInlineEditing(true);
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: "0.72rem", padding: "0.2rem 0.5rem", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
                    title="Edit section"
                  >
                    <Edit3 size={12} />
                    <span>Edit</span>
                  </button>
                )}
              </div>

              <EnrollmentCensusInput
                tierStructure={isInlineEditing ? editFormData.specificTierStructure : activeBAndE.specificTierStructure}
                onTierStructureChange={isInlineEditing ? handleTierStructureChange : undefined}
                single={isInlineEditing ? editFormData.figuresSingle : activeBAndE.figuresSingle}
                onSingleChange={(val) => setEditFormData((prev) => ({ ...prev, figuresSingle: val }))}
                eePlusOne={isInlineEditing ? editFormData.figuresEmployeePlusOne : activeBAndE.figuresEmployeePlusOne}
                onEePlusOneChange={(val) => setEditFormData((prev) => ({ ...prev, figuresEmployeePlusOne: val }))}
                eeSpouse={isInlineEditing ? editFormData.figuresEmployeeSpouse : activeBAndE.figuresEmployeeSpouse}
                onEeSpouseChange={(val) => setEditFormData((prev) => ({ ...prev, figuresEmployeeSpouse: val }))}
                eeChildren={isInlineEditing ? editFormData.figuresEmployeeChildren : activeBAndE.figuresEmployeeChildren}
                onEeChildrenChange={(val) => setEditFormData((prev) => ({ ...prev, figuresEmployeeChildren: val }))}
                family={isInlineEditing ? editFormData.figuresFamily : activeBAndE.figuresFamily}
                onFamilyChange={(val) => setEditFormData((prev) => ({ ...prev, figuresFamily: val }))}
                total={isInlineEditing ? editFormData.figuresTotal : activeBAndE.figuresTotal}
                onTotalChange={(val) => setEditFormData((prev) => ({ ...prev, figuresTotal: val }))}
                isEditing={isInlineEditing}
                compact={true}
              />
            </div>
          </div>

          {/* Specific Stop-Loss & Aggregate Stop-Loss Grid (Shown in BOTH and STOP_LOSS) */}
          {showStopLoss && (
            <>
              <div className="grid-cols-2" style={{ gap: "1.25rem" }}>
                {/* Specific Stop-Loss */}
                <div
                  className="glass-card"
                  style={{
                    padding: "1.25rem",
                    background: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid var(--border)",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <Percent size={18} style={{ color: "var(--accent-blue)" }} />
                      <h3 style={{ fontSize: "1rem", fontWeight: "700" }}>Specific Stop-Loss Specs</h3>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      {isInlineEditing ? (
                        <>
                          {editFormData.specificStopLossStatus !== "None" && (
                            <ContractSelect
                              value={editFormData.specificContract}
                              onChange={(val) => setEditFormData((prev) => ({ ...prev, specificContract: val }))}
                            />
                          )}
                          <IncludedNoneToggle
                            size="sm"
                            colorScheme="blue"
                            value={editFormData.specificStopLossStatus}
                            onChange={(val) => setEditFormData((prev) => ({ ...prev, specificStopLossStatus: val }))}
                          />
                        </>
                      ) : (
                        <>
                          {(activeBAndE.specificStopLossStatus === "None" || activeBAndE.specificContract?.trim().toLowerCase() === "none") ? (
                            <span className="badge" style={{ background: "rgba(148, 163, 184, 0.15)", color: "#64748b", border: "1px solid #cbd5e1", fontSize: "0.7rem" }}>
                              No Spec Coverage
                            </span>
                          ) : (
                            <span className="badge badge-blue" style={{ fontSize: "0.7rem" }}>
                              {activeBAndE.specificContract || "12/12"}
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setIsExpanded(true);
                              setIsInlineEditing(true);
                            }}
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: "0.72rem", padding: "0.2rem 0.5rem", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
                            title="Edit section"
                          >
                            <Edit3 size={12} />
                            <span>Edit</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* If View Mode & Specific is set to None, display notice message */}
                  {!isInlineEditing && (activeBAndE.specificStopLossStatus === "None" || activeBAndE.specificContract?.trim().toLowerCase() === "none") ? (
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "2rem 1rem",
                        background: "rgba(148, 163, 184, 0.05)",
                        borderRadius: "8px",
                        border: "1px dashed var(--border)",
                        textAlign: "center",
                        gap: "0.5rem",
                        margin: "0.5rem 0",
                      }}
                    >
                      <ShieldAlert size={28} style={{ color: "#94a3b8" }} />
                      <div style={{ fontWeight: "700", fontSize: "0.95rem", color: "var(--text-primary)" }}>
                        No Specific Stop-Loss Coverage
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", maxWidth: "280px", lineHeight: "1.4" }}>
                        There is no Specific Stop-Loss coverage included for this plan year specification.
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.85rem", flex: 1 }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", borderBottom: "1px dashed var(--border)", paddingBottom: "0.4rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ color: "var(--text-muted)" }}>Specific Deductible</span>
                          {!isInlineEditing && (
                            <strong style={{ color: "var(--text-primary)" }}>
                              {formatDisplaySpecificDeductible(activeBAndE.specificDeductible)}
                            </strong>
                          )}
                        </div>
                        {isInlineEditing && (
                          <SpecificDeductibleInput
                            value={editFormData.specificDeductible}
                            onChange={(val) => setEditFormData((prev) => ({ ...prev, specificDeductible: val }))}
                            compact={true}
                          />
                        )}
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", borderBottom: "1px dashed var(--border)", paddingBottom: "0.4rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ color: "var(--text-muted)" }}>Aggregating Specific Deductible</span>
                          {!isInlineEditing && (
                            <strong style={{ color: "var(--text-primary)" }}>
                              {formatCurrencyDisplay(activeBAndE.aggregatingSpecificDeductible)}
                            </strong>
                          )}
                        </div>
                        {isInlineEditing && (
                          <AggregatingSpecificInput
                            value={editFormData.aggregatingSpecificDeductible}
                            onChange={(val) => setEditFormData((prev) => ({ ...prev, aggregatingSpecificDeductible: val }))}
                            compact={true}
                          />
                        )}
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px dashed var(--border)", paddingBottom: "0.4rem" }}>
                        <span style={{ color: "var(--text-muted)" }}>No-Laser Renewal Guarantee</span>
                        {isInlineEditing ? (
                          <YesNoToggle
                            value={editFormData.noLaserRenewalGuarantee}
                            onChange={(val) => setEditFormData((prev) => ({ ...prev, noLaserRenewalGuarantee: val }))}
                            size="sm"
                          />
                        ) : (
                          <span>{activeBAndE.noLaserRenewalGuarantee || "No"}</span>
                        )}
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", borderBottom: "1px dashed var(--border)", paddingBottom: "0.4rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ color: "var(--text-muted)" }}>Max Specific Renewal Increase</span>
                          {!isInlineEditing && (
                            <span>{activeBAndE.maxSpecificPremiumRenewalIncrease || "—"}</span>
                          )}
                        </div>
                        {isInlineEditing && (
                          <MaxSpecificRenewalIncreaseInput
                            value={editFormData.maxSpecificPremiumRenewalIncrease}
                            onChange={(val) => setEditFormData((prev) => ({ ...prev, maxSpecificPremiumRenewalIncrease: val }))}
                            compact={true}
                          />
                        )}
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", borderBottom: "1px dashed var(--border)", paddingBottom: "0.4rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ color: "var(--text-muted)" }}>Lasered Individuals</span>
                          {!isInlineEditing && (
                            <span>{parseLaserString(activeBAndE.laseredIndividuals).isYes ? "Yes" : "No"}</span>
                          )}
                        </div>
                        {!isInlineEditing && (
                          <LaseredIndividualsView value={activeBAndE.laseredIndividuals} />
                        )}
                        {isInlineEditing && (
                          <LaseredIndividualsInput
                            value={editFormData.laseredIndividuals}
                            onChange={(val) => setEditFormData((prev) => ({ ...prev, laseredIndividuals: val }))}
                            compact={true}
                          />
                        )}
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", borderBottom: "1px dashed var(--border)", paddingBottom: "0.4rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ color: "var(--text-muted)" }}>Benefits Covered</span>
                          {!isInlineEditing && (
                            <span>{activeBAndE.specificBenefitsCovered || "Med/Rx"}</span>
                          )}
                        </div>
                        {isInlineEditing && (
                          <BenefitsCoveredSelect
                            style={{ width: "160px" }}
                            value={editFormData.specificBenefitsCovered}
                            onChange={(val) => setEditFormData((prev) => ({ ...prev, specificBenefitsCovered: val }))}
                          />
                        )}
                      </div>

                      {/* Specific Rates (Placed at bottom to align with Aggregate Factors) */}
                      <div style={{ marginTop: "auto", background: "rgba(0, 174, 219, 0.05)", padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--border)" }}>
                        <div style={{ fontSize: "0.75rem", fontWeight: "700", color: "var(--accent-blue)", marginBottom: "0.4rem" }}>
                          Specific Premium Rates (PEPM)
                        </div>
                        <SpecificPremiumRatesInput
                          tierStructure={isInlineEditing ? editFormData.specificTierStructure : activeBAndE.specificTierStructure}
                          onTierStructureChange={isInlineEditing ? handleTierStructureChange : undefined}
                          singleRate={isInlineEditing ? editFormData.specificPremiumSingle : activeBAndE.specificPremiumSingle}
                          onSingleRateChange={(val) => setEditFormData((prev) => ({ ...prev, specificPremiumSingle: val }))}
                          eePlusOneRate={isInlineEditing ? editFormData.specificPremiumEmployeePlusOne : activeBAndE.specificPremiumEmployeePlusOne}
                          onEePlusOneRateChange={(val) => setEditFormData((prev) => ({ ...prev, specificPremiumEmployeePlusOne: val }))}
                          eeSpouseRate={isInlineEditing ? editFormData.specificPremiumEmployeeSpouse : activeBAndE.specificPremiumEmployeeSpouse}
                          onEeSpouseRateChange={(val) => setEditFormData((prev) => ({ ...prev, specificPremiumEmployeeSpouse: val }))}
                          eeChildrenRate={isInlineEditing ? editFormData.specificPremiumEmployeeChildren : activeBAndE.specificPremiumEmployeeChildren}
                          onEeChildrenRateChange={(val) => setEditFormData((prev) => ({ ...prev, specificPremiumEmployeeChildren: val }))}
                          familyRate={isInlineEditing ? editFormData.specificPremiumFamily : activeBAndE.specificPremiumFamily}
                          onFamilyRateChange={(val) => setEditFormData((prev) => ({ ...prev, specificPremiumFamily: val }))}
                          isEditing={isInlineEditing}
                          compact={true}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Aggregate Stop-Loss */}
                <div
                  className="glass-card"
                  style={{
                    padding: "1.25rem",
                    background: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid var(--border)",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <Layers size={18} style={{ color: "var(--accent-purple)" }} />
                      <h3 style={{ fontSize: "1rem", fontWeight: "700" }}>Aggregate Stop-Loss Specs</h3>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      {isInlineEditing ? (
                        <>
                          {editFormData.aggregateStopLossStatus !== "None" && (
                            <ContractSelect
                              value={editFormData.aggregateContract}
                              onChange={(val) => setEditFormData({ ...editFormData, aggregateContract: val })}
                            />
                          )}
                          <IncludedNoneToggle
                            size="sm"
                            value={editFormData.aggregateStopLossStatus}
                            onChange={(val) => setEditFormData({ ...editFormData, aggregateStopLossStatus: val })}
                          />
                        </>
                      ) : (
                        <>
                          {(activeBAndE.aggregateStopLossStatus === "None" || activeBAndE.aggregatePremium?.trim().toLowerCase() === "none") ? (
                            <span className="badge" style={{ background: "rgba(148, 163, 184, 0.15)", color: "#64748b", border: "1px solid #cbd5e1", fontSize: "0.7rem" }}>
                              No Agg Coverage
                            </span>
                          ) : (
                            <span className="badge badge-purple" style={{ fontSize: "0.7rem" }}>
                              {activeBAndE.aggregateContract || "12/12"}
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setIsExpanded(true);
                              setIsInlineEditing(true);
                            }}
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: "0.72rem", padding: "0.2rem 0.5rem", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
                            title="Edit section"
                          >
                            <Edit3 size={12} />
                            <span>Edit</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* If View Mode & Aggregate is set to None, display notice message */}
                  {!isInlineEditing && (activeBAndE.aggregateStopLossStatus === "None" || activeBAndE.aggregatePremium?.trim().toLowerCase() === "none") ? (
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "2rem 1rem",
                        background: "rgba(148, 163, 184, 0.05)",
                        borderRadius: "8px",
                        border: "1px dashed var(--border)",
                        textAlign: "center",
                        gap: "0.5rem",
                        margin: "0.5rem 0",
                      }}
                    >
                      <ShieldAlert size={28} style={{ color: "#94a3b8" }} />
                      <div style={{ fontWeight: "700", fontSize: "0.95rem", color: "var(--text-primary)" }}>
                        No Aggregate Stop-Loss Coverage
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", maxWidth: "280px", lineHeight: "1.4" }}>
                        There is no Aggregate Stop-Loss coverage included for this plan year specification.
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.85rem", flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px dashed var(--border)", paddingBottom: "0.4rem" }}>
                        <span style={{ color: "var(--text-muted)" }}>Aggregate Premium</span>
                        {isInlineEditing ? (
                          <CurrencyInput
                            style={{ width: "160px" }}
                            value={editFormData.aggregatePremium}
                            onChange={(val) => setEditFormData({ ...editFormData, aggregatePremium: val })}
                            placeholder="0.00"
                          />
                        ) : (
                          <strong style={{ color: "var(--text-primary)" }}>{activeBAndE.aggregatePremium || "—"}</strong>
                        )}
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", borderBottom: "1px dashed var(--border)", paddingBottom: "0.4rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <span style={{ color: "var(--text-muted)" }}>Monthly Accommodation</span>
                          {!isInlineEditing && (() => {
                            const parsed = parseMonthlyAccommodationDisplay(activeBAndE.monthlyAggregateAccommodation);
                            if (parsed.isNo || !parsed.amountDisplay) {
                              return <strong style={{ color: "var(--text-primary)" }}>No</strong>;
                            }
                            return (
                              <div style={{ textAlign: "right" }}>
                                <strong style={{ color: "var(--text-primary)", fontWeight: "800", fontSize: "0.85rem" }}>
                                  {parsed.amountDisplay}
                                </strong>
                                {parsed.noteText && (
                                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontStyle: "italic", marginTop: "0.15rem" }}>
                                    {parsed.noteText}
                                  </div>
                                )}
                              </div>
                            );
                          })()}
                        </div>
                        {isInlineEditing && (
                          <MonthlyAccommodationInput
                            value={editFormData.monthlyAggregateAccommodation}
                            onChange={(val) => setEditFormData({ ...editFormData, monthlyAggregateAccommodation: val })}
                            compact={true}
                          />
                        )}
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", borderBottom: "1px dashed var(--border)", paddingBottom: "0.4rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ color: "var(--text-muted)" }}>Terminal Liability Option (TLO)</span>
                          {!isInlineEditing && (
                            <span style={{ fontWeight: activeBAndE.terminalLiabilityOption?.toLowerCase().includes("separately") ? 600 : 400 }}>
                              {formatTloDisplay(activeBAndE.terminalLiabilityOption)}
                            </span>
                          )}
                        </div>
                        {isInlineEditing && (
                          <TerminalLiabilityInput
                            value={editFormData.terminalLiabilityOption}
                            onChange={(val) => setEditFormData({ ...editFormData, terminalLiabilityOption: val })}
                            compact={true}
                          />
                        )}
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px dashed var(--border)", paddingBottom: "0.4rem" }}>
                        <span style={{ color: "var(--text-muted)" }}>Min Attachment Point</span>
                        {isInlineEditing ? (
                          <CurrencyInput
                            style={{ width: "160px" }}
                            value={editFormData.aggregateMinAttachmentPoint}
                            onChange={(val) => setEditFormData({ ...editFormData, aggregateMinAttachmentPoint: val })}
                            placeholder="0.00"
                          />
                        ) : (
                          <strong style={{ color: "#c084fc" }}>{activeBAndE.aggregateMinAttachmentPoint || "—"}</strong>
                        )}
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", borderBottom: "1px dashed var(--border)", paddingBottom: "0.4rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ color: "var(--text-muted)" }}>Run-in Limit</span>
                          {!isInlineEditing && (
                            <span>{formatRunInLimitDisplay(activeBAndE.aggregateRunInLimit)}</span>
                          )}
                        </div>
                        {isInlineEditing && (
                          <AggregateRunInLimitInput
                            value={editFormData.aggregateRunInLimit}
                            onChange={(val) => setEditFormData({ ...editFormData, aggregateRunInLimit: val })}
                            compact={true}
                          />
                        )}
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", borderBottom: "1px dashed var(--border)", paddingBottom: "0.4rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ color: "var(--text-muted)" }}>Benefits Covered</span>
                          {!isInlineEditing && (
                            <span>{activeBAndE.aggregateBenefitsCovered || "Med/Rx"}</span>
                          )}
                        </div>
                        {isInlineEditing && (
                          <BenefitsCoveredSelect
                            style={{ width: "160px" }}
                            value={editFormData.aggregateBenefitsCovered}
                            onChange={(val) => setEditFormData({ ...editFormData, aggregateBenefitsCovered: val })}
                          />
                        )}
                      </div>

                      {/* Aggregate Factors (Placed at bottom to align with Specific Premium Rates) */}
                      <div style={{ marginTop: "auto", background: "rgba(192, 132, 252, 0.05)", padding: "0.75rem", borderRadius: "8px", border: "1px solid rgba(192, 132, 252, 0.2)" }}>
                        <div style={{ fontSize: "0.75rem", fontWeight: "700", color: "#c084fc", marginBottom: "0.4rem" }}>
                          Aggregate Factors (PEPM)
                        </div>
                        <AggregateFactorsInput
                          tierStructure={isInlineEditing ? editFormData.specificTierStructure : activeBAndE.specificTierStructure}
                          onTierStructureChange={isInlineEditing ? handleTierStructureChange : undefined}
                          singleFactor={isInlineEditing ? editFormData.aggregateFactorSingle : activeBAndE.aggregateFactorSingle}
                          onSingleFactorChange={(val) => setEditFormData((prev) => ({ ...prev, aggregateFactorSingle: val }))}
                          eePlusOneFactor={isInlineEditing ? editFormData.aggregateFactorEmployeePlusOne : activeBAndE.aggregateFactorEmployeePlusOne}
                          onEePlusOneFactorChange={(val) => setEditFormData((prev) => ({ ...prev, aggregateFactorEmployeePlusOne: val }))}
                          eeSpouseFactor={isInlineEditing ? editFormData.aggregateFactorEmployeeSpouse : activeBAndE.aggregateFactorEmployeeSpouse}
                          onEeSpouseFactorChange={(val) => setEditFormData((prev) => ({ ...prev, aggregateFactorEmployeeSpouse: val }))}
                          eeChildrenFactor={isInlineEditing ? editFormData.aggregateFactorEmployeeChildren : activeBAndE.aggregateFactorEmployeeChildren}
                          onEeChildrenFactorChange={(val) => setEditFormData((prev) => ({ ...prev, aggregateFactorEmployeeChildren: val }))}
                          familyFactor={isInlineEditing ? editFormData.aggregateFactorFamily : activeBAndE.aggregateFactorFamily}
                          onFamilyFactorChange={(val) => setEditFormData((prev) => ({ ...prev, aggregateFactorFamily: val }))}
                          isEditing={isInlineEditing}
                          compact={true}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* DEDICATED STOP-LOSS NOTES SECTION (Directly Below Aggregate and Specific Sections) */}
              <div
                className="glass-card"
                style={{
                  padding: "1.25rem",
                  background: "rgba(192, 132, 252, 0.04)",
                  border: "1px solid rgba(192, 132, 252, 0.3)",
                  borderRadius: "10px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <ShieldAlert size={18} style={{ color: "#c084fc" }} />
                    <h3 style={{ fontSize: "0.95rem", fontWeight: "700", color: "#c084fc" }}>
                      Stop-Loss Notes & Contract Specifications ({activeBAndE.planYear || "2026"})
                    </h3>
                  </div>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                    Specific & Aggregate Terms, Lasers, Guarantees
                  </span>
                </div>

                {isInlineEditing ? (
                  <div>
                    <textarea
                      rows={4}
                      className="form-textarea"
                      style={{ fontSize: "0.85rem" }}
                      placeholder="Enter stop-loss notes, laser details, specific deductible guarantees, carrier binding clauses..."
                      value={editFormData.stopLossNotes}
                      onChange={(e) => setEditFormData({ ...editFormData, stopLossNotes: e.target.value })}
                    />
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem", display: "block" }}>
                      Supports multi-line text and operational contract notes for Stop-Loss coverage.
                    </span>
                  </div>
                ) : activeBAndE.stopLossNotes ? (
                  <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: "1.5" }}>
                    <MarkdownNoteRenderer content={activeBAndE.stopLossNotes} />
                  </div>
                ) : (
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                    No specific stop-loss notes recorded for Plan Year {activeBAndE.planYear || "2026"}. Click <strong>Edit Plan Year</strong> above to add stop-loss terms or laser agreements.
                  </div>
                )}
              </div>
            </>
          )}

          {/* Associated Vendors & Group Fees (Shown in BOTH and BILLING - Placed Above Composite Administration) */}
          {showBilling && (
            <BEAssociatedVendorsTable
              clientId={clientId}
              clientName={clientName}
              vendors={vendors}
              allVendors={allVendors}
              onRefresh={onRefresh}
            />
          )}

          {/* Administration Fees, PPO Network & Additional Specs Grid Layout */}
          {showBilling ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.1fr 1fr",
                gap: "1.25rem",
                alignItems: "stretch",
              }}
            >
              {/* Composite Administration & PPO Network Information (Stacked Single Column for Billing Portal Entry) */}
              <div
                className="glass-card"
                style={{
                  padding: "1rem 1.15rem",
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.85rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Network size={18} style={{ color: "var(--accent-yellow)" }} />
                    <h3 style={{ fontSize: "1rem", fontWeight: "700" }}>
                      Composite Administration & PPO Network Information
                    </h3>
                  </div>
                  {!isInlineEditing && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsExpanded(true);
                        setIsInlineEditing(true);
                      }}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: "0.72rem", padding: "0.2rem 0.5rem", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
                      title="Edit section"
                    >
                      <Edit3 size={12} />
                      <span>Edit</span>
                    </button>
                  )}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.85rem", flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px dashed var(--border)", paddingBottom: "0.4rem" }}>
                    <span style={{ color: "var(--text-muted)" }}>Composite Admin Fee</span>
                    {isInlineEditing ? (
                      <CurrencyInput
                        style={{ width: "160px" }}
                        value={editFormData.compositeAdminFee}
                        onChange={(val) => setEditFormData({ ...editFormData, compositeAdminFee: val })}
                        placeholder="0.00"
                        suffix="PEPM"
                      />
                    ) : (
                      <strong style={{ color: "#ffc20e" }}>{activeBAndE.compositeAdminFee || "—"}</strong>
                    )}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px dashed var(--border)", paddingBottom: "0.4rem" }}>
                    <span style={{ color: "var(--text-muted)" }}>Medical Administration</span>
                    {isInlineEditing ? (
                      <CurrencyInput
                        style={{ width: "160px" }}
                        value={editFormData.medicalFee}
                        onChange={(val) => setEditFormData({ ...editFormData, medicalFee: val })}
                        placeholder="0.00"
                        suffix="PEPM"
                      />
                    ) : (
                      <span>{activeBAndE.medicalFee || "—"}</span>
                    )}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px dashed var(--border)", paddingBottom: "0.4rem" }}>
                    <span style={{ color: "var(--text-muted)" }}>UR (Utilization Review)</span>
                    {isInlineEditing ? (
                      <CurrencyInput
                        style={{ width: "160px" }}
                        value={editFormData.urFee}
                        onChange={(val) => setEditFormData({ ...editFormData, urFee: val })}
                        placeholder="0.00"
                        suffix="PEPM"
                      />
                    ) : (
                      <span>{activeBAndE.urFee || "—"}</span>
                    )}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px dashed var(--border)", paddingBottom: "0.4rem" }}>
                    <span style={{ color: "var(--text-muted)" }}>Amwell Telehealth</span>
                    {isInlineEditing ? (
                      <CurrencyInput
                        style={{ width: "160px" }}
                        value={editFormData.amwellFee}
                        onChange={(val) => setEditFormData({ ...editFormData, amwellFee: val })}
                        placeholder="0.00"
                        suffix="PEPM"
                      />
                    ) : (
                      <span>{activeBAndE.amwellFee || "—"}</span>
                    )}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px dashed var(--border)", paddingBottom: "0.4rem" }}>
                    <span style={{ color: "var(--text-muted)" }}>Physicians Care / HAP</span>
                    {isInlineEditing ? (
                      <CurrencyInput
                        style={{ width: "160px" }}
                        value={editFormData.physiciansCareHapFee}
                        onChange={(val) => setEditFormData({ ...editFormData, physiciansCareHapFee: val })}
                        placeholder="0.00"
                        suffix="PEPM"
                      />
                    ) : (
                      <span>{activeBAndE.physiciansCareHapFee || "—"}</span>
                    )}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px dashed var(--border)", paddingBottom: "0.4rem" }}>
                    <span style={{ color: "var(--text-muted)" }}>Aetna Signature Admin</span>
                    {isInlineEditing ? (
                      <CurrencyInput
                        style={{ width: "160px" }}
                        value={editFormData.aetnaSignatureAdminFee}
                        onChange={(val) => setEditFormData({ ...editFormData, aetnaSignatureAdminFee: val })}
                        placeholder="0.00"
                        suffix="PEPM"
                      />
                    ) : (
                      <span>{activeBAndE.aetnaSignatureAdminFee || "—"}</span>
                    )}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px dashed var(--border)", paddingBottom: "0.4rem" }}>
                    <span style={{ color: "var(--text-muted)" }}>Network Access Fee</span>
                    {isInlineEditing ? (
                      <CurrencyInput
                        style={{ width: "160px" }}
                        value={editFormData.networkAccessFee}
                        onChange={(val) => setEditFormData({ ...editFormData, networkAccessFee: val })}
                        placeholder="0.00"
                        suffix="PEPM"
                      />
                    ) : (
                      <span>{activeBAndE.networkAccessFee || "—"}</span>
                    )}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px dashed var(--border)", paddingBottom: "0.4rem" }}>
                    <span style={{ color: "var(--text-muted)" }}>Reinsurance Fee</span>
                    {isInlineEditing ? (
                      <CurrencyInput
                        style={{ width: "160px" }}
                        value={editFormData.reinsuranceFee}
                        onChange={(val) => setEditFormData({ ...editFormData, reinsuranceFee: val })}
                        placeholder="0.00"
                        suffix="PEPM"
                      />
                    ) : (
                      <span>{activeBAndE.reinsuranceFee || "—"}</span>
                    )}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px dashed var(--border)", paddingBottom: "0.4rem" }}>
                    <span style={{ color: "var(--text-muted)" }}>LCM / SPA (AHH)</span>
                    {isInlineEditing ? (
                      <CurrencyInput
                        style={{ width: "160px" }}
                        value={editFormData.lcmSpaFee}
                        onChange={(val) => setEditFormData({ ...editFormData, lcmSpaFee: val })}
                        placeholder="0.00"
                        suffix="hr"
                      />
                    ) : (
                      <span>{activeBAndE.lcmSpaFee || "—"}</span>
                    )}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px dashed var(--border)", paddingBottom: "0.4rem" }}>
                    <span style={{ color: "var(--text-muted)" }}>Agent Fee</span>
                    {isInlineEditing ? (
                      <CurrencyInput
                        style={{ width: "160px" }}
                        value={editFormData.agentFee}
                        onChange={(val) => setEditFormData({ ...editFormData, agentFee: val })}
                        placeholder="0.00"
                        suffix="PEPM"
                      />
                    ) : (
                      <span>{activeBAndE.agentFee || "—"}</span>
                    )}
                  </div>

                  <div style={{ borderBottom: "1px dashed var(--border)", paddingBottom: "0.4rem" }}>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>Wrap Networks</div>
                    {isInlineEditing ? (
                      <input
                        type="text"
                        className="form-input"
                        style={{ width: "100%", marginTop: "0.2rem", padding: "0.25rem 0.5rem", fontSize: "0.8rem" }}
                        value={editFormData.wrapNetwork}
                        onChange={(e) => setEditFormData({ ...editFormData, wrapNetwork: e.target.value })}
                        placeholder="e.g. MultiPlan, PHCS"
                      />
                    ) : (
                      <div style={{ fontWeight: "600", color: "var(--text-primary)", marginTop: "0.15rem" }}>
                        {activeBAndE.wrapNetwork || "—"}
                      </div>
                    )}
                  </div>

                  <div style={{ paddingBottom: "0.4rem" }}>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>PPO Fee Notes</div>
                    {isInlineEditing ? (
                      <input
                        type="text"
                        className="form-input"
                        style={{ width: "100%", marginTop: "0.2rem", padding: "0.25rem 0.5rem", fontSize: "0.8rem" }}
                        value={editFormData.ppoFee}
                        onChange={(e) => setEditFormData({ ...editFormData, ppoFee: e.target.value })}
                        placeholder="PPO network discount details..."
                      />
                    ) : (
                      <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.15rem", lineHeight: "1.4" }}>
                        {activeBAndE.ppoFee || "—"}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Side Column Container for PBM, Commission, Transplant & Domestic */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", height: "100%" }}>
                {/* PBM Specs */}
                <div
                  className="glass-card"
                  style={{
                    padding: "1.25rem",
                    background: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid var(--border)",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <Pill size={18} style={{ color: "#34d399" }} />
                      <h3 style={{ fontSize: "0.95rem", fontWeight: "700" }}>PBM Information</h3>
                    </div>
                    {!isInlineEditing && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsExpanded(true);
                          setIsInlineEditing(true);
                        }}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: "0.72rem", padding: "0.2rem 0.5rem", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
                        title="Edit section"
                      >
                        <Edit3 size={12} />
                        <span>Edit</span>
                      </button>
                    )}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.85rem", flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "var(--text-muted)" }}>PBM Provider</span>
                      {isInlineEditing ? (
                        <input
                          type="text"
                          className="form-input"
                          style={{ width: "120px", padding: "0.2rem 0.4rem", fontSize: "0.75rem", textAlign: "right" }}
                          value={editFormData.pbmRx}
                          onChange={(e) => setEditFormData({ ...editFormData, pbmRx: e.target.value })}
                          placeholder="Express Scripts"
                        />
                      ) : (
                        <strong style={{ color: "#34d399" }}>{activeBAndE.pbmRx || "—"}</strong>
                      )}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "var(--text-muted)" }}>Rx in ASR Reporting?</span>
                      {isInlineEditing ? (
                        <YesNoToggle
                          value={editFormData.rxIncludedInAsrReporting}
                          onChange={(val) => setEditFormData({ ...editFormData, rxIncludedInAsrReporting: val })}
                        />
                      ) : (
                        <span>{activeBAndE.rxIncludedInAsrReporting || "No"}</span>
                      )}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "var(--text-muted)" }}>Rx ASR Contract?</span>
                      {isInlineEditing ? (
                        <YesNoToggle
                          value={editFormData.isRxAsrContract}
                          onChange={(val) => setEditFormData({ ...editFormData, isRxAsrContract: val })}
                        />
                      ) : (
                        <span>{activeBAndE.isRxAsrContract || "No"}</span>
                      )}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "var(--text-muted)" }}>Agent Comp</span>
                      {isInlineEditing ? (
                        <YesNoToggle
                          value={editFormData.pbmAgentCompensation}
                          onChange={(val) => setEditFormData({ ...editFormData, pbmAgentCompensation: val })}
                        />
                      ) : (
                        <span>{activeBAndE.pbmAgentCompensation || "No"}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Commissions */}
                <div
                  className="glass-card"
                  style={{
                    padding: "1.25rem",
                    background: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid var(--border)",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <DollarSign size={18} style={{ color: "#f472b6" }} />
                      <h3 style={{ fontSize: "0.95rem", fontWeight: "700" }}>Commission Info</h3>
                    </div>
                    {!isInlineEditing && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsExpanded(true);
                          setIsInlineEditing(true);
                        }}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: "0.72rem", padding: "0.2rem 0.5rem", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
                        title="Edit section"
                      >
                        <Edit3 size={12} />
                        <span>Edit</span>
                      </button>
                    )}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.85rem", flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "var(--text-muted)" }}>Stop-Loss Commission</span>
                      {isInlineEditing ? (
                        <PercentInput
                          style={{ width: "110px", fontSize: "0.75rem", padding: "0.2rem 0.4rem" }}
                          value={editFormData.stopLossCommission}
                          onChange={(val) => setEditFormData({ ...editFormData, stopLossCommission: val })}
                          placeholder="10"
                        />
                      ) : (
                        <span>{activeBAndE.stopLossCommission || "0%"}</span>
                      )}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "var(--text-muted)" }}>Stop-Loss Other Comp</span>
                      {isInlineEditing ? (
                        <PercentInput
                          style={{ width: "110px", fontSize: "0.75rem", padding: "0.2rem 0.4rem" }}
                          value={editFormData.stopLossOtherCompensation}
                          onChange={(val) => setEditFormData({ ...editFormData, stopLossOtherCompensation: val })}
                          placeholder="3"
                        />
                      ) : (
                        <span>{activeBAndE.stopLossOtherCompensation || "—"}</span>
                      )}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "var(--text-muted)" }}>Agent Compensation</span>
                      {isInlineEditing ? (
                        <YesNoToggle
                          value={editFormData.commissionAgentCompensation}
                          onChange={(val) => setEditFormData({ ...editFormData, commissionAgentCompensation: val })}
                        />
                      ) : (
                        <span>{activeBAndE.commissionAgentCompensation || "No"}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Organ Transplant & Domestic Claims */}
                {showStopLoss && (
                  <div
                    className="glass-card"
                    style={{
                      padding: "1.25rem",
                      background: "rgba(255, 255, 255, 0.02)",
                      border: "1px solid var(--border)",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <HeartHandshake size={18} style={{ color: "#60a5fa" }} />
                        <h3 style={{ fontSize: "0.95rem", fontWeight: "700" }}>Transplant & Domestic</h3>
                      </div>
                      {!isInlineEditing && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsExpanded(true);
                            setIsInlineEditing(true);
                          }}
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: "0.72rem", padding: "0.2rem 0.5rem", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
                          title="Edit section"
                        >
                          <Edit3 size={12} />
                          <span>Edit</span>
                        </button>
                      )}
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.85rem", flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ color: "var(--text-muted)" }}>Transplant Policy</span>
                        {isInlineEditing ? (
                          <YesNoToggle
                            value={editFormData.organTransplantPolicy}
                            onChange={(val) => setEditFormData({ ...editFormData, organTransplantPolicy: val })}
                          />
                        ) : (
                          <span>{activeBAndE.organTransplantPolicy || "No"}</span>
                        )}
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ color: "var(--text-muted)" }}>Domestic Claims?</span>
                        {isInlineEditing ? (
                          <YesNoToggle
                            value={editFormData.domesticClaims}
                            onChange={(val) => setEditFormData({ ...editFormData, domesticClaims: val })}
                          />
                        ) : (
                          <span>{activeBAndE.domesticClaims || "No"}</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Organ Transplant & Domestic Claims (Shown when ONLY STOP_LOSS is enabled) */
            showStopLoss && (
              <div
                className="glass-card"
                style={{
                  padding: "1.25rem",
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <HeartHandshake size={18} style={{ color: "#60a5fa" }} />
                    <h3 style={{ fontSize: "0.95rem", fontWeight: "700" }}>Transplant & Domestic</h3>
                  </div>
                  {!isInlineEditing && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsExpanded(true);
                        setIsInlineEditing(true);
                      }}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: "0.72rem", padding: "0.2rem 0.5rem", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
                      title="Edit section"
                    >
                      <Edit3 size={12} />
                      <span>Edit</span>
                    </button>
                  )}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.85rem", flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "var(--text-muted)" }}>Transplant Policy</span>
                    {isInlineEditing ? (
                      <YesNoToggle
                        value={editFormData.organTransplantPolicy}
                        onChange={(val) => setEditFormData({ ...editFormData, organTransplantPolicy: val })}
                      />
                    ) : (
                      <span>{activeBAndE.organTransplantPolicy || "No"}</span>
                    )}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "var(--text-muted)" }}>Domestic Claims?</span>
                    {isInlineEditing ? (
                      <YesNoToggle
                        value={editFormData.domesticClaims}
                        onChange={(val) => setEditFormData({ ...editFormData, domesticClaims: val })}
                      />
                    ) : (
                      <span>{activeBAndE.domesticClaims || "No"}</span>
                    )}
                  </div>
                </div>
              </div>
            )
          )}

          {/* General Operational Notes (Shown in BOTH and BILLING) */}
          {showBilling && (
            (activeBAndE.notes || isInlineEditing) && (
              <div
                className="glass-card"
                style={{
                  padding: "1rem 1.25rem",
                  background: "rgba(255, 194, 14, 0.04)",
                  border: "1px solid rgba(255, 194, 14, 0.25)",
                  borderRadius: "8px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                  <div style={{ fontSize: "0.8rem", fontWeight: "700", color: "#ffc20e", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <AlertCircle size={15} />
                    <span>B&E Specification Notes ({activeBAndE.planYear || "2026"})</span>
                  </div>
                  {!isInlineEditing && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsExpanded(true);
                        setIsInlineEditing(true);
                      }}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: "0.72rem", padding: "0.2rem 0.5rem", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
                      title="Edit section"
                    >
                      <Edit3 size={12} />
                      <span>Edit</span>
                    </button>
                  )}
                </div>

                {isInlineEditing ? (
                  <textarea
                    rows={3}
                    className="form-textarea"
                    placeholder="Enter general B&E operational notes, special terms, fee guarantees..."
                    value={editFormData.notes}
                    onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                  />
                ) : (
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", whiteSpace: "pre-wrap" }}>
                    {activeBAndE.notes}
                  </p>
                )}
              </div>
            )
          )}

          {/* B&E Section Footer Bar (Allows Edit / Save / Print directly from bottom of section) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0.85rem 1.25rem",
              background: "rgba(255, 255, 255, 0.025)",
              border: "1px solid var(--border)",
              borderRadius: "10px",
              marginTop: "0.75rem",
              flexWrap: "wrap",
              gap: "0.75rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Calendar size={16} style={{ color: "var(--accent-pink)" }} />
              <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-primary)" }}>
                {isInlineEditing
                  ? `Editing Plan Year ${activeBAndE.planYear || "2026"} Specifications`
                  : `Plan Year ${activeBAndE.planYear || "2026"} Specifications`}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              {!isInlineEditing ? (
                <>
                  <button
                    type="button"
                    onClick={() => setIsPrintOpen(true)}
                    className="btn btn-secondary btn-sm"
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
                  >
                    <Printer size={14} style={{ color: "var(--accent-pink)" }} />
                    <span>Print/Export</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsExpanded(true);
                      setIsInlineEditing(true);
                    }}
                    className="btn btn-primary btn-sm"
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
                  >
                    <Edit3 size={14} />
                    <span>Edit ({activeBAndE.planYear || "2026"})</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setIsInlineEditing(false)}
                    className="btn btn-secondary btn-sm"
                  >
                    <X size={14} />
                    <span>Cancel</span>
                  </button>

                  <button
                    type="button"
                    disabled={savingInline}
                    onClick={handleSaveInline}
                    className="btn btn-primary btn-sm"
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "#10b981", borderColor: "#10b981" }}
                  >
                    <Save size={14} />
                    <span>{savingInline ? "Saving Changes..." : "Save Changes"}</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Fixed Floating Save Action Bar (Follows viewport during active editing) */}
      {isInlineEditing && (
        <div
          style={{
            position: "fixed",
            bottom: "1.5rem",
            right: "2rem",
            display: "flex",
            alignItems: "center",
            gap: "0.85rem",
            padding: "0.65rem 1.15rem",
            background: "var(--bg-elevated, #0f172a)",
            backdropFilter: "blur(12px)",
            borderRadius: "12px",
            border: "1px solid var(--accent-pink)",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.4)",
            color: "var(--text-primary)",
            zIndex: 9999,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span
              style={{
                display: "inline-block",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#10b981",
                boxShadow: "0 0 8px #10b981",
              }}
            />
            <span style={{ fontSize: "0.8rem", fontWeight: "700" }}>
              Editing {activeBAndE.planYear || "2026"}
            </span>
            <kbd
              style={{
                fontSize: "0.68rem",
                background: "rgba(255, 255, 255, 0.1)",
                padding: "0.15rem 0.4rem",
                borderRadius: "4px",
                color: "var(--text-muted)",
                border: "1px solid var(--border)",
              }}
            >
              Ctrl+S
            </kbd>
          </div>

          <div style={{ height: "18px", width: "1px", background: "var(--border)" }} />

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <button
              type="button"
              onClick={() => setIsInlineEditing(false)}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: "0.78rem", padding: "0.25rem 0.6rem" }}
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={savingInline}
              onClick={handleSaveInline}
              className="btn btn-primary btn-sm"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                background: "#10b981",
                borderColor: "#10b981",
                fontSize: "0.78rem",
                padding: "0.25rem 0.75rem",
                boxShadow: "0 2px 8px rgba(16, 185, 129, 0.4)",
              }}
            >
              <Save size={14} />
              <span>{savingInline ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </div>
      )}

      {/* Add Plan Year Modal: Simplified to only the first page */}
      {isNewYearMode && (
        <EditBillingEnrollmentModal
          clientId={clientId}
          clientName={clientName}
          initialData={null}
          allEnrollments={sortedEnrollments}
          allVendors={allVendors}
          isNewPlanYear={true}
          onClose={() => setIsNewYearMode(false)}
          onSuccess={() => {
            setIsNewYearMode(false);
            onRefresh();
          }}
        />
      )}

      {/* Print/Export Modal */}
      {isPrintOpen && (
        <PrintBillingEnrollmentModal
          clientName={clientName}
          data={activeBAndE}
          onClose={() => setIsPrintOpen(false)}
        />
      )}
    </div>
  );
}
