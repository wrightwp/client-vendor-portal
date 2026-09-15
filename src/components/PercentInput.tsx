"use client";

import React, { ChangeEvent } from "react";

interface PercentInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
}

export function PercentInput({
  id,
  value,
  onChange,
  placeholder = "0",
  className = "form-input",
  style = {},
  disabled = false,
}: PercentInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value;
    // Allow digits and decimals
    const cleaned = raw.replace(/[^\d.]/g, "");
    onChange(cleaned);
  };

  const handleFocus = () => {
    if (!value) return;
    const cleaned = value.trim().replace(/%/g, "");
    const num = parseFloat(cleaned);
    if (!isNaN(num) && num === 0) {
      onChange("");
    }
  };

  const handleBlur = () => {
    if (!value || !value.trim()) return;
    const num = parseFloat(value.replace(/%/g, ""));
    if (!isNaN(num)) {
      onChange(`${num}%`);
    }
  };

  // Strip % for editing
  const displayVal = value ? value.replace(/%/g, "") : "";

  const { width, margin, marginTop, marginBottom, flex, alignSelf, ...inputStyles } = style || {};

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        position: "relative",
        width: width || "100%",
        margin,
        marginTop,
        marginBottom,
        flex,
        alignSelf,
      }}
    >
      <input
        type="text"
        id={id}
        value={displayVal}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={className}
        style={{
          width: "100%",
          textAlign: "right",
          fontSize: "0.85rem",
          ...inputStyles,
          paddingRight: "1.75rem",
        }}
      />
      <span
        style={{
          position: "absolute",
          right: "0.6rem",
          color: "var(--text-muted)",
          fontSize: "0.85rem",
          fontWeight: "600",
          pointerEvents: "none",
        }}
      >
        %
      </span>
    </div>
  );
}

export default PercentInput;
