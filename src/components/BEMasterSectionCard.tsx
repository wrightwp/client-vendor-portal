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
  Layers,
  GripVertical,
} from "lucide-react";
import {
  CustomFieldColorPicker,
  CustomFieldColorDropdown,
  IndentToggleButton,
  IndentRowButton,
  normalizeFieldColor,
} from "./CustomFieldColorPicker";

export interface BEMasterField {
  id: string;
  label: string;
  defaultValue?: string;
  placeholder?: string;
  color?: string;
  indented?: boolean;
}

export interface BEMasterSection {
  id: string;
  title: string;
  fields: BEMasterField[];
}

interface BEMasterSectionCardProps {
  section: BEMasterSection;
  onUpdateSection: (updatedSection: BEMasterSection) => void;
  accentColor?: string;
}

export function BEMasterSectionCard({
  section,
  onUpdateSection,
  accentColor = "#ea580c",
}: BEMasterSectionCardProps) {
  const [isAddingField, setIsAddingField] = useState(false);
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [newFieldColor, setNewFieldColor] = useState("#000000");
  const [newFieldIndented, setNewFieldIndented] = useState(false);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [editingFieldLabel, setEditingFieldLabel] = useState("");

  // Drag-and-drop states
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleAddField = () => {
    if (!newFieldLabel.trim()) return;
    const newField: BEMasterField = {
      id: `fld_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      label: newFieldLabel.trim(),
      defaultValue: "",
      color: newFieldColor || "#000000",
      indented: newFieldIndented,
    };

    onUpdateSection({
      ...section,
      fields: [...section.fields, newField],
    });

    setNewFieldLabel("");
    setNewFieldColor("#000000");
    setNewFieldIndented(false);
    setIsAddingField(false);
  };

  const handleRemoveField = (id: string) => {
    onUpdateSection({
      ...section,
      fields: section.fields.filter((f) => f.id !== id),
    });
  };

  const handleFieldChange = (id: string, updatedProps: Partial<BEMasterField>) => {
    onUpdateSection({
      ...section,
      fields: section.fields.map((f) => (f.id === id ? { ...f, ...updatedProps } : f)),
    });
  };

  const handleMoveField = (index: number, direction: "up" | "down") => {
    const newFields = [...section.fields];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newFields.length) return;

    const temp = newFields[index];
    newFields[index] = newFields[targetIndex];
    newFields[targetIndex] = temp;

    onUpdateSection({
      ...section,
      fields: newFields,
    });
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) return;
    const newFields = [...section.fields];
    const [movedItem] = newFields.splice(fromIndex, 1);
    newFields.splice(toIndex, 0, movedItem);

    onUpdateSection({
      ...section,
      fields: newFields,
    });
  };

  const startEditLabel = (field: BEMasterField) => {
    setEditingFieldId(field.id);
    setEditingFieldLabel(field.label);
  };

  const saveEditLabel = (id: string) => {
    if (editingFieldLabel.trim()) {
      handleFieldChange(id, { label: editingFieldLabel.trim() });
    }
    setEditingFieldId(null);
  };

  return (
    <div
      className="glass-card"
      style={{
        padding: "1.25rem 1.5rem",
        borderTop: `3px solid ${accentColor}`,
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.04)",
      }}
    >
      {/* Section Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid var(--border)",
          paddingBottom: "0.75rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <Layers size={18} style={{ color: accentColor }} />
          <h3
            style={{
              fontSize: "1.05rem",
              fontWeight: 700,
              margin: 0,
              color: "var(--text-primary)",
            }}
          >
            {section.title}
          </h3>
          <span
            style={{
              fontSize: "0.72rem",
              padding: "0.15rem 0.5rem",
              borderRadius: "12px",
              background: "var(--bg-card-hover)",
              color: "var(--text-muted)",
              fontWeight: 600,
            }}
          >
            {section.fields.length} {section.fields.length === 1 ? "Field" : "Fields"}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsAddingField(true)}
          className="btn btn-secondary"
          style={{
            padding: "0.35rem 0.75rem",
            fontSize: "0.78rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
            color: accentColor,
            borderColor: "var(--border)",
          }}
        >
          <Plus size={14} />
          <span>Add Field</span>
        </button>
      </div>

      {/* Add Field Inline Bar */}
      {isAddingField && (
        <div
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            background: "var(--bg-card-hover, #f8fafc)",
            border: `1px dashed ${accentColor}`,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "0.6rem",
          }}
        >
          <input
            type="text"
            className="form-input"
            style={{
              flex: "1 1 200px",
              fontSize: "0.85rem",
              padding: "0.45rem 0.75rem",
              color: newFieldColor.toLowerCase() === "#000000" ? "inherit" : newFieldColor,
              fontWeight: newFieldColor.toLowerCase() === "#000000" ? "normal" : "600",
            }}
            placeholder="Enter field label (e.g. Dental Fee, PPO Network, Reinsurance)..."
            value={newFieldLabel}
            onChange={(e) => setNewFieldLabel(e.target.value)}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddField();
              if (e.key === "Escape") {
                setIsAddingField(false);
                setNewFieldLabel("");
                setNewFieldColor("#000000");
                setNewFieldIndented(false);
              }
            }}
          />

          {/* Indent Toggle */}
          <IndentToggleButton
            indented={newFieldIndented}
            onToggle={() => setNewFieldIndented(!newFieldIndented)}
            size="sm"
          />

          {/* Color Picker */}
          <CustomFieldColorPicker
            selectedColor={newFieldColor}
            onChange={(c) => setNewFieldColor(c)}
            size="sm"
          />

          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <button
              type="button"
              onClick={handleAddField}
              disabled={!newFieldLabel.trim()}
              className="btn btn-primary"
              style={{
                padding: "0.45rem 0.85rem",
                fontSize: "0.8rem",
                background: accentColor,
                borderColor: accentColor,
              }}
            >
              <Check size={14} />
              <span>Add</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAddingField(false);
                setNewFieldLabel("");
                setNewFieldColor("#000000");
                setNewFieldIndented(false);
              }}
              className="btn btn-secondary"
              style={{ padding: "0.45rem 0.65rem", fontSize: "0.8rem" }}
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Fields List */}
      {section.fields.length === 0 ? (
        <div
          style={{
            padding: "2rem",
            textAlign: "center",
            color: "var(--text-muted)",
            fontSize: "0.85rem",
            background: "var(--bg-card-hover)",
            borderRadius: "8px",
            border: "1px dashed var(--border)",
          }}
        >
          No fields added yet. Click <strong>"Add Field"</strong> above to configure default fields for this section.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {section.fields.map((field, idx) => {
            const isDragging = draggedIndex === idx;
            const isOver = dragOverIndex === idx && draggedIndex !== idx;
            const fieldColor = normalizeFieldColor(field.color);
            const isStandardBlack = fieldColor.toLowerCase() === "#000000";

            return (
              <div
                key={field.id}
                draggable={editingFieldId !== field.id}
                onDragStart={(e) => {
                  setDraggedIndex(idx);
                  e.dataTransfer.effectAllowed = "move";
                  e.dataTransfer.setData("text/plain", `${idx}`);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                  if (dragOverIndex !== idx) {
                    setDragOverIndex(idx);
                  }
                }}
                onDragLeave={() => {
                  if (dragOverIndex === idx) {
                    setDragOverIndex(null);
                  }
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  if (draggedIndex !== null) {
                    handleReorder(draggedIndex, idx);
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
                  gridTemplateColumns: "32px 240px 1fr auto auto auto",
                  alignItems: "center",
                  gap: "0.65rem",
                  padding: "0.6rem 0.85rem",
                  borderRadius: "8px",
                  background: isOver
                    ? "#fff7ed"
                    : isDragging
                    ? "rgba(249, 115, 22, 0.08)"
                    : "var(--bg-card-hover, #f8fafc)",
                  border: isOver
                    ? "2px solid #f97316"
                    : isDragging
                    ? "1px dashed #f97316"
                    : "1px solid var(--border, #e2e8f0)",
                  opacity: isDragging ? 0.45 : 1,
                  transform: isOver ? "translateY(-1px)" : "none",
                  boxShadow: isOver ? "0 4px 12px rgba(249, 115, 22, 0.15)" : "none",
                  transition: "all 0.15s ease",
                  cursor: "default",
                }}
              >
                {/* Drag Handle */}
                <div
                  title="Drag to reorder field"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "grab",
                    color: "var(--text-muted, #94a3b8)",
                    padding: "4px 0",
                    userSelect: "none",
                  }}
                  onMouseDown={(e) => {
                    const target = e.currentTarget;
                    target.style.cursor = "grabbing";
                  }}
                  onMouseUp={(e) => {
                    const target = e.currentTarget;
                    target.style.cursor = "grab";
                  }}
                >
                  <GripVertical size={16} />
                </div>

                {/* Field Label (editable) */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    paddingLeft: field.indented ? "1rem" : "0",
                  }}
                >
                  {field.indented && (
                    <span style={{ color: fieldColor, fontSize: "0.8rem", opacity: 0.8, flexShrink: 0, fontWeight: "bold" }}>
                      ↳
                    </span>
                  )}

                  {editingFieldId === field.id ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", width: "100%" }}>
                      <input
                        type="text"
                        className="form-input"
                        style={{
                          fontSize: "0.825rem",
                          padding: "0.25rem 0.5rem",
                          width: "100%",
                          color: isStandardBlack ? "inherit" : fieldColor,
                          fontWeight: isStandardBlack ? "normal" : "600",
                        }}
                        value={editingFieldLabel}
                        onChange={(e) => setEditingFieldLabel(e.target.value)}
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEditLabel(field.id);
                          if (e.key === "Escape") setEditingFieldId(null);
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => saveEditLabel(field.id)}
                        style={{ background: "none", border: "none", color: "#10b981", cursor: "pointer" }}
                      >
                        <Check size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingFieldId(null)}
                        style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
                      >
                        <X size={15} />
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", width: "100%" }}>
                      <span
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: isStandardBlack ? 600 : 700,
                          color: isStandardBlack ? "var(--text-primary)" : fieldColor,
                          wordBreak: "break-word",
                        }}
                      >
                        {field.label}
                      </span>
                      <button
                        type="button"
                        onClick={() => startEditLabel(field)}
                        title="Edit label"
                        style={{
                          background: "none",
                          border: "none",
                          color: "var(--text-muted)",
                          cursor: "pointer",
                          padding: "2px",
                          display: "inline-flex",
                          alignItems: "center",
                        }}
                      >
                        <Edit2 size={12} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Text Box for Default Value */}
                <div>
                  <input
                    type="text"
                    className="form-input"
                    style={{
                      width: "100%",
                      fontSize: "0.85rem",
                      padding: "0.4rem 0.65rem",
                      color: isStandardBlack ? "inherit" : fieldColor,
                      fontWeight: isStandardBlack ? "normal" : "600",
                    }}
                    value={field.defaultValue || ""}
                    onChange={(e) => handleFieldChange(field.id, { defaultValue: e.target.value })}
                  />
                </div>

                {/* Indent Button */}
                <div>
                  <IndentRowButton
                    indented={field.indented}
                    onToggle={() => handleFieldChange(field.id, { indented: !field.indented })}
                  />
                </div>

                {/* Color Dropdown Swatch */}
                <div>
                  <CustomFieldColorDropdown
                    color={fieldColor}
                    onChange={(color) => handleFieldChange(field.id, { color })}
                  />
                </div>

                {/* Reorder & Remove Actions */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
                  <button
                    type="button"
                    onClick={() => handleMoveField(idx, "up")}
                    disabled={idx === 0}
                    title="Move field up"
                    style={{
                      background: "none",
                      border: "none",
                      color: idx === 0 ? "var(--border)" : "var(--text-muted)",
                      cursor: idx === 0 ? "default" : "pointer",
                      padding: "3px",
                    }}
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveField(idx, "down")}
                    disabled={idx === section.fields.length - 1}
                    title="Move field down"
                    style={{
                      background: "none",
                      border: "none",
                      color: idx === section.fields.length - 1 ? "var(--border)" : "var(--text-muted)",
                      cursor: idx === section.fields.length - 1 ? "default" : "pointer",
                      padding: "3px",
                    }}
                  >
                    <ArrowDown size={14} />
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
                      padding: "3px",
                      marginLeft: "0.25rem",
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default BEMasterSectionCard;
