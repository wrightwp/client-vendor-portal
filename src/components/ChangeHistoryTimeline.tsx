"use client";

import React, { useState } from "react";
import {
  History,
  Clock,
  PlusCircle,
  Edit,
  RefreshCw,
  Link as LinkIcon,
  Unlink,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Eye,
} from "lucide-react";
import { FIELD_LABELS } from "@/lib/history";

interface ChangeHistoryTimelineProps {
  history: any[];
  onSelectVersion?: (index: number) => void;
  accentColor?: "pink" | "blue";
  collapsible?: boolean;
  defaultOpen?: boolean;
  isOpen?: boolean;
  onToggleOpen?: () => void;
}

export default function ChangeHistoryTimeline({
  history,
  onSelectVersion,
  accentColor = "pink",
  collapsible = true,
  defaultOpen = false,
  isOpen,
  onToggleOpen,
}: ChangeHistoryTimelineProps) {
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const [internalExpanded, setInternalExpanded] = useState(defaultOpen);

  const isCardExpanded = isOpen !== undefined ? isOpen : internalExpanded;

  const handleToggleCard = () => {
    if (onToggleOpen) {
      onToggleOpen();
    } else {
      setInternalExpanded(!internalExpanded);
    }
  };

  if (!history || history.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: "1.5rem 2rem", textAlign: "center" }}>
        <History size={28} style={{ color: "var(--text-muted)", marginBottom: "0.5rem", opacity: 0.5 }} />
        <h3 style={{ fontSize: "0.95rem", fontWeight: "700", marginBottom: "0.2rem" }}>No Change History Recorded</h3>
        <p style={{ fontSize: "0.825rem", color: "var(--text-muted)" }}>
          Future edits, status updates, and association changes will be tracked here automatically.
        </p>
      </div>
    );
  }

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case "CREATE":
        return {
          label: "Created",
          icon: <PlusCircle size={14} />,
          bg: "rgba(16, 185, 129, 0.15)",
          color: "#10b981",
          border: "rgba(16, 185, 129, 0.3)",
        };
      case "STATUS_CHANGE":
        return {
          label: "Status Changed",
          icon: <RefreshCw size={14} />,
          bg: "rgba(245, 158, 11, 0.15)",
          color: "#f59e0b",
          border: "rgba(245, 158, 11, 0.3)",
        };
      case "ASSOCIATION_ADDED":
        return {
          label: "Association Linked",
          icon: <LinkIcon size={14} />,
          bg: "rgba(59, 130, 246, 0.15)",
          color: "#3b82f6",
          border: "rgba(59, 130, 246, 0.3)",
        };
      case "ASSOCIATION_REMOVED":
        return {
          label: "Association Removed",
          icon: <Unlink size={14} />,
          bg: "rgba(239, 68, 68, 0.15)",
          color: "#ef4444",
          border: "rgba(239, 68, 68, 0.3)",
        };
      default:
        return {
          label: "Updated",
          icon: <Edit size={14} />,
          bg: accentColor === "pink" ? "rgba(236, 72, 153, 0.15)" : "rgba(59, 130, 246, 0.15)",
          color: accentColor === "pink" ? "#ec4899" : "#3b82f6",
          border: accentColor === "pink" ? "rgba(236, 72, 153, 0.3)" : "rgba(59, 130, 246, 0.3)",
        };
    }
  };

  return (
    <div className="glass-panel" style={{ padding: "1.25rem 1.75rem", transition: "all 0.2s ease" }}>
      {/* Header / Expander Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: collapsible ? "pointer" : "default",
          marginBottom: isCardExpanded ? "1.5rem" : 0,
        }}
        onClick={() => {
          if (collapsible) handleToggleCard();
        }}
      >
        <h2 style={{ fontSize: "1.1rem", fontWeight: "800", display: "flex", alignItems: "center", gap: "0.55rem" }}>
          <History size={20} style={{ color: accentColor === "pink" ? "var(--accent-pink)" : "var(--accent-blue)" }} />
          <span>Audit Trail & Change History</span>
          <span
            style={{
              fontSize: "0.75rem",
              background: "rgba(255, 255, 255, 0.08)",
              padding: "0.15rem 0.65rem",
              borderRadius: "12px",
              color: "var(--text-muted)",
              fontWeight: "600",
            }}
          >
            {history.length} event{history.length !== 1 ? "s" : ""}
          </span>
        </h2>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {onSelectVersion && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectVersion(history.length - 1);
              }}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: "0.75rem", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
              title="Launch step-by-step audit walkthrough modal"
            >
              <Eye size={13} style={{ color: accentColor === "pink" ? "var(--accent-pink)" : "var(--accent-blue)" }} />
              <span>Interactive Walkthrough</span>
            </button>
          )}

          {collapsible && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleToggleCard();
              }}
              style={{
                background: "var(--bg-card-hover)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
                padding: "0.25rem 0.6rem",
                borderRadius: "6px",
                fontSize: "0.8rem",
                fontWeight: "600",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
              }}
            >
              <span>{isCardExpanded ? "Hide Audit Trail" : "Expand Audit Trail"}</span>
              {isCardExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          )}
        </div>
      </div>

      {/* Expandable Content Area */}
      {isCardExpanded && (

      <div style={{ position: "relative", paddingLeft: "1.5rem", borderLeft: "2px solid var(--border)" }}>
        {history.map((item: any, index: number) => {
          const badge = getActionBadge(item.action);
          const isExpanded = expandedIds[item.id] !== false; // expanded by default
          let diffs: any[] = [];
          if (item.changes) {
            try {
              diffs = typeof item.changes === "string" ? JSON.parse(item.changes) : item.changes;
            } catch (e) {
              console.error(e);
            }
          }

          // Compute reverse index for Walkthrough (since history is desc: index 0 is latest, history.length - 1 - index is chronological step)
          const chronologicalStepIndex = history.length - 1 - index;

          return (
            <div
              key={item.id || index}
              style={{
                marginBottom: index === history.length - 1 ? 0 : "1.75rem",
                position: "relative",
              }}
            >
              {/* Timeline Dot */}
              <div
                style={{
                  position: "absolute",
                  left: "-1.95rem",
                  top: "0.25rem",
                  width: "14px",
                  height: "14px",
                  borderRadius: "50%",
                  background: badge.color,
                  border: "3px solid var(--bg-main)",
                  boxShadow: `0 0 10px ${badge.color}`,
                }}
              />

              <div
                className="timeline-item-card"
                style={{
                  borderRadius: "var(--radius-md)",
                  padding: "1rem 1.25rem",
                  transition: "all 0.2s ease",
                }}
              >
                {/* Header Row */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: "700",
                        padding: "0.25rem 0.6rem",
                        borderRadius: "6px",
                        background: badge.bg,
                        color: badge.color,
                        border: `1px solid ${badge.border}`,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.35rem",
                      }}
                    >
                      {badge.icon}
                      {badge.label}
                    </span>

                    <span style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-primary)" }}>
                      {item.summary}
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                      <Clock size={13} />
                      <span>{new Date(item.createdAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}</span>
                    </div>

                    {onSelectVersion && (
                      <button
                        onClick={() => onSelectVersion(chronologicalStepIndex)}
                        style={{
                          background: "var(--bg-card-hover)",
                          border: "1px solid var(--border)",
                          color: "var(--text-secondary)",
                          borderRadius: "6px",
                          padding: "0.25rem 0.5rem",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.3rem",
                        }}
                        title="View this snapshot in History Walkthrough"
                      >
                        <Eye size={13} />
                        <span>View Snapshot</span>
                      </button>
                    )}

                    {diffs.length > 0 && (
                      <button
                        onClick={() => toggleExpand(item.id)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "var(--text-muted)",
                          cursor: "pointer",
                          padding: "0.2rem",
                        }}
                      >
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded Diffs Section */}
                {isExpanded && diffs.length > 0 && (
                  <div style={{ marginTop: "0.875rem", paddingTop: "0.75rem", borderTop: "1px dashed var(--border)" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      {diffs.map((diff: any, dIdx: number) => (
                        <div
                          key={dIdx}
                          className="timeline-diff-item"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.75rem",
                            fontSize: "0.825rem",
                            padding: "0.4rem 0.75rem",
                            borderRadius: "6px",
                          }}
                        >
                          <span style={{ fontWeight: "600", color: "var(--text-secondary)", width: "160px", flexShrink: 0 }}>
                            {diff.label || FIELD_LABELS[diff.field] || diff.field}
                          </span>

                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flex: 1, flexWrap: "wrap" }}>
                            {diff.oldValue !== null && diff.oldValue !== undefined ? (
                              <span style={{ color: "#ef4444", textDecoration: "line-through", background: "rgba(239, 68, 68, 0.1)", padding: "0.1rem 0.4rem", borderRadius: "4px" }}>
                                {diff.oldValue || "—"}
                              </span>
                            ) : (
                              <span style={{ color: "var(--text-muted)", fontStyle: "italic" }}>(None)</span>
                            )}

                            <ArrowRight size={12} style={{ color: "var(--text-muted)", flexShrink: 0 }} />

                            {diff.newValue !== null && diff.newValue !== undefined ? (
                              <span style={{ color: "#10b981", fontWeight: "600", background: "rgba(16, 185, 129, 0.1)", padding: "0.1rem 0.4rem", borderRadius: "4px" }}>
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
              </div>
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
}
