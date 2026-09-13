"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, ShieldAlert, User } from "lucide-react";
import YesNoToggle from "./YesNoToggle";

export interface LaserItem {
  id: string;
  individual: string;
  deductible: string;
  condition?: string;
}

interface LaseredIndividualsInputProps {
  value: string;
  onChange: (value: string) => void;
  compact?: boolean;
}

/**
 * Parses existing value string into structured LaserItems
 */
function parseLaserString(val: string): { isYes: boolean; items: LaserItem[] } {
  const trimmed = (val || "").trim();
  if (!trimmed || trimmed.toLowerCase() === "no" || trimmed.toLowerCase() === "none") {
    return { isYes: false, items: [] };
  }

  // Try JSON parse first
  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return { isYes: true, items: parsed };
    }
  } catch (e) {
    // Not JSON, continue to string parsing
  }

  // If text contains items separated by commas or semicolons
  const parts = trimmed.split(/[;,]/).map((p) => p.trim()).filter(Boolean);
  if (parts.length > 0) {
    const items: LaserItem[] = parts.map((part, idx) => {
      // Look for dollar amount
      const amountMatch = part.match(/\$[\d,]+(\.\d+)?([kK])?/);
      const deductible = amountMatch ? amountMatch[0] : "$150,000";
      return {
        id: String(Date.now() + idx),
        individual: `Individual #${idx + 1}`,
        deductible: deductible,
        condition: part.replace(amountMatch ? amountMatch[0] : "", "").replace(/[\(\)]/g, "").trim() || "",
      };
    });
    return { isYes: true, items };
  }

  return {
    isYes: true,
    items: [
      {
        id: String(Date.now()),
        individual: "Individual #1",
        deductible: "$150,000",
        condition: "",
      },
    ],
  };
}

/**
 * Serializes laser items into a clean human-readable summary string
 */
function serializeLaserItems(items: LaserItem[]): string {
  if (!items || items.length === 0) return "No";

  // Summary format readable in Excel and UI:
  // e.g. "2 individuals: Individual #1 ($150,000), Individual #2 ($250,000)"
  const countStr = items.length === 1 ? "1 individual" : `${items.length} individuals`;
  const details = items
    .map((item) => {
      const parts = [item.individual || "Individual", item.deductible || "$0"];
      if (item.condition) parts.push(item.condition);
      return `${parts[0]} (${parts.slice(1).join(" - ")})`;
    })
    .join("; ");

  return `${countStr}: ${details}`;
}

