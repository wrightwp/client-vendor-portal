"use client";

import React, { useState, useEffect } from "react";

interface ContractSelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
}

const STANDARD_CONTRACTS = [
  "12/12",
  "12/15",
  "12/18",
  "12/24",
  "24/12",
  "pi (paid & incurred) 12/12",
  "Paid & Incurred",
];

export function ContractSelect({
  value,
  onChange,
  className = "form-select",
  style = {},
  disabled = false,
}: ContractSelectProps) {
  const isStandard = STANDARD_CONTRACTS.includes(value);
  const [isCustom, setIsCustom] = useState(!isStandard && Boolean(value));
  const [customText, setCustomText] = useState(!isStandard ? value : "");

  useEffect(() => {
    if (!STANDARD_CONTRACTS.includes(value) && Boolean(value)) {
      setIsCustom(true);
      setCustomText(value);
    } else if (STANDARD_CONTRACTS.includes(value)) {
      setIsCustom(false);
    }
  }, [value]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    if (selected === "CUSTOM") {
      setIsCustom(true);
      onChange(customText || "");
    } else {
      setIsCustom(false);
      onChange(selected);
    }
  };

  const handleCustomTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setCustomText(text);
    onChange(text);
  };

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", width: style.width || "auto" }}>
      <select
        value={isCustom ? "CUSTOM" : value || "12/12"}
        onChange={handleSelectChange}
        disabled={disabled}
        className={className}
        style={{
          fontSize: "0.78rem",
          padding: "0.2rem 0.4rem",
          width: isCustom ? "90px" : style.width || "110px",
          ...style,
        }}
      >
        <option value="12/12">12/12</option>
        <option value="12/15">12/15</option>
        <option value="12/18">12/18</option>
        <option value="12/24">12/24</option>
        <option value="24/12">24/12</option>
        <option value="pi (paid & incurred) 12/12">Paid & Incurred (12/12)</option>
        <option value="CUSTOM">Custom...</option>
      </select>

      {isCustom && (
        <input
          type="text"
          value={customText}
          onChange={handleCustomTextChange}
          placeholder="e.g. 15/12"
          className="form-input"
          style={{
            fontSize: "0.75rem",
            padding: "0.2rem 0.4rem",
            width: "80px",
          }}
        />
      )}
    </div>
  );
}

export default ContractSelect;
