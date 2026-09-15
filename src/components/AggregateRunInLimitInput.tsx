"use client";

import React, { useState, useEffect } from "react";
import YesNoToggle from "./YesNoToggle";
import CurrencyInput from "./CurrencyInput";

interface AggregateRunInLimitInputProps {
  value: string | null | undefined;
  onChange: (value: string) => void;
  compact?: boolean;
}

/**
 * Helper to check if value represents "No" or empty
 */
export function isNoRunInLimit(val: string | null | undefined): boolean {
  if (!val || !val.trim()) return true;
  const trimmed = val.trim().toLowerCase();
  return (
    trimmed === "no" ||
    trimmed === "false" ||
    trimmed === "none" ||
    trimmed === "$0" ||
    trimmed === "0"
  );
}

/**
 * Format Run-in Limit string for view cards & export
 */
export function formatRunInLimitDisplay(val: string | null | undefined): string {
  if (isNoRunInLimit(val)) return "No";
  const trimmed = val!.trim();
  const lower = trimmed.toLowerCase();
  if (lower === "yes" || lower === "true") return "Yes (No Dollar Limit Specified)";

  // Format numeric values cleanly as currency with $
  const clean = trimmed.replace(/^\$/, "").replace(/,/g, "").trim();
  const num = parseFloat(clean);
  if (!isNaN(num)) {
    const formatted = num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `$${formatted}`;
  }
  return trimmed.startsWith("$") ? trimmed : `$${trimmed}`;
}

export function AggregateRunInLimitInput({
  value,
  onChange,
  compact = false,
}: AggregateRunInLimitInputProps) {
  const no = isNoRunInLimit(value);
  const [isYes, setIsYes] = useState(!no);
  const [amountText, setAmountText] = useState(
    !no && value?.trim().toLowerCase() !== "yes" ? value! : ""
  );

  useEffect(() => {
    const isNo = isNoRunInLimit(value);
    setIsYes(!isNo);
    if (!isNo && value?.trim().toLowerCase() !== "yes") {
      setAmountText(value!);
    } else if (value?.trim().toLowerCase() === "yes") {
      setAmountText("");
    }
  }, [value]);

  const handleToggle = (toggleVal: string) => {
    if (toggleVal === "No") {
      setIsYes(false);
      onChange("No");
    } else {
      setIsYes(true);
      const text = amountText.trim();
      onChange(text || "Yes");
    }
  };

  const handleAmountChange = (val: string) => {
    setAmountText(val);
    onChange(val || "Yes");
  };

  if (compact) {
    return (
      <div style={{ display: "flex", flexDirection: "column", width: "100%", alignItems: "flex-end", gap: "0.35rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", width: "100%" }}>
          <YesNoToggle value={isYes ? "Yes" : "No"} onChange={handleToggle} size="sm" />
        </div>
        {isYes && (
          <CurrencyInput
            value={amountText}
            onChange={handleAmountChange}
            placeholder="0.00"
            style={{ width: "160px", fontSize: "0.75rem" }}
          />
        )}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Aggregate Run-In Limit Included?</span>
        <YesNoToggle value={isYes ? "Yes" : "No"} onChange={handleToggle} size="md" />
      </div>

      {isYes && (
        <div style={{ marginTop: "0.2rem" }}>
          <label className="form-label" style={{ fontSize: "0.78rem" }}>Run-In Dollar Limit ($)</label>
          <CurrencyInput
            value={amountText}
            onChange={handleAmountChange}
            placeholder="0.00"
            style={{ width: "100%" }}
          />
        </div>
      )}
    </div>
  );
}

export default AggregateRunInLimitInput;
