"use client";

import { X, Printer, FileText, FileSpreadsheet, Calendar, CheckCircle2 } from "lucide-react";
import { exportBEToExcel } from "@/lib/exportBEExcel";
import { formatDisplayDate } from "@/lib/dateUtils";
import { formatCurrencyDisplay } from "./CurrencyInput";
import { formatTloDisplay } from "./TerminalLiabilityInput";
import { formatRunInLimitDisplay } from "./AggregateRunInLimitInput";
import { formatMonthlyAccommodationDisplay } from "./MonthlyAccommodationInput";

interface PrintBillingEnrollmentModalProps {
  clientName: string;
  data: any;
  onClose: () => void;
}

export default function PrintBillingEnrollmentModal({
  clientName,
  data,
  onClose,
}: PrintBillingEnrollmentModalProps) {
  const bAndE = data || {};

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{
          maxWidth: "850px",
          background: "#ffffff",
          color: "#0f172a",
          border: "1px solid #cbd5e1",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Controls (Hidden when printing) */}
        <div
          className="no-print"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1rem 1.5rem",
            background: "#f8fafc",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#0f172a" }}>
            <FileText size={20} style={{ color: "#b81c66" }} />
            <h3 style={{ fontSize: "1.1rem", fontWeight: "700" }}>
              Print / Export B&E ({bAndE.planYear || "2026"})
            </h3>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button
              type="button"
              onClick={() => exportBEToExcel(clientName, data)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.5rem 1rem",
                borderRadius: "6px",
                background: "#10b981",
                color: "#ffffff",
                fontWeight: "600",
                fontSize: "0.85rem",
                border: "none",
                cursor: "pointer",
              }}
            >
              <FileSpreadsheet size={16} />
              <span>Export to Excel (.xlsx)</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.5rem 1rem",
                borderRadius: "6px",
                background: "#b81c66",
                color: "#ffffff",
                fontWeight: "600",
                fontSize: "0.85rem",
                border: "none",
                cursor: "pointer",
              }}
            >
              <Printer size={16} />
              <span>Print Specification Document</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer" }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Printable Document Area */}
        <div style={{ padding: "2.5rem", fontSize: "0.9rem", lineHeight: "1.5" }}>
          {/* Header Banner */}
          <div style={{ borderBottom: "3px solid #b81c66", paddingBottom: "1rem", marginBottom: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.8rem", fontWeight: "700", textTransform: "uppercase", color: "#b81c66", letterSpacing: "0.05em" }}>
                  BILLING AND ENROLLMENT SUMMARY (B&E)
                </span>
                <span
                  style={{
                    background: bAndE.isCurrent ? "#fce7f3" : "#f1f5f9",
                    color: bAndE.isCurrent ? "#be185d" : "#475569",
                    padding: "0.15rem 0.5rem",
                    borderRadius: "4px",
                    fontSize: "0.75rem",
                    fontWeight: "700",
                  }}
                >
                  Plan Year {bAndE.planYear || "2026"} {bAndE.isCurrent ? "(Current)" : ""}
                </span>
              </div>

              <h1 style={{ fontSize: "1.8rem", fontWeight: "800", color: "#0f172a", margin: "0.2rem 0" }}>
                {clientName}
              </h1>

              <div style={{ fontSize: "0.85rem", color: "#64748b", display: "flex", alignItems: "center", gap: "1rem", marginTop: "0.2rem" }}>
                <span>Generated on {formatDisplayDate(new Date())}</span>
                {(bAndE.startDate || bAndE.endDate) && (
                  <span>
                    • Effective: <strong>{formatDisplayDate(bAndE.startDate) || "N/A"}</strong> to <strong>{formatDisplayDate(bAndE.endDate) || "N/A"}</strong>
                  </span>
                )}
              </div>
            </div>

            <div style={{ textAlign: "right", fontSize: "0.8rem", color: "#64748b" }}>
              <div>Client-Vendor Portal</div>
              <div style={{ fontWeight: "600", color: "#0f172a" }}>Group Profile Specs</div>
            </div>
          </div>

          {/* Section 1: Carrier & Underwriter Overview */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1rem", fontWeight: "700", color: "#0f172a", borderBottom: "1px solid #e2e8f0", paddingBottom: "0.3rem", marginBottom: "0.75rem" }}>
              Carrier & Underwriter Overview
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", fontSize: "0.85rem" }}>
              <div><strong>Current Stop-Loss Insurance Carrier:</strong> {bAndE.currentStopLossCarrier || "N/A"}</div>
              <div><strong>Current Managing General Underwriter:</strong> {bAndE.currentManagingGeneralUnderwriter || "N/A"}</div>
              <div><strong>Prior Stop-Loss Insurance Carrier:</strong> {bAndE.priorStopLossCarrier || "N/A"}</div>
              <div><strong>Prior Managing General Underwriter:</strong> {bAndE.priorManagingGeneralUnderwriter || "N/A"}</div>
            </div>
          </div>

          {/* Section 2: Specific Stop-Loss Information */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1rem", fontWeight: "700", color: "#0f172a", borderBottom: "1px solid #e2e8f0", paddingBottom: "0.3rem", marginBottom: "0.75rem" }}>
              Specific Stop-Loss Information
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", fontSize: "0.85rem" }}>
              <div><strong>Specific Stop-Loss Deductible:</strong> {bAndE.specificDeductible || "N/A"}</div>
              <div><strong>Aggregating Specific Deductible:</strong> {formatCurrencyDisplay(bAndE.aggregatingSpecificDeductible)}</div>
              <div><strong>No-Laser Renewal Guarantee:</strong> {bAndE.noLaserRenewalGuarantee || "N/A"}</div>
              <div><strong>Max Specific Premium Renewal Increase:</strong> {bAndE.maxSpecificPremiumRenewalIncrease || "N/A"}</div>
              <div><strong>Lasered Individuals:</strong> {bAndE.laseredIndividuals || "No"}</div>
              <div><strong>Specific Stop-Loss Benefits Covered:</strong> {bAndE.specificBenefitsCovered || "Med/Rx"}</div>
              <div><strong>Specific Stop-Loss Contract:</strong> {bAndE.specificContract || "N/A"}</div>
            </div>

            <div style={{ marginTop: "0.75rem", background: "#f8fafc", padding: "0.75rem 1rem", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
              <div style={{ fontWeight: "700", fontSize: "0.8rem", color: "#475569", marginBottom: "0.3rem" }}>
                Specific Premium Rates ({bAndE.specificTierStructure || "3-Tier"}):
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "0.5rem", fontSize: "0.85rem" }}>
                <div><strong>Single:</strong> {bAndE.specificPremiumSingle || "N/A"}</div>
                {bAndE.specificPremiumEmployeePlusOne && <div><strong>EE + 1:</strong> {bAndE.specificPremiumEmployeePlusOne}</div>}
                {bAndE.specificPremiumEmployeeSpouse && <div><strong>EE + Spouse:</strong> {bAndE.specificPremiumEmployeeSpouse}</div>}
                {bAndE.specificPremiumEmployeeChildren && <div><strong>EE + Child:</strong> {bAndE.specificPremiumEmployeeChildren}</div>}
                {bAndE.specificPremiumFamily && <div><strong>Family:</strong> {bAndE.specificPremiumFamily}</div>}
              </div>
            </div>
          </div>

          {/* Section 3: Aggregate Stop-Loss Information */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1rem", fontWeight: "700", color: "#0f172a", borderBottom: "1px solid #e2e8f0", paddingBottom: "0.3rem", marginBottom: "0.75rem" }}>
              Aggregate Stop-Loss Information
            </h2>
            {(bAndE.aggregateStopLossStatus === "None" || bAndE.aggregatePremium?.trim().toLowerCase() === "none") ? (
              <div style={{ background: "#f8fafc", padding: "0.75rem 1rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.85rem", color: "#64748b" }}>
                <strong>Aggregate Coverage:</strong> None (No Aggregate Stop-Loss Coverage Included)
              </div>
            ) : (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", fontSize: "0.85rem" }}>
                  <div><strong>Aggregate Premium:</strong> {bAndE.aggregatePremium || "N/A"}</div>
                  <div><strong>Monthly Aggregate Accommodation:</strong> {formatMonthlyAccommodationDisplay(bAndE.monthlyAggregateAccommodation)}</div>
                  <div><strong>Terminal Liability Option (TLO):</strong> {formatTloDisplay(bAndE.terminalLiabilityOption)}</div>
                  <div><strong>Min. Attachment Point:</strong> {bAndE.aggregateMinAttachmentPoint || "N/A"}</div>
                  <div><strong>Aggregate Run-in Limit:</strong> {formatRunInLimitDisplay(bAndE.aggregateRunInLimit)}</div>
                  <div><strong>Aggregate Benefits Covered:</strong> {bAndE.aggregateBenefitsCovered || "Med/Rx"}</div>
                  <div><strong>Aggregate Stop-Loss Contract:</strong> {bAndE.aggregateContract || "N/A"}</div>
                </div>

                <div style={{ marginTop: "0.75rem", background: "#f8fafc", padding: "0.75rem 1rem", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
                  <div style={{ fontWeight: "700", fontSize: "0.8rem", color: "#475569", marginBottom: "0.3rem" }}>
                    Aggregate Factors ({bAndE.specificTierStructure || "3-Tier"}):
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "0.5rem", fontSize: "0.85rem" }}>
                    <div><strong>Single:</strong> {formatCurrencyDisplay(bAndE.aggregateFactorSingle)}</div>
                    {bAndE.aggregateFactorEmployeePlusOne && <div><strong>EE + 1:</strong> {formatCurrencyDisplay(bAndE.aggregateFactorEmployeePlusOne)}</div>}
                    {bAndE.aggregateFactorEmployeeSpouse && <div><strong>EE + Spouse:</strong> {formatCurrencyDisplay(bAndE.aggregateFactorEmployeeSpouse)}</div>}
                    {bAndE.aggregateFactorEmployeeChildren && <div><strong>EE + Child:</strong> {formatCurrencyDisplay(bAndE.aggregateFactorEmployeeChildren)}</div>}
                    {bAndE.aggregateFactorFamily && <div><strong>Family:</strong> {formatCurrencyDisplay(bAndE.aggregateFactorFamily)}</div>}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Section 4: Composite Administration & PPO Network Information */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1rem", fontWeight: "700", color: "#0f172a", borderBottom: "1px solid #e2e8f0", paddingBottom: "0.3rem", marginBottom: "0.75rem" }}>
              Composite Administration & PPO Network Information
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", fontSize: "0.85rem" }}>
              <div><strong>Composite Administration Fee:</strong> {bAndE.compositeAdminFee || "N/A"}</div>
              <div><strong>Medical Administration:</strong> {bAndE.medicalFee || "N/A"}</div>
              <div><strong>UR (AHH):</strong> {bAndE.urFee || "N/A"}</div>
              <div><strong>Amwell Telehealth:</strong> {bAndE.amwellFee || "N/A"}</div>
              <div><strong>Physicians Care / HAP:</strong> {bAndE.physiciansCareHapFee || "N/A"}</div>
              <div><strong>Wrap Networks:</strong> {bAndE.wrapNetwork || "N/A"}</div>
              <div><strong>Aetna Signature Administrators:</strong> {bAndE.aetnaSignatureAdminFee || "N/A"}</div>
              <div><strong>Network Access Fee:</strong> {bAndE.networkAccessFee || "N/A"}</div>
              <div><strong>Reinsurance Fee:</strong> {bAndE.reinsuranceFee || "N/A"}</div>
              <div><strong>LCM / SPA (AHH):</strong> {bAndE.lcmSpaFee || "N/A"}</div>
              <div><strong>Agent Fee:</strong> {bAndE.agentFee || "N/A"}</div>
              <div style={{ gridColumn: "span 2" }}><strong>PPO Fee Notes:</strong> {bAndE.ppoFee || "N/A"}</div>
            </div>
          </div>

          {/* Section 5: PBM, Commissions & Organ Transplant */}
          <div style={{ marginBottom: "1.5rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <div>
              <h3 style={{ fontSize: "0.95rem", fontWeight: "700", color: "#0f172a", borderBottom: "1px solid #e2e8f0", paddingBottom: "0.3rem", marginBottom: "0.5rem" }}>
                PBM Information
              </h3>
              <div style={{ fontSize: "0.85rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                <div><strong>RX:</strong> {bAndE.pbmRx || "N/A"}</div>
                <div><strong>RX Included in ASR Reporting?:</strong> {bAndE.rxIncludedInAsrReporting || "No"}</div>
                <div><strong>Is Rx ASR's Contract?:</strong> {bAndE.isRxAsrContract || "No"}</div>
                <div><strong>Agent Compensation:</strong> {bAndE.pbmAgentCompensation || "No"}</div>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: "0.95rem", fontWeight: "700", color: "#0f172a", borderBottom: "1px solid #e2e8f0", paddingBottom: "0.3rem", marginBottom: "0.5rem" }}>
                Commission & Policy Information
              </h3>
              <div style={{ fontSize: "0.85rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                <div><strong>Stop-loss Commission:</strong> {bAndE.stopLossCommission || "0%"}</div>
                <div><strong>Stop-loss Other Compensation:</strong> {bAndE.stopLossOtherCompensation || "N/A"}</div>
                <div><strong>Organ Transplant Policy:</strong> {bAndE.organTransplantPolicy || "No"}</div>
                <div><strong>Domestic Claims?:</strong> {bAndE.domesticClaims || "No"}</div>
              </div>
            </div>
          </div>

          {/* Section 6: Census Figures */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1rem", fontWeight: "700", color: "#0f172a", borderBottom: "1px solid #e2e8f0", paddingBottom: "0.3rem", marginBottom: "0.75rem" }}>
              Enrollment Figures (Census - {bAndE.specificTierStructure || "3-Tier"})
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: "0.5rem", fontSize: "0.85rem", textAlign: "center", background: "#f8fafc", padding: "0.75rem", borderRadius: "6px" }}>
              <div><strong>Single:</strong> {bAndE.figuresSingle || "0"}</div>
              {bAndE.figuresEmployeePlusOne && <div><strong>EE + 1:</strong> {bAndE.figuresEmployeePlusOne}</div>}
              {bAndE.figuresEmployeeSpouse && <div><strong>EE + Spouse:</strong> {bAndE.figuresEmployeeSpouse}</div>}
              {bAndE.figuresEmployeeChildren && <div><strong>EE + Child:</strong> {bAndE.figuresEmployeeChildren}</div>}
              {bAndE.figuresFamily && <div><strong>Family:</strong> {bAndE.figuresFamily}</div>}
              <div><strong>Total:</strong> {bAndE.figuresTotal || "0"}</div>
            </div>
          </div>

          {/* Section 7: Specification & Stop-Loss Notes */}
          {(bAndE.stopLossNotes || bAndE.notes) && (
            <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {bAndE.stopLossNotes && (
                <div style={{ background: "#f5f3ff", border: "1px solid #ddd6fe", padding: "0.85rem 1rem", borderRadius: "6px", fontSize: "0.85rem" }}>
                  <strong style={{ color: "#6d28d9" }}>STOP-LOSS NOTES & CONTRACT TERMS:</strong>
                  <div style={{ marginTop: "0.25rem", whiteSpace: "pre-wrap" }}>{bAndE.stopLossNotes}</div>
                </div>
              )}
              {bAndE.notes && (
                <div style={{ background: "#fffbeb", border: "1px solid #fef3c7", padding: "0.85rem 1rem", borderRadius: "6px", fontSize: "0.85rem" }}>
                  <strong style={{ color: "#b45309" }}>B&E OPERATIONAL NOTES:</strong>
                  <div style={{ marginTop: "0.25rem", whiteSpace: "pre-wrap" }}>{bAndE.notes}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
