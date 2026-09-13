"use client";

import React, { useState, useEffect } from "react";
import YesNoToggle from "./YesNoToggle";

interface MonthlyAccommodationInputProps {
  value: string;
  onChange: (value: string) => void;
  compact?: boolean;
}

export function MonthlyAccommodationInput({
  value,
  onChange,
  compact = false,
}: MonthlyAccommodationInputProps) {
  const isNo =
    !value ||
    value.trim().toLowerCase() === "no" ||
    value.trim().toLowerCase() === "false" ||
    value.trim().toLowerCase() === "none";

  const [isYes, setIsYes] = useState(!isNo);
  const [feeText, setFeeText] = useState(
    !isNo && value.trim().toLowerCase() !== "yes" ? value : "$1.50 (not included in aggregate premium)"
  );

  useEffect(() => {
    const no =
      !value ||
      value.trim().toLowerCase() === "no" ||
      value.trim().toLowerCase() === "false" ||
      value.trim().toLowerCase() === "none";
    setIsYes(!no);
    if (!no && value.trim().toLowerCase() !== "yes") {
      setFeeText(value);
    }
  }, [value]);

  const handleToggle = (toggleVal: string) => {
    if (toggleVal === "No") {
      setIsYes(false);
      onChange("No");
    } else {
      setIsYes(true);
      const text = feeText.trim() || "$1.50 (not included in aggregate premium)";
      onChange(text);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setFeeText(text);
    onChange(text);
  };

  if (compact) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", justifyContent: "flex-end" }}>
        <YesNoToggle value={isYes ? "Yes" : "No"} onChange={handleToggle} size="sm" />
        {isYes && (
          <input
            type="text"
            value={feeText}
            onChange={handleTextChange}
            placeholder="$1.50 PEPM"
            className="form-input"
            style={{ width: "120px", fontSize: "0.75rem", padding: "0.15rem 0.35rem", textAlign: "right" }}
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
          <label className="form-label" style={{ fontSize: "0.78rem" }}>Accommodation Surcharge / Note</label>
          <input
            type="text"
            value={feeText}
            onChange={handleTextChange}
            placeholder="e.g. $1.50 (not included in aggregate premium)"
            className="form-input"
            style={{ fontSize: "0.8rem" }}
          />
        </div>
      )}
    </div>
  );
}

export default MonthlyAccommodationInput;
