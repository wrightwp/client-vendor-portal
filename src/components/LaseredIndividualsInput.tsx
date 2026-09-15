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
  if (!trimmed || trimmed.toLowerCase() === "no" || trimmed.toLowerCase() === "none" || trimmed.toLowerCase() === "false") {
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

  // Clean summary prefix like "1 individual: ", "2 individuals: "
  const cleaned = trimmed.replace(/^\d+\s+individuals?:?\s*/i, "");

  // Split ONLY by semicolon or newline or pipe (NEVER comma, since amounts have commas like $150,000!)
  const rawParts = cleaned.split(/[;\n|]/).map((p) => p.trim()).filter(Boolean);

  if (rawParts.length > 0) {
    const items: LaserItem[] = rawParts.map((part, idx) => {
      // Find deductible amount e.g. $150,000 or $150k
      const amountMatch = part.match(/\$[\d,]+(\.\d+)?([kK])?/);
      const deductible = amountMatch ? amountMatch[0] : "$150,000";

      // Extract individual name e.g. "Individual #1"
      let individual = `Individual #${idx + 1}`;
      const nameMatch = part.match(/^([^($]+)/);
      if (nameMatch && nameMatch[1].trim()) {
        const candidate = nameMatch[1].trim();
        if (candidate) {
          individual = candidate;
        }
      }

      // Extract condition inside parentheses if any
      let condition = "";
      const condMatch = part.match(/\(([^)]+)\)/);
      if (condMatch) {
        condition = condMatch[1].replace(amountMatch ? amountMatch[0] : "", "").replace(/^[-:\s]+|[-:\s]+$/g, "").trim();
      }

      return {
        id: `laser_${idx + 1}_${Math.random().toString(36).substring(2, 7)}`,
        individual,
        deductible,
        condition,
      };
    });
    return { isYes: true, items };
  }

  return {
    isYes: true,
    items: [
      {
        id: `laser_1_${Math.random().toString(36).substring(2, 7)}`,
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

  const countStr = items.length === 1 ? "1 individual" : `${items.length} individuals`;
  const details = items
    .map((item) => {
      const parts = [item.individual || "Individual", item.deductible || "$150,000"];
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
      : [{ id: `laser_1_${Math.random().toString(36).substring(2, 7)}`, individual: "Individual #1", deductible: "$150,000", condition: "" }]
  );
  const [showDrawer, setShowDrawer] = useState(false);

  useEffect(() => {
    const currentSerialized = serializeLaserItems(items);
    if (value !== currentSerialized) {
      const p = parseLaserString(value);
      setIsYes(p.isYes);
      if (p.items.length > 0) {
        setItems(p.items);
      }
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
          : [{ id: `laser_1_${Math.random().toString(36).substring(2, 7)}`, individual: "Individual #1", deductible: "$150,000", condition: "" }];
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
      id: `laser_${items.length + 1}_${Math.random().toString(36).substring(2, 7)}`,
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
      setShowDrawer(false);
      onChange("No");
    } else {
      setItems(updated);
      onChange(serializeLaserItems(updated));
    }
  };

  if (compact) {
    // Inline row version
    return (
      <div style={{ display: "flex", flexDirection: "column", width: "100%", alignItems: "flex-end", gap: "0.35rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          {isYes && (
            <button
              type="button"
              onClick={() => setShowDrawer(!showDrawer)}
              className="btn btn-sm"
              style={{
                fontSize: "0.72rem",
                padding: "0.15rem 0.45rem",
                background: "rgba(244, 114, 182, 0.12)",
                color: "var(--accent-pink)",
                border: "1px solid rgba(244, 114, 182, 0.35)",
                borderRadius: "4px",
                fontWeight: "600",
              }}
            >
              {items.length} {items.length === 1 ? "Laser" : "Lasers"} {showDrawer ? "▲" : "▼"}
            </button>
          )}
          <YesNoToggle value={isYes ? "Yes" : "No"} onChange={handleToggle} size="sm" />
        </div>

        {isYes && showDrawer && (
          <div
            style={{
              marginTop: "0.35rem",
              padding: "0.6rem 0.75rem",
              background: "var(--bg-elevated)",
              border: "1px solid rgba(244, 114, 182, 0.35)",
              borderRadius: "8px",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "0.35rem",
              boxShadow: "var(--shadow-md)",
            }}
          >
            <div style={{ fontSize: "0.72rem", fontWeight: "700", color: "var(--accent-pink)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <ShieldAlert size={12} />
                Lasered Individuals ({items.length})
              </span>
              <button
                type="button"
                onClick={handleAddItem}
                style={{
                  fontSize: "0.68rem",
                  background: "rgba(244, 114, 182, 0.12)",
                  color: "var(--accent-pink)",
                  border: "1px solid rgba(244, 114, 182, 0.3)",
                  borderRadius: "4px",
                  padding: "0.1rem 0.4rem",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.2rem",
                  fontWeight: "600",
                }}
              >
                <Plus size={10} />Add Individual
              </button>
            </div>

            {/* Compact Grid Table Header spanning full box width */}
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1.4fr 24px", gap: "0.4rem", fontSize: "0.68rem", fontWeight: "700", color: "var(--text-muted)", borderBottom: "1px solid var(--border)", paddingBottom: "0.2rem", marginTop: "0.15rem" }}>
              <span>Member / ID</span>
              <span>Deductible</span>
              <span>Condition / Notes</span>
              <span></span>
            </div>

            {/* Compact Grid Rows spanning full box width */}
            {items.map((item) => (
              <div key={item.id} style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1.4fr 24px", gap: "0.4rem", alignItems: "center" }}>
                <input
                  type="text"
                  placeholder="ID / Name"
                  value={item.individual}
                  onChange={(e) => handleItemChange(item.id, "individual", e.target.value)}
                  className="form-input"
                  style={{ fontSize: "0.74rem", padding: "0.15rem 0.35rem", height: "26px" }}
                />
                <input
                  type="text"
                  placeholder="Deductible"
                  value={item.deductible}
                  onChange={(e) => handleItemChange(item.id, "deductible", e.target.value)}
                  className="form-input"
                  style={{ fontSize: "0.74rem", padding: "0.15rem 0.35rem", height: "26px" }}
                />
                <input
                  type="text"
                  placeholder="Condition / Notes (opt)"
                  value={item.condition || ""}
                  onChange={(e) => handleItemChange(item.id, "condition", e.target.value)}
                  className="form-input"
                  style={{ fontSize: "0.74rem", padding: "0.15rem 0.35rem", height: "26px" }}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveItem(item.id)}
                  style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
                  title="Remove Laser"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
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
            padding: "0.65rem 0.75rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.4rem",
          }}
        >
          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "0.1rem" }}>
            Record specific deductible lasers assigned to individual members:
          </div>

          {/* Grid Table Header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 1.2fr 1.5fr 28px",
              gap: "0.5rem",
              padding: "0.2rem 0.3rem",
              fontSize: "0.72rem",
              fontWeight: "700",
              color: "var(--text-muted)",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <span>Member / ID</span>
            <span>Laser Deductible</span>
            <span>Condition / Notes</span>
            <span></span>
          </div>

          {/* Compact Grid Rows */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
            {items.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.2fr 1.2fr 1.5fr 28px",
                  gap: "0.5rem",
                  alignItems: "center",
                  padding: "0.15rem 0.3rem",
                }}
              >
                <input
                  type="text"
                  placeholder="Individual Identifier / ID"
                  value={item.individual}
                  onChange={(e) => handleItemChange(item.id, "individual", e.target.value)}
                  className="form-input"
                  style={{ fontSize: "0.78rem", padding: "0.2rem 0.45rem", height: "28px" }}
                />
                <input
                  type="text"
                  placeholder="Laser Deductible (e.g. $150,000)"
                  value={item.deductible}
                  onChange={(e) => handleItemChange(item.id, "deductible", e.target.value)}
                  className="form-input"
                  style={{ fontSize: "0.78rem", padding: "0.2rem 0.45rem", height: "28px" }}
                />
                <input
                  type="text"
                  placeholder="Condition / Notes (optional)"
                  value={item.condition || ""}
                  onChange={(e) => handleItemChange(item.id, "condition", e.target.value)}
                  className="form-input"
                  style={{ fontSize: "0.78rem", padding: "0.2rem 0.45rem", height: "28px" }}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveItem(item.id)}
                  style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
                  title="Remove Laser"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAddItem}
            className="btn btn-secondary btn-sm"
            style={{
              alignSelf: "flex-start",
              fontSize: "0.75rem",
              padding: "0.2rem 0.55rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.3rem",
              marginTop: "0.2rem",
            }}
          >
            <Plus size={13} style={{ color: "var(--accent-pink)" }} />
            <span>Add Individual</span>
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Compact read-only Grid View for Lasered Individuals in View Mode
 */
export function LaseredIndividualsView({ value }: { value: string }) {
  const { isYes, items } = parseLaserString(value);

  if (!isYes || items.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        padding: "0.45rem 0.65rem",
        background: "var(--bg-input, rgba(0, 0, 0, 0.03))",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "0.25rem",
        marginTop: "0.15rem",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr 1.4fr",
          gap: "0.4rem",
          fontSize: "0.68rem",
          fontWeight: "700",
          color: "var(--text-muted)",
          borderBottom: "1px solid var(--border)",
          paddingBottom: "0.2rem",
        }}
      >
        <span>Member / ID</span>
        <span>Laser Deductible</span>
        <span>Condition / Notes</span>
      </div>

      {items.map((item, idx) => (
        <div
          key={item.id || idx}
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr 1.4fr",
            gap: "0.4rem",
            alignItems: "center",
            fontSize: "0.76rem",
            padding: "0.12rem 0",
            color: "var(--text-primary)",
          }}
        >
          <span style={{ fontWeight: "600", color: "var(--text-primary)" }}>{item.individual}</span>
          <span style={{ fontWeight: "700", color: "var(--accent-pink)" }}>{item.deductible}</span>
          <span style={{ color: "var(--text-secondary)", fontSize: "0.74rem" }}>{item.condition || "—"}</span>
        </div>
      ))}
    </div>
  );
}

export { parseLaserString };
export default LaseredIndividualsInput;
