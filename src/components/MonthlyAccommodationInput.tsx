"use client";

import React, { useState, useEffect } from "react";
import { ShieldOff, Shield, DollarSign } from "lucide-react";
import CurrencyInput from "./CurrencyInput";

export type AccommodationOption = "No" | "Included" | "Separately Billed";

interface MonthlyAccommodationInputProps {
  value: string | null | undefined;
  onChange: (value: string) => void;
  compact?: boolean;
}

/**
 * Detects which option is active based on the stored string value
 */
export function detectAccommodationOption(val: string | null | undefined): AccommodationOption {
  if (!val || !val.trim()) return "No";
  const raw = val.trim();
  const lower = raw.toLowerCase();

  if (lower === "no" || lower === "none" || lower === "false" || lower === "not included") {
    return "No";
  }

  if (lower === "included" || lower === "yes" || lower === "true") {
    return "Included";
  }

  if (lower.includes("separately") || lower.includes("separate") || raw.match(/[\d.]/)) {
    return "Separately Billed";
  }

  return "Included";
}

/**
 * Extracts fee amount from string if present (e.g. "$0.50 PEPM" -> "0.50")
 */
export function extractAccommodationFee(val: string | null | undefined): string {
  if (!val || !val.trim()) return "";
  const raw = val.trim();
  const match = raw.match(/([\d,]+(?:\.\d*)?)/);
  return match ? match[1].replace(/,/g, "") : "";
}

export function parseMonthlyAccommodationDisplay(val: string | null | undefined): {
  option: AccommodationOption;
  isNo: boolean;
  amountDisplay: string;
  noteText: string;
} {
  const opt = detectAccommodationOption(val);

  if (opt === "No") {
    return { option: "No", isNo: true, amountDisplay: "No", noteText: "" };
  }

  if (opt === "Included") {
    return {
      option: "Included",
      isNo: false,
      amountDisplay: "Included",
      noteText: "Included in stop-loss rate",
    };
  }

  // Separately Billed
  const raw = (val || "").trim();
  const fee = extractAccommodationFee(raw);

  if (fee) {
    const num = parseFloat(fee);
    const formattedNum = !isNaN(num)
      ? num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : fee;
    return {
      option: "Separately Billed",
      isNo: false,
      amountDisplay: `$${formattedNum} PEPM`,
      noteText: "Separately Billed",
    };
  }

  return {
    option: "Separately Billed",
    isNo: false,
    amountDisplay: "Separately Billed",
    noteText: "Not included in stop-loss rate",
  };
}

export function formatMonthlyAccommodationDisplay(val: string | null | undefined): string {
  const parsed = parseMonthlyAccommodationDisplay(val);
  if (parsed.isNo || !parsed.amountDisplay) return "No";
  if (parsed.option === "Included") return "Included (in stop-loss rate)";
  if (parsed.option === "Separately Billed") {
    if (parsed.amountDisplay !== "Separately Billed") {
      return `${parsed.amountDisplay} (Separately Billed)`;
    }
    return "Separately Billed";
  }
  return parsed.amountDisplay;
}

