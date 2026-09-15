"use client";

import React, { useState, useEffect } from "react";
import YesNoToggle from "./YesNoToggle";
import CurrencyInput from "./CurrencyInput";

interface AggregatingSpecificInputProps {
  value: string;
  onChange: (value: string) => void;
  compact?: boolean;
}

export function AggregatingSpecificInput({
  value,
  onChange,
  compact = false,
}: AggregatingSpecificInputProps) {
  const isNo =
    !value ||
    value.trim().toLowerCase() === "no" ||
    value.trim().toLowerCase() === "false" ||
    value.trim().toLowerCase() === "none" ||
    value.trim() === "$0" ||
    value.trim() === "0";

  const [isYes, setIsYes] = useState(!isNo);
  const [amountText, setAmountText] = useState(
    !isNo && value.trim().toLowerCase() !== "yes" ? value : ""
  );

  useEffect(() => {
    const no =
      !value ||
      value.trim().toLowerCase() === "no" ||
      value.trim().toLowerCase() === "false" ||
      value.trim().toLowerCase() === "none" ||
      value.trim() === "$0" ||
      value.trim() === "0";
    setIsYes(!no);
    if (!no && value.trim().toLowerCase() !== "yes") {
      setAmountText(value);
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
            style={{ width: "100%", fontSize: "0.75rem", padding: "0.2rem 0.4rem", marginTop: "0.15rem" }}
          />
        )}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Included in Policy?</span>
        <YesNoToggle value={isYes ? "Yes" : "No"} onChange={handleToggle} size="md" />
      </div>

      {isYes && (
        <div style={{ marginTop: "0.2rem" }}>
          <label className="form-label" style={{ fontSize: "0.78rem" }}>Deductible Amount ($)</label>
          <CurrencyInput
            value={amountText}
            onChange={handleAmountChange}
            placeholder="0.00"
          />
        </div>
      )}
    </div>
  );
}

export default AggregatingSpecificInput;
