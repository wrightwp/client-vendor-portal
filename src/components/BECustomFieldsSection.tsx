"use client";

import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  ArrowUp,
  ArrowDown,
  GripVertical,
} from "lucide-react";
import {
  CustomFieldColorPicker,
  CustomFieldColorDropdown,
  normalizeFieldColor,
} from "./CustomFieldColorPicker";

export interface BECustomField {
  id: string;
  label: string;
  defaultValue: string;
  color?: string;
}

interface BECustomFieldsSectionProps {
  fields: BECustomField[];
  isEditing: boolean;
  onChange?: (updatedFields: BECustomField[]) => void;
  accentColor?: string;
  addLabel?: string;
}

export function parseBECustomFields(rawJson?: string | null): BECustomField[] {
  if (!rawJson || !rawJson.trim() || rawJson === "[]") return [];
  try {
    const parsed = JSON.parse(rawJson);
    if (Array.isArray(parsed)) {
      return parsed.map((item) => ({
        id: item.id || `fld_${Math.random().toString(36).substring(2, 9)}`,
        label: item.label || "Custom Field",
        defaultValue: item.defaultValue !== undefined ? item.defaultValue : item.value || "",
        color: item.color || "#000000",
      }));
    }
  } catch (e) {
    console.error("Error parsing BECustomFields:", e);
  }
  return [];
}

