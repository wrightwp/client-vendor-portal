"use client";

import React, { ChangeEvent } from "react";

interface CurrencyInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  align?: "left" | "right" | "center";
  suffix?: string;
}

export function CurrencyInput({
  id,
  value = "",
  onChange,
  placeholder = "0.00",
  className = "form-input",
  style = {},
  disabled = false,
  align = "right",
  suffix,
}: CurrencyInputProps) {
  // Determine if current value is numeric, empty, or in-progress typing (warrants a $ prefix)
  const isNumericOrEmpty =
    !value ||
    value.trim() === "" ||
    /^\s*\$?-?[\d,]*([.]\d*)?\s*$/.test(value.trim());

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value;
    if (!raw) {
      onChange("");
      return;
    }
    // Strip leading $ if user types or pastes it, allowing non-restrictive typing
    if (raw.startsWith("$")) {
      raw = raw.substring(1).trimStart();
    }
    onChange(raw);
  };

  const handleFocus = () => {
    if (!value) return;
    const trimmed = value.trim().replace(/^\$/, "").replace(/,/g, "");
    // Wipe 0, 0.0, 0.00 on focus so input clears cleanly for typing
    const num = parseFloat(trimmed);
    if (!isNaN(num) && num === 0) {
      onChange("");
    }
  };

  const handleBlur = () => {
    if (!value || !value.trim()) return;

    const trimmed = value.trim();
    // Strip leading $, commas, and extra whitespace
    let clean = trimmed.replace(/^\$/, "").replace(/,/g, "").trim();

    // Normalize leading decimal (e.g. ".5" -> "0.5")
    if (clean.startsWith(".")) {
      clean = `0${clean}`;
    }
    // Normalize trailing decimal (e.g. "1000." -> "1000")
    if (clean.endsWith(".")) {
      clean = clean.slice(0, -1);
    }

    const num = parseFloat(clean);
    if (!isNaN(num) && /^-?\d+(\.\d+)?$/.test(clean)) {
      const formatted = num.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      onChange(formatted);
    }
  };

  const showDollar = isNumericOrEmpty;

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        position: "relative",
        width: style.width || "auto",
        ...style,
      }}
    >
      {showDollar && (
        <span
          style={{
            position: "absolute",
            left: "0.5rem",
            color: "var(--text-muted)",
            fontSize: "0.8rem",
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          $
        </span>
      )}

      <input
        type="text"
        id={id}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={className}
        style={{
          width: "100%",
          textAlign: align,
          fontSize: "0.85rem",
          ...style,
          paddingLeft: showDollar ? "1.4rem" : "0.5rem",
          paddingRight: suffix ? "3.25rem" : "0.5rem",
        }}
      />

      {suffix && (
        <span
          style={{
            position: "absolute",
            right: "0.5rem",
            color: "var(--text-muted)",
            fontSize: "0.72rem",
            fontWeight: "600",
            pointerEvents: "none",
          }}
        >
          {suffix}
        </span>
      )}
    </div>
  );
}

export function formatCurrencyDisplay(val?: string | null): string {
  if (!val || !val.trim()) return "—";
  const trimmed = val.trim();
  const lower = trimmed.toLowerCase();
  if (lower === "no" || lower === "none" || lower === "false") return "No";
  if (lower === "yes") return "Yes";

  const clean = trimmed.replace(/^\$/, "").replace(/,/g, "").trim();
  const num = parseFloat(clean);
  if (!isNaN(num)) {
    return `$${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return trimmed.startsWith("$") ? trimmed : `$${trimmed}`;
}

export default CurrencyInput;
