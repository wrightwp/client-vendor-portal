"use client";

import { useState } from "react";
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
} from "lucide-react";
import EditBillingEnrollmentModal from "./EditBillingEnrollmentModal";
import PrintBillingEnrollmentModal from "./PrintBillingEnrollmentModal";
import { exportBEToExcel } from "@/lib/exportBEExcel";

interface BillingEnrollmentSectionProps {
  clientId: string;
  clientName: string;
  data: any;
  onRefresh: () => void;
}

export default function BillingEnrollmentSection({
  clientId,
  clientName,
  data,
  onRefresh,
}: BillingEnrollmentSectionProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isNewYearMode, setIsNewYearMode] = useState(false);
  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Normalize data into array of plan year records
  const enrollmentsList: any[] = Array.isArray(data)
    ? data
    : data
    ? [data]
    : [];

  // Sort descending by planYear
  const sortedEnrollments = [...enrollmentsList].sort((a, b) =>
    (b.planYear || "").localeCompare(a.planYear || "")
  );

  // Determine active plan year
  const currentRecord = sortedEnrollments.find((e) => e.isCurrent) || sortedEnrollments[0];
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  const activeYear =
    selectedYear && sortedEnrollments.some((e) => e.planYear === selectedYear)
      ? selectedYear
      : currentRecord?.planYear || "2026";

  const activeBAndE =
    sortedEnrollments.find((e) => e.planYear === activeYear) || currentRecord || {};

  return (
    <div className="glass-panel" style={{ padding: "1.25rem 1.5rem", border: "1px solid rgba(184, 28, 102, 0.35)" }}>
      {/* Section Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "1rem",
          marginBottom: isExpanded ? "1.25rem" : "0",
          cursor: "pointer",
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div
              style={{
                padding: "0.6rem",
                borderRadius: "10px",
                background: "rgba(244, 114, 182, 0.15)",
                color: "var(--accent-pink)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <FileText size={24} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                <span className="badge badge-pink" style={{ fontSize: "0.7rem" }}>GROUP SPECIFICATION</span>
                <h2 style={{ fontSize: "1.35rem", fontWeight: "800" }}>
                  B&E (Billing & Enrollment Summary)
                </h2>
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "0.15rem" }}>
                Complete stop-loss, administrative fees, PBM network, and census specifications for {clientName}.
              </p>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "0.875rem", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                exportBEToExcel(clientName, activeBAndE);
              }}
              className="btn btn-secondary btn-sm"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
              title="Export active B&E specifications as an Excel spreadsheet (.xlsx)"
            >
              <FileSpreadsheet size={15} style={{ color: "#10b981" }} />
              <span>Export B&E to Excel</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsPrintOpen(true);
              }}
              className="btn btn-secondary btn-sm"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
            >
              <Printer size={15} style={{ color: "var(--accent-pink)" }} />
              <span>Print / Export B&E</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsNewYearMode(false);
                setIsEditOpen(true);
              }}
              className="btn btn-primary btn-sm"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
            >
              <Edit3 size={15} />
              <span>Edit Plan Year ({activeBAndE.planYear || "2026"})</span>
            </button>
          </div>
        </div>

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

      {/* Expanded Content View */}
      {isExpanded && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Plan Year Tabs Bar */}
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
                    onClick={() => setSelectedYear(item.planYear)}
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
                  setIsEditOpen(true);
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

            {/* Effective Dates Badge */}
            {(activeBAndE.startDate || activeBAndE.endDate) && (
              <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <span style={{ color: "var(--text-muted)" }}>Effective Period:</span>
                <strong style={{ color: "var(--text-primary)" }}>
                  {activeBAndE.startDate || "N/A"}
                </strong>
                <span>to</span>
                <strong style={{ color: "var(--text-primary)" }}>
                  {activeBAndE.endDate || "N/A"}
                </strong>
              </div>
            )}
          </div>

          {/* Top Overview Cards Grid */}
          <div className="grid-cols-2" style={{ gap: "1.25rem" }}>
            {/* Carrier & Managing Underwriter */}
            <div
              className="glass-card"
              style={{
                padding: "1.25rem",
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid var(--border)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                <Shield size={18} style={{ color: "var(--accent-pink)" }} />
                <h3 style={{ fontSize: "1rem", fontWeight: "700" }}>Stop-Loss Carrier & Underwriter</h3>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", fontSize: "0.85rem" }}>
                <div>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>Current Carrier</div>
                  <div style={{ fontWeight: "700", marginTop: "0.2rem" }}>
                    {activeBAndE.currentStopLossCarrier || "Not specified"}
                  </div>
                </div>

                <div>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>Current MGU</div>
                  <div style={{ fontWeight: "700", marginTop: "0.2rem" }}>
                    {activeBAndE.currentManagingGeneralUnderwriter || "Not specified"}
                  </div>
                </div>

                <div>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>Prior Carrier</div>
                  <div style={{ marginTop: "0.2rem" }}>
                    {activeBAndE.priorStopLossCarrier || "—"}
                  </div>
                </div>

                <div>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>Prior MGU</div>
                  <div style={{ marginTop: "0.2rem" }}>
                    {activeBAndE.priorManagingGeneralUnderwriter || "—"}
                  </div>
                </div>
              </div>
            </div>

            {/* Census / Figures */}
            <div
              className="glass-card"
              style={{
                padding: "1.25rem",
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid var(--border)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                <Users size={18} style={{ color: "var(--accent-pink)" }} />
                <h3 style={{ fontSize: "1rem", fontWeight: "700" }}>Enrollment Census / Tier Breakdown</h3>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem", textAlign: "center" }}>
                <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "0.75rem 0.5rem", borderRadius: "8px", border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: "1.25rem", fontWeight: "800", color: "var(--accent-pink)" }}>
                    {activeBAndE.figuresSingle || "0"}
                  </div>
                  <div style={{ fontSize: "0.725rem", color: "var(--text-muted)" }}>Single</div>
                </div>

                <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "0.75rem 0.5rem", borderRadius: "8px", border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: "1.25rem", fontWeight: "800", color: "var(--accent-pink)" }}>
                    {activeBAndE.figuresEmployeePlusOne || "0"}
                  </div>
                  <div style={{ fontSize: "0.725rem", color: "var(--text-muted)" }}>Employee + 1</div>
                </div>

                <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "0.75rem 0.5rem", borderRadius: "8px", border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: "1.25rem", fontWeight: "800", color: "var(--accent-pink)" }}>
                    {activeBAndE.figuresFamily || "0"}
                  </div>
                  <div style={{ fontSize: "0.725rem", color: "var(--text-muted)" }}>Family</div>
                </div>

                <div style={{ background: "rgba(244, 114, 182, 0.1)", padding: "0.75rem 0.5rem", borderRadius: "8px", border: "1px solid rgba(244, 114, 182, 0.3)" }}>
                  <div style={{ fontSize: "1.25rem", fontWeight: "800", color: "#f472b6" }}>
                    {activeBAndE.figuresTotal || "0"}
                  </div>
                  <div style={{ fontSize: "0.725rem", color: "#f472b6", fontWeight: "700" }}>Total Census</div>
                </div>
              </div>
            </div>
          </div>

          {/* Specific Stop-Loss & Aggregate Stop-Loss Grid */}
          <div className="grid-cols-2" style={{ gap: "1.25rem" }}>
            {/* Specific Stop-Loss */}
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
                  <Percent size={18} style={{ color: "var(--accent-blue)" }} />
                  <h3 style={{ fontSize: "1rem", fontWeight: "700" }}>Specific Stop-Loss Specs</h3>
                </div>
                <span className="badge badge-blue" style={{ fontSize: "0.7rem" }}>
                  {activeBAndE.specificContract || "12/12"}
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.85rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed var(--border)", paddingBottom: "0.4rem" }}>
                  <span style={{ color: "var(--text-muted)" }}>Specific Deductible</span>
                  <strong style={{ color: "var(--text-primary)" }}>{activeBAndE.specificDeductible || "—"}</strong>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed var(--border)", paddingBottom: "0.4rem" }}>
                  <span style={{ color: "var(--text-muted)" }}>Aggregating Specific Deductible</span>
                  <span>{activeBAndE.aggregatingSpecificDeductible || "No"}</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed var(--border)", paddingBottom: "0.4rem" }}>
                  <span style={{ color: "var(--text-muted)" }}>No-Laser Renewal Guarantee</span>
                  <span>{activeBAndE.noLaserRenewalGuarantee || "No"}</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed var(--border)", paddingBottom: "0.4rem" }}>
                  <span style={{ color: "var(--text-muted)" }}>Max Specific Renewal Increase</span>
                  <span>{activeBAndE.maxSpecificPremiumRenewalIncrease || "—"}</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed var(--border)", paddingBottom: "0.4rem" }}>
                  <span style={{ color: "var(--text-muted)" }}>Lasered Individuals</span>
                  <span>{activeBAndE.laseredIndividuals || "No"}</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed var(--border)", paddingBottom: "0.4rem" }}>
                  <span style={{ color: "var(--text-muted)" }}>Benefits Covered</span>
                  <span>{activeBAndE.specificBenefitsCovered || "Med/Rx"}</span>
                </div>

                <div style={{ marginTop: "0.5rem", background: "rgba(56, 189, 248, 0.05)", padding: "0.75rem", borderRadius: "8px", border: "1px solid rgba(56, 189, 248, 0.2)" }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: "700", color: "#38bdf8", marginBottom: "0.4rem" }}>
                    Specific Premium Rates
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem", fontSize: "0.8rem", textAlign: "center" }}>
                    <div>
                      <div style={{ color: "var(--text-muted)", fontSize: "0.7rem" }}>Single</div>
                      <div style={{ fontWeight: "700" }}>{activeBAndE.specificPremiumSingle || "—"}</div>
                    </div>
                    <div>
                      <div style={{ color: "var(--text-muted)", fontSize: "0.7rem" }}>Emp + 1</div>
                      <div style={{ fontWeight: "700" }}>{activeBAndE.specificPremiumEmployeePlusOne || "—"}</div>
                    </div>
                    <div>
                      <div style={{ color: "var(--text-muted)", fontSize: "0.7rem" }}>Family</div>
                      <div style={{ fontWeight: "700" }}>{activeBAndE.specificPremiumFamily || "—"}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Aggregate Stop-Loss */}
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
                  <Layers size={18} style={{ color: "var(--accent-purple)" }} />
                  <h3 style={{ fontSize: "1rem", fontWeight: "700" }}>Aggregate Stop-Loss Specs</h3>
                </div>
                <span className="badge badge-purple" style={{ fontSize: "0.7rem" }}>
                  {activeBAndE.aggregateContract || "12/12"}
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.85rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed var(--border)", paddingBottom: "0.4rem" }}>
                  <span style={{ color: "var(--text-muted)" }}>Aggregate Premium</span>
                  <strong style={{ color: "var(--text-primary)" }}>{activeBAndE.aggregatePremium || "—"}</strong>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed var(--border)", paddingBottom: "0.4rem" }}>
                  <span style={{ color: "var(--text-muted)" }}>Monthly Accommodation</span>
                  <span>{activeBAndE.monthlyAggregateAccommodation || "—"}</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed var(--border)", paddingBottom: "0.4rem" }}>
                  <span style={{ color: "var(--text-muted)" }}>Min Attachment Point</span>
                  <strong style={{ color: "#c084fc" }}>{activeBAndE.aggregateMinAttachmentPoint || "—"}</strong>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed var(--border)", paddingBottom: "0.4rem" }}>
                  <span style={{ color: "var(--text-muted)" }}>Run-in Limit</span>
                  <span>{activeBAndE.aggregateRunInLimit || "No"}</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed var(--border)", paddingBottom: "0.4rem" }}>
                  <span style={{ color: "var(--text-muted)" }}>Benefits Covered</span>
                  <span>{activeBAndE.aggregateBenefitsCovered || "Med/Rx"}</span>
                </div>

                <div style={{ marginTop: "0.5rem", background: "rgba(192, 132, 252, 0.05)", padding: "0.75rem", borderRadius: "8px", border: "1px solid rgba(192, 132, 252, 0.2)" }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: "700", color: "#c084fc", marginBottom: "0.4rem" }}>
                    Aggregate Factors
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem", fontSize: "0.8rem", textAlign: "center" }}>
                    <div>
                      <div style={{ color: "var(--text-muted)", fontSize: "0.7rem" }}>Single</div>
                      <div style={{ fontWeight: "700" }}>{activeBAndE.aggregateFactorSingle || "—"}</div>
                    </div>
                    <div>
                      <div style={{ color: "var(--text-muted)", fontSize: "0.7rem" }}>Emp + 1</div>
                      <div style={{ fontWeight: "700" }}>{activeBAndE.aggregateFactorEmployeePlusOne || "—"}</div>
                    </div>
                    <div>
                      <div style={{ color: "var(--text-muted)", fontSize: "0.7rem" }}>Family</div>
                      <div style={{ fontWeight: "700" }}>{activeBAndE.aggregateFactorFamily || "—"}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Administration Fees, PPO Networks & PBM */}
          <div
            className="glass-card"
            style={{
              padding: "1.5rem",
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid var(--border)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
              <Network size={20} style={{ color: "var(--accent-yellow)" }} />
              <h3 style={{ fontSize: "1.05rem", fontWeight: "700" }}>
                Composite Administration & PPO Network Information
              </h3>
            </div>

            <div className="grid-cols-2" style={{ gap: "1.25rem", fontSize: "0.85rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed var(--border)", paddingBottom: "0.4rem" }}>
                  <span style={{ color: "var(--text-muted)" }}>Composite Admin Fee</span>
                  <strong style={{ color: "#ffc20e" }}>{activeBAndE.compositeAdminFee || "—"}</strong>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed var(--border)", paddingBottom: "0.4rem" }}>
                  <span style={{ color: "var(--text-muted)" }}>Medical Administration</span>
                  <span>{activeBAndE.medicalFee || "—"}</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed var(--border)", paddingBottom: "0.4rem" }}>
                  <span style={{ color: "var(--text-muted)" }}>UR (Utilization Review)</span>
                  <span>{activeBAndE.urFee || "—"}</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed var(--border)", paddingBottom: "0.4rem" }}>
                  <span style={{ color: "var(--text-muted)" }}>Amwell Telehealth</span>
                  <span>{activeBAndE.amwellFee || "—"}</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed var(--border)", paddingBottom: "0.4rem" }}>
                  <span style={{ color: "var(--text-muted)" }}>Physicians Care / HAP</span>
                  <span>{activeBAndE.physiciansCareHapFee || "—"}</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed var(--border)", paddingBottom: "0.4rem" }}>
                  <span style={{ color: "var(--text-muted)" }}>Aetna Signature Admin</span>
                  <span>{activeBAndE.aetnaSignatureAdminFee || "—"}</span>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed var(--border)", paddingBottom: "0.4rem" }}>
                  <span style={{ color: "var(--text-muted)" }}>Network Access Fee</span>
                  <span>{activeBAndE.networkAccessFee || "—"}</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed var(--border)", paddingBottom: "0.4rem" }}>
                  <span style={{ color: "var(--text-muted)" }}>Reinsurance Fee</span>
                  <span>{activeBAndE.reinsuranceFee || "—"}</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed var(--border)", paddingBottom: "0.4rem" }}>
                  <span style={{ color: "var(--text-muted)" }}>LCM / SPA (AHH)</span>
                  <span>{activeBAndE.lcmSpaFee || "—"}</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed var(--border)", paddingBottom: "0.4rem" }}>
                  <span style={{ color: "var(--text-muted)" }}>Agent Fee</span>
                  <span>{activeBAndE.agentFee || "—"}</span>
                </div>

                <div style={{ borderBottom: "1px dashed var(--border)", paddingBottom: "0.4rem" }}>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>Wrap Networks</div>
                  <div style={{ fontWeight: "600", color: "var(--text-primary)", marginTop: "0.15rem" }}>
                    {activeBAndE.wrapNetwork || "—"}
                  </div>
                </div>

                <div style={{ paddingBottom: "0.4rem" }}>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>PPO Fee Notes</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.15rem", lineHeight: "1.4" }}>
                    {activeBAndE.ppoFee || "—"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PBM, Commission & Additional Policies Grid */}
          <div className="grid-cols-3" style={{ gap: "1.25rem" }}>
            {/* PBM Specs */}
            <div
              className="glass-card"
              style={{
                padding: "1.25rem",
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid var(--border)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                <Pill size={18} style={{ color: "#34d399" }} />
                <h3 style={{ fontSize: "0.95rem", fontWeight: "700" }}>PBM Information</h3>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.85rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>PBM Provider</span>
                  <strong style={{ color: "#34d399" }}>{activeBAndE.pbmRx || "—"}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Rx in ASR Reporting?</span>
                  <span>{activeBAndE.rxIncludedInAsrReporting || "No"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Rx ASR Contract?</span>
                  <span>{activeBAndE.isRxAsrContract || "No"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Agent Comp</span>
                  <span>{activeBAndE.pbmAgentCompensation || "No"}</span>
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
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                <DollarSign size={18} style={{ color: "#f472b6" }} />
                <h3 style={{ fontSize: "0.95rem", fontWeight: "700" }}>Commission Info</h3>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.85rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Stop-Loss Commission</span>
                  <span>{activeBAndE.stopLossCommission || "0%"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Stop-Loss Other Comp</span>
                  <span>{activeBAndE.stopLossOtherCompensation || "—"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Agent Compensation</span>
                  <span>{activeBAndE.commissionAgentCompensation || "No"}</span>
                </div>
              </div>
            </div>

            {/* Organ Transplant & Domestic Claims */}
            <div
              className="glass-card"
              style={{
                padding: "1.25rem",
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid var(--border)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                <HeartHandshake size={18} style={{ color: "#60a5fa" }} />
                <h3 style={{ fontSize: "0.95rem", fontWeight: "700" }}>Transplant & Domestic</h3>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.85rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Transplant Policy</span>
                  <span>{activeBAndE.organTransplantPolicy || "No"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Domestic Claims?</span>
                  <span>{activeBAndE.domesticClaims || "No"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Operational Notes */}
          {activeBAndE.notes && (
            <div
              className="glass-card"
              style={{
                padding: "1rem 1.25rem",
                background: "rgba(255, 194, 14, 0.04)",
                border: "1px solid rgba(255, 194, 14, 0.25)",
                borderRadius: "8px",
              }}
            >
              <div style={{ fontSize: "0.8rem", fontWeight: "700", color: "#ffc20e", marginBottom: "0.25rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <AlertCircle size={15} />
                <span>B&E Specification Notes ({activeBAndE.planYear || "2026"})</span>
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", whiteSpace: "pre-wrap" }}>
                {activeBAndE.notes}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Edit Modal */}
      {isEditOpen && (
        <EditBillingEnrollmentModal
          clientId={clientId}
          clientName={clientName}
          initialData={isNewYearMode ? null : activeBAndE}
          allEnrollments={sortedEnrollments}
          isNewPlanYear={isNewYearMode}
          onClose={() => setIsEditOpen(false)}
          onSuccess={() => {
            setIsEditOpen(false);
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
