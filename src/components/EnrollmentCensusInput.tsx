"use client";

import React from "react";
import { TierStructure, detectTierStructure, TierStructureSelector } from "./TierStructureSelector";

interface EnrollmentCensusInputProps {
  tierStructure?: string;
  onTierStructureChange?: (tier: TierStructure) => void;

  single?: string;
  onSingleChange?: (val: string) => void;

  eePlusOne?: string;
  onEePlusOneChange?: (val: string) => void;

  eeSpouse?: string;
  onEeSpouseChange?: (val: string) => void;

  eeChildren?: string;
  onEeChildrenChange?: (val: string) => void;

  family?: string;
  onFamilyChange?: (val: string) => void;

  total?: string;
  onTotalChange?: (val: string) => void;

  isEditing: boolean;
  compact?: boolean;
}

/**
 * Calculates total census based on active tier values
 */
export function calculateCensusTotal(
  tier: TierStructure,
  values: {
    single?: string;
    eePlusOne?: string;
    eeSpouse?: string;
    eeChildren?: string;
    family?: string;
  }
): number {
  const s = parseInt(values.single || "0", 10) || 0;
  const e1 = parseInt(values.eePlusOne || "0", 10) || 0;
  const esp = parseInt(values.eeSpouse || "0", 10) || 0;
  const ech = parseInt(values.eeChildren || "0", 10) || 0;
  const fam = parseInt(values.family || "0", 10) || 0;

  if (tier === "1-Tier") return s;
  if (tier === "2-Tier") return s + fam;
  if (tier === "4-Tier") return s + esp + ech + fam;
  return s + e1 + fam; // 3-Tier default
}

