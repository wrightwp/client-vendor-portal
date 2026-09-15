"use client";

import React from "react";
import { Layers } from "lucide-react";

export type TierStructure = "1-Tier" | "2-Tier" | "3-Tier" | "4-Tier";

export const TIER_OPTIONS: { id: TierStructure; label: string; desc: string }[] = [
  { id: "1-Tier", label: "1-Tier", desc: "Composite Rate" },
  { id: "2-Tier", label: "2-Tier", desc: "Single & Family" },
  { id: "3-Tier", label: "3-Tier", desc: "Single, EE+1, Family" },
  { id: "4-Tier", label: "4-Tier", desc: "Single, EE+Spouse, EE+Child, Family" },
];

/**
 * Auto-detects tier structure if not explicitly saved
 */
export function detectTierStructure(data: {
  tierStructure?: string;
  single?: string;
  eePlusOne?: string;
  eeSpouse?: string;
  eeChildren?: string;
  family?: string;
  figuresSingle?: string;
  figuresEmployeePlusOne?: string;
  figuresEmployeeSpouse?: string;
  figuresEmployeeChildren?: string;
  figuresFamily?: string;
  aggregateFactorSingle?: string;
  aggregateFactorEmployeePlusOne?: string;
  aggregateFactorEmployeeSpouse?: string;
  aggregateFactorEmployeeChildren?: string;
  aggregateFactorFamily?: string;
}): TierStructure {
  if (data.tierStructure && TIER_OPTIONS.some((t) => t.id === data.tierStructure)) {
    return data.tierStructure as TierStructure;
  }
  const isFilled = (v?: string) => Boolean(v && v.trim() !== "" && v.trim() !== "0" && v.trim() !== "$0.00" && v.trim() !== "—");

  // Check for 4-tier indicators
  if (
    isFilled(data.eeSpouse) ||
    isFilled(data.eeChildren) ||
    isFilled(data.figuresEmployeeSpouse) ||
    isFilled(data.figuresEmployeeChildren) ||
    isFilled(data.aggregateFactorEmployeeSpouse) ||
    isFilled(data.aggregateFactorEmployeeChildren)
  ) {
    return "4-Tier";
  }
  // Check for 3-tier indicators
  if (
    isFilled(data.eePlusOne) ||
    isFilled(data.figuresEmployeePlusOne) ||
    isFilled(data.aggregateFactorEmployeePlusOne)
  ) {
    return "3-Tier";
  }
  // Check for 2-tier indicators (has family and single, but no eePlusOne/eeSpouse)
  if (
    (isFilled(data.single) || isFilled(data.figuresSingle) || isFilled(data.aggregateFactorSingle)) &&
    (isFilled(data.family) || isFilled(data.figuresFamily) || isFilled(data.aggregateFactorFamily))
  ) {
    return "2-Tier";
  }
  // Check for 1-tier composite
  if (isFilled(data.single) || isFilled(data.figuresSingle) || isFilled(data.aggregateFactorSingle)) {
    return "1-Tier";
  }
  return "3-Tier";
}

interface TierStructureSelectorProps {
  value?: string;
  onChange: (tier: TierStructure) => void;
  label?: string;
  compact?: boolean;
  colorScheme?: "pink" | "blue" | "purple";
}

export function TierStructureSelector({
  value,
  onChange,
  label = "Tier Structure",
  compact = false,
  colorScheme = "blue",
}: TierStructureSelectorProps) {
  const activeTier = detectTierStructure({ tierStructure: value });

  const activeColor =
    colorScheme === "pink"
      ? "var(--accent-pink)"
      : colorScheme === "purple"
      ? "var(--accent-purple, #c084fc)"
      : "var(--accent-blue)";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span
          style={{
            fontSize: "0.75rem",
            fontWeight: 700,
            color: activeColor,
            display: "flex",
            alignItems: "center",
            gap: "0.3rem",
          }}
        >
          <Layers size={13} />
          <span>{label}</span>
        </span>
        <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
          {TIER_OPTIONS.find((t) => t.id === activeTier)?.desc}
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "4px",
          padding: "3px",
          background: "var(--bg-card-hover, rgba(255, 255, 255, 0.05))",
          borderRadius: "8px",
          border: "1px solid var(--border)",
        }}
      >
        {TIER_OPTIONS.map((opt) => {
          const isSelected = activeTier === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              style={{
                padding: compact ? "0.3rem 0.2rem" : "0.4rem 0.3rem",
                fontSize: "0.75rem",
                fontWeight: 700,
                borderRadius: "5px",
                border: "none",
                cursor: "pointer",
                background: isSelected ? activeColor : "transparent",
                color: isSelected ? "#ffffff" : "var(--text-secondary)",
                transition: "all 0.15s ease",
                textAlign: "center",
                whiteSpace: "nowrap",
              }}
              title={opt.desc}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default TierStructureSelector;
