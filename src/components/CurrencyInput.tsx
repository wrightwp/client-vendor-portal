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
  // Determine if current value is purely numeric or empty (warrants a $ prefix)
  const isNumericOrEmpty =
    !value ||
    value.trim() === "" ||
    /^\s*\$?-?\d+([.,]\d+)*\s*$/.test(value);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value;
    if (!raw) {
      onChange("");
      return;
    }
    // If user typed/pasted leading $, strip it so we don't double up
    if (raw.startsWith("$")) {
      raw = raw.substring(1).trimStart();
    }
    onChange(raw);
  };

  const handleBlur = () => {
    if (!value || !value.trim()) return;
    const cleaned = value.trim().replace(/,/g, "").replace(/^\$/, "").trim();
    const num = parseFloat(cleaned);
    if (!isNaN(num) && /^-?\d+(\.\d+)?$/.test(cleaned)) {
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
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={className}
        style={{
          width: "100%",
          paddingLeft: showDollar ? "1.25rem" : "0.5rem",
          paddingRight: suffix ? "3.25rem" : "0.5rem",
          textAlign: align,
          fontSize: "0.8rem",
          ...style,
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

export default CurrencyInput;
