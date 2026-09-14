"use client";

import React from "react";
import CurrencyInput from "./CurrencyInput";
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
}): TierStructure {
  if (data.tierStructure && TIER_OPTIONS.some((t) => t.id === data.tierStructure)) {
    return data.tierStructure as TierStructure;
  }
  if (data.eeSpouse || data.eeChildren) return "4-Tier";
  if (data.eePlusOne) return "3-Tier";
  if (data.single && data.family) return "2-Tier";
  if (data.single) return "1-Tier";
  return "3-Tier";
}

interface SpecificPremiumRatesInputProps {
  tierStructure?: string;
  onTierStructureChange?: (tier: TierStructure) => void;

  singleRate?: string;
  onSingleRateChange?: (val: string) => void;

  eePlusOneRate?: string;
  onEePlusOneRateChange?: (val: string) => void;

  eeSpouseRate?: string;
  onEeSpouseRateChange?: (val: string) => void;

  eeChildrenRate?: string;
  onEeChildrenRateChange?: (val: string) => void;

  familyRate?: string;
  onFamilyRateChange?: (val: string) => void;

  isEditing: boolean;
  compact?: boolean;
}

function formatRateAsCurrency(val?: string): string {
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

export function SpecificPremiumRatesInput({
  tierStructure,
  onTierStructureChange,

  singleRate = "",
  onSingleRateChange,

  eePlusOneRate = "",
  onEePlusOneRateChange,

  eeSpouseRate = "",
  onEeSpouseRateChange,

  eeChildrenRate = "",
  onEeChildrenRateChange,

  familyRate = "",
  onFamilyRateChange,

  isEditing,
  compact = false,
}: SpecificPremiumRatesInputProps) {
  const activeTier = detectTierStructure({
    tierStructure,
    single: singleRate,
    eePlusOne: eePlusOneRate,
    eeSpouse: eeSpouseRate,
    eeChildren: eeChildrenRate,
    family: familyRate,
  });

  const handleSelectTier = (tier: TierStructure) => {
    if (onTierStructureChange) {
      onTierStructureChange(tier);
    }
  };

  // Render View Mode
  if (!isEditing) {
    if (activeTier === "1-Tier") {
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", textAlign: "center" }}>
          <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 700 }}>
            Composite Rate (1-Tier)
          </span>
          <div style={{ fontSize: "0.95rem", fontWeight: "700", color: "#00aedb" }}>
            {formatRateAsCurrency(singleRate)}
          </div>
        </div>
      );
    }

    if (activeTier === "2-Tier") {
      return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", fontSize: "0.8rem", textAlign: "center" }}>
          <div>
            <div style={{ color: "var(--text-muted)", fontSize: "0.7rem", fontWeight: 600 }}>Single (EE)</div>
            <div style={{ fontWeight: "700", color: "#00aedb" }}>{formatRateAsCurrency(singleRate)}</div>
          </div>
          <div>
            <div style={{ color: "var(--text-muted)", fontSize: "0.7rem", fontWeight: 600 }}>Family (FAM)</div>
            <div style={{ fontWeight: "700", color: "#00aedb" }}>{formatRateAsCurrency(familyRate)}</div>
          </div>
        </div>
      );
    }

    if (activeTier === "4-Tier") {
      return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "0.4rem", fontSize: "0.78rem", textAlign: "center" }}>
          <div>
            <div style={{ color: "var(--text-muted)", fontSize: "0.68rem", fontWeight: 600 }}>Single</div>
            <div style={{ fontWeight: "700", color: "#00aedb" }}>{formatRateAsCurrency(singleRate)}</div>
          </div>
          <div>
            <div style={{ color: "var(--text-muted)", fontSize: "0.68rem", fontWeight: 600 }}>EE + Spouse</div>
            <div style={{ fontWeight: "700", color: "#00aedb" }}>{formatRateAsCurrency(eeSpouseRate)}</div>
          </div>
          <div>
            <div style={{ color: "var(--text-muted)", fontSize: "0.68rem", fontWeight: 600 }}>EE + Child(ren)</div>
            <div style={{ fontWeight: "700", color: "#00aedb" }}>{formatRateAsCurrency(eeChildrenRate)}</div>
          </div>
          <div>
            <div style={{ color: "var(--text-muted)", fontSize: "0.68rem", fontWeight: 600 }}>Family</div>
            <div style={{ fontWeight: "700", color: "#00aedb" }}>{formatRateAsCurrency(familyRate)}</div>
          </div>
        </div>
      );
    }

    // Default: 3-Tier
    return (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem", fontSize: "0.8rem", textAlign: "center" }}>
        <div>
          <div style={{ color: "var(--text-muted)", fontSize: "0.7rem", fontWeight: 600 }}>Single</div>
          <div style={{ fontWeight: "700", color: "#00aedb" }}>{formatRateAsCurrency(singleRate)}</div>
        </div>
        <div>
          <div style={{ color: "var(--text-muted)", fontSize: "0.7rem", fontWeight: 600 }}>Emp + 1</div>
          <div style={{ fontWeight: "700", color: "#00aedb" }}>{formatRateAsCurrency(eePlusOneRate)}</div>
        </div>
        <div>
          <div style={{ color: "var(--text-muted)", fontSize: "0.7rem", fontWeight: 600 }}>Family</div>
          <div style={{ fontWeight: "700", color: "#00aedb" }}>{formatRateAsCurrency(familyRate)}</div>
        </div>
      </div>
    );
  }

  // Render Edit Mode
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", width: "100%" }}>
      {/* Tier Selector Bar */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--accent-blue)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <Layers size={13} />
            <span>Specific Rating Tier Structure</span>
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
            background: "var(--bg-card-hover)",
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
                onClick={() => handleSelectTier(opt.id)}
                style={{
                  padding: compact ? "0.3rem 0.2rem" : "0.4rem 0.3rem",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  borderRadius: "5px",
                  border: "none",
                  cursor: "pointer",
                  background: isSelected ? "var(--accent-blue)" : "transparent",
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

      {/* Dynamic Rate Fields based on Active Tier */}
      {activeTier === "1-Tier" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>
            Composite Rate ($ PEPM)
          </label>
          <CurrencyInput
            style={{ width: "100%" }}
            align={compact ? "center" : "left"}
            value={singleRate}
            onChange={(val) => onSingleRateChange && onSingleRateChange(val)}
            placeholder="165.00"
          />
        </div>
      )}

      {activeTier === "2-Tier" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
          <div>
            <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>
              Single Rate (EE)
            </label>
            <CurrencyInput
              style={{ width: "100%" }}
              align={compact ? "center" : "left"}
              value={singleRate}
              onChange={(val) => onSingleRateChange && onSingleRateChange(val)}
              placeholder="140.00"
            />
          </div>
          <div>
            <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>
              Family Rate (FAM)
            </label>
            <CurrencyInput
              style={{ width: "100%" }}
              align={compact ? "center" : "left"}
              value={familyRate}
              onChange={(val) => onFamilyRateChange && onFamilyRateChange(val)}
              placeholder="400.00"
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
              value={singleRate}
              onChange={(val) => onSingleRateChange && onSingleRateChange(val)}
              placeholder="140.00"
            />
          </div>
          <div>
            <label style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 600 }}>
              Emp + 1 (EE+1)
            </label>
            <CurrencyInput
              style={{ width: "100%" }}
              align={compact ? "center" : "left"}
              value={eePlusOneRate}
              onChange={(val) => onEePlusOneRateChange && onEePlusOneRateChange(val)}
              placeholder="260.00"
            />
          </div>
          <div>
            <label style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 600 }}>
              Family (FAM)
            </label>
            <CurrencyInput
              style={{ width: "100%" }}
              align={compact ? "center" : "left"}
              value={familyRate}
              onChange={(val) => onFamilyRateChange && onFamilyRateChange(val)}
              placeholder="400.00"
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
              value={singleRate}
              onChange={(val) => onSingleRateChange && onSingleRateChange(val)}
              placeholder="140.00"
            />
          </div>
          <div>
            <label style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: 600 }}>
              EE + Spouse
            </label>
            <CurrencyInput
              style={{ width: "100%" }}
              align={compact ? "center" : "left"}
              value={eeSpouseRate}
              onChange={(val) => onEeSpouseRateChange && onEeSpouseRateChange(val)}
              placeholder="280.00"
            />
          </div>
          <div>
            <label style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: 600 }}>
              EE + Child(ren)
            </label>
            <CurrencyInput
              style={{ width: "100%" }}
              align={compact ? "center" : "left"}
              value={eeChildrenRate}
              onChange={(val) => onEeChildrenRateChange && onEeChildrenRateChange(val)}
              placeholder="250.00"
            />
          </div>
          <div>
            <label style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: 600 }}>
              Family (FAM)
            </label>
            <CurrencyInput
              style={{ width: "100%" }}
              align={compact ? "center" : "left"}
              value={familyRate}
              onChange={(val) => onFamilyRateChange && onFamilyRateChange(val)}
              placeholder="420.00"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default SpecificPremiumRatesInput;
