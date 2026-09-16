"use client";

import { useState } from "react";
import { X, Save, FileText, Copy, Calendar, CheckCircle2, ShieldAlert } from "lucide-react";
import DateInput from "./DateInput";
import { formatDisplayDate, normalizeDate } from "@/lib/dateUtils";
import YesNoToggle from "./YesNoToggle";
import CurrencyInput from "./CurrencyInput";
import PercentInput from "./PercentInput";
import ContractSelect from "./ContractSelect";
import LaseredIndividualsInput from "./LaseredIndividualsInput";
import MonthlyAccommodationInput from "./MonthlyAccommodationInput";
import AggregatingSpecificInput from "./AggregatingSpecificInput";
import BenefitsCoveredSelect from "./BenefitsCoveredSelect";
import VendorTypeahead from "./VendorTypeahead";
import MaxSpecificRenewalIncreaseInput from "./MaxSpecificRenewalIncreaseInput";
import SpecificDeductibleInput from "./SpecificDeductibleInput";
import SpecificPremiumRatesInput from "./SpecificPremiumRatesInput";
import AggregateFactorsInput from "./AggregateFactorsInput";
import EnrollmentCensusInput, { calculateCensusTotal } from "./EnrollmentCensusInput";
import { TierStructure } from "./TierStructureSelector";
import IncludedNoneToggle from "./IncludedNoneToggle";
import TerminalLiabilityInput from "./TerminalLiabilityInput";
import AggregateRunInLimitInput from "./AggregateRunInLimitInput";
import GroupAdministrationSection from "./GroupAdministrationSection";

