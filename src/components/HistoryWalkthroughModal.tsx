"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Clock,
  History,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Building2,
  Store,
  Phone,
  Mail,
  MapPin,
  FileText,
  Tag,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import { FIELD_LABELS } from "@/lib/history";

interface HistoryWalkthroughModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: any[];
  entityType: "CLIENT" | "VENDOR";
  entityName: string;
  initialStepIndex?: number;
  accentColor?: "pink" | "blue";
}

export default function HistoryWalkthroughModal({
  isOpen,
  onClose,
  history,
  entityType,
  entityName,
  initialStepIndex = 0,
  accentColor = "pink",
}: HistoryWalkthroughModalProps) {
  // Sort history chronologically (oldest first: Step 0 is creation, Step N is current/latest)
  const sortedHistory = React.useMemo(() => {
    if (!history) return [];
    return [...history].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [history]);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (initialStepIndex >= 0 && initialStepIndex < sortedHistory.length) {
      setCurrentStepIndex(initialStepIndex);
    } else {
      setCurrentStepIndex(Math.max(0, sortedHistory.length - 1));
    }
  }, [initialStepIndex, sortedHistory]);

  if (!isOpen || sortedHistory.length === 0) return null;

  const currentStep = sortedHistory[currentStepIndex];
  const totalSteps = sortedHistory.length;

  let parsedSnapshot: Record<string, any> = {};
  if (currentStep?.snapshot) {
    try {
      parsedSnapshot = typeof currentStep.snapshot === "string" ? JSON.parse(currentStep.snapshot) : currentStep.snapshot;
    } catch (e) {
      console.error("Error parsing snapshot:", e);
    }
  }

  let parsedDiffs: any[] = [];
  if (currentStep?.changes) {
    try {
      parsedDiffs = typeof currentStep.changes === "string" ? JSON.parse(currentStep.changes) : currentStep.changes;
    } catch (e) {
      console.error("Error parsing changes:", e);
    }
  }

  const isLatest = currentStepIndex === totalSteps - 1;
  const isFirst = currentStepIndex === 0;

  const isPink = accentColor === "pink";
  const primaryThemeColor = isPink ? "#ec4899" : "#3b82f6";
  const modalBorderColor = isPink ? "rgba(236, 72, 153, 0.4)" : "rgba(59, 130, 246, 0.4)";

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.82)",
        backdropFilter: "blur(12px)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
      }}
      onClick={onClose}
    >
      <div
        className="walkthrough-modal-dialog"
        style={{
          width: "100%",
          maxWidth: "1050px",
          maxHeight: "92vh",
          border: `1px solid ${modalBorderColor}`,
          borderRadius: "var(--radius-xl)",
          boxShadow: `0 25px 60px -15px ${isPink ? "rgba(236, 72, 153, 0.25)" : "rgba(59, 130, 246, 0.25)"}`,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: "1.25rem 1.75rem",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div
              style={{
                padding: "0.5rem",
                borderRadius: "10px",
                background: isPink ? "rgba(236, 72, 153, 0.15)" : "rgba(59, 130, 246, 0.15)",
                color: primaryThemeColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <History size={22} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span className={`badge ${isPink ? "badge-pink" : "badge-blue"}`}>
                  {entityType === "CLIENT" ? "Group History Walkthrough" : "Vendor History Walkthrough"}
                </span>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  {entityName}
                </span>
              </div>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "800", marginTop: "0.1rem" }}>
                Interactive Change Time-Travel
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "var(--bg-card-hover)",
              border: "1px solid var(--border)",
              color: "var(--text-secondary)",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Interactive Stepper & Scrubber Bar */}
        <div
          className="walkthrough-modal-stepper"
          style={{
            padding: "1rem 1.75rem",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <button
              onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
              disabled={isFirst}
              className="btn btn-secondary btn-sm"
              style={{ opacity: isFirst ? 0.4 : 1, display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
            >
              <ChevronLeft size={16} />
              <span>Previous Revision</span>
            </button>

            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-primary)" }}>
                Revision {currentStepIndex + 1} of {totalSteps}
                {isLatest && (
                  <span
                    style={{
                      marginLeft: "0.5rem",
                      fontSize: "0.75rem",
                      background: "rgba(16, 185, 129, 0.2)",
                      color: "#10b981",
                      padding: "0.1rem 0.5rem",
                      borderRadius: "10px",
                      fontWeight: "600",
                    }}
                  >
                    Current State
                  </span>
                )}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.1rem" }}>
                {new Date(currentStep.createdAt).toLocaleString(undefined, {
                  dateStyle: "full",
                  timeStyle: "medium",
                })}
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              {!isLatest && (
                <button
                  onClick={() => setCurrentStepIndex(totalSteps - 1)}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: "0.75rem", padding: "0.3rem 0.6rem" }}
                  title="Jump to current latest version"
                >
                  <RotateCcw size={13} style={{ marginRight: "0.3rem" }} />
                  Current
                </button>
              )}
              <button
                onClick={() => setCurrentStepIndex((prev) => Math.min(totalSteps - 1, prev + 1))}
                disabled={isLatest}
                className="btn btn-secondary btn-sm"
                style={{ opacity: isLatest ? 0.4 : 1, display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
              >
                <span>Next Revision</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Timeline Dots Scrubber */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", width: "100%", padding: "0.25rem 0" }}>
            {sortedHistory.map((step: any, sIdx: number) => {
              const active = sIdx === currentStepIndex;
              return (
                <button
                  key={sIdx}
                  onClick={() => setCurrentStepIndex(sIdx)}
                  style={{
                    flex: 1,
                    height: active ? "8px" : "4px",
                    borderRadius: "4px",
                    background: active
                      ? primaryThemeColor
                      : sIdx < currentStepIndex
                      ? primaryThemeColor + "66"
                      : "var(--border)",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    boxShadow: active ? `0 0 10px ${primaryThemeColor}` : "none",
                  }}
                  title={`Revision ${sIdx + 1}: ${step.summary}`}
                />
              );
            })}
          </div>
        </div>

        {/* Modal Body / Revision Detail */}
        <div
          style={{
            padding: "1.75rem",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
            flex: 1,
          }}
        >
          {/* Action Summary Card */}
          <div
            className="walkthrough-modal-summary"
            style={{
              padding: "1.25rem",
              borderRadius: "var(--radius-lg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>
                Action Summary
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--text-primary)" }}>
                {currentStep.summary}
              </h3>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span
                style={{
                  fontSize: "0.8rem",
                  fontWeight: "700",
                  padding: "0.3rem 0.75rem",
                  borderRadius: "20px",
                  background: currentStep.action === "CREATE" ? "rgba(16, 185, 129, 0.2)" : "rgba(236, 72, 153, 0.2)",
                  color: currentStep.action === "CREATE" ? "#10b981" : primaryThemeColor,
                  border: `1px solid ${currentStep.action === "CREATE" ? "rgba(16, 185, 129, 0.4)" : modalBorderColor}`,
                }}
              >
                {currentStep.action}
              </span>
            </div>
          </div>

          {/* Diffs Highlight Card (What changed in this revision) */}
          {parsedDiffs.length > 0 && (
            <div>
              <h4 style={{ fontSize: "0.95rem", fontWeight: "700", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Sparkles size={16} style={{ color: primaryThemeColor }} />
                <span>Changes Made In This Revision ({parsedDiffs.length})</span>
              </h4>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "0.875rem" }}>
                {parsedDiffs.map((diff: any, idx: number) => (
                  <div
                    key={idx}
                    className="walkthrough-diff-card"
                    style={{
                      padding: "0.875rem 1rem",
                      borderRadius: "var(--radius-md)",
                      fontSize: "0.85rem",
                    }}
                  >
                    <div style={{ fontWeight: "700", color: "var(--text-primary)", marginBottom: "0.4rem" }}>
                      {diff.label || FIELD_LABELS[diff.field] || diff.field}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                      {diff.oldValue !== null && diff.oldValue !== undefined ? (
                        <span style={{ color: "#ef4444", textDecoration: "line-through", background: "rgba(239, 68, 68, 0.1)", padding: "0.15rem 0.5rem", borderRadius: "4px" }}>
                          {diff.oldValue || "—"}
                        </span>
                      ) : (
                        <span style={{ color: "var(--text-muted)", fontStyle: "italic" }}>(Initial)</span>
                      )}

                      <ArrowRight size={14} style={{ color: "var(--text-muted)" }} />

                      {diff.newValue !== null && diff.newValue !== undefined ? (
                        <span style={{ color: "#10b981", fontWeight: "600", background: "rgba(16, 185, 129, 0.1)", padding: "0.15rem 0.5rem", borderRadius: "4px" }}>
                          {diff.newValue || "—"}
                        </span>
                      ) : (
                        <span style={{ color: "var(--text-muted)", fontStyle: "italic" }}>(Cleared)</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Historical Profile Snapshot Preview */}
          <div>
            <h4 style={{ fontSize: "0.95rem", fontWeight: "700", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Clock size={16} style={{ color: "var(--text-muted)" }} />
              <span>Record Snapshot at Revision {currentStepIndex + 1}</span>
            </h4>

            {Object.keys(parsedSnapshot).length > 0 ? (
              <div
                className="walkthrough-snapshot-card"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                  borderRadius: "var(--radius-lg)",
                  padding: "1.25rem",
                }}
              >
                {/* Basic Info */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.875rem" }}>
                  <div>
                    <span style={{ color: "var(--text-muted)", fontSize: "0.75rem", display: "block" }}>Name / Title</span>
                    <strong style={{ fontSize: "1rem", color: "var(--text-primary)" }}>{parsedSnapshot.name || "—"}</strong>
                  </div>

                  <div style={{ display: "flex", gap: "1.5rem" }}>
                    <div>
                      <span style={{ color: "var(--text-muted)", fontSize: "0.75rem", display: "block" }}>Tax ID</span>
                      <strong className="text-mono">{parsedSnapshot.taxId || "—"}</strong>
                    </div>

                    {entityType === "CLIENT" ? (
                      <div>
                        <span style={{ color: "var(--text-muted)", fontSize: "0.75rem", display: "block" }}>Group Number</span>
                        <strong className="text-mono">{parsedSnapshot.npiNumber || "—"}</strong>
                      </div>
                    ) : (
                      <div>
                        <span style={{ color: "var(--text-muted)", fontSize: "0.75rem", display: "block" }}>Vendor Type</span>
                        <span>{parsedSnapshot.vendorType || "—"}</span>
                      </div>
                    )}

                    <div>
                      <span style={{ color: "var(--text-muted)", fontSize: "0.75rem", display: "block" }}>Status</span>
                      <span
                        className={`badge ${
                          parsedSnapshot.status === "ACTIVE"
                            ? "badge-active"
                            : parsedSnapshot.status === "INACTIVE"
                            ? "badge-inactive"
                            : "badge-pending"
                        }`}
                      >
                        {parsedSnapshot.status || "ACTIVE"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span style={{ color: "var(--text-muted)", fontSize: "0.75rem", display: "block" }}>
                      {entityType === "CLIENT" ? "Specialty" : "Type"}
                    </span>
                    <span>{parsedSnapshot.specialty || parsedSnapshot.vendorType || "—"}</span>
                  </div>
                </div>

                {/* Contact & Location Info */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.875rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Phone size={15} style={{ color: "var(--text-muted)" }} />
                    <span>{parsedSnapshot.phone || "No phone listed"}</span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Mail size={15} style={{ color: "var(--text-muted)" }} />
                    <span>{parsedSnapshot.email || "No email listed"}</span>
                  </div>

                  <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                    <MapPin size={15} style={{ color: "var(--text-muted)", marginTop: "0.15rem" }} />
                    <div>
                      <div>{parsedSnapshot.address || "No address"}</div>
                      <div>
                        {parsedSnapshot.city && parsedSnapshot.state
                          ? `${parsedSnapshot.city}, ${parsedSnapshot.state} ${parsedSnapshot.zipCode || ""}`
                          : "—"}
                      </div>
                    </div>
                  </div>

                  {parsedSnapshot.notes && (
                    <div style={{ marginTop: "0.5rem", paddingTop: "0.5rem", borderTop: "1px dashed var(--border)" }}>
                      <span style={{ color: "var(--text-muted)", fontSize: "0.75rem", display: "block" }}>Notes at this point:</span>
                      <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
                        {parsedSnapshot.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ padding: "1rem", color: "var(--text-muted)", fontSize: "0.85rem", fontStyle: "italic" }}>
                No snapshot preview available for this historical record step.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