export function EnrollmentCensusInput({
  tierStructure,
  onTierStructureChange,

  single = "",
  onSingleChange,

  eePlusOne = "",
  onEePlusOneChange,

  eeSpouse = "",
  onEeSpouseChange,

  eeChildren = "",
  onEeChildrenChange,

  family = "",
  onFamilyChange,

  total = "",
  onTotalChange,

  isEditing,
  compact = false,
}: EnrollmentCensusInputProps) {
  const activeTier = detectTierStructure({
    tierStructure,
    single,
    eePlusOne,
    eeSpouse,
    eeChildren,
    family,
  });

  const handleTierChange = (newTier: TierStructure) => {
    if (onTierStructureChange) {
      onTierStructureChange(newTier);
    }
  };

  const handleValueChange = (
    field: "single" | "eePlusOne" | "eeSpouse" | "eeChildren" | "family",
    val: string
  ) => {
    const updatedValues = {
      single: field === "single" ? val : single,
      eePlusOne: field === "eePlusOne" ? val : eePlusOne,
      eeSpouse: field === "eeSpouse" ? val : eeSpouse,
      eeChildren: field === "eeChildren" ? val : eeChildren,
      family: field === "family" ? val : family,
    };

    if (field === "single" && onSingleChange) onSingleChange(val);
    if (field === "eePlusOne" && onEePlusOneChange) onEePlusOneChange(val);
    if (field === "eeSpouse" && onEeSpouseChange) onEeSpouseChange(val);
    if (field === "eeChildren" && onEeChildrenChange) onEeChildrenChange(val);
    if (field === "family" && onFamilyChange) onFamilyChange(val);

    if (onTotalChange) {
      const calculatedTotal = calculateCensusTotal(activeTier, updatedValues);
      onTotalChange(String(calculatedTotal));
    }
  };

  // -------------------------------------------------------------
  // VIEW MODE
  // -------------------------------------------------------------
  if (!isEditing) {
    if (activeTier === "1-Tier") {
      return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", textAlign: "center" }}>
          <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "0.75rem 0.5rem", borderRadius: "8px", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: "1.25rem", fontWeight: "800", color: "var(--accent-pink)" }}>
              {single || "0"}
            </div>
            <div style={{ fontSize: "0.725rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>Composite / Single</div>
          </div>
          <div style={{ background: "rgba(244, 114, 182, 0.1)", padding: "0.75rem 0.5rem", borderRadius: "8px", border: "1px solid rgba(244, 114, 182, 0.3)" }}>
            <div style={{ fontSize: "1.25rem", fontWeight: "800", color: "var(--accent-pink)" }}>
              {total || single || "0"}
            </div>
            <div style={{ fontSize: "0.725rem", color: "var(--accent-pink)", fontWeight: "700", marginTop: "0.2rem" }}>Total Census</div>
          </div>
        </div>
      );
    }

    if (activeTier === "2-Tier") {
      return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.2fr", gap: "0.75rem", textAlign: "center" }}>
          <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "0.75rem 0.5rem", borderRadius: "8px", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: "1.25rem", fontWeight: "800", color: "var(--accent-pink)" }}>
              {single || "0"}
            </div>
            <div style={{ fontSize: "0.725rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>Single (EE)</div>
          </div>
          <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "0.75rem 0.5rem", borderRadius: "8px", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: "1.25rem", fontWeight: "800", color: "var(--accent-pink)" }}>
              {family || "0"}
            </div>
            <div style={{ fontSize: "0.725rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>Family (FAM)</div>
          </div>
          <div style={{ background: "rgba(244, 114, 182, 0.1)", padding: "0.75rem 0.5rem", borderRadius: "8px", border: "1px solid rgba(244, 114, 182, 0.3)" }}>
            <div style={{ fontSize: "1.25rem", fontWeight: "800", color: "var(--accent-pink)" }}>
              {total || String((parseInt(single || "0", 10) || 0) + (parseInt(family || "0", 10) || 0))}
            </div>
            <div style={{ fontSize: "0.725rem", color: "var(--accent-pink)", fontWeight: "700", marginTop: "0.2rem" }}>Total Census</div>
          </div>
        </div>
      );
    }

    if (activeTier === "4-Tier") {
      return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "0.5rem", textAlign: "center" }}>
          <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "0.75rem 0.4rem", borderRadius: "8px", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: "1.2rem", fontWeight: "800", color: "var(--accent-pink)" }}>
              {single || "0"}
            </div>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>Single</div>
          </div>
          <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "0.75rem 0.4rem", borderRadius: "8px", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: "1.2rem", fontWeight: "800", color: "var(--accent-pink)" }}>
              {eeSpouse || "0"}
            </div>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>EE + Spouse</div>
          </div>
          <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "0.75rem 0.4rem", borderRadius: "8px", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: "1.2rem", fontWeight: "800", color: "var(--accent-pink)" }}>
              {eeChildren || "0"}
            </div>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>EE + Child(ren)</div>
          </div>
          <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "0.75rem 0.4rem", borderRadius: "8px", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: "1.2rem", fontWeight: "800", color: "var(--accent-pink)" }}>
              {family || "0"}
            </div>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>Family</div>
          </div>
          <div style={{ background: "rgba(244, 114, 182, 0.1)", padding: "0.75rem 0.4rem", borderRadius: "8px", border: "1px solid rgba(244, 114, 182, 0.3)" }}>
            <div style={{ fontSize: "1.2rem", fontWeight: "800", color: "var(--accent-pink)" }}>
              {total || String(calculateCensusTotal("4-Tier", { single, eeSpouse, eeChildren, family }))}
            </div>
            <div style={{ fontSize: "0.7rem", color: "var(--accent-pink)", fontWeight: "700", marginTop: "0.2rem" }}>Total</div>
          </div>
        </div>
      );
    }

    // Default: 3-Tier
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem", textAlign: "center" }}>
        <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "0.75rem 0.5rem", borderRadius: "8px", border: "1px solid var(--border)" }}>
          <div style={{ fontSize: "1.25rem", fontWeight: "800", color: "var(--accent-pink)" }}>
            {single || "0"}
          </div>
          <div style={{ fontSize: "0.725rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>Single</div>
        </div>
        <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "0.75rem 0.5rem", borderRadius: "8px", border: "1px solid var(--border)" }}>
          <div style={{ fontSize: "1.25rem", fontWeight: "800", color: "var(--accent-pink)" }}>
            {eePlusOne || "0"}
          </div>
          <div style={{ fontSize: "0.725rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>Employee + 1</div>
        </div>
        <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "0.75rem 0.5rem", borderRadius: "8px", border: "1px solid var(--border)" }}>
          <div style={{ fontSize: "1.25rem", fontWeight: "800", color: "var(--accent-pink)" }}>
            {family || "0"}
          </div>
          <div style={{ fontSize: "0.725rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>Family</div>
        </div>
        <div style={{ background: "rgba(244, 114, 182, 0.1)", padding: "0.75rem 0.5rem", borderRadius: "8px", border: "1px solid rgba(244, 114, 182, 0.3)" }}>
          <div style={{ fontSize: "1.25rem", fontWeight: "800", color: "var(--accent-pink)" }}>
            {total || String(calculateCensusTotal("3-Tier", { single, eePlusOne, family }))}
          </div>
          <div style={{ fontSize: "0.725rem", color: "var(--accent-pink)", fontWeight: "700", marginTop: "0.2rem" }}>Total Census</div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // EDIT MODE
  // -------------------------------------------------------------
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", width: "100%" }}>
      {/* Linked Tier Level Selector */}
      {onTierStructureChange && (
        <TierStructureSelector
          value={activeTier}
          onChange={handleTierChange}
          colorScheme="pink"
          label="Enrollment Tier Level"
          compact={compact}
        />
      )}

      {/* Dynamic Tier Inputs */}
      {activeTier === "1-Tier" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", textAlign: "center" }}>
          <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "0.75rem 0.5rem", borderRadius: "8px", border: "1px solid var(--border)" }}>
            <input
              type="number"
              min="0"
              className="form-input"
              style={{ textAlign: "center", fontWeight: "800", fontSize: "1.1rem", padding: "0.2rem", color: "var(--accent-pink)" }}
              value={single}
              onChange={(e) => handleValueChange("single", e.target.value)}
              placeholder="0"
            />
            <div style={{ fontSize: "0.725rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>Composite / Single Count</div>
          </div>

          <div style={{ background: "rgba(244, 114, 182, 0.1)", padding: "0.75rem 0.5rem", borderRadius: "8px", border: "1px solid rgba(244, 114, 182, 0.3)" }}>
            <input
              type="number"
              min="0"
              className="form-input"
              style={{ textAlign: "center", fontWeight: "800", fontSize: "1.1rem", padding: "0.2rem", color: "var(--accent-pink)", background: "rgba(244, 114, 182, 0.15)" }}
              value={total || single}
              onChange={(e) => onTotalChange && onTotalChange(e.target.value)}
              placeholder="0"
            />
            <div style={{ fontSize: "0.725rem", color: "var(--accent-pink)", fontWeight: "700", marginTop: "0.2rem" }}>Total Census</div>
          </div>
        </div>
      )}

      {activeTier === "2-Tier" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.2fr", gap: "0.75rem", textAlign: "center" }}>
          <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "0.75rem 0.5rem", borderRadius: "8px", border: "1px solid var(--border)" }}>
            <input
              type="number"
              min="0"
              className="form-input"
              style={{ textAlign: "center", fontWeight: "800", fontSize: "1.1rem", padding: "0.2rem", color: "var(--accent-pink)" }}
              value={single}
              onChange={(e) => handleValueChange("single", e.target.value)}
              placeholder="0"
            />
            <div style={{ fontSize: "0.725rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>Single (EE)</div>
          </div>

          <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "0.75rem 0.5rem", borderRadius: "8px", border: "1px solid var(--border)" }}>
            <input
              type="number"
              min="0"
              className="form-input"
              style={{ textAlign: "center", fontWeight: "800", fontSize: "1.1rem", padding: "0.2rem", color: "var(--accent-pink)" }}
              value={family}
              onChange={(e) => handleValueChange("family", e.target.value)}
              placeholder="0"
            />
            <div style={{ fontSize: "0.725rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>Family (FAM)</div>
          </div>

          <div style={{ background: "rgba(244, 114, 182, 0.1)", padding: "0.75rem 0.5rem", borderRadius: "8px", border: "1px solid rgba(244, 114, 182, 0.3)" }}>
            <input
              type="number"
              min="0"
              className="form-input"
              style={{ textAlign: "center", fontWeight: "800", fontSize: "1.1rem", padding: "0.2rem", color: "var(--accent-pink)", background: "rgba(244, 114, 182, 0.15)" }}
              value={total}
              onChange={(e) => onTotalChange && onTotalChange(e.target.value)}
              placeholder="0"
            />
            <div style={{ fontSize: "0.725rem", color: "var(--accent-pink)", fontWeight: "700", marginTop: "0.2rem" }}>Total Census</div>
          </div>
        </div>
      )}

      {activeTier === "3-Tier" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem", textAlign: "center" }}>
          <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "0.75rem 0.5rem", borderRadius: "8px", border: "1px solid var(--border)" }}>
            <input
              type="number"
              min="0"
              className="form-input"
              style={{ textAlign: "center", fontWeight: "800", fontSize: "1.1rem", padding: "0.2rem", color: "var(--accent-pink)" }}
              value={single}
              onChange={(e) => handleValueChange("single", e.target.value)}
              placeholder="0"
            />
            <div style={{ fontSize: "0.725rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>Single</div>
          </div>

          <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "0.75rem 0.5rem", borderRadius: "8px", border: "1px solid var(--border)" }}>
            <input
              type="number"
              min="0"
              className="form-input"
              style={{ textAlign: "center", fontWeight: "800", fontSize: "1.1rem", padding: "0.2rem", color: "var(--accent-pink)" }}
              value={eePlusOne}
              onChange={(e) => handleValueChange("eePlusOne", e.target.value)}
              placeholder="0"
            />
            <div style={{ fontSize: "0.725rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>Employee + 1</div>
          </div>

          <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "0.75rem 0.5rem", borderRadius: "8px", border: "1px solid var(--border)" }}>
            <input
              type="number"
              min="0"
              className="form-input"
              style={{ textAlign: "center", fontWeight: "800", fontSize: "1.1rem", padding: "0.2rem", color: "var(--accent-pink)" }}
              value={family}
              onChange={(e) => handleValueChange("family", e.target.value)}
              placeholder="0"
            />
            <div style={{ fontSize: "0.725rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>Family</div>
          </div>

          <div style={{ background: "rgba(244, 114, 182, 0.1)", padding: "0.75rem 0.5rem", borderRadius: "8px", border: "1px solid rgba(244, 114, 182, 0.3)" }}>
            <input
              type="number"
              min="0"
              className="form-input"
              style={{ textAlign: "center", fontWeight: "800", fontSize: "1.1rem", padding: "0.2rem", color: "var(--accent-pink)", background: "rgba(244, 114, 182, 0.15)" }}
              value={total}
              onChange={(e) => onTotalChange && onTotalChange(e.target.value)}
              placeholder="0"
            />
            <div style={{ fontSize: "0.725rem", color: "var(--accent-pink)", fontWeight: "700", marginTop: "0.2rem" }}>Total Census</div>
          </div>
        </div>
      )}

      {activeTier === "4-Tier" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "0.5rem", textAlign: "center" }}>
          <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "0.75rem 0.4rem", borderRadius: "8px", border: "1px solid var(--border)" }}>
            <input
              type="number"
              min="0"
              className="form-input"
              style={{ textAlign: "center", fontWeight: "800", fontSize: "1.05rem", padding: "0.2rem", color: "var(--accent-pink)" }}
              value={single}
              onChange={(e) => handleValueChange("single", e.target.value)}
              placeholder="0"
            />
            <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>Single</div>
          </div>

          <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "0.75rem 0.4rem", borderRadius: "8px", border: "1px solid var(--border)" }}>
            <input
              type="number"
              min="0"
              className="form-input"
              style={{ textAlign: "center", fontWeight: "800", fontSize: "1.05rem", padding: "0.2rem", color: "var(--accent-pink)" }}
              value={eeSpouse}
              onChange={(e) => handleValueChange("eeSpouse", e.target.value)}
              placeholder="0"
            />
            <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>EE + Spouse</div>
          </div>

          <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "0.75rem 0.4rem", borderRadius: "8px", border: "1px solid var(--border)" }}>
            <input
              type="number"
              min="0"
              className="form-input"
              style={{ textAlign: "center", fontWeight: "800", fontSize: "1.05rem", padding: "0.2rem", color: "var(--accent-pink)" }}
              value={eeChildren}
              onChange={(e) => handleValueChange("eeChildren", e.target.value)}
              placeholder="0"
            />
            <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>EE + Child(ren)</div>
          </div>

          <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "0.75rem 0.4rem", borderRadius: "8px", border: "1px solid var(--border)" }}>
            <input
              type="number"
              min="0"
              className="form-input"
              style={{ textAlign: "center", fontWeight: "800", fontSize: "1.05rem", padding: "0.2rem", color: "var(--accent-pink)" }}
              value={family}
              onChange={(e) => handleValueChange("family", e.target.value)}
              placeholder="0"
            />
            <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>Family</div>
          </div>

          <div style={{ background: "rgba(244, 114, 182, 0.1)", padding: "0.75rem 0.4rem", borderRadius: "8px", border: "1px solid rgba(244, 114, 182, 0.3)" }}>
            <input
              type="number"
              min="0"
              className="form-input"
              style={{ textAlign: "center", fontWeight: "800", fontSize: "1.05rem", padding: "0.2rem", color: "var(--accent-pink)", background: "rgba(244, 114, 182, 0.15)" }}
              value={total}
              onChange={(e) => onTotalChange && onTotalChange(e.target.value)}
              placeholder="0"
            />
            <div style={{ fontSize: "0.68rem", color: "var(--accent-pink)", fontWeight: "700", marginTop: "0.2rem" }}>Total</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EnrollmentCensusInput;
