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

interface EditBillingEnrollmentModalProps {
  clientId: string;
  clientName: string;
  initialData: any;
  allEnrollments?: any[];
  isNewPlanYear?: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditBillingEnrollmentModal({
  clientId,
  clientName,
  initialData,
  allEnrollments = [],
  isNewPlanYear = false,
  onClose,
  onSuccess,
}: EditBillingEnrollmentModalProps) {
  const [recordId, setRecordId] = useState<string | undefined>(
    isNewPlanYear ? undefined : initialData?.id
  );
  const [planYear, setPlanYear] = useState<string>(
    isNewPlanYear
      ? String(new Date().getFullYear() + 1)
      : initialData?.planYear || "2026"
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

    specificDeductible: initialData?.specificDeductible || "",
    aggregatingSpecificDeductible: initialData?.aggregatingSpecificDeductible || "",
    noLaserRenewalGuarantee: initialData?.noLaserRenewalGuarantee || "",
    maxSpecificPremiumRenewalIncrease: initialData?.maxSpecificPremiumRenewalIncrease || "",
    laseredIndividuals: initialData?.laseredIndividuals || "",
    specificPremiumSingle: initialData?.specificPremiumSingle || "",
    specificPremiumEmployeePlusOne: initialData?.specificPremiumEmployeePlusOne || "",
    specificPremiumFamily: initialData?.specificPremiumFamily || "",
    specificBenefitsCovered: initialData?.specificBenefitsCovered || "",
    specificContract: initialData?.specificContract || "",

    aggregatePremium: initialData?.aggregatePremium || "",
    monthlyAggregateAccommodation: initialData?.monthlyAggregateAccommodation || "",
    aggregateFactorSingle: initialData?.aggregateFactorSingle || "",
    aggregateFactorEmployeePlusOne: initialData?.aggregateFactorEmployeePlusOne || "",
    aggregateFactorFamily: initialData?.aggregateFactorFamily || "",
    aggregateMinAttachmentPoint: initialData?.aggregateMinAttachmentPoint || "",
    aggregateBenefitsCovered: initialData?.aggregateBenefitsCovered || "",
    aggregateContract: initialData?.aggregateContract || "",
    aggregateRunInLimit: initialData?.aggregateRunInLimit || "",

    organTransplantPolicy: initialData?.organTransplantPolicy || "",

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

  const handleUpdateCensusTier = (
    field: "figuresSingle" | "figuresEmployeePlusOne" | "figuresFamily",
    val: string
  ) => {
    const updated = { ...formData, [field]: val };
    const s = parseInt(field === "figuresSingle" ? val : updated.figuresSingle, 10) || 0;
    const e = parseInt(field === "figuresEmployeePlusOne" ? val : updated.figuresEmployeePlusOne, 10) || 0;
    const f = parseInt(field === "figuresFamily" ? val : updated.figuresFamily, 10) || 0;
    if (s > 0 || e > 0 || f > 0) {
      updated.figuresTotal = String(s + e + f);
    }
    setFormData(updated);
  };

  const handleCopyFromPriorYear = (sourceYear: string) => {
    const sourceRecord = allEnrollments.find((e) => e.planYear === sourceYear);
    if (!sourceRecord) return;

    setFormData({
      currentStopLossCarrier: sourceRecord.currentStopLossCarrier || "",
      currentManagingGeneralUnderwriter: sourceRecord.currentManagingGeneralUnderwriter || "",
      priorStopLossCarrier: sourceRecord.priorStopLossCarrier || "",
      priorManagingGeneralUnderwriter: sourceRecord.priorManagingGeneralUnderwriter || "",

      specificDeductible: sourceRecord.specificDeductible || "",
      aggregatingSpecificDeductible: sourceRecord.aggregatingSpecificDeductible || "",
      noLaserRenewalGuarantee: sourceRecord.noLaserRenewalGuarantee || "",
      maxSpecificPremiumRenewalIncrease: sourceRecord.maxSpecificPremiumRenewalIncrease || "",
      laseredIndividuals: sourceRecord.laseredIndividuals || "",
      specificPremiumSingle: sourceRecord.specificPremiumSingle || "",
      specificPremiumEmployeePlusOne: sourceRecord.specificPremiumEmployeePlusOne || "",
      specificPremiumFamily: sourceRecord.specificPremiumFamily || "",
      specificBenefitsCovered: sourceRecord.specificBenefitsCovered || "",
      specificContract: sourceRecord.specificContract || "",

      aggregatePremium: sourceRecord.aggregatePremium || "",
      monthlyAggregateAccommodation: sourceRecord.monthlyAggregateAccommodation || "",
      aggregateFactorSingle: sourceRecord.aggregateFactorSingle || "",
      aggregateFactorEmployeePlusOne: sourceRecord.aggregateFactorEmployeePlusOne || "",
      aggregateFactorFamily: sourceRecord.aggregateFactorFamily || "",
      aggregateMinAttachmentPoint: sourceRecord.aggregateMinAttachmentPoint || "",
      aggregateBenefitsCovered: sourceRecord.aggregateBenefitsCovered || "",
      aggregateContract: sourceRecord.aggregateContract || "",
      aggregateRunInLimit: sourceRecord.aggregateRunInLimit || "",

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
                        placeholder="01/01/2026"
                        value={startDate}
                        onChange={setStartDate}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Effective End Date</label>
                      <DateInput
                        className="form-input"
                        placeholder="12/31/2026"
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
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. HCC Life"
                      value={formData.currentStopLossCarrier}
                      onChange={(e) => setFormData({ ...formData, currentStopLossCarrier: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Current Managing General Underwriter</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. HCC Life Insurance"
                      value={formData.currentManagingGeneralUnderwriter}
                      onChange={(e) => setFormData({ ...formData, currentManagingGeneralUnderwriter: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid-cols-2">
                  <div className="form-group">
                    <label className="form-label">Prior Stop-Loss Carrier</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Voya"
                      value={formData.priorStopLossCarrier}
                      onChange={(e) => setFormData({ ...formData, priorStopLossCarrier: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Prior Managing General Underwriter</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Tokyo Marine"
                      value={formData.priorManagingGeneralUnderwriter}
                      onChange={(e) => setFormData({ ...formData, priorManagingGeneralUnderwriter: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Specific Stop-Loss */}
            {activeTab === "SPECIFIC" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div className="grid-cols-2">
                  <div className="form-group">
                    <label className="form-label">Specific Deductible</label>
                    <CurrencyInput
                      align="left"
                      style={{ width: "100%" }}
                      placeholder="75,000.00"
                      value={formData.specificDeductible}
                      onChange={(val) => setFormData({ ...formData, specificDeductible: val })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Aggregating Specific Deductible</label>
                    <AggregatingSpecificInput
                      value={formData.aggregatingSpecificDeductible}
                      onChange={(val) => setFormData({ ...formData, aggregatingSpecificDeductible: val })}
                      compact={false}
                    />
                  </div>
                </div>

                <div className="grid-cols-2" style={{ alignItems: "center" }}>
                  <div className="form-group">
                    <label className="form-label">No-Laser Renewal Guarantee</label>
                    <YesNoToggle
                      value={formData.noLaserRenewalGuarantee}
                      onChange={(val) => setFormData({ ...formData, noLaserRenewalGuarantee: val })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Max Specific Premium Renewal Increase</label>
                    <PercentInput
                      placeholder="45"
                      value={formData.maxSpecificPremiumRenewalIncrease}
                      onChange={(val) => setFormData({ ...formData, maxSpecificPremiumRenewalIncrease: val })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Lasered Individuals</label>
                  <LaseredIndividualsInput
                    value={formData.laseredIndividuals}
                    onChange={(val) => setFormData({ ...formData, laseredIndividuals: val })}
                    compact={false}
                  />
                </div>

                <div className="grid-cols-2">
                  <div className="form-group">
                    <label className="form-label">Benefits Covered</label>
                    <BenefitsCoveredSelect
                      value={formData.specificBenefitsCovered}
                      onChange={(val) => setFormData({ ...formData, specificBenefitsCovered: val })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Specific Contract Type</label>
                    <ContractSelect
                      value={formData.specificContract}
                      onChange={(val) => setFormData({ ...formData, specificContract: val })}
                    />
                  </div>
                </div>

                <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "1rem", borderRadius: "8px", border: "1px solid var(--border)" }}>
                  <label className="form-label" style={{ marginBottom: "0.5rem" }}>Specific Premium Rates (Monthly PEPM)</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
                    <div>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Single</span>
                      <CurrencyInput
                        style={{ width: "100%" }}
                        placeholder="161.65"
                        value={formData.specificPremiumSingle}
                        onChange={(val) => setFormData({ ...formData, specificPremiumSingle: val })}
                      />
                    </div>
                    <div>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Employee + 1</span>
                      <CurrencyInput
                        style={{ width: "100%" }}
                        placeholder="301.31"
                        value={formData.specificPremiumEmployeePlusOne}
                        onChange={(val) => setFormData({ ...formData, specificPremiumEmployeePlusOne: val })}
                      />
                    </div>
                    <div>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Family</span>
                      <CurrencyInput
                        style={{ width: "100%" }}
                        placeholder="457.63"
                        value={formData.specificPremiumFamily}
                        onChange={(val) => setFormData({ ...formData, specificPremiumFamily: val })}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: "0.25rem" }}>
                  <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <ShieldAlert size={15} style={{ color: "#c084fc" }} />
                    <span>Stop-Loss Notes & Contract Specifications</span>
                  </label>
                  <textarea
                    rows={3}
                    className="form-textarea"
                    placeholder="Enter stop-loss notes, laser details, specific deductible guarantees, carrier binding clauses..."
                    value={formData.stopLossNotes}
                    onChange={(e) => setFormData({ ...formData, stopLossNotes: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* TAB 3: Aggregate Stop-Loss */}
            {activeTab === "AGGREGATE" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div className="grid-cols-2">
                  <div className="form-group">
                    <label className="form-label">Aggregate Premium (Annual / PEPM)</label>
                    <CurrencyInput
                      align="left"
                      style={{ width: "100%" }}
                      placeholder="7.54"
                      value={formData.aggregatePremium}
                      onChange={(val) => setFormData({ ...formData, aggregatePremium: val })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Monthly Aggregate Accommodation</label>
                    <MonthlyAccommodationInput
                      value={formData.monthlyAggregateAccommodation}
                      onChange={(val) => setFormData({ ...formData, monthlyAggregateAccommodation: val })}
                    />
                  </div>
                </div>

                <div className="grid-cols-2" style={{ alignItems: "center" }}>
                  <div className="form-group">
                    <label className="form-label">Min. Attachment Point</label>
                    <CurrencyInput
                      align="left"
                      style={{ width: "100%" }}
                      placeholder="1,439,838.96"
                      value={formData.aggregateMinAttachmentPoint}
                      onChange={(val) => setFormData({ ...formData, aggregateMinAttachmentPoint: val })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Run-in Limit</label>
                    <YesNoToggle
                      value={formData.aggregateRunInLimit}
                      onChange={(val) => setFormData({ ...formData, aggregateRunInLimit: val })}
                    />
                  </div>
                </div>

                <div className="grid-cols-2">
                  <div className="form-group">
                    <label className="form-label">Benefits Covered</label>
                    <BenefitsCoveredSelect
                      value={formData.aggregateBenefitsCovered}
                      onChange={(val) => setFormData({ ...formData, aggregateBenefitsCovered: val })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Aggregate Contract Type</label>
                    <ContractSelect
                      value={formData.aggregateContract}
                      onChange={(val) => setFormData({ ...formData, aggregateContract: val })}
                    />
                  </div>
                </div>

                <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "1rem", borderRadius: "8px", border: "1px solid var(--border)" }}>
                  <label className="form-label" style={{ marginBottom: "0.5rem" }}>Aggregate Factors (Monthly PEPM)</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
                    <div>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Single Factor</span>
                      <CurrencyInput
                        style={{ width: "100%" }}
                        placeholder="425.84"
                        value={formData.aggregateFactorSingle}
                        onChange={(val) => setFormData({ ...formData, aggregateFactorSingle: val })}
                      />
                    </div>
                    <div>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Employee + 1 Factor</span>
                      <CurrencyInput
                        style={{ width: "100%" }}
                        placeholder="793.78"
                        value={formData.aggregateFactorEmployeePlusOne}
                        onChange={(val) => setFormData({ ...formData, aggregateFactorEmployeePlusOne: val })}
                      />
                    </div>
                    <div>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Family Factor</span>
                      <CurrencyInput
                        style={{ width: "100%" }}
                        placeholder="1,205.57"
                        value={formData.aggregateFactorFamily}
                        onChange={(val) => setFormData({ ...formData, aggregateFactorFamily: val })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: Admin Fees & Networks */}
            {activeTab === "ADMIN" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div className="grid-cols-2">
                  <div className="form-group">
                    <label className="form-label">Composite Admin Fee</label>
                    <CurrencyInput
                      style={{ width: "100%" }}
                      placeholder="53.00"
                      suffix="PEPM"
                      value={formData.compositeAdminFee}
                      onChange={(val) => setFormData({ ...formData, compositeAdminFee: val })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Medical Fee</label>
                    <CurrencyInput
                      style={{ width: "100%" }}
                      placeholder="52.55"
                      suffix="PEPM"
                      value={formData.medicalFee}
                      onChange={(val) => setFormData({ ...formData, medicalFee: val })}
                    />
                  </div>
                </div>

                <div className="grid-cols-2">
                  <div className="form-group">
                    <label className="form-label">UR (AHH)</label>
                    <CurrencyInput
                      style={{ width: "100%" }}
                      placeholder="2.85"
                      suffix="PEPM"
                      value={formData.urFee}
                      onChange={(val) => setFormData({ ...formData, urFee: val })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Amwell Telehealth</label>
                    <CurrencyInput
                      style={{ width: "100%" }}
                      placeholder="0.45"
                      suffix="PEPM"
                      value={formData.amwellFee}
                      onChange={(val) => setFormData({ ...formData, amwellFee: val })}
                    />
                  </div>
                </div>

                <div className="grid-cols-2">
                  <div className="form-group">
                    <label className="form-label">Physicians Care / HAP</label>
                    <CurrencyInput
                      style={{ width: "100%" }}
                      placeholder="10.00"
                      suffix="PEPM"
                      value={formData.physiciansCareHapFee}
                      onChange={(val) => setFormData({ ...formData, physiciansCareHapFee: val })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Wrap Networks</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Aetna 25%, Valenz 25%"
                      value={formData.wrapNetwork}
                      onChange={(e) => setFormData({ ...formData, wrapNetwork: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid-cols-2">
                  <div className="form-group">
                    <label className="form-label">Aetna Signature Admin</label>
                    <CurrencyInput
                      style={{ width: "100%" }}
                      placeholder="17.00"
                      suffix="PEPM"
                      value={formData.aetnaSignatureAdminFee}
                      onChange={(val) => setFormData({ ...formData, aetnaSignatureAdminFee: val })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Network Access Fee</label>
                    <CurrencyInput
                      style={{ width: "100%" }}
                      placeholder="16.25"
                      suffix="PEPM"
                      value={formData.networkAccessFee}
                      onChange={(val) => setFormData({ ...formData, networkAccessFee: val })}
                    />
                  </div>
                </div>

                <div className="grid-cols-2">
                  <div className="form-group">
                    <label className="form-label">Reinsurance Fee</label>
                    <CurrencyInput
                      style={{ width: "100%" }}
                      placeholder="0.75"
                      suffix="PEPM"
                      value={formData.reinsuranceFee}
                      onChange={(val) => setFormData({ ...formData, reinsuranceFee: val })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">LCM / SPA (AHH)</label>
                    <CurrencyInput
                      style={{ width: "100%" }}
                      placeholder="149.00"
                      suffix="hr"
                      value={formData.lcmSpaFee}
                      onChange={(val) => setFormData({ ...formData, lcmSpaFee: val })}
                    />
                  </div>
                </div>

                <div className="grid-cols-2">
                  <div className="form-group">
                    <label className="form-label">Agent Fee</label>
                    <CurrencyInput
                      style={{ width: "100%" }}
                      placeholder="32.00"
                      suffix="PEPM"
                      value={formData.agentFee}
                      onChange={(val) => setFormData({ ...formData, agentFee: val })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">PPO Fee Notes</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="$9.00 PEPM + 3% of allowed..."
                      value={formData.ppoFee}
                      onChange={(e) => setFormData({ ...formData, ppoFee: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: PBM & Commissions */}
            {activeTab === "PBM" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <h3 style={{ fontSize: "0.95rem", fontWeight: "700", color: "#34d399" }}>PBM Information</h3>
                <div className="grid-cols-2">
                  <div className="form-group">
                    <label className="form-label">PBM / Rx Provider</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Liviniti"
                      value={formData.pbmRx}
                      onChange={(e) => setFormData({ ...formData, pbmRx: e.target.value })}
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

                <div className="grid-cols-2" style={{ alignItems: "center" }}>
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

                <h3 style={{ fontSize: "0.95rem", fontWeight: "700", color: "#f472b6", marginTop: "1rem" }}>Commission Information</h3>
                <div className="grid-cols-2">
                  <div className="form-group">
                    <label className="form-label">Stop-Loss Commission</label>
                    <PercentInput
                      placeholder="0"
                      value={formData.stopLossCommission}
                      onChange={(val) => setFormData({ ...formData, stopLossCommission: val })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Stop-Loss Other Compensation</label>
                    <PercentInput
                      placeholder="3"
                      value={formData.stopLossOtherCompensation}
                      onChange={(val) => setFormData({ ...formData, stopLossOtherCompensation: val })}
                    />
                  </div>
                </div>

                <div className="grid-cols-2" style={{ alignItems: "center" }}>
                  <div className="form-group">
                    <label className="form-label">Agent Compensation</label>
                    <YesNoToggle
                      value={formData.commissionAgentCompensation}
                      onChange={(val) => setFormData({ ...formData, commissionAgentCompensation: val })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Organ Transplant Policy</label>
                    <YesNoToggle
                      value={formData.organTransplantPolicy}
                      onChange={(val) => setFormData({ ...formData, organTransplantPolicy: val })}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: Census & Notes */}
            {activeTab === "CENSUS" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ fontSize: "0.95rem", fontWeight: "700" }}>Enrollment Census Figures</h3>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                    Total updates automatically as tiers are entered
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem" }}>
                  <div className="form-group">
                    <label className="form-label">Single Count</label>
                    <input
                      type="number"
                      min="0"
                      className="form-input"
                      placeholder="126"
                      value={formData.figuresSingle}
                      onChange={(e) => handleUpdateCensusTier("figuresSingle", e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Employee + 1 Count</label>
                    <input
                      type="number"
                      min="0"
                      className="form-input"
                      placeholder="38"
                      value={formData.figuresEmployeePlusOne}
                      onChange={(e) => handleUpdateCensusTier("figuresEmployeePlusOne", e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Family Count</label>
                    <input
                      type="number"
                      min="0"
                      className="form-input"
                      placeholder="30"
                      value={formData.figuresFamily}
                      onChange={(e) => handleUpdateCensusTier("figuresFamily", e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Total Census</label>
                    <input
                      type="number"
                      min="0"
                      className="form-input"
                      placeholder="194"
                      value={formData.figuresTotal}
                      onChange={(e) => setFormData({ ...formData, figuresTotal: e.target.value })}
                    />
                  </div>
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
