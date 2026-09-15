"use client";

import React, { useState, useEffect } from "react";
import YesNoToggle from "./YesNoToggle";

import CurrencyInput from "./CurrencyInput";

interface MonthlyAccommodationInputProps {
  value: string;
  onChange: (value: string) => void;
  compact?: boolean;
}

export function parseMonthlyAccommodationDisplay(val: string | null | undefined): {
  isNo: boolean;
  amountDisplay: string;
  noteText: string;
} {
  if (!val || !val.trim()) {
    return { isNo: true, amountDisplay: "", noteText: "" };
  }
  const raw = val.trim();
  const lower = raw.toLowerCase();

  if (lower === "no" || lower === "none" || lower === "false" || lower === "not included") {
    return { isNo: true, amountDisplay: "No", noteText: "" };
  }

  if (lower === "yes" || lower === "true") {
    return { isNo: false, amountDisplay: "Included", noteText: "Not included in stop-loss rate" };
  }

  // Matches leading numeric string with optional $, decimal, and optional PEPM
  const match = raw.match(/^(\$?\s*[\d,]+(?:\.\d+)?(?:\s*pepm)?)(.*)$/i);
  if (match) {
    let rawAmount = match[1].trim();
    let rawNote = match[2].trim().replace(/^[\s\-:]+/, "").trim();

    const cleanNum = rawAmount.replace(/pepm/gi, "").replace(/^\$/, "").replace(/,/g, "").trim();
    const num = parseFloat(cleanNum);
    let amountDisplay = rawAmount;
    if (!isNaN(num)) {
      const formattedNum = num.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      const hasPepm = rawAmount.toLowerCase().includes("pepm");
      amountDisplay = `$${formattedNum}${hasPepm || !rawAmount.includes("$") ? " PEPM" : ""}`;
    } else if (!amountDisplay.startsWith("$")) {
      amountDisplay = `$${amountDisplay}`;
    }

    const noteText = rawNote || "Not included in stop-loss rate";
    return { isNo: false, amountDisplay, noteText };
  }

  return { isNo: false, amountDisplay: raw, noteText: "Not included in stop-loss rate" };
}

export function formatMonthlyAccommodationDisplay(val: string | null | undefined): string {
  const parsed = parseMonthlyAccommodationDisplay(val);
  if (parsed.isNo || !parsed.amountDisplay) return "No";
  if (parsed.noteText) {
    return `${parsed.amountDisplay} (${parsed.noteText})`;
  }
  return parsed.amountDisplay;
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
          <CurrencyInput
            value={feeText}
            onChange={(val) => {
              setFeeText(val);
              onChange(val || "Yes");
            }}
            placeholder="0.00"
            suffix="PEPM"
            style={{ width: "160px", fontSize: "0.75rem" }}
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
