"use client";

import React, { useState, useEffect } from "react";
import CurrencyInput from "./CurrencyInput";
import { User, Users } from "lucide-react";

interface SpecificDeductibleInputProps {
  value: string;
  onChange: (value: string) => void;
  compact?: boolean;
}

export type DeductibleBasis = "Per Individual" | "Per Family";

/**
 * Formats a raw amount string as currency (e.g., "50000" -> "$50,000.00")
 */
export function formatCurrencyAmount(val: string): string {
  if (!val || !val.trim()) return "$50,000.00";
  const cleaned = val.trim().replace(/,/g, "").replace(/^\$/, "").trim();
  const num = parseFloat(cleaned);
  if (!isNaN(num)) {
    return `$${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  if (!val.trim().startsWith("$")) {
    return `$${val.trim()}`;
  }
  return val.trim();
}

/**
 * Parses raw deductible string into amount and basis ("Per Individual" | "Per Family")
 * e.g. "$50,000.00 / Per Individual", "$75,000 / Per Family", "50000"
 */
export function parseSpecificDeductible(val: string): { amount: string; basis: DeductibleBasis } {
  const trimmed = (val || "").trim();
  if (!trimmed) {
    return { amount: "$50,000.00", basis: "Per Individual" };
  }

  const isFamily = /per\s*family|family/i.test(trimmed);
  const basis: DeductibleBasis = isFamily ? "Per Family" : "Per Individual";

  // Extract currency amount part before slash or bracket
  const parts = trimmed.split(/[/(\\]/);
  const amountPart = parts[0].trim();
  const amount = formatCurrencyAmount(amountPart || "$50,000.00");

  return { amount, basis };
}

/**
 * Helper to display any specific deductible string formatted as currency with basis
 */
export function formatDisplaySpecificDeductible(val: string | null | undefined): string {
  if (!val || !val.trim()) return "—";
  const { amount, basis } = parseSpecificDeductible(val);
  return `${amount} / ${basis}`;
}

export function SpecificDeductibleInput({
  value,
  onChange,
  compact = false,
}: SpecificDeductibleInputProps) {
  const parsed = parseSpecificDeductible(value);
  const [amount, setAmount] = useState(parsed.amount);
  const [basis, setBasis] = useState<DeductibleBasis>(parsed.basis);

  useEffect(() => {
    const p = parseSpecificDeductible(value);
    setAmount(p.amount);
    setBasis(p.basis);
  }, [value]);

  const emitChange = (newAmount: string, newBasis: DeductibleBasis) => {
    const formattedAmt = formatCurrencyAmount(newAmount);
    onChange(`${formattedAmt} / ${newBasis}`);
  };

  const handleAmountChange = (val: string) => {
    setAmount(val);
    emitChange(val, basis);
  };

  const handleBasisChange = (newBasis: DeductibleBasis) => {
    setBasis(newBasis);
    emitChange(amount, newBasis);
  };

  if (compact) {
    return (
      <div style={{ display: "flex", flexDirection: "column", width: "100%", alignItems: "flex-end", gap: "0.4rem" }}>
        <CurrencyInput
          value={amount}
          onChange={handleAmountChange}
          placeholder="0.00"
          style={{ width: "140px", fontSize: "0.825rem", padding: "0.25rem 0.5rem" }}
        />

        {/* Segmented Toggle for Per Individual vs Per Family */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "2px",
            background: "var(--bg-card-hover)",
            borderRadius: "6px",
            border: "1px solid var(--border)",
            gap: "2px",
          }}
        >
          <button
            type="button"
            onClick={() => handleBasisChange("Per Individual")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              padding: "0.2rem 0.45rem",
              fontSize: "0.725rem",
              fontWeight: 700,
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
              background: basis === "Per Individual" ? "var(--accent-blue)" : "transparent",
              color: basis === "Per Individual" ? "#ffffff" : "var(--text-secondary)",
              transition: "all 0.15s ease",
            }}
          >
            <User size={11} />
            <span>Per Individual</span>
          </button>

          <button
            type="button"
            onClick={() => handleBasisChange("Per Family")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              padding: "0.2rem 0.45rem",
              fontSize: "0.725rem",
              fontWeight: 700,
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
              background: basis === "Per Family" ? "var(--accent-pink)" : "transparent",
              color: basis === "Per Family" ? "#ffffff" : "var(--text-secondary)",
              transition: "all 0.15s ease",
            }}
          >
            <Users size={11} />
            <span>Per Family</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <CurrencyInput
        align="left"
        style={{ width: "100%" }}
        placeholder="0.00"
        value={amount}
        onChange={handleAmountChange}
      />

      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.2rem" }}>
        <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600 }}>Deductible Scope:</span>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "2px",
            background: "var(--bg-card-hover)",
            borderRadius: "6px",
            border: "1px solid var(--border)",
            gap: "2px",
          }}
        >
          <button
            type="button"
            onClick={() => handleBasisChange("Per Individual")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
              padding: "0.3rem 0.65rem",
              fontSize: "0.78rem",
              fontWeight: 700,
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
              background: basis === "Per Individual" ? "var(--accent-blue)" : "transparent",
              color: basis === "Per Individual" ? "#ffffff" : "var(--text-secondary)",
              transition: "all 0.15s ease",
            }}
          >
            <User size={12} />
            <span>Per Individual</span>
          </button>

          <button
            type="button"
            onClick={() => handleBasisChange("Per Family")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
              padding: "0.3rem 0.65rem",
              fontSize: "0.78rem",
              fontWeight: 700,
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
              background: basis === "Per Family" ? "var(--accent-pink)" : "transparent",
              color: basis === "Per Family" ? "#ffffff" : "var(--text-secondary)",
              transition: "all 0.15s ease",
            }}
          >
            <Users size={12} />
            <span>Per Family</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default SpecificDeductibleInput;
