"use client";

import { useState } from "react";
import { X, Save, FileText } from "lucide-react";

interface EditBillingEnrollmentModalProps {
  clientId: string;
  clientName: string;
  initialData: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditBillingEnrollmentModal({
  clientId,
  clientName,
  initialData,
  onClose,
  onSuccess,
}: EditBillingEnrollmentModalProps) {
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
  });

  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "CARRIER" | "SPECIFIC" | "AGGREGATE" | "ADMIN" | "PBM" | "CENSUS"
  >("CARRIER");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/clients/${clientId}/billing-enrollment`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        onSuccess();
      } else {
        setError(data.error || "Failed to update B&E summary.");
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
        style={{ maxWidth: "850px", border: "1px solid var(--accent-pink)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FileText size={22} style={{ color: "var(--accent-pink)" }} />
            <h2 className="modal-title">Edit B&E Summary — {clientName}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
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

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ maxHeight: "60vh", overflowY: "auto" }}>
            {error && (
              <div style={{ padding: "0.75rem", background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "8px", color: "#ef4444", fontSize: "0.85rem", marginBottom: "1rem" }}>
                {error}
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
                    <input
                      type="text"
                      className="form-input"
                      placeholder="$75,000.00 per individual"
                      value={formData.specificDeductible}
                      onChange={(e) => setFormData({ ...formData, specificDeductible: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Aggregating Specific Deductible</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="No / $0.00"
                      value={formData.aggregatingSpecificDeductible}
                      onChange={(e) => setFormData({ ...formData, aggregatingSpecificDeductible: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid-cols-2">
                  <div className="form-group">
                    <label className="form-label">No-Laser Renewal Guarantee</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Yes / No"
                      value={formData.noLaserRenewalGuarantee}
                      onChange={(e) => setFormData({ ...formData, noLaserRenewalGuarantee: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Max Specific Premium Renewal Increase</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="45%"
                      value={formData.maxSpecificPremiumRenewalIncrease}
                      onChange={(e) => setFormData({ ...formData, maxSpecificPremiumRenewalIncrease: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid-cols-2">
                  <div className="form-group">
                    <label className="form-label">Lasered Individuals</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="No / List details"
                      value={formData.laseredIndividuals}
                      onChange={(e) => setFormData({ ...formData, laseredIndividuals: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Benefits Covered</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Med/Rx"
                      value={formData.specificBenefitsCovered}
                      onChange={(e) => setFormData({ ...formData, specificBenefitsCovered: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Specific Contract Type</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="pi (paid & incurred) 12/12"
                    value={formData.specificContract}
                    onChange={(e) => setFormData({ ...formData, specificContract: e.target.value })}
                  />
                </div>

                <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "1rem", borderRadius: "8px", border: "1px solid var(--border)" }}>
                  <label className="form-label" style={{ marginBottom: "0.5rem" }}>Specific Premium Rates</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
                    <div>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Single</span>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="$161.65"
                        value={formData.specificPremiumSingle}
                        onChange={(e) => setFormData({ ...formData, specificPremiumSingle: e.target.value })}
                      />
                    </div>
                    <div>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Employee + 1</span>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="$301.31"
                        value={formData.specificPremiumEmployeePlusOne}
                        onChange={(e) => setFormData({ ...formData, specificPremiumEmployeePlusOne: e.target.value })}
                      />
                    </div>
                    <div>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Family</span>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="$457.63"
                        value={formData.specificPremiumFamily}
                        onChange={(e) => setFormData({ ...formData, specificPremiumFamily: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Aggregate Stop-Loss */}
            {activeTab === "AGGREGATE" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div className="grid-cols-2">
                  <div className="form-group">
                    <label className="form-label">Aggregate Premium</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="$7.54"
                      value={formData.aggregatePremium}
                      onChange={(e) => setFormData({ ...formData, aggregatePremium: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Monthly Aggregate Accommodation</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="$1.50 (not included in aggregate premium)"
                      value={formData.monthlyAggregateAccommodation}
                      onChange={(e) => setFormData({ ...formData, monthlyAggregateAccommodation: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid-cols-2">
                  <div className="form-group">
                    <label className="form-label">Min. Attachment Point</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="$1,439,838.96"
                      value={formData.aggregateMinAttachmentPoint}
                      onChange={(e) => setFormData({ ...formData, aggregateMinAttachmentPoint: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Run-in Limit</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="No"
                      value={formData.aggregateRunInLimit}
                      onChange={(e) => setFormData({ ...formData, aggregateRunInLimit: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid-cols-2">
                  <div className="form-group">
                    <label className="form-label">Benefits Covered</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Med/Rx"
                      value={formData.aggregateBenefitsCovered}
                      onChange={(e) => setFormData({ ...formData, aggregateBenefitsCovered: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Aggregate Contract</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="pi (paid & incurred) 12/12"
                      value={formData.aggregateContract}
                      onChange={(e) => setFormData({ ...formData, aggregateContract: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "1rem", borderRadius: "8px", border: "1px solid var(--border)" }}>
                  <label className="form-label" style={{ marginBottom: "0.5rem" }}>Aggregate Factors</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
                    <div>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Single Factor</span>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="$425.84"
                        value={formData.aggregateFactorSingle}
                        onChange={(e) => setFormData({ ...formData, aggregateFactorSingle: e.target.value })}
                      />
                    </div>
                    <div>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Employee + 1 Factor</span>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="$793.78"
                        value={formData.aggregateFactorEmployeePlusOne}
                        onChange={(e) => setFormData({ ...formData, aggregateFactorEmployeePlusOne: e.target.value })}
                      />
                    </div>
                    <div>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Family Factor</span>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="$1,205.57"
                        value={formData.aggregateFactorFamily}
                        onChange={(e) => setFormData({ ...formData, aggregateFactorFamily: e.target.value })}
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
                    <input
                      type="text"
                      className="form-input"
                      placeholder="$53.00 per employee per month"
                      value={formData.compositeAdminFee}
                      onChange={(e) => setFormData({ ...formData, compositeAdminFee: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Medical Fee</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Included ($52.55 PEPM)"
                      value={formData.medicalFee}
                      onChange={(e) => setFormData({ ...formData, medicalFee: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid-cols-2">
                  <div className="form-group">
                    <label className="form-label">UR (AHH)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Included ($2.85 PEPM)"
                      value={formData.urFee}
                      onChange={(e) => setFormData({ ...formData, urFee: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Amwell Telehealth</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Included ($0.45 PEPM)"
                      value={formData.amwellFee}
                      onChange={(e) => setFormData({ ...formData, amwellFee: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid-cols-2">
                  <div className="form-group">
                    <label className="form-label">Physicians Care / HAP</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Included ($10.00 PEPM)"
                      value={formData.physiciansCareHapFee}
                      onChange={(e) => setFormData({ ...formData, physiciansCareHapFee: e.target.value })}
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
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Included ($17.00 PEPM)"
                      value={formData.aetnaSignatureAdminFee}
                      onChange={(e) => setFormData({ ...formData, aetnaSignatureAdminFee: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Network Access Fee</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Included ($16.25 PEPM)"
                      value={formData.networkAccessFee}
                      onChange={(e) => setFormData({ ...formData, networkAccessFee: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid-cols-2">
                  <div className="form-group">
                    <label className="form-label">Reinsurance Fee</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Included ($0.75 PEPM)"
                      value={formData.reinsuranceFee}
                      onChange={(e) => setFormData({ ...formData, reinsuranceFee: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">LCM / SPA (AHH)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="$149.00 per hour"
                      value={formData.lcmSpaFee}
                      onChange={(e) => setFormData({ ...formData, lcmSpaFee: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid-cols-2">
                  <div className="form-group">
                    <label className="form-label">Agent Fee</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="$32.00 per employee per month"
                      value={formData.agentFee}
                      onChange={(e) => setFormData({ ...formData, agentFee: e.target.value })}
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
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Yes / No"
                      value={formData.rxIncludedInAsrReporting}
                      onChange={(e) => setFormData({ ...formData, rxIncludedInAsrReporting: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid-cols-2">
                  <div className="form-group">
                    <label className="form-label">Is Rx ASR's Contract?</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Yes / No"
                      value={formData.isRxAsrContract}
                      onChange={(e) => setFormData({ ...formData, isRxAsrContract: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">PBM Agent Compensation</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="No / Details"
                      value={formData.pbmAgentCompensation}
                      onChange={(e) => setFormData({ ...formData, pbmAgentCompensation: e.target.value })}
                    />
                  </div>
                </div>

                <h3 style={{ fontSize: "0.95rem", fontWeight: "700", color: "#f472b6", marginTop: "1rem" }}>Commission Information</h3>
                <div className="grid-cols-2">
                  <div className="form-group">
                    <label className="form-label">Stop-Loss Commission</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="0% of stop-loss premium"
                      value={formData.stopLossCommission}
                      onChange={(e) => setFormData({ ...formData, stopLossCommission: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Stop-Loss Other Compensation</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="3% of stop-loss premium"
                      value={formData.stopLossOtherCompensation}
                      onChange={(e) => setFormData({ ...formData, stopLossOtherCompensation: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid-cols-2">
                  <div className="form-group">
                    <label className="form-label">Agent Compensation</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="No / Details"
                      value={formData.commissionAgentCompensation}
                      onChange={(e) => setFormData({ ...formData, commissionAgentCompensation: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Organ Transplant Policy</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="No / Yes"
                      value={formData.organTransplantPolicy}
                      onChange={(e) => setFormData({ ...formData, organTransplantPolicy: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: Census & Notes */}
            {activeTab === "CENSUS" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <h3 style={{ fontSize: "0.95rem", fontWeight: "700" }}>Enrollment Census Figures</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem" }}>
                  <div className="form-group">
                    <label className="form-label">Single Count</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="126"
                      value={formData.figuresSingle}
                      onChange={(e) => setFormData({ ...formData, figuresSingle: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Employee + 1 Count</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="38"
                      value={formData.figuresEmployeePlusOne}
                      onChange={(e) => setFormData({ ...formData, figuresEmployeePlusOne: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Family Count</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="30"
                      value={formData.figuresFamily}
                      onChange={(e) => setFormData({ ...formData, figuresFamily: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Total Census</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="194"
                      value={formData.figuresTotal}
                      onChange={(e) => setFormData({ ...formData, figuresTotal: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Does the group have domestic claims?</label>
                  <select
                    className="form-select"
                    value={formData.domesticClaims}
                    onChange={(e) => setFormData({ ...formData, domesticClaims: e.target.value })}
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
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
              <span>{saving ? "Saving Changes..." : "Save B&E Summary"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
