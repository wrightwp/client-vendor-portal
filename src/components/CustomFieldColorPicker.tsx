"use client";

import React, { useState, useRef, useEffect } from "react";
import { Check, Palette } from "lucide-react";

export const CUSTOM_FIELD_COLORS = [
  { id: "black", label: "Black", color: "#000000", border: "#475569" },
  { id: "pink", label: "Pink", color: "#b81c66", border: "#b81c66" },
  { id: "blue", label: "Blue", color: "#00aedb", border: "#00aedb" },
  { id: "green", label: "Green", color: "#10b981", border: "#10b981" },
] as const;

export function normalizeFieldColor(color?: string | null): string {
  if (!color) return "#000000";
  const match = CUSTOM_FIELD_COLORS.find(
    (c) => c.color.toLowerCase() === color.toLowerCase() || c.id.toLowerCase() === color.toLowerCase()
  );
  return match ? match.color : color;
}

interface CustomFieldColorPickerProps {
  selectedColor: string;
  onChange: (color: string) => void;
  size?: "sm" | "md";
}

/**
 * Horizontal button group of the 4 standard font colors (Black, Pink, Blue, Green)
 */
export function CustomFieldColorPicker({
  selectedColor = "#000000",
  onChange,
  size = "sm",
}: CustomFieldColorPickerProps) {
  const normalized = normalizeFieldColor(selectedColor);

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
      <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 600, marginRight: "0.15rem" }}>
        Color:
      </span>
      {CUSTOM_FIELD_COLORS.map((c) => {
        const isSelected = normalized.toLowerCase() === c.color.toLowerCase();
        const diameter = size === "sm" ? 18 : 22;

        return (
          <button
            key={c.id}
            type="button"
            title={`${c.label} (${c.color})`}
            onClick={() => onChange(c.color)}
            style={{
              width: `${diameter}px`,
              height: `${diameter}px`,
              borderRadius: "50%",
              backgroundColor: c.color,
              border: isSelected ? "2px solid #ffffff" : "1px solid rgba(0, 0, 0, 0.2)",
              outline: isSelected ? `2px solid ${c.color}` : "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
              boxShadow: isSelected ? `0 0 6px ${c.color}66` : "0 1px 3px rgba(0, 0, 0, 0.15)",
              transform: isSelected ? "scale(1.12)" : "scale(1)",
              transition: "all 0.15s ease",
            }}
          >
            {isSelected && (
              <Check
                size={size === "sm" ? 11 : 13}
                style={{ color: "#ffffff", strokeWidth: 3 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

interface CustomFieldColorDropdownProps {
  color?: string;
  onChange: (color: string) => void;
}

/**
 * Compact inline palette popover to switch color on any existing field row
 */
export function CustomFieldColorDropdown({
  color = "#000000",
  onChange,
}: CustomFieldColorDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const normalized = normalizeFieldColor(color);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const activeColorObj = CUSTOM_FIELD_COLORS.find(
    (c) => c.color.toLowerCase() === normalized.toLowerCase()
  ) || CUSTOM_FIELD_COLORS[0];

  return (
    <div ref={dropdownRef} style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        title={`Change font color (Current: ${activeColorObj.label})`}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.25rem",
          background: "none",
          border: "1px solid var(--border, #cbd5e1)",
          borderRadius: "4px",
          padding: "2px 4px",
          cursor: "pointer",
          backgroundColor: "var(--bg-card, #ffffff)",
          transition: "all 0.15s ease",
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            backgroundColor: activeColorObj.color,
            border: "1px solid rgba(0, 0, 0, 0.15)",
          }}
        />
        <Palette size={11} style={{ color: "var(--text-muted)" }} />
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            marginTop: "4px",
            zIndex: 100,
            background: "var(--bg-card, #ffffff)",
            border: "1px solid var(--border, #cbd5e1)",
            borderRadius: "6px",
            padding: "0.35rem 0.45rem",
            boxShadow: "0 4px 14px rgba(0, 0, 0, 0.12)",
            display: "flex",
            gap: "0.3rem",
            alignItems: "center",
            whiteSpace: "nowrap",
          }}
        >
          {CUSTOM_FIELD_COLORS.map((c) => {
            const isSelected = normalized.toLowerCase() === c.color.toLowerCase();
            return (
              <button
                key={c.id}
                type="button"
                title={c.label}
                onClick={() => {
                  onChange(c.color);
                  setIsOpen(false);
                }}
                style={{
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  backgroundColor: c.color,
                  border: isSelected ? "2px solid #ffffff" : "1px solid rgba(0, 0, 0, 0.2)",
                  outline: isSelected ? `2px solid ${c.color}` : "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                  boxShadow: isSelected ? `0 0 4px ${c.color}66` : "none",
                  transform: isSelected ? "scale(1.15)" : "scale(1)",
                  transition: "all 0.1s ease",
                }}
              >
                {isSelected && <Check size={10} style={{ color: "#ffffff", strokeWidth: 3 }} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
