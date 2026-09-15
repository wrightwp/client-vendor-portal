"use client";

import React, { useState, useEffect } from "react";
import YesNoToggle from "./YesNoToggle";
import PercentInput from "./PercentInput";

interface MaxSpecificRenewalIncreaseInputProps {
  value: string;
  onChange: (value: string) => void;
  compact?: boolean;
}

/**
 * Helper to check if value represents "No"
 */
function isNoIncrease(val: string): boolean {
  if (!val) return false;
  const trimmed = val.trim().toLowerCase();
  return (
    trimmed === "no" ||
    trimmed === "false" ||
    trimmed === "none" ||
    trimmed === "0%" ||
    trimmed === "0"
  );
}

/**
 * Parses percent value out of raw text e.g. "30%", "Yes - 30%", "45"
 */
function extractPercentText(val: string): string {
  if (!val || isNoIncrease(val)) return "";
  const cleaned = val.replace(/^yes\s*[-:\(]?\s*/i, "").replace(/\)$/, "").trim();
  return cleaned === "yes" ? "" : cleaned;
}

export function MaxSpecificRenewalIncreaseInput({
  value,
  onChange,
  compact = false,
}: MaxSpecificRenewalIncreaseInputProps) {
  const [isYes, setIsYes] = useState(!isNoIncrease(value));
  const [percentText, setPercentText] = useState(extractPercentText(value));

  useEffect(() => {
    const no = isNoIncrease(value);
    setIsYes(!no);
    if (!no) {
      setPercentText(extractPercentText(value));
    }
  }, [value]);

  const handleToggle = (toggleVal: string) => {
    if (toggleVal === "No") {
      setIsYes(false);
      onChange("No");
    } else {
      setIsYes(true);
      const text = percentText.trim();
      onChange(text || "Yes");
    }
  };

  const handlePercentChange = (val: string) => {
    setPercentText(val);
    onChange(val || "Yes");
  };

  if (compact) {
    return (
      <div style={{ display: "flex", flexDirection: "column", width: "100%", alignItems: "flex-end", gap: "0.35rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", width: "100%" }}>
          <YesNoToggle value={isYes ? "Yes" : "No"} onChange={handleToggle} size="sm" />
        </div>
        {isYes && (
          <PercentInput
            value={percentText}
            onChange={handlePercentChange}
            placeholder="0"
            style={{ width: "110px", fontSize: "0.8rem", padding: "0.2rem 0.4rem", marginTop: "0.15rem" }}
          />
        )}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Max Increase Cap Specified?</span>
        <YesNoToggle value={isYes ? "Yes" : "No"} onChange={handleToggle} size="md" />
      </div>

      {isYes && (
        <div style={{ marginTop: "0.2rem" }}>
          <label className="form-label" style={{ fontSize: "0.78rem" }}>Max Increase Percentage (%)</label>
          <PercentInput
            value={percentText}
            onChange={handlePercentChange}
            placeholder="0"
          />
        </div>
      )}
    </div>
  );
}

export default MaxSpecificRenewalIncreaseInput;
