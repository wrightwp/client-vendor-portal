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

  const handleBlur = () => {
    if (!value || !value.trim()) return;
    const num = parseFloat(value.replace(/%/g, ""));
    if (!isNaN(num)) {
      onChange(`${num}%`);
    }
  };

  // Strip % for editing
  const displayVal = value ? value.replace(/%/g, "") : "";

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
      <input
        type="text"
        id={id}
        value={displayVal}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={className}
        style={{
          width: "100%",
          paddingRight: "1.4rem",
          textAlign: "right",
          fontSize: "0.8rem",
          ...style,
        }}
      />
      <span
        style={{
          position: "absolute",
          right: "0.5rem",
          color: "var(--text-muted)",
          fontSize: "0.8rem",
          pointerEvents: "none",
        }}
      >
        %
      </span>
    </div>
  );
}

export default PercentInput;
