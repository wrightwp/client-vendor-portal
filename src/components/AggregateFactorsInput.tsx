"use client";

import React from "react";
import CurrencyInput from "./CurrencyInput";
import { TierStructure, detectTierStructure, TierStructureSelector } from "./TierStructureSelector";

interface AggregateFactorsInputProps {
  tierStructure?: string;
  onTierStructureChange?: (tier: TierStructure) => void;

  singleFactor?: string;
  onSingleFactorChange?: (val: string) => void;

  eePlusOneFactor?: string;
  onEePlusOneFactorChange?: (val: string) => void;

  eeSpouseFactor?: string;
  onEeSpouseFactorChange?: (val: string) => void;

  eeChildrenFactor?: string;
  onEeChildrenFactorChange?: (val: string) => void;

  familyFactor?: string;
  onFamilyFactorChange?: (val: string) => void;

  isEditing: boolean;
  compact?: boolean;
}

function formatFactorDisplay(val?: string): string {
  if (!val || val === "—") return "—";
  const trimmed = val.trim();
  if (!trimmed) return "—";
  if (trimmed.startsWith("$")) return trimmed;
  const num = parseFloat(trimmed.replace(/,/g, ""));
  if (!isNaN(num)) {
    return `$${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `$${trimmed}`;
}

export function AggregateFactorsInput({
  tierStructure,
  onTierStructureChange,

  singleFactor = "",
  onSingleFactorChange,

  eePlusOneFactor = "",
  onEePlusOneFactorChange,

  eeSpouseFactor = "",
  onEeSpouseFactorChange,

  eeChildrenFactor = "",
  onEeChildrenFactorChange,

  familyFactor = "",
  onFamilyFactorChange,

  isEditing,
  compact = false,
}: AggregateFactorsInputProps) {
  const activeTier = detectTierStructure({
    tierStructure,
    aggregateFactorSingle: singleFactor,
    aggregateFactorEmployeePlusOne: eePlusOneFactor,
    aggregateFactorEmployeeSpouse: eeSpouseFactor,
    aggregateFactorEmployeeChildren: eeChildrenFactor,
    aggregateFactorFamily: familyFactor,
  });

  // -------------------------------------------------------------
  // VIEW MODE
  // -------------------------------------------------------------
  if (!isEditing) {
    if (activeTier === "1-Tier") {
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", textAlign: "center" }}>
          <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 700 }}>
            Composite Factor (1-Tier)
          </span>
          <div style={{ fontSize: "0.95rem", fontWeight: "700", color: "#c084fc" }}>
            {formatFactorDisplay(singleFactor)}
          </div>
        </div>
      );
    }

    if (activeTier === "2-Tier") {
      return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", fontSize: "0.8rem", textAlign: "center" }}>
          <div>
            <div style={{ color: "var(--text-muted)", fontSize: "0.7rem", fontWeight: 600 }}>Single (EE)</div>
            <div style={{ fontWeight: "700", color: "#c084fc" }}>{formatFactorDisplay(singleFactor)}</div>
          </div>
          <div>
            <div style={{ color: "var(--text-muted)", fontSize: "0.7rem", fontWeight: 600 }}>Family (FAM)</div>
            <div style={{ fontWeight: "700", color: "#c084fc" }}>{formatFactorDisplay(familyFactor)}</div>
          </div>
        </div>
      );
    }

    if (activeTier === "4-Tier") {
      return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "0.4rem", fontSize: "0.78rem", textAlign: "center" }}>
          <div>
            <div style={{ color: "var(--text-muted)", fontSize: "0.68rem", fontWeight: 600 }}>Single</div>
            <div style={{ fontWeight: "700", color: "#c084fc" }}>{formatFactorDisplay(singleFactor)}</div>
          </div>
          <div>
            <div style={{ color: "var(--text-muted)", fontSize: "0.68rem", fontWeight: 600 }}>EE + Spouse</div>
            <div style={{ fontWeight: "700", color: "#c084fc" }}>{formatFactorDisplay(eeSpouseFactor)}</div>
          </div>
          <div>
            <div style={{ color: "var(--text-muted)", fontSize: "0.68rem", fontWeight: 600 }}>EE + Child(ren)</div>
            <div style={{ fontWeight: "700", color: "#c084fc" }}>{formatFactorDisplay(eeChildrenFactor)}</div>
          </div>
          <div>
            <div style={{ color: "var(--text-muted)", fontSize: "0.68rem", fontWeight: 600 }}>Family</div>
            <div style={{ fontWeight: "700", color: "#c084fc" }}>{formatFactorDisplay(familyFactor)}</div>
          </div>
        </div>
      );
    }

    // Default: 3-Tier
    return (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem", fontSize: "0.8rem", textAlign: "center" }}>
        <div>
          <div style={{ color: "var(--text-muted)", fontSize: "0.7rem", fontWeight: 600 }}>Single</div>
          <div style={{ fontWeight: "700", color: "#c084fc" }}>{formatFactorDisplay(singleFactor)}</div>
        </div>
        <div>
          <div style={{ color: "var(--text-muted)", fontSize: "0.7rem", fontWeight: 600 }}>Emp + 1</div>
          <div style={{ fontWeight: "700", color: "#c084fc" }}>{formatFactorDisplay(eePlusOneFactor)}</div>
        </div>
        <div>
          <div style={{ color: "var(--text-muted)", fontSize: "0.7rem", fontWeight: 600 }}>Family</div>
          <div style={{ fontWeight: "700", color: "#c084fc" }}>{formatFactorDisplay(familyFactor)}</div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // EDIT MODE
  // -------------------------------------------------------------
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", width: "100%" }}>
      {/* Linked Tier Level Selector */}
      {onTierStructureChange && (
        <TierStructureSelector
          value={activeTier}
          onChange={onTierStructureChange}
          colorScheme="purple"
          label="Aggregate Tier Structure"
          compact={compact}
        />
      )}

      {/* Dynamic Factor Inputs */}
      {activeTier === "1-Tier" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>
            Composite Factor ($ PEPM)
          </label>
          <CurrencyInput
            style={{ width: "100%" }}
            align={compact ? "center" : "left"}
            value={singleFactor}
            onChange={(val) => onSingleFactorChange && onSingleFactorChange(val)}
            placeholder="0.00"
          />
        </div>
      )}

      {activeTier === "2-Tier" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
          <div>
            <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>
              Single Factor (EE)
            </label>
            <CurrencyInput
              style={{ width: "100%" }}
              align={compact ? "center" : "left"}
              value={singleFactor}
              onChange={(val) => onSingleFactorChange && onSingleFactorChange(val)}
              placeholder="0.00"
            />
          </div>
          <div>
            <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>
              Family Factor (FAM)
            </label>
            <CurrencyInput
              style={{ width: "100%" }}
              align={compact ? "center" : "left"}
              value={familyFactor}
              onChange={(val) => onFamilyFactorChange && onFamilyFactorChange(val)}
              placeholder="0.00"
            />
          </div>
        </div>
      )}

      {activeTier === "3-Tier" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.6rem" }}>
          <div>
            <label style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 600 }}>
              Single (EE)
            </label>
            <CurrencyInput
              style={{ width: "100%" }}
              align={compact ? "center" : "left"}
              value={singleFactor}
              onChange={(val) => onSingleFactorChange && onSingleFactorChange(val)}
              placeholder="0.00"
            />
          </div>
          <div>
            <label style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 600 }}>
              Emp + 1 (EE+1)
            </label>
            <CurrencyInput
              style={{ width: "100%" }}
              align={compact ? "center" : "left"}
              value={eePlusOneFactor}
              onChange={(val) => onEePlusOneFactorChange && onEePlusOneFactorChange(val)}
              placeholder="0.00"
            />
          </div>
          <div>
            <label style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 600 }}>
              Family (FAM)
            </label>
            <CurrencyInput
              style={{ width: "100%" }}
              align={compact ? "center" : "left"}
              value={familyFactor}
              onChange={(val) => onFamilyFactorChange && onFamilyFactorChange(val)}
              placeholder="0.00"
            />
          </div>
        </div>
      )}

      {activeTier === "4-Tier" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "0.5rem" }}>
          <div>
            <label style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: 600 }}>
              Single (EE)
            </label>
            <CurrencyInput
              style={{ width: "100%" }}
              align={compact ? "center" : "left"}
              value={singleFactor}
              onChange={(val) => onSingleFactorChange && onSingleFactorChange(val)}
              placeholder="0.00"
            />
          </div>
          <div>
            <label style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: 600 }}>
              EE + Spouse
            </label>
            <CurrencyInput
              style={{ width: "100%" }}
              align={compact ? "center" : "left"}
              value={eeSpouseFactor}
              onChange={(val) => onEeSpouseFactorChange && onEeSpouseFactorChange(val)}
              placeholder="0.00"
            />
          </div>
          <div>
            <label style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: 600 }}>
              EE + Child(ren)
            </label>
            <CurrencyInput
              style={{ width: "100%" }}
              align={compact ? "center" : "left"}
              value={eeChildrenFactor}
              onChange={(val) => onEeChildrenFactorChange && onEeChildrenFactorChange(val)}
              placeholder="0.00"
            />
          </div>
          <div>
            <label style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: 600 }}>
              Family (FAM)
            </label>
            <CurrencyInput
              style={{ width: "100%" }}
              align={compact ? "center" : "left"}
              value={familyFactor}
              onChange={(val) => onFamilyFactorChange && onFamilyFactorChange(val)}
              placeholder="0.00"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default AggregateFactorsInput;
