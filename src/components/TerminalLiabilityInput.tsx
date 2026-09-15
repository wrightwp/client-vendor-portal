"use client";

import React, { useState, useEffect } from "react";
import CurrencyInput from "./CurrencyInput";

export type TloOption = "No" | "Included" | "Separately Billed";

interface TerminalLiabilityInputProps {
  value: string | null | undefined;
  onChange: (value: string) => void;
  compact?: boolean;
}

/**
/**
 * Parses raw TLO string into option and clean fee string
 */
export function parseTloString(val: string | null | undefined): { option: TloOption; fee: string } {
  if (!val || !val.trim()) {
    return { option: "No", fee: "" };
  }
  const raw = val.trim();
  const lower = raw.toLowerCase();

  if (lower === "no" || lower === "not included" || lower === "none" || lower === "false") {
    return { option: "No", fee: "" };
  }

  if (lower === "included" || lower === "included in premium" || lower === "yes" || lower === "true") {
    return { option: "Included", fee: "" };
  }

  if (
    lower.includes("separately billed") ||
    lower.includes("sep. billed") ||
    lower.includes("sep billed") ||
    lower.includes("separately") ||
    lower.includes("billed")
  ) {
    // Extract fee inside parenthesis if present e.g. "Separately Billed ($0.45 PEPM)"
    const match = raw.match(/\(([^)]+)\)/);
    const rawFee = match
      ? match[1]
      : raw
          .replace(/(separately billed|sep\.?\s*billed|separately|billed)/gi, "")
          .replace(/^[\s\-:]+/, "")
          .trim();

    const cleanFee = rawFee
      .replace(/pepm/gi, "")
      .replace(/^\$/, "")
      .trim();

    return { option: "Separately Billed", fee: cleanFee };
  }

  // Fallback for custom string or pure numeric like "$0.45 PEPM" or "0.45"
  const cleanFee = raw
    .replace(/pepm/gi, "")
    .replace(/^\$/, "")
    .trim();
  return { option: "Separately Billed", fee: cleanFee };
}

export function formatTloDisplay(val: string | null | undefined): string {
  const { option, fee } = parseTloString(val);
  if (option === "No") return "No";
  if (option === "Included") return "Included in Premium";
  if (fee && fee.trim()) {
    const clean = fee.trim();
    const num = parseFloat(clean.replace(/,/g, ""));
    if (!isNaN(num)) {
      const formattedNum = num.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      return `Separately Billed ($${formattedNum} PEPM)`;
    }
    const formattedFee = clean.startsWith("$") ? clean : `$${clean}`;
    const hasPepm = clean.toLowerCase().includes("pepm");
    return `Separately Billed (${formattedFee}${hasPepm ? "" : " PEPM"})`;
  }
  return "Separately Billed";
}

export function TerminalLiabilityInput({
  value,
  onChange,
  compact = false,
}: TerminalLiabilityInputProps) {
  const parsed = parseTloString(value);
  const [selectedOption, setSelectedOption] = useState<TloOption>(parsed.option);
  const [feeAmount, setFeeAmount] = useState(parsed.fee);

  useEffect(() => {
    const p = parseTloString(value);
    setSelectedOption(p.option);
    const cleanCurrent = feeAmount.replace(/pepm/gi, "").replace(/^\$/, "").replace(/,/g, "").trim();
    const cleanP = p.fee.replace(/pepm/gi, "").replace(/^\$/, "").replace(/,/g, "").trim();
    if (cleanP !== cleanCurrent) {
      setFeeAmount(p.fee);
    }
  }, [value]);

  const emitChange = (opt: TloOption, fee: string, format = false) => {
    if (opt === "No") {
      onChange("No");
    } else if (opt === "Included") {
      onChange("Included in Premium");
    } else {
      const cleanFee = fee
        .replace(/pepm/gi, "")
        .replace(/^\$/, "")
        .trim();
      if (cleanFee) {
        if (format) {
          const num = parseFloat(cleanFee.replace(/,/g, ""));
          const formattedFee = !isNaN(num)
            ? num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            : cleanFee;
          onChange(`Separately Billed ($${formattedFee} PEPM)`);
        } else {
          onChange(`Separately Billed ($${cleanFee} PEPM)`);
        }
      } else {
        onChange("Separately Billed");
      }
    }
  };

  const handleOptionSelect = (opt: TloOption) => {
    setSelectedOption(opt);
    emitChange(opt, feeAmount, false);
  };

  const handleFeeChange = (val: string) => {
    setFeeAmount(val);
    emitChange("Separately Billed", val, false);
  };

  const handleFeeBlur = () => {
    emitChange("Separately Billed", feeAmount, true);
  };

  if (compact) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", width: "100%", alignItems: "flex-end" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            background: "var(--bg-card-hover, #f1f5f9)",
            borderRadius: "6px",
            padding: "2px",
            border: "1px solid var(--border, #cbd5e1)",
          }}
        >
          {(["No", "Included", "Separately Billed"] as TloOption[]).map((opt) => {
            const isSelected = selectedOption === opt;
            const label = opt === "Separately Billed" ? "Sep. Billed" : opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => handleOptionSelect(opt)}
                style={{
                  padding: "0.2rem 0.45rem",
                  fontSize: "0.7rem",
                  fontWeight: isSelected ? 700 : 500,
                  borderRadius: "4px",
                  border: isSelected ? "1px solid #7c3aed" : "1px solid transparent",
                  background: isSelected
                    ? "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"
                    : "transparent",
                  color: isSelected ? "#ffffff" : "var(--text-muted, #64748b)",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {selectedOption === "Separately Billed" && (
          <CurrencyInput
            value={feeAmount}
            onChange={handleFeeChange}
            onBlur={handleFeeBlur}
            placeholder="0.00"
            suffix="PEPM"
            style={{ width: "160px", fontSize: "0.75rem" }}
          />
        )}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "4px",
          padding: "3px",
          background: "var(--bg-card-hover, #f1f5f9)",
          borderRadius: "8px",
          border: "1px solid var(--border, #cbd5e1)",
        }}
      >
        {(["No", "Included", "Separately Billed"] as TloOption[]).map((opt) => {
          const isSelected = selectedOption === opt;
          const label = opt === "Included" ? "Included in Premium" : opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => handleOptionSelect(opt)}
              style={{
                padding: "0.45rem 0.4rem",
                fontSize: "0.78rem",
                fontWeight: isSelected ? 700 : 600,
                borderRadius: "6px",
                border: "none",
                background: isSelected
                  ? "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"
                  : "transparent",
                color: isSelected ? "#ffffff" : "var(--text-secondary, #475569)",
                cursor: "pointer",
                transition: "all 0.15s ease",
                textAlign: "center",
                whiteSpace: "nowrap",
                boxShadow: isSelected ? "0 2px 6px rgba(124, 58, 237, 0.35)" : "none",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {selectedOption === "Separately Billed" && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.2rem" }}>
          <label style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600 }}>
            TLO Fee ($ PEPM):
          </label>
          <CurrencyInput
            value={feeAmount}
            onChange={handleFeeChange}
            onBlur={handleFeeBlur}
            placeholder="0.00"
            suffix="PEPM"
            style={{ flex: 1 }}
          />
        </div>
      )}
    </div>
  );
}

export default TerminalLiabilityInput;