export function LaseredIndividualsInput({
  value,
  onChange,
  compact = false,
}: LaseredIndividualsInputProps) {
  const parsed = parseLaserString(value);
  const [isYes, setIsYes] = useState(parsed.isYes);
  const [items, setItems] = useState<LaserItem[]>(
    parsed.items.length > 0
      ? parsed.items
      : [{ id: String(Date.now()), individual: "Individual #1", deductible: "$150,000", condition: "" }]
  );
  const [showDrawer, setShowDrawer] = useState(false);

  useEffect(() => {
    const p = parseLaserString(value);
    setIsYes(p.isYes);
    if (p.items.length > 0) {
      setItems(p.items);
    }
  }, [value]);

  const handleToggle = (toggleVal: string) => {
    if (toggleVal === "No") {
      setIsYes(false);
      setShowDrawer(false);
      onChange("No");
    } else {
      setIsYes(true);
      setShowDrawer(true);
      const initialList =
        items.length > 0
          ? items
          : [{ id: String(Date.now()), individual: "Individual #1", deductible: "$150,000", condition: "" }];
      setItems(initialList);
      onChange(serializeLaserItems(initialList));
    }
  };

  const handleItemChange = (id: string, field: keyof LaserItem, val: string) => {
    const updated = items.map((item) => (item.id === id ? { ...item, [field]: val } : item));
    setItems(updated);
    onChange(serializeLaserItems(updated));
  };

  const handleAddItem = () => {
    const newItem: LaserItem = {
      id: String(Date.now()),
      individual: `Individual #${items.length + 1}`,
      deductible: "$150,000",
      condition: "",
    };
    const updated = [...items, newItem];
    setItems(updated);
    onChange(serializeLaserItems(updated));
  };

  const handleRemoveItem = (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    if (updated.length === 0) {
      setIsYes(false);
      onChange("No");
    } else {
      setItems(updated);
      onChange(serializeLaserItems(updated));
    }
  };

  if (compact) {
    // Inline row version
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.3rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <YesNoToggle value={isYes ? "Yes" : "No"} onChange={handleToggle} size="sm" />
          {isYes && (
            <button
              type="button"
              onClick={() => setShowDrawer(!showDrawer)}
              className="btn btn-sm"
              style={{
                fontSize: "0.72rem",
                padding: "0.15rem 0.4rem",
                background: "rgba(244, 114, 182, 0.15)",
                color: "var(--accent-pink)",
                border: "1px solid rgba(244, 114, 182, 0.35)",
                borderRadius: "4px",
              }}
            >
              {items.length} {items.length === 1 ? "Laser" : "Lasers"} {showDrawer ? "▲" : "▼"}
            </button>
          )}
        </div>

        {isYes && showDrawer && (
          <div
            style={{
              marginTop: "0.3rem",
              padding: "0.6rem",
              background: "var(--bg-elevated)",
              border: "1px solid rgba(244, 114, 182, 0.3)",
              borderRadius: "6px",
              width: "260px",
              display: "flex",
              flexDirection: "column",
              gap: "0.4rem",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            <div style={{ fontSize: "0.72rem", fontWeight: "700", color: "var(--accent-pink)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
              <ShieldAlert size={12} />
              <span>Lasered Individuals ({items.length})</span>
            </div>

            {items.map((item) => (
              <div key={item.id} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "0.25rem", alignItems: "center" }}>
                <input
                  type="text"
                  placeholder="ID / Name"
                  value={item.individual}
                  onChange={(e) => handleItemChange(item.id, "individual", e.target.value)}
                  className="form-input"
                  style={{ fontSize: "0.7rem", padding: "0.15rem 0.3rem", height: "24px" }}
                />
                <input
                  type="text"
                  placeholder="Laser Deductible"
                  value={item.deductible}
                  onChange={(e) => handleItemChange(item.id, "deductible", e.target.value)}
                  className="form-input"
                  style={{ fontSize: "0.7rem", padding: "0.15rem 0.3rem", height: "24px" }}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveItem(item.id)}
                  style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", padding: "2px" }}
                  title="Remove Laser"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddItem}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: "0.68rem", padding: "0.15rem 0.35rem", display: "inline-flex", alignItems: "center", gap: "0.2rem", justifyContent: "center" }}
            >
              <Plus size={11} />
              <span>Add Another Laser</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // Modal full-width version
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <label className="form-label" style={{ margin: 0, display: "flex", alignItems: "center", gap: "0.35rem" }}>
          <ShieldAlert size={15} style={{ color: "var(--accent-pink)" }} />
          <span>Any Lasered Individuals?</span>
        </label>
        <YesNoToggle value={isYes ? "Yes" : "No"} onChange={handleToggle} size="md" />
      </div>

      {isYes && (
        <div
          style={{
            background: "rgba(244, 114, 182, 0.04)",
            border: "1px solid rgba(244, 114, 182, 0.25)",
            borderRadius: "8px",
            padding: "0.75rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "0.2rem" }}>
            Record specific deductible lasers assigned to individual members:
          </div>

          {items.map((item, idx) => (
            <div
              key={item.id}
              style={{
                display: "grid",
                gridTemplateColumns: "1.2fr 1.2fr 1.5fr auto",
                gap: "0.5rem",
                alignItems: "center",
                background: "var(--bg-input)",
                padding: "0.4rem 0.6rem",
                borderRadius: "6px",
                border: "1px solid var(--border)",
              }}
            >
              <input
                type="text"
                placeholder="Individual Identifier / ID"
                value={item.individual}
                onChange={(e) => handleItemChange(item.id, "individual", e.target.value)}
                className="form-input"
                style={{ fontSize: "0.78rem", padding: "0.25rem 0.45rem" }}
              />

              <input
                type="text"
                placeholder="Laser Deductible (e.g. $150,000)"
                value={item.deductible}
                onChange={(e) => handleItemChange(item.id, "deductible", e.target.value)}
                className="form-input"
                style={{ fontSize: "0.78rem", padding: "0.25rem 0.45rem" }}
              />

              <input
                type="text"
                placeholder="Condition / Notes (optional)"
                value={item.condition || ""}
                onChange={(e) => handleItemChange(item.id, "condition", e.target.value)}
                className="form-input"
                style={{ fontSize: "0.78rem", padding: "0.25rem 0.45rem" }}
              />

              <button
                type="button"
                onClick={() => handleRemoveItem(item.id)}
                className="btn btn-danger btn-sm"
                style={{ padding: "0.25rem 0.4rem" }}
                title="Remove Laser"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddItem}
            className="btn btn-secondary btn-sm"
            style={{
              alignSelf: "flex-start",
              fontSize: "0.75rem",
              padding: "0.25rem 0.6rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.3rem",
              marginTop: "0.2rem",
            }}
          >
            <Plus size={13} style={{ color: "var(--accent-pink)" }} />
            <span>+ Add Another Lasered Individual</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default LaseredIndividualsInput;
