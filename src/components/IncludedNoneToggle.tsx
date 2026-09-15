"use client";

import React from "react";
import { Check, Ban, Shield, ShieldOff } from "lucide-react";

interface IncludedNoneToggleProps {
  value: string | null | undefined;
  onChange: (value: "Included" | "None") => void;
  size?: "sm" | "md" | "lg";
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  colorScheme?: "purple" | "blue";
}

export function IncludedNoneToggle({
  value,
  onChange,
  size = "md",
  className = "",
  style = {},
  disabled = false,
  colorScheme = "purple",
}: IncludedNoneToggleProps) {
  const isNone =
    String(value || "")
      .trim()
      .toLowerCase() === "none" ||
    String(value || "")
      .trim()
      .toLowerCase() === "no" ||
    String(value || "")
      .trim()
      .toLowerCase() === "false";

  const isIncluded = !isNone;

  const isSmall = size === "sm";
  const isLarge = size === "lg";

  const isBlue = colorScheme === "blue";
  const includedBorder = isBlue ? "1px solid #0284c7" : "1px solid #7c3aed";
  const includedBg = isBlue
    ? "linear-gradient(135deg, #00aedb 0%, #0284c7 100%)"
    : "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)";
  const includedShadow = isBlue
    ? "0 2px 8px rgba(2, 132, 199, 0.35)"
    : "0 2px 8px rgba(124, 58, 237, 0.35)";

  return (
    <div
      className={`included-none-toggle ${className}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        background: "var(--bg-card-hover, #f1f5f9)",
        borderRadius: "8px",
        padding: isSmall ? "2px" : "3px",
        border: "1px solid var(--border, #cbd5e1)",
        userSelect: "none",
        boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.04)",
        ...style,
      }}
    >
      {/* INCLUDED BUTTON */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange("Included")}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: isSmall ? "0.25rem" : "0.4rem",
          border: isIncluded ? includedBorder : "1px solid transparent",
          background: isIncluded ? includedBg : "transparent",
          color: isIncluded ? "#ffffff" : "var(--text-secondary, #475569)",
          fontWeight: isIncluded ? "700" : "600",
          fontSize: isSmall ? "0.72rem" : isLarge ? "0.88rem" : "0.78rem",
          padding: isSmall
            ? "0.2rem 0.5rem"
            : isLarge
            ? "0.45rem 1rem"
            : "0.3rem 0.75rem",
          borderRadius: "6px",
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
          lineHeight: "1.2",
          boxShadow: isIncluded ? includedShadow : "none",
        }}
      >
        <Shield size={isSmall ? 11 : isLarge ? 15 : 13} />
        <span>Included</span>
      </button>

      {/* NONE BUTTON */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange("None")}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: isSmall ? "0.25rem" : "0.4rem",
          border: isNone ? "1px solid #94a3b8" : "1px solid transparent",
          background: isNone
            ? "linear-gradient(135deg, #64748b 0%, #475569 100%)"
            : "transparent",
          color: isNone ? "#ffffff" : "var(--text-secondary, #475569)",
          fontWeight: isNone ? "700" : "600",
          fontSize: isSmall ? "0.72rem" : isLarge ? "0.88rem" : "0.78rem",
          padding: isSmall
            ? "0.2rem 0.5rem"
            : isLarge
            ? "0.45rem 1rem"
            : "0.3rem 0.75rem",
          borderRadius: "6px",
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
          lineHeight: "1.2",
          boxShadow: isNone ? "0 2px 6px rgba(71, 85, 105, 0.3)" : "none",
        }}
      >
        <ShieldOff size={isSmall ? 11 : isLarge ? 15 : 13} />
        <span>None</span>
      </button>
    </div>
  );
}

export default IncludedNoneToggle;