export default function BECustomFieldsSection({
  fields = [],
  isEditing,
  onChange,
  accentColor = "#00aedb",
  addLabel = "Add Field",
}: BECustomFieldsSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newColor, setNewColor] = useState("#000000");
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState("");

  // Drag-and-drop state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleAddField = () => {
    if (!newLabel.trim() || !onChange) return;
    const newField: BECustomField = {
      id: `fld_cst_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      label: newLabel.trim(),
      defaultValue: "",
      color: newColor || "#000000",
    };
    onChange([...fields, newField]);
    setNewLabel("");
    setNewColor("#000000");
    setIsAdding(false);
  };

  const handleRemoveField = (fieldId: string) => {
    if (!onChange) return;
    onChange(fields.filter((f) => f.id !== fieldId));
  };

  const handleFieldValueChange = (fieldId: string, value: string) => {
    if (!onChange) return;
    onChange(fields.map((f) => (f.id === fieldId ? { ...f, defaultValue: value } : f)));
  };

  const handleFieldColorChange = (fieldId: string, color: string) => {
    if (!onChange) return;
    onChange(fields.map((f) => (f.id === fieldId ? { ...f, color } : f)));
  };

  const handleStartEditLabel = (field: BECustomField) => {
    setEditingFieldId(field.id);
    setEditingLabel(field.label);
  };

  const handleSaveEditLabel = (fieldId: string) => {
    if (!onChange) return;
    if (editingLabel.trim()) {
      onChange(fields.map((f) => (f.id === fieldId ? { ...f, label: editingLabel.trim() } : f)));
    }
    setEditingFieldId(null);
  };

  const handleMoveField = (fromIndex: number, direction: "up" | "down") => {
    if (!onChange) return;
    const toIndex = direction === "up" ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= fields.length) return;
    const updated = [...fields];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    onChange(updated);
  };

  const handleDropReorder = (fromIndex: number, toIndex: number) => {
    if (!onChange || fromIndex === toIndex || fromIndex < 0 || toIndex < 0) return;
    const updated = [...fields];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    onChange(updated);
  };

  // --------------------------------------------------------------------------
  // VIEW MODE
  // --------------------------------------------------------------------------
  if (!isEditing) {
    if (!fields || fields.length === 0) return null;

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", width: "100%" }}>
        {fields.map((field) => {
          const fontColor = field.color || "#000000";
          const isStandardBlack = !field.color || field.color.toLowerCase() === "#000000";

          return (
            <div
              key={field.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px dashed var(--border)",
                paddingBottom: "0.4rem",
                fontSize: "0.85rem",
              }}
            >
              <span
                style={{
                  color: isStandardBlack ? "var(--text-muted)" : fontColor,
                  fontWeight: isStandardBlack ? 500 : 700,
                }}
              >
                {field.label}
              </span>
              <strong
                style={{
                  color: isStandardBlack ? "var(--text-primary)" : fontColor,
                  fontWeight: 600,
                }}
              >
                {field.defaultValue && field.defaultValue.trim() !== "" ? field.defaultValue : "—"}
              </strong>
            </div>
          );
        })}
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // EDIT MODE
  // --------------------------------------------------------------------------
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%" }}>
      {/* Field List */}
      {fields.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
          {fields.map((field, idx) => {
            const isDragging = draggedIndex === idx;
            const isOver = dragOverIndex === idx && draggedIndex !== idx;
            const fieldColor = normalizeFieldColor(field.color);
            const isStandardBlack = fieldColor.toLowerCase() === "#000000";

            return (
              <div
                key={field.id}
                draggable
                onDragStart={() => setDraggedIndex(idx)}
                onDragOver={(e) => {
                  e.preventDefault();
                  if (dragOverIndex !== idx) setDragOverIndex(idx);
                }}
                onDragLeave={() => {
                  if (dragOverIndex === idx) setDragOverIndex(null);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  if (draggedIndex !== null) {
                    handleDropReorder(draggedIndex, idx);
                  }
                  setDraggedIndex(null);
                  setDragOverIndex(null);
                }}
                onDragEnd={() => {
                  setDraggedIndex(null);
                  setDragOverIndex(null);
                }}
                style={{
                  display: "grid",
                  gridTemplateColumns: "22px minmax(130px, 190px) 1fr auto auto",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.45rem 0.6rem",
                  borderRadius: "6px",
                  background: isOver
                    ? "rgba(249, 115, 22, 0.08)"
                    : isDragging
                    ? "rgba(249, 115, 22, 0.05)"
                    : "var(--bg-card-hover, rgba(255, 255, 255, 0.03))",
                  border: isOver
                    ? "1px solid #f97316"
                    : isDragging
                    ? "1px dashed #f97316"
                    : "1px solid var(--border)",
                  opacity: isDragging ? 0.45 : 1,
                  transition: "all 0.12s ease",
                }}
              >
                {/* Drag Handle */}
                <div
                  title="Drag to reorder"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "grab",
                    color: "var(--text-muted)",
                  }}
                >
                  <GripVertical size={14} />
                </div>

                {/* Field Label (Editable) */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", minWidth: 0 }}>
                  {editingFieldId === field.id ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.2rem", width: "100%" }}>
                      <input
                        type="text"
                        className="form-input"
                        style={{
                          fontSize: "0.8rem",
                          padding: "0.2rem 0.4rem",
                          width: "100%",
                          color: isStandardBlack ? "inherit" : fieldColor,
                          fontWeight: isStandardBlack ? "normal" : "600",
                        }}
                        value={editingLabel}
                        onChange={(e) => setEditingLabel(e.target.value)}
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveEditLabel(field.id);
                          if (e.key === "Escape") setEditingFieldId(null);
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveEditLabel(field.id)}
                        style={{ background: "none", border: "none", color: "#10b981", cursor: "pointer", padding: "1px" }}
                      >
                        <Check size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingFieldId(null)}
                        style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "1px" }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", minWidth: 0 }}>
                      <span
                        style={{
                          fontSize: "0.825rem",
                          fontWeight: isStandardBlack ? 600 : 700,
                          color: isStandardBlack ? "var(--text-primary)" : fieldColor,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        title={field.label}
                      >
                        {field.label}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleStartEditLabel(field)}
                        title="Edit label"
                        style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "1px" }}
                      >
                        <Edit2 size={11} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Field Value Textbox */}
                <div>
                  <input
                    type="text"
                    className="form-input"
                    style={{
                      width: "100%",
                      fontSize: "0.8rem",
                      padding: "0.3rem 0.5rem",
                      color: isStandardBlack ? "inherit" : fieldColor,
                      fontWeight: isStandardBlack ? "normal" : "600",
                    }}
                    value={field.defaultValue || ""}
                    onChange={(e) => handleFieldValueChange(field.id, e.target.value)}
                  />
                </div>

                {/* Font Color Dropdown Swatch */}
                <div>
                  <CustomFieldColorDropdown
                    color={fieldColor}
                    onChange={(color) => handleFieldColorChange(field.id, color)}
                  />
                </div>

                {/* Actions (Up, Down, Delete) */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.15rem" }}>
                  <button
                    type="button"
                    onClick={() => handleMoveField(idx, "up")}
                    disabled={idx === 0}
                    title="Move up"
                    style={{
                      background: "none",
                      border: "none",
                      color: idx === 0 ? "var(--border)" : "var(--text-muted)",
                      cursor: idx === 0 ? "default" : "pointer",
                      padding: "2px",
                    }}
                  >
                    <ArrowUp size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveField(idx, "down")}
                    disabled={idx === fields.length - 1}
                    title="Move down"
                    style={{
                      background: "none",
                      border: "none",
                      color: idx === fields.length - 1 ? "var(--border)" : "var(--text-muted)",
                      cursor: idx === fields.length - 1 ? "default" : "pointer",
                      padding: "2px",
                    }}
                  >
                    <ArrowDown size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveField(field.id)}
                    title="Remove field"
                    style={{
                      background: "none",
                      border: "none",
                      color: "#ef4444",
                      cursor: "pointer",
                      padding: "2px",
                      marginLeft: "0.15rem",
                    }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Custom Field Section */}
      {isAdding ? (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.5rem 0.65rem",
            borderRadius: "6px",
            background: "rgba(148, 163, 184, 0.08)",
            border: "1px dashed var(--border-light, #cbd5e1)",
            marginTop: "0.25rem",
          }}
        >
          <input
            type="text"
            className="form-input"
            placeholder="Field name / label..."
            style={{
              flex: "1 1 140px",
              fontSize: "0.8rem",
              padding: "0.32rem 0.55rem",
              color: newColor.toLowerCase() === "#000000" ? "inherit" : newColor,
              fontWeight: newColor.toLowerCase() === "#000000" ? "normal" : "600",
            }}
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter" && newLabel.trim()) handleAddField();
              if (e.key === "Escape") {
                setIsAdding(false);
                setNewLabel("");
                setNewColor("#000000");
              }
            }}
          />

          {/* Font Color Picker (Black, Pink, Blue, Green) */}
          <CustomFieldColorPicker
            selectedColor={newColor}
            onChange={(color) => setNewColor(color)}
            size="sm"
          />

          <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <button
              type="button"
              onClick={handleAddField}
              disabled={!newLabel.trim()}
              className="btn btn-sm"
              style={{
                padding: "0.32rem 0.65rem",
                fontSize: "0.75rem",
                background: newLabel.trim() ? accentColor : "#e2e8f0",
                color: newLabel.trim() ? "#ffffff" : "#94a3b8",
                border: `1px solid ${newLabel.trim() ? accentColor : "#cbd5e1"}`,
                cursor: newLabel.trim() ? "pointer" : "not-allowed",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
                fontWeight: 600,
                boxShadow: newLabel.trim() ? "0 2px 6px rgba(0, 0, 0, 0.12)" : "none",
              }}
            >
              <Check size={13} />
              <span>Add</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setNewLabel("");
                setNewColor("#000000");
              }}
              className="btn btn-secondary btn-sm"
              style={{ padding: "0.32rem 0.5rem", fontSize: "0.75rem", display: "inline-flex", alignItems: "center" }}
              title="Cancel"
            >
              <X size={13} />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="btn btn-secondary btn-sm"
          style={{
            alignSelf: "flex-start",
            fontSize: "0.75rem",
            padding: "0.25rem 0.65rem",
            marginTop: "0.25rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.3rem",
            borderStyle: "dashed",
          }}
        >
          <Plus size={13} />
          <span>{addLabel}</span>
        </button>
      )}
    </div>
  );
}