export function MonthlyAccommodationInput({
  value,
  onChange,
  compact = false,
}: MonthlyAccommodationInputProps) {
  const activeOption = detectAccommodationOption(value);
  const [fee, setFee] = useState<string>(() => extractAccommodationFee(value));

  useEffect(() => {
    const extracted = extractAccommodationFee(value);
    setFee((prevFee) => {
      const cleanPrev = (prevFee || "").trim().replace(/^\$/, "").replace(/,/g, "");
      const cleanExtracted = (extracted || "").trim().replace(/^\$/, "").replace(/,/g, "");
      if (cleanPrev === cleanExtracted || cleanPrev === `${cleanExtracted}.` || `${cleanPrev}.` === cleanExtracted) {
        return prevFee;
      }
      return extracted;
    });
  }, [value]);

  const handleSelectOption = (opt: AccommodationOption) => {
    if (opt === "No") {
      onChange("No");
    } else if (opt === "Included") {
      onChange("Included");
    } else {
      // Separately Billed
      const cleanFee = fee.trim();
      if (cleanFee) {
        onChange(`$${cleanFee} PEPM (Separately Billed)`);
      } else {
        onChange("Separately Billed");
      }
    }
  };

  const handleFeeChange = (val: string) => {
    setFee(val);
    const cleanFee = val.trim();
    if (cleanFee) {
      onChange(`$${cleanFee} PEPM (Separately Billed)`);
    } else {
      onChange("Separately Billed");
    }
  };

  const handleFeeBlur = () => {
    const cleanFee = fee.trim().replace(/^\$/, "").replace(/,/g, "");
    if (cleanFee) {
      const num = parseFloat(cleanFee);
      if (!isNaN(num)) {
        const formatted = num.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        setFee(formatted);
        onChange(`$${formatted} PEPM (Separately Billed)`);
      }
    }
  };

  const options: { id: AccommodationOption; label: string; icon: React.ReactNode }[] = [
    { id: "No", label: "No", icon: <ShieldOff size={compact ? 11 : 13} /> },
    { id: "Included", label: "Included", icon: <Shield size={compact ? 11 : 13} /> },
    { id: "Separately Billed", label: "Separately Billed", icon: <DollarSign size={compact ? 11 : 13} /> },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", width: "100%", alignItems: compact ? "flex-end" : "stretch" }}>
      {/* 3-Way Segmented Control */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          background: "var(--bg-card-hover, #f1f5f9)",
          borderRadius: "8px",
          padding: compact ? "2px" : "3px",
          border: "1px solid var(--border, #cbd5e1)",
          userSelect: "none",
          boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.04)",
          width: compact ? "auto" : "100%",
        }}
      >
        {options.map((opt) => {
          const isSelected = activeOption === opt.id;
          let activeBg = "transparent";
          let activeBorder = "1px solid transparent";
          let activeShadow = "none";

          if (isSelected) {
            if (opt.id === "No") {
              activeBg = "linear-gradient(135deg, #64748b 0%, #475569 100%)";
              activeBorder = "1px solid #64748b";
              activeShadow = "0 2px 6px rgba(71, 85, 105, 0.3)";
            } else if (opt.id === "Included") {
              activeBg = "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)";
              activeBorder = "1px solid #7c3aed";
              activeShadow = "0 2px 8px rgba(124, 58, 237, 0.35)";
            } else {
              activeBg = "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)";
              activeBorder = "1px solid #0284c7";
              activeShadow = "0 2px 8px rgba(2, 132, 199, 0.35)";
            }
          }

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleSelectOption(opt.id)}
              style={{
                flex: compact ? undefined : 1,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: compact ? "0.25rem" : "0.35rem",
                border: activeBorder,
                background: activeBg,
                color: isSelected ? "#ffffff" : "var(--text-secondary, #475569)",
                fontWeight: isSelected ? "700" : "600",
                fontSize: compact ? "0.7rem" : "0.78rem",
                padding: compact ? "0.22rem 0.45rem" : "0.35rem 0.65rem",
                borderRadius: "6px",
                cursor: "pointer",
                transition: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
                lineHeight: "1.2",
                boxShadow: activeShadow,
                whiteSpace: "nowrap",
              }}
            >
              {opt.icon}
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>

      {/* Surcharge / Rate Input if Separately Billed */}
      {activeOption === "Separately Billed" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem", width: compact ? "220px" : "100%", marginTop: "0.15rem" }}>
          {!compact && (
            <label className="form-label" style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              Separately Billed Fee (Optional PEPM amount)
            </label>
          )}
          <CurrencyInput
            value={fee}
            onChange={handleFeeChange}
            onBlur={handleFeeBlur}
            placeholder="0.00"
            suffix="PEPM"
            align="left"
            style={{ width: "100%", fontSize: compact ? "0.78rem" : "0.85rem" }}
          />
        </div>
      )}
    </div>
  );
}

export default MonthlyAccommodationInput;
