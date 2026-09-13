"use client";

import React from "react";
import { History, Clock, ArrowRight, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { FIELD_LABELS } from "@/lib/history";
import { formatDisplayDateTime } from "@/lib/dateUtils";

interface LastChangeHighlightProps {
  lastChange: any | null;
  onOpenWalkthrough: () => void;
  accentColor?: "pink" | "blue";
}

export default function LastChangeHighlight({
  lastChange,
  onOpenWalkthrough,
  accentColor = "pink",
}: LastChangeHighlightProps) {
  if (!lastChange) {
    return (
      <div
        style={{
          padding: "1rem 1.25rem",
          borderRadius: "var(--radius-md)",
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px dashed var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: "var(--text-muted)",
          fontSize: "0.875rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Clock size={16} />
          <span>No historical changes logged yet.</span>
        </div>
      </div>
    );
  }

  let parsedDiffs: any[] = [];
  if (lastChange.changes) {
    try {
      parsedDiffs = typeof lastChange.changes === "string" ? JSON.parse(lastChange.changes) : lastChange.changes;
    } catch (e) {
      console.error(e);
    }
  }

  const formatRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return formatDisplayDateTime(date);
  };

  const isPink = accentColor === "pink";
  const badgeColor = isPink ? "#ec4899" : "#3b82f6";

  return (
    <div
      className={isPink ? "last-change-highlight-pink" : "last-change-highlight-blue"}
      style={{
        padding: "1.1rem 1.5rem",
        borderRadius: "var(--radius-lg)",
        boxShadow: `0 4px 20px -5px ${isPink ? "rgba(236, 72, 153, 0.15)" : "rgba(59, 130, 246, 0.15)"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "1rem",
        transition: "all 0.2s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1, minWidth: "280px" }}>
        <div
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "12px",
            background: isPink ? "rgba(236, 72, 153, 0.2)" : "rgba(59, 130, 246, 0.2)",
            border: `1px solid ${isPink ? "rgba(236, 72, 153, 0.4)" : "rgba(59, 130, 246, 0.4)"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: badgeColor,
            flexShrink: 0,
          }}
        >
          <Sparkles size={20} />
        </div>

        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.2rem" }}>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: badgeColor,
                background: isPink ? "rgba(236, 72, 153, 0.15)" : "rgba(59, 130, 246, 0.15)",
                padding: "0.15rem 0.6rem",
                borderRadius: "20px",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem",
              }}
            >
              <Clock size={12} />
              Last Change Highlight
            </span>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              {formatRelativeTime(lastChange.createdAt)}
            </span>
          </div>

          <div style={{ fontSize: "0.95rem", fontWeight: "600", color: "var(--text-primary)" }}>
            {lastChange.summary}
          </div>

          {parsedDiffs.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.4rem" }}>
              {parsedDiffs.slice(0, 3).map((d: any, i: number) => (
                <span
                  key={i}
                  className="last-change-diff-chip"
                  style={{
                    fontSize: "0.75rem",
                    padding: "0.2rem 0.5rem",
                    borderRadius: "6px",
                    color: "var(--text-secondary)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.3rem",
                  }}
                >
                  <strong style={{ color: "var(--text-primary)" }}>{d.label || FIELD_LABELS[d.field] || d.field}:</strong>
                  {d.oldValue && (
                    <span style={{ textDecoration: "line-through", color: "#ef4444", opacity: 0.8 }}>
                      {d.oldValue}
                    </span>
                  )}
                  {d.oldValue && d.newValue && <ArrowRight size={10} style={{ opacity: 0.5 }} />}
                  {d.newValue && (
                    <span style={{ color: "#10b981", fontWeight: "600" }}>{d.newValue}</span>
                  )}
                </span>
              ))}
              {parsedDiffs.length > 3 && (
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", alignSelf: "center" }}>
                  +{parsedDiffs.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={onOpenWalkthrough}
        className={`btn ${isPink ? "btn-primary" : "btn-blue"}`}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.6rem 1.1rem",
          borderRadius: "var(--radius-md)",
          fontSize: "0.875rem",
          fontWeight: "600",
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        <History size={16} />
        <span>Walk Through History</span>
      </button>
    </div>
  );
}
