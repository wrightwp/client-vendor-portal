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
    !isNo && value.trim().toLowerCase() !== "yes" ? value : ""
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
    } else if (value?.trim().toLowerCase() === "yes") {
      setFeeText("");
    }
  }, [value]);

  const handleToggle = (toggleVal: string) => {
    if (toggleVal === "No") {
      setIsYes(false);
      onChange("No");
    } else {
      setIsYes(true);
      const text = feeText.trim();
      onChange(text || "Yes");
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setFeeText(text);
    onChange(text || "Yes");
  };

  if (compact) {
    return (
      <div style={{ display: "flex", flexDirection: "column", width: "100%", alignItems: "flex-end", gap: "0.35rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", width: "100%" }}>
          <YesNoToggle value={isYes ? "Yes" : "No"} onChange={handleToggle} size="sm" />
        </div>
        {isYes && (
          <input
            type="text"
            value={feeText}
            onChange={handleTextChange}
            placeholder="0.00"
            className="form-input"
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
          <label className="form-label" style={{ fontSize: "0.78rem" }}>Accommodation Surcharge / Note</label>
          <input
            type="text"
            value={feeText}
            onChange={handleTextChange}
            placeholder="0.00"
            className="form-input"
            style={{ fontSize: "0.8rem" }}
          />
        </div>
      )}
    </div>
  );
}

export default MonthlyAccommodationInput;
