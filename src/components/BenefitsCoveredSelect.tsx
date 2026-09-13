"use client";

import React, { useState, useEffect } from "react";

interface BenefitsCoveredSelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

const PRESET_BENEFITS = [
  "Med/Rx",
  "Medical Only",
  "Rx Only",
  "All Lines (Med/Rx/Dent/Vis)",
];

export function BenefitsCoveredSelect({
  value,
  onChange,
  className = "form-select",
  style = {},
}: BenefitsCoveredSelectProps) {
  const isPreset = PRESET_BENEFITS.includes(value);
  const [isCustom, setIsCustom] = useState(!isPreset && Boolean(value));
  const [customText, setCustomText] = useState(!isPreset ? value : "");

  useEffect(() => {
    if (!PRESET_BENEFITS.includes(value) && Boolean(value)) {
      setIsCustom(true);
      setCustomText(value);
    } else if (PRESET_BENEFITS.includes(value)) {
      setIsCustom(false);
    }
  }, [value]);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "CUSTOM") {
      setIsCustom(true);
      onChange(customText || "");
    } else {
      setIsCustom(false);
      onChange(val);
    }
  };

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", width: style.width || "auto" }}>
      <select
        value={isCustom ? "CUSTOM" : value || "Med/Rx"}
        onChange={handleSelect}
        className={className}
        style={{
          fontSize: "0.78rem",
          padding: "0.2rem 0.4rem",
          width: isCustom ? "90px" : style.width || "110px",
          ...style,
        }}
      >
        <option value="Med/Rx">Med/Rx</option>
        <option value="Medical Only">Medical Only</option>
        <option value="Rx Only">Rx Only</option>
        <option value="All Lines (Med/Rx/Dent/Vis)">All Lines</option>
        <option value="CUSTOM">Custom...</option>
      </select>

      {isCustom && (
        <input
          type="text"
          value={customText}
          onChange={(e) => {
            setCustomText(e.target.value);
            onChange(e.target.value);
          }}
          placeholder="Custom benefits"
          className="form-input"
          style={{ fontSize: "0.75rem", padding: "0.2rem 0.4rem", width: "90px" }}
        />
      )}
    </div>
  );
}

export default BenefitsCoveredSelect;