interface EditBillingEnrollmentModalProps {
  clientId: string;
  clientName: string;
  initialData: any;
  allEnrollments?: any[];
  allVendors?: any[];
  isNewPlanYear?: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditBillingEnrollmentModal({
  clientId,
  clientName,
  initialData,
  allEnrollments = [],
  allVendors = [],
  isNewPlanYear = false,
  onClose,
  onSuccess,
}: EditBillingEnrollmentModalProps) {
  const [recordId, setRecordId] = useState<string | undefined>(
    isNewPlanYear ? undefined : initialData?.id
  );
  const [planYear, setPlanYear] = useState(
    initialData?.planYear || (isNewPlanYear ? String(new Date().getFullYear() + 1) : "2026")
  );
  const [startDate, setStartDate] = useState<string>(formatDisplayDate(initialData?.startDate));
  const [endDate, setEndDate] = useState<string>(formatDisplayDate(initialData?.endDate));
  const [isCurrent, setIsCurrent] = useState<boolean>(
    isNewPlanYear ? false : initialData?.isCurrent ?? true
  );

  const [formData, setFormData] = useState({
    currentStopLossCarrier: initialData?.currentStopLossCarrier || "",
    currentManagingGeneralUnderwriter: initialData?.currentManagingGeneralUnderwriter || "",
    priorStopLossCarrier: initialData?.priorStopLossCarrier || "",
    priorManagingGeneralUnderwriter: initialData?.priorManagingGeneralUnderwriter || "",

    specificStopLossStatus: initialData?.specificStopLossStatus || (initialData?.specificContract?.trim().toLowerCase() === "none" ? "None" : "Included"),
    specificDeductible: initialData?.specificDeductible || "",
    aggregatingSpecificDeductible: initialData?.aggregatingSpecificDeductible || "",
    noLaserRenewalGuarantee: initialData?.noLaserRenewalGuarantee || "",
    maxSpecificPremiumRenewalIncrease: initialData?.maxSpecificPremiumRenewalIncrease || "",
    laseredIndividuals: initialData?.laseredIndividuals || "",
    specificTierStructure: initialData?.specificTierStructure || "",
    specificPremiumSingle: initialData?.specificPremiumSingle || "",
    specificPremiumEmployeePlusOne: initialData?.specificPremiumEmployeePlusOne || "",
    specificPremiumEmployeeSpouse: initialData?.specificPremiumEmployeeSpouse || "",
    specificPremiumEmployeeChildren: initialData?.specificPremiumEmployeeChildren || "",
    specificPremiumFamily: initialData?.specificPremiumFamily || "",
    specificBenefitsCovered: initialData?.specificBenefitsCovered || "",
    specificContract: initialData?.specificContract || "",

    aggregateStopLossStatus: initialData?.aggregateStopLossStatus || (initialData?.aggregatePremium?.trim().toLowerCase() === "none" ? "None" : "Included"),
    aggregatePremium: initialData?.aggregatePremium || "",
    monthlyAggregateAccommodation: initialData?.monthlyAggregateAccommodation || "",
    terminalLiabilityOption: initialData?.terminalLiabilityOption || "",
    aggregateFactorSingle: initialData?.aggregateFactorSingle || "",
    aggregateFactorEmployeePlusOne: initialData?.aggregateFactorEmployeePlusOne || "",
    aggregateFactorEmployeeSpouse: initialData?.aggregateFactorEmployeeSpouse || "",
    aggregateFactorEmployeeChildren: initialData?.aggregateFactorEmployeeChildren || "",
    aggregateFactorFamily: initialData?.aggregateFactorFamily || "",
    aggregateMinAttachmentPoint: initialData?.aggregateMinAttachmentPoint || "",
    aggregateBenefitsCovered: initialData?.aggregateBenefitsCovered || "",
    aggregateContract: initialData?.aggregateContract || "",
    aggregateRunInLimit: initialData?.aggregateRunInLimit || "",

    organTransplantPolicy: initialData?.organTransplantPolicy || "",

    adminMasterType: initialData?.adminMasterType || "COMPOSITE",
    adminSections: initialData?.adminSections || "",

    compositeAdminFee: initialData?.compositeAdminFee || "",
    medicalFee: initialData?.medicalFee || "",
    urFee: initialData?.urFee || "",
    amwellFee: initialData?.amwellFee || "",
    physiciansCareHapFee: initialData?.physiciansCareHapFee || "",
    wrapNetwork: initialData?.wrapNetwork || "",
    aetnaSignatureAdminFee: initialData?.aetnaSignatureAdminFee || "",
    networkAccessFee: initialData?.networkAccessFee || "",
    reinsuranceFee: initialData?.reinsuranceFee || "",
    lcmSpaFee: initialData?.lcmSpaFee || "",
    agentFee: initialData?.agentFee || "",
    ppoFee: initialData?.ppoFee || "",

    pbmRx: initialData?.pbmRx || "",
    rxIncludedInAsrReporting: initialData?.rxIncludedInAsrReporting || "",
    isRxAsrContract: initialData?.isRxAsrContract || "",
    pbmAgentCompensation: initialData?.pbmAgentCompensation || "",

    stopLossCommission: initialData?.stopLossCommission || "",
    stopLossOtherCompensation: initialData?.stopLossOtherCompensation || "",
    commissionAgentCompensation: initialData?.commissionAgentCompensation || "",

    figuresSingle: initialData?.figuresSingle || "",
    figuresEmployeePlusOne: initialData?.figuresEmployeePlusOne || "",
    figuresEmployeeSpouse: initialData?.figuresEmployeeSpouse || "",
    figuresEmployeeChildren: initialData?.figuresEmployeeChildren || "",
    figuresFamily: initialData?.figuresFamily || "",
    figuresTotal: initialData?.figuresTotal || "",

    domesticClaims: initialData?.domesticClaims || "",
    notes: initialData?.notes || "",
    stopLossNotes: initialData?.stopLossNotes || "",
  });

  const [saving, setSaving] = useState(false);
  const [copySourceYear, setCopySourceYear] = useState<string>("");
  const [activeTab, setActiveTab] = useState<
    "YEAR_DATES" | "CARRIER" | "SPECIFIC" | "AGGREGATE" | "ADMIN" | "PBM" | "CENSUS"
  >("YEAR_DATES");
  const [error, setError] = useState("");

  const handleTierStructureChange = (newTier: TierStructure) => {
    setFormData((prev) => {
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

  const handleCopyFromPriorYear = (sourceYear: string) => {
    const sourceRecord = allEnrollments.find((e) => e.planYear === sourceYear);
    if (!sourceRecord) return;

    setFormData({
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

      aggregateStopLossStatus: sourceRecord.aggregateStopLossStatus || (sourceRecord.aggregatePremium?.trim().toLowerCase() === "none" ? "None" : "Included"),
      aggregatePremium: sourceRecord.aggregatePremium || "",
      monthlyAggregateAccommodation: sourceRecord.monthlyAggregateAccommodation || "",
      terminalLiabilityOption: sourceRecord.terminalLiabilityOption || "",
      aggregateFactorSingle: sourceRecord.aggregateFactorSingle || "",
      aggregateFactorEmployeePlusOne: sourceRecord.aggregateFactorEmployeePlusOne || "",
      aggregateFactorEmployeeSpouse: sourceRecord.aggregateFactorEmployeeSpouse || "",
      aggregateFactorEmployeeChildren: sourceRecord.aggregateFactorEmployeeChildren || "",
      aggregateFactorFamily: sourceRecord.aggregateFactorFamily || "",
      aggregateMinAttachmentPoint: sourceRecord.aggregateMinAttachmentPoint || "",
      aggregateBenefitsCovered: sourceRecord.aggregateBenefitsCovered || "",
      aggregateContract: sourceRecord.aggregateContract || "",
      aggregateRunInLimit: sourceRecord.aggregateRunInLimit || "",

      organTransplantPolicy: sourceRecord.organTransplantPolicy || "",

      adminMasterType: sourceRecord.adminMasterType || "COMPOSITE",
      adminSections: sourceRecord.adminSections || "",

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
      stopLossNotes: sourceRecord.stopLossNotes || "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!planYear.trim()) {
      setError("Plan Year label is required (e.g. '2026' or '2025-2026').");
      setActiveTab("YEAR_DATES");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const payload = {
        id: recordId,
        planYear: planYear.trim(),
        startDate: normalizeDate(startDate) || null,
        endDate: normalizeDate(endDate) || null,
        isCurrent,
        ...formData,
      };

      const res = await fetch(`/api/clients/${clientId}/billing-enrollment`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        onSuccess();
      } else {
        setError(data.error || "Failed to save B&E summary.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to submit.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: "880px", border: "1px solid var(--accent-pink)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FileText size={22} style={{ color: "var(--accent-pink)" }} />
            <h2 className="modal-title">
              {isNewPlanYear ? "Add New B&E Plan Year" : "Edit B&E Summary"} — {clientName}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation - Only shown when editing full modal, hidden for new plan year creation */}
        {!isNewPlanYear && (
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              padding: "0.75rem 1.5rem",
              borderBottom: "1px solid var(--border)",
              background: "rgba(255, 255, 255, 0.02)",
              overflowX: "auto",
            }}
          >
            {[
              { id: "YEAR_DATES", label: "Plan Year & Dates" },
              { id: "CARRIER", label: "Carrier & Underwriter" },
              { id: "SPECIFIC", label: "Specific Stop-Loss" },
              { id: "AGGREGATE", label: "Aggregate Stop-Loss" },
              { id: "ADMIN", label: "Admin Fees & Networks" },
              { id: "PBM", label: "PBM & Commissions" },
              { id: "CENSUS", label: "Census & Notes" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`btn btn-sm ${activeTab === tab.id ? "btn-primary" : "btn-secondary"}`}
                style={{ fontSize: "0.8rem", whiteSpace: "nowrap" }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ maxHeight: "60vh", overflowY: "auto" }}>
            {error && (
              <div style={{ padding: "0.75rem", background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "8px", color: "#ef4444", fontSize: "0.85rem", marginBottom: "1rem" }}>
                {error}
              </div>
            )}

            {/* TAB 0: Plan Year & Dates (always rendered if isNewPlanYear or activeTab is YEAR_DATES) */}
            {(isNewPlanYear || activeTab === "YEAR_DATES") && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div style={{ background: "rgba(244, 114, 182, 0.05)", border: "1px solid rgba(244, 114, 182, 0.3)", borderRadius: "10px", padding: "1.25rem" }}>
                  <h3 style={{ fontSize: "1rem", fontWeight: "700", color: "#f472b6", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <Calendar size={18} />
                    <span>Plan Year Specifications</span>
                  </h3>

                  <div className="grid-cols-2" style={{ gap: "1rem" }}>
                    <div className="form-group">
                      <label className="form-label">Plan Year Label *</label>
                      <input
                        type="text"
                        className="form-input"
                        required
                        placeholder="e.g. 2026, 2025, or 2025-2026"
                        value={planYear}
                        onChange={(e) => setPlanYear(e.target.value)}
                      />
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                        Unique identifier label for this plan year (e.g. 2026).
                      </span>
                    </div>

                    <div className="form-group" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontWeight: "600", color: "var(--text-primary)" }}>
                        <input
                          type="checkbox"
                          checked={isCurrent}
                          onChange={(e) => setIsCurrent(e.target.checked)}
                          style={{ width: "18px", height: "18px", accentColor: "#f472b6" }}
                        />
                        <span>Set as Current Active Plan Year</span>
                      </label>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.3rem" }}>
                        If checked, this plan year will be displayed by default on group profile pages.
                      </span>
                    </div>
                  </div>

                  <div className="grid-cols-2" style={{ gap: "1rem", marginTop: "0.75rem" }}>
                    <div className="form-group">
                      <label className="form-label">Effective Start Date</label>
                      <DateInput
                        className="form-input"
                        placeholder=""
                        value={startDate}
                        onChange={setStartDate}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Effective End Date</label>
                      <DateInput
                        className="form-input"
                        placeholder=""
                        value={endDate}
                        onChange={setEndDate}
                      />
                    </div>
                  </div>
                </div>

                {/* Shortcut to Copy Specifications from Prior Year */}
                {allEnrollments.length > 0 && (
                  <div style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid var(--border)", borderRadius: "10px", padding: "1.25rem" }}>
                    <h3 style={{ fontSize: "0.95rem", fontWeight: "700", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <Copy size={16} style={{ color: "#38bdf8" }} />
                      <span>Copy Specifications from Existing Plan Year</span>
                    </h3>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.75rem" }}>
                      Pre-fill stop-loss rates, carrier details, admin fees, and census from an existing plan year record to save time.
                    </p>

                    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                      <select
                        className="form-select"
                        style={{ flex: 1 }}
                        value={copySourceYear}
                        onChange={(e) => setCopySourceYear(e.target.value)}
                      >
                        <option value="">-- Select a Plan Year to Copy From --</option>
                        {allEnrollments.map((e) => (
                          <option key={e.id} value={e.planYear}>
                            Plan Year {e.planYear} {e.isCurrent ? "(Current Active)" : ""}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        disabled={!copySourceYear}
                        onClick={() => handleCopyFromPriorYear(copySourceYear)}
                        className="btn btn-blue btn-sm"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        <Copy size={14} />
                        <span>Copy All Specs</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 1: Carrier & Underwriter */}
            {activeTab === "CARRIER" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div className="grid-cols-2">
                  <div className="form-group">
                    <label className="form-label">Current Stop-Loss Carrier</label>
                    <VendorTypeahead
                      placeholder="e.g. HCC Life"
                      value={formData.currentStopLossCarrier}
                      onChange={(val) => setFormData({ ...formData, currentStopLossCarrier: val })}
                      allVendors={allVendors}
                      allowedCategories={["Stoploss", "Stoploss MGU"]}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Current Managing General Underwriter</label>
                    <VendorTypeahead
                      placeholder="e.g. HCC Life Insurance"
                      value={formData.currentManagingGeneralUnderwriter}
                      onChange={(val) => setFormData({ ...formData, currentManagingGeneralUnderwriter: val })}
                      allVendors={allVendors}
                      allowedCategories={["Stoploss", "Stoploss MGU"]}
                    />
                  </div>
                </div>

                <div className="grid-cols-2">
                  <div className="form-group">
                    <label className="form-label">Prior Stop-Loss Carrier</label>
                    <VendorTypeahead
                      placeholder="e.g. Voya"
                      value={formData.priorStopLossCarrier}
                      onChange={(val) => setFormData({ ...formData, priorStopLossCarrier: val })}
                      allVendors={allVendors}
                      allowedCategories={["Stoploss", "Stoploss MGU"]}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Prior Managing General Underwriter</label>
                    <VendorTypeahead
                      placeholder="e.g. Tokio Marine"
                      value={formData.priorManagingGeneralUnderwriter}
                      onChange={(val) => setFormData({ ...formData, priorManagingGeneralUnderwriter: val })}
                      allVendors={allVendors}
                      allowedCategories={["Stoploss", "Stoploss MGU"]}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Specific Stop-Loss */}
            {activeTab === "SPECIFIC" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ fontSize: "0.95rem", fontWeight: "700" }}>Specific Stop-Loss Protection</h3>
                  <IncludedNoneToggle
                    colorScheme="blue"
                    value={formData.specificStopLossStatus}
                    onChange={(val) => setFormData((prev) => ({ ...prev, specificStopLossStatus: val }))}
                  />
                </div>

                {formData.specificStopLossStatus !== "None" && (
                  <>
                    <div className="grid-cols-2">
                      <div className="form-group">
                        <label className="form-label">Specific Deductible</label>
                        <SpecificDeductibleInput
                          value={formData.specificDeductible}
                          onChange={(val) => setFormData((prev) => ({ ...prev, specificDeductible: val }))}
                          compact={false}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Aggregating Specific Deductible</label>
                        <AggregatingSpecificInput
                          value={formData.aggregatingSpecificDeductible}
                          onChange={(val) => setFormData((prev) => ({ ...prev, aggregatingSpecificDeductible: val }))}
                          compact={false}
                        />
                      </div>
                    </div>

                    <div className="grid-cols-2" style={{ alignItems: "flex-start" }}>
                      <div className="form-group">
                        <label className="form-label">No-Laser Renewal Guarantee</label>
                        <YesNoToggle
                          value={formData.noLaserRenewalGuarantee}
                          onChange={(val) => setFormData((prev) => ({ ...prev, noLaserRenewalGuarantee: val }))}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Max Specific Premium Renewal Increase</label>
                        <MaxSpecificRenewalIncreaseInput
                          value={formData.maxSpecificPremiumRenewalIncrease}
                          onChange={(val) => setFormData((prev) => ({ ...prev, maxSpecificPremiumRenewalIncrease: val }))}
                          compact={false}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Lasered Individuals</label>
                      <LaseredIndividualsInput
                        value={formData.laseredIndividuals}
                        onChange={(val) => setFormData((prev) => ({ ...prev, laseredIndividuals: val }))}
                        compact={false}
                      />
                    </div>

                    <div className="grid-cols-2">
                      <div className="form-group">
                        <label className="form-label">Benefits Covered</label>
                        <BenefitsCoveredSelect
                          value={formData.specificBenefitsCovered}
                          onChange={(val) => setFormData((prev) => ({ ...prev, specificBenefitsCovered: val }))}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Specific Contract Type</label>
                        <ContractSelect
                          value={formData.specificContract}
                          onChange={(val) => setFormData((prev) => ({ ...prev, specificContract: val }))}
                        />
                      </div>
                    </div>

                    <div style={{ background: "rgba(0, 174, 219, 0.04)", padding: "1rem", borderRadius: "8px", border: "1px solid var(--border)" }}>
                      <SpecificPremiumRatesInput
                        tierStructure={formData.specificTierStructure}
                        onTierStructureChange={handleTierStructureChange}
                        singleRate={formData.specificPremiumSingle}
                        onSingleRateChange={(val) => setFormData((prev) => ({ ...prev, specificPremiumSingle: val }))}
                        eePlusOneRate={formData.specificPremiumEmployeePlusOne}
                        onEePlusOneRateChange={(val) => setFormData((prev) => ({ ...prev, specificPremiumEmployeePlusOne: val }))}
                        eeSpouseRate={formData.specificPremiumEmployeeSpouse}
                        onEeSpouseRateChange={(val) => setFormData((prev) => ({ ...prev, specificPremiumEmployeeSpouse: val }))}
                        eeChildrenRate={formData.specificPremiumEmployeeChildren}
                        onEeChildrenRateChange={(val) => setFormData((prev) => ({ ...prev, specificPremiumEmployeeChildren: val }))}
                        familyRate={formData.specificPremiumFamily}
                        onFamilyRateChange={(val) => setFormData((prev) => ({ ...prev, specificPremiumFamily: val }))}
                        isEditing={true}
                        compact={false}
                      />
                    </div>

                    <div className="form-group" style={{ marginTop: "0.25rem" }}>
                      <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                        <ShieldAlert size={15} style={{ color: "#c084fc" }} />
                        <span>Stop-Loss Notes & Contract Specifications</span>
                      </label>
                      <textarea
                        rows={3}
                        className="form-textarea"
                        placeholder="Enter stop-loss contract terms, laser specifics, renewal caps, or carrier clauses..."
                        value={formData.stopLossNotes}
                        onChange={(e) => setFormData((prev) => ({ ...prev, stopLossNotes: e.target.value }))}
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {/* TAB 3: Aggregate Stop-Loss */}
            {activeTab === "AGGREGATE" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ fontSize: "0.95rem", fontWeight: "700" }}>Aggregate Stop-Loss Protection</h3>
                  <IncludedNoneToggle
                    value={formData.aggregateStopLossStatus}
                    onChange={(val) => setFormData({ ...formData, aggregateStopLossStatus: val })}
                  />
                </div>

                {formData.aggregateStopLossStatus !== "None" && (
                  <>
                    <div className="grid-cols-2">
                      <div className="form-group">
                        <label className="form-label">Aggregate Premium (Annual)</label>
                        <CurrencyInput
                          style={{ width: "100%" }}
                          placeholder="0.00"
                          value={formData.aggregatePremium}
                          onChange={(val) => setFormData({ ...formData, aggregatePremium: val })}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Min. Attachment Point</label>
                        <CurrencyInput
                          style={{ width: "100%" }}
                          placeholder="0.00"
                          value={formData.aggregateMinAttachmentPoint}
                          onChange={(val) => setFormData({ ...formData, aggregateMinAttachmentPoint: val })}
                        />
                      </div>
                    </div>

                    <div className="grid-cols-2">
                      <div className="form-group">
                        <label className="form-label">Monthly Accommodation</label>
                        <MonthlyAccommodationInput
                          value={formData.monthlyAggregateAccommodation}
                          onChange={(val) => setFormData((prev) => ({ ...prev, monthlyAggregateAccommodation: val }))}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Terminal Liability Option (TLO)</label>
                        <TerminalLiabilityInput
                          value={formData.terminalLiabilityOption}
                          onChange={(val) => setFormData({ ...formData, terminalLiabilityOption: val })}
                        />
                      </div>
                    </div>

                    <div className="grid-cols-3">
                      <div className="form-group">
                        <label className="form-label">Run-in Limit</label>
                        <AggregateRunInLimitInput
                          value={formData.aggregateRunInLimit}
                          onChange={(val) => setFormData({ ...formData, aggregateRunInLimit: val })}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Benefits Covered</label>
                        <BenefitsCoveredSelect
                          value={formData.aggregateBenefitsCovered}
                          onChange={(val) => setFormData({ ...formData, aggregateBenefitsCovered: val })}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Contract Type</label>
                        <ContractSelect
                          value={formData.aggregateContract}
                          onChange={(val) => setFormData({ ...formData, aggregateContract: val })}
                        />
                      </div>
                    </div>

                    <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "1rem", borderRadius: "8px", border: "1px solid var(--border)" }}>
                      <AggregateFactorsInput
                        tierStructure={formData.specificTierStructure}
                        onTierStructureChange={handleTierStructureChange}
                        singleFactor={formData.aggregateFactorSingle}
                        onSingleFactorChange={(val) => setFormData((prev) => ({ ...prev, aggregateFactorSingle: val }))}
                        eePlusOneFactor={formData.aggregateFactorEmployeePlusOne}
                        onEePlusOneFactorChange={(val) => setFormData((prev) => ({ ...prev, aggregateFactorEmployeePlusOne: val }))}
                        eeSpouseFactor={formData.aggregateFactorEmployeeSpouse}
                        onEeSpouseFactorChange={(val) => setFormData((prev) => ({ ...prev, aggregateFactorEmployeeSpouse: val }))}
                        eeChildrenFactor={formData.aggregateFactorEmployeeChildren}
                        onEeChildrenFactorChange={(val) => setFormData((prev) => ({ ...prev, aggregateFactorEmployeeChildren: val }))}
                        familyFactor={formData.aggregateFactorFamily}
                        onFamilyFactorChange={(val) => setFormData((prev) => ({ ...prev, aggregateFactorFamily: val }))}
                        isEditing={true}
                        compact={false}
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {/* TAB 4: Admin Fees & Networks (Dynamic Administration Sections) */}
            {activeTab === "ADMIN" && (
              <GroupAdministrationSection
                adminMasterType={formData.adminMasterType}
                adminSections={formData.adminSections}
                isEditing={true}
                onChangeMasterType={(newType) => setFormData((prev) => ({ ...prev, adminMasterType: newType }))}
                onChangeSections={(newSectionsJson) => setFormData((prev) => ({ ...prev, adminSections: newSectionsJson }))}
                legacyData={initialData}
              />
            )}

            {/* TAB 5: PBM & Commissions */}
            {activeTab === "PBM" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div className="grid-cols-2">
                  <div className="form-group">
                    <label className="form-label">PBM Rx Provider</label>
                    <VendorTypeahead
                      placeholder="Select or enter PBM Provider..."
                      value={formData.pbmRx}
                      onChange={(val) => setFormData({ ...formData, pbmRx: val })}
                      allVendors={allVendors}
                      allowedCategories={["PBM"]}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Rx Included in ASR Reporting?</label>
                    <YesNoToggle
                      value={formData.rxIncludedInAsrReporting}
                      onChange={(val) => setFormData({ ...formData, rxIncludedInAsrReporting: val })}
                    />
                  </div>
                </div>

                <div className="grid-cols-2">
                  <div className="form-group">
                    <label className="form-label">Is Rx ASR's Contract?</label>
                    <YesNoToggle
                      value={formData.isRxAsrContract}
                      onChange={(val) => setFormData({ ...formData, isRxAsrContract: val })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">PBM Agent Compensation</label>
                    <YesNoToggle
                      value={formData.pbmAgentCompensation}
                      onChange={(val) => setFormData({ ...formData, pbmAgentCompensation: val })}
                    />
                  </div>
                </div>

                <div className="grid-cols-3">
                  <div className="form-group">
                    <label className="form-label">Stop-Loss Commission (%)</label>
                    <PercentInput
                      style={{ width: "100%" }}
                      placeholder="10"
                      value={formData.stopLossCommission}
                      onChange={(val) => setFormData({ ...formData, stopLossCommission: val })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Stop-Loss Other Compensation (%)</label>
                    <PercentInput
                      style={{ width: "100%" }}
                      placeholder="3"
                      value={formData.stopLossOtherCompensation}
                      onChange={(val) => setFormData({ ...formData, stopLossOtherCompensation: val })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Agent Compensation?</label>
                    <YesNoToggle
                      value={formData.commissionAgentCompensation}
                      onChange={(val) => setFormData({ ...formData, commissionAgentCompensation: val })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Organ Transplant Policy?</label>
                  <YesNoToggle
                    value={formData.organTransplantPolicy}
                    onChange={(val) => setFormData({ ...formData, organTransplantPolicy: val })}
                  />
                </div>
              </div>
            )}

            {/* TAB 6: Census & Notes */}
            {activeTab === "CENSUS" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "1rem", borderRadius: "8px", border: "1px solid var(--border)" }}>
                  <EnrollmentCensusInput
                    tierStructure={formData.specificTierStructure}
                    onTierStructureChange={handleTierStructureChange}
                    single={formData.figuresSingle}
                    onSingleChange={(val) => setFormData((prev) => ({ ...prev, figuresSingle: val }))}
                    eePlusOne={formData.figuresEmployeePlusOne}
                    onEePlusOneChange={(val) => setFormData((prev) => ({ ...prev, figuresEmployeePlusOne: val }))}
                    eeSpouse={formData.figuresEmployeeSpouse}
                    onEeSpouseChange={(val) => setFormData((prev) => ({ ...prev, figuresEmployeeSpouse: val }))}
                    eeChildren={formData.figuresEmployeeChildren}
                    onEeChildrenChange={(val) => setFormData((prev) => ({ ...prev, figuresEmployeeChildren: val }))}
                    family={formData.figuresFamily}
                    onFamilyChange={(val) => setFormData((prev) => ({ ...prev, figuresFamily: val }))}
                    total={formData.figuresTotal}
                    onTotalChange={(val) => setFormData((prev) => ({ ...prev, figuresTotal: val }))}
                    isEditing={true}
                    compact={false}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Does the group have domestic claims?</label>
                  <YesNoToggle
                    value={formData.domesticClaims}
                    onChange={(val) => setFormData({ ...formData, domesticClaims: val })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">B&E Operational Notes & Guarantees</label>
                  <textarea
                    rows={4}
                    className="form-textarea"
                    placeholder="Enter B&E specification notes, fee guarantees, or contract terms..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  ></textarea>
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn btn-primary">
              <Save size={16} />
              <span>
                {saving
                  ? isNewPlanYear
                    ? "Creating Plan Year..."
                    : "Saving Changes..."
                  : isNewPlanYear
                  ? `Create Plan Year (${planYear})`
                  : `Save Plan Year (${planYear})`}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
