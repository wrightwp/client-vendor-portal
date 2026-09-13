"use client";

import React from "react";

interface YesNoToggleProps {
  value: string | boolean | null | undefined;
  onChange: (value: string) => void;
  size?: "sm" | "md";
  yesLabel?: string;
  noLabel?: string;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
}

export function YesNoToggle({
  value,
  onChange,
  size = "sm",
  yesLabel = "Yes",
  noLabel = "No",
  className = "",
  style = {},
  disabled = false,
}: YesNoToggleProps) {
  // Normalize value to check if it's "Yes" / truthy
  const isYes =
    typeof value === "boolean"
      ? value === true
      : String(value || "")
          .trim()
          .toLowerCase() === "yes" ||
        String(value || "")
          .trim()
          .toLowerCase() === "true";

  const isNo =
    typeof value === "boolean"
      ? value === false
      : String(value || "")
          .trim()
          .toLowerCase() === "no" ||
        String(value || "")
          .trim()
          .toLowerCase() === "false" ||
        String(value || "")
          .trim()
          .toLowerCase() === "none";

  const isSmall = size === "sm";

  return (
    <div
      className={`yes-no-toggle-group ${className}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        background: "var(--bg-card-hover, rgba(0, 0, 0, 0.05))",
        borderRadius: "6px",
        padding: "2px",
        border: "1px solid var(--border)",
        userSelect: "none",
        ...style,
      }}
    >
      {/* NO button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange("No")}
        style={{
          border: isNo ? "1px solid var(--border)" : "1px solid transparent",
          background: isNo ? "var(--bg-card)" : "transparent",
          color: isNo ? "var(--text-primary)" : "var(--text-muted)",
          fontWeight: isNo ? "700" : "500",
          fontSize: isSmall ? "0.72rem" : "0.82rem",
          padding: isSmall ? "0.2rem 0.6rem" : "0.3rem 0.85rem",
          borderRadius: "4px",
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "all 0.15s ease",
          lineHeight: "1.2",
          boxShadow: isNo ? "var(--shadow-sm)" : "none",
        }}
      >
        {noLabel}
      </button>

      {/* YES button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange("Yes")}
        style={{
          border: isYes ? "1px solid rgba(16, 185, 129, 0.45)" : "1px solid transparent",
          background: isYes ? "var(--status-active-bg)" : "transparent",
          color: isYes ? "var(--status-active)" : "var(--text-muted)",
          fontWeight: isYes ? "700" : "500",
          fontSize: isSmall ? "0.72rem" : "0.82rem",
          padding: isSmall ? "0.2rem 0.6rem" : "0.3rem 0.85rem",
          borderRadius: "4px",
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "all 0.15s ease",
          lineHeight: "1.2",
          boxShadow: isYes ? "0 0 8px rgba(16, 185, 129, 0.2)" : "none",
        }}
      >
        {yesLabel}
      </button>
    </div>
  );
}

export default YesNoToggle;
