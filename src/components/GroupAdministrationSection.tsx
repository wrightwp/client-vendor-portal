"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Layers,
  Plus,
  Trash2,
  Edit2,
  Edit3,
  Check,
  X,
  ArrowUp,
  ArrowDown,
  GripVertical,
  RotateCcw,
  Sparkles,
  Network,
  ShieldAlert,
  AlertTriangle,
} from "lucide-react";
import { BEMasterField, BEMasterSection } from "./BEMasterSectionCard";
import CurrencyInput, { formatCurrencyDisplay } from "./CurrencyInput";
import {
  CustomFieldColorPicker,
  CustomFieldColorDropdown,
  IndentToggleButton,
  IndentRowButton,
  normalizeFieldColor,
} from "./CustomFieldColorPicker";

export interface GroupAdministrationSectionProps {
  adminMasterType?: string | null;
  adminSections?: string | null;
  isEditing: boolean;
  onChangeMasterType?: (type: string) => void;
  onChangeSections?: (sectionsJson: string) => void;
  onEdit?: () => void;
  legacyData?: any;
  compact?: boolean;
}

const FALLBACK_DEFAULT_TEMPLATES: Record<string, { name: string; sections: BEMasterSection[] }> = {
  COMPOSITE: {
    name: "Composite",
    sections: [
      {
        id: "sec_composite_admin_net",
        title: "Administration & Network Information",
        fields: [
          { id: "fld_comp_admin", label: "Composite Administration Fee", defaultValue: "$0.00" },
          { id: "fld_med_fee", label: "Medical Fee", defaultValue: "$0.00" },
          { id: "fld_ur_fee", label: "UR Fee", defaultValue: "$0.00" },
          { id: "fld_amwell_fee", label: "Amwell Fee", defaultValue: "$0.00" },
          { id: "fld_phys_fee", label: "Physicians Care / HAP Fee", defaultValue: "$0.00" },
          { id: "fld_wrap_net", label: "Wrap Network", defaultValue: "None" },
          { id: "fld_aetna_fee", label: "Aetna Signature Admin Fee", defaultValue: "$0.00" },
          { id: "fld_net_access", label: "Network Access Fee", defaultValue: "$0.00" },
          { id: "fld_reinsurance", label: "Reinsurance Fee", defaultValue: "$0.00" },
          { id: "fld_lcm_spa", label: "LCM / SPA Fee", defaultValue: "$0.00" },
          { id: "fld_agent_fee", label: "Agent Fee", defaultValue: "$0.00" },
          { id: "fld_ppo_fee", label: "PPO Fee", defaultValue: "$0.00" },
        ],
      },
    ],
  },
  NON_COMPOSITE: {
    name: "Non-Composite",
    sections: [
      {
        id: "sec_non_comp_admin",
        title: "Administration",
        fields: [
          { id: "fld_nc_admin_fee", label: "Administration Fee", defaultValue: "$0.00" },
          { id: "fld_nc_med_fee", label: "Medical Fee", defaultValue: "$0.00" },
          { id: "fld_nc_ur_fee", label: "UR Fee", defaultValue: "$0.00" },
          { id: "fld_nc_amwell_fee", label: "Amwell Fee", defaultValue: "$0.00" },
          { id: "fld_nc_phys_fee", label: "Physicians Care / HAP Fee", defaultValue: "$0.00" },
        ],
      },
      {
        id: "sec_non_comp_net",
        title: "Network Information",
        fields: [
          { id: "fld_nc_wrap_net", label: "Wrap Network", defaultValue: "None" },
          { id: "fld_nc_aetna_fee", label: "Aetna Signature Admin Fee", defaultValue: "$0.00" },
          { id: "fld_nc_net_access", label: "Network Access Fee", defaultValue: "$0.00" },
          { id: "fld_nc_reinsurance", label: "Reinsurance Fee", defaultValue: "$0.00" },
          { id: "fld_nc_lcm_spa", label: "LCM / SPA Fee", defaultValue: "$0.00" },
          { id: "fld_nc_agent_fee", label: "Agent Fee", defaultValue: "$0.00" },
          { id: "fld_nc_ppo_fee", label: "PPO Fee", defaultValue: "$0.00" },
        ],
      },
    ],
  },
  NON_MED: {
    name: "Non-Med",
    sections: [
      {
        id: "sec_non_med",
        title: "Non-Med",
        fields: [
          { id: "fld_nm_dental_fee", label: "Dental Admin Fee", defaultValue: "$0.00" },
          { id: "fld_nm_vision_fee", label: "Vision Admin Fee", defaultValue: "$0.00" },
          { id: "fld_nm_hearing_fee", label: "Hearing Admin Fee", defaultValue: "$0.00" },
          { id: "fld_nm_std_fee", label: "Short Term Disability (STD) Fee", defaultValue: "$0.00" },
          { id: "fld_nm_life_fee", label: "Life / AD&D Fee", defaultValue: "$0.00" },
        ],
      },
    ],
  },
};

/**
 * Parses or initializes group administration sections
 */
export function parseGroupAdminSections(
  rawJson?: string | null,
  masterType: string = "COMPOSITE",
  legacyData?: any
): BEMasterSection[] {
  if (rawJson && rawJson.trim() && rawJson !== "[]") {
    try {
      const parsed = JSON.parse(rawJson);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (e) {
      console.error("Error parsing group adminSections:", e);
    }
  }

  // Fallback to master template defaults
  const typeKey = (masterType || "COMPOSITE").toUpperCase();
  const defaultTemplate = FALLBACK_DEFAULT_TEMPLATES[typeKey] || FALLBACK_DEFAULT_TEMPLATES.COMPOSITE;
  const sectionsCopy: BEMasterSection[] = JSON.parse(JSON.stringify(defaultTemplate.sections));

  // If legacy fields exist and we are in COMPOSITE mode, hydrate initial field values from legacy data
  if (legacyData && typeKey === "COMPOSITE" && sectionsCopy.length > 0) {
    const sec = sectionsCopy[0];
    sec.fields = sec.fields.map((f) => {
      if (f.id === "fld_comp_admin" && legacyData.compositeAdminFee) return { ...f, defaultValue: legacyData.compositeAdminFee };
      if (f.id === "fld_med_fee" && legacyData.medicalFee) return { ...f, defaultValue: legacyData.medicalFee };
      if (f.id === "fld_ur_fee" && legacyData.urFee) return { ...f, defaultValue: legacyData.urFee };
      if (f.id === "fld_amwell_fee" && legacyData.amwellFee) return { ...f, defaultValue: legacyData.amwellFee };
      if (f.id === "fld_phys_fee" && legacyData.physiciansCareHapFee) return { ...f, defaultValue: legacyData.physiciansCareHapFee };
      if (f.id === "fld_wrap_net" && legacyData.wrapNetwork) return { ...f, defaultValue: legacyData.wrapNetwork };
      if (f.id === "fld_aetna_fee" && legacyData.aetnaSignatureAdminFee) return { ...f, defaultValue: legacyData.aetnaSignatureAdminFee };
      if (f.id === "fld_net_access" && legacyData.networkAccessFee) return { ...f, defaultValue: legacyData.networkAccessFee };
      if (f.id === "fld_reinsurance" && legacyData.reinsuranceFee) return { ...f, defaultValue: legacyData.reinsuranceFee };
      if (f.id === "fld_lcm_spa" && legacyData.lcmSpaFee) return { ...f, defaultValue: legacyData.lcmSpaFee };
      if (f.id === "fld_agent_fee" && legacyData.agentFee) return { ...f, defaultValue: legacyData.agentFee };
      if (f.id === "fld_ppo_fee" && legacyData.ppoFee) return { ...f, defaultValue: legacyData.ppoFee };
      return f;
    });
  }

  return sectionsCopy;
}

export function GroupAdministrationSection({
  adminMasterType = "COMPOSITE",
  adminSections,
  isEditing,
  onChangeMasterType,
  onChangeSections,
  onEdit,
  legacyData,
  compact = false,
}: GroupAdministrationSectionProps) {
  const currentType = (adminMasterType || "COMPOSITE").toUpperCase();
  const [sections, setSections] = useState<BEMasterSection[]>(() =>
    parseGroupAdminSections(adminSections, currentType, legacyData)
  );

  const [activeAddingSectionId, setActiveAddingSectionId] = useState<string | null>(null);
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [newFieldColor, setNewFieldColor] = useState("#000000");
  const [newFieldIndented, setNewFieldIndented] = useState(false);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [editingFieldLabel, setEditingFieldLabel] = useState("");

  // Drag-and-drop state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [draggedSectionId, setDraggedSectionId] = useState<string | null>(null);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [masterTemplatesCache, setMasterTemplatesCache] = useState<Record<string, BEMasterSection[]>>({});
  const [pendingSwapType, setPendingSwapType] = useState<string | null>(null);

  // Helper to check if current group setup differs from the active master template
  const checkHasDifferencesFromMaster = (
    currentSections: BEMasterSection[],
    masterSections?: BEMasterSection[]
  ): boolean => {
    if (!masterSections || masterSections.length === 0) {
      return currentSections.some((s) => s.fields.some((f) => f.defaultValue && f.defaultValue.trim() !== ""));
    }

    if (currentSections.length !== masterSections.length) return true;

    for (let sIdx = 0; sIdx < currentSections.length; sIdx++) {
      const curSec = currentSections[sIdx];
      const mSec = masterSections[sIdx];

      if (!mSec) return true;
      if (curSec.title !== mSec.title) return true;
      if (curSec.fields.length !== mSec.fields.length) return true;

      for (let fIdx = 0; fIdx < curSec.fields.length; fIdx++) {
        const curF = curSec.fields[fIdx];
        const mF = mSec.fields[fIdx];
        if (!mF) return true;
        if (curF.id !== mF.id) return true;
        if (curF.label !== mF.label) return true;
        if ((curF.defaultValue || "").trim() !== (mF.defaultValue || "").trim()) return true;
      }
    }

    return false;
  };

  // Sync internal state when external props change, or fetch latest DB master template if empty
  useEffect(() => {
    let isCancelled = false;

    fetch("/api/admin/be-masters/templates")
      .then((res) => res.json())
      .then((data) => {
        if (!isCancelled && data.success && Array.isArray(data.templates)) {
          const cache: Record<string, BEMasterSection[]> = {};
          data.templates.forEach((t: any) => {
            cache[t.type] = t.sections;
          });
          setMasterTemplatesCache(cache);

          if (!adminSections || !adminSections.trim() || adminSections === "[]") {
            const found = data.templates.find((t: any) => t.type === currentType);
            if (found && Array.isArray(found.sections) && found.sections.length > 0) {
              setSections(found.sections);
              if (onChangeSections) {
                onChangeSections(JSON.stringify(found.sections));
              }
              return;
            }
          }
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!isCancelled && adminSections && adminSections.trim() && adminSections !== "[]") {
          setSections(parseGroupAdminSections(adminSections, currentType, legacyData));
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [adminSections, currentType]);

  const emitSectionsChange = (newSections: BEMasterSection[]) => {
    setSections(newSections);
    if (onChangeSections) {
      onChangeSections(JSON.stringify(newSections));
    }
  };

  const handleRequestSwap = (targetType: string) => {
    if (targetType === currentType) return;
    const masterForCurrent = masterTemplatesCache[currentType] || FALLBACK_DEFAULT_TEMPLATES[currentType]?.sections;
    const hasDifferences = checkHasDifferencesFromMaster(sections, masterForCurrent);

    if (hasDifferences) {
      setPendingSwapType(targetType);
    } else {
      executeSwapMasterType(targetType);
    }
  };

  const executeSwapMasterType = async (newType: string) => {
    setPendingSwapType(null);
    const targetType = newType.toUpperCase();
    if (onChangeMasterType) {
      onChangeMasterType(targetType);
    }

    const cached = masterTemplatesCache[targetType];
    if (cached && Array.isArray(cached) && cached.length > 0) {
      emitSectionsChange(JSON.parse(JSON.stringify(cached)));
      return;
    }

    // Attempt to fetch fresh master defaults from database for newType
    try {
      const res = await fetch("/api/admin/be-masters/templates");
      const data = await res.json();
      if (data.success && Array.isArray(data.templates)) {
        const found = data.templates.find((t: any) => t.type === targetType);
        if (found && Array.isArray(found.sections) && found.sections.length > 0) {
          emitSectionsChange(found.sections);
          return;
        }
      }
    } catch (e) {
      console.warn("Could not fetch database templates, using fallback:", e);
    }

    // Fallback template defaults
    const fallback = FALLBACK_DEFAULT_TEMPLATES[targetType] || FALLBACK_DEFAULT_TEMPLATES.COMPOSITE;
    emitSectionsChange(JSON.parse(JSON.stringify(fallback.sections)));
  };

  const handleAddField = (sectionId: string) => {
    if (!newFieldLabel.trim()) return;
    const newField: BEMasterField = {
      id: `fld_grp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      label: newFieldLabel.trim(),
      defaultValue: "$0.00",
      color: newFieldColor || "#000000",
      indented: newFieldIndented,
    };

    const newSections = sections.map((sec) =>
      sec.id === sectionId ? { ...sec, fields: [...sec.fields, newField] } : sec
    );

    emitSectionsChange(newSections);
    setNewFieldLabel("");
    setNewFieldColor("#000000");
    setNewFieldIndented(false);
    setActiveAddingSectionId(null);
  };

  const handleFieldColorChange = (sectionId: string, fieldId: string, color: string) => {
    const newSections = sections.map((sec) =>
      sec.id === sectionId
        ? {
            ...sec,
            fields: sec.fields.map((f) =>
              f.id === fieldId ? { ...f, color } : f
            ),
          }
        : sec
    );
    emitSectionsChange(newSections);
  };

  const handleFieldIndentToggle = (sectionId: string, fieldId: string) => {
    const newSections = sections.map((sec) =>
      sec.id === sectionId
        ? {
            ...sec,
            fields: sec.fields.map((f) =>
              f.id === fieldId ? { ...f, indented: !f.indented } : f
            ),
          }
        : sec
    );
    emitSectionsChange(newSections);
  };

  const handleRemoveField = (sectionId: string, fieldId: string) => {
    const newSections = sections.map((sec) =>
      sec.id === sectionId
        ? { ...sec, fields: sec.fields.filter((f) => f.id !== fieldId) }
        : sec
    );
    emitSectionsChange(newSections);
  };

  const handleFieldValueChange = (sectionId: string, fieldId: string, value: string) => {
    const newSections = sections.map((sec) =>
      sec.id === sectionId
        ? {
            ...sec,
            fields: sec.fields.map((f) =>
              f.id === fieldId ? { ...f, defaultValue: value } : f
            ),
          }
        : sec
    );
    emitSectionsChange(newSections);
  };

  const handleMoveField = (sectionId: string, index: number, direction: "up" | "down") => {
    const sec = sections.find((s) => s.id === sectionId);
    if (!sec) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sec.fields.length) return;

    const newFields = [...sec.fields];
    const temp = newFields[index];
    newFields[index] = newFields[targetIndex];
    newFields[targetIndex] = temp;

    const newSections = sections.map((s) => (s.id === sectionId ? { ...s, fields: newFields } : s));
    emitSectionsChange(newSections);
  };

  const handleReorder = (sectionId: string, fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) return;
    const sec = sections.find((s) => s.id === sectionId);
    if (!sec) return;

    const newFields = [...sec.fields];
    const [movedItem] = newFields.splice(fromIndex, 1);
    newFields.splice(toIndex, 0, movedItem);

    const newSections = sections.map((s) => (s.id === sectionId ? { ...s, fields: newFields } : s));
    emitSectionsChange(newSections);
  };

  const masterTypesList: { id: string; label: string; sub: string }[] = [
    { id: "COMPOSITE", label: "Composite", sub: "1 Section" },
    { id: "NON_COMPOSITE", label: "Non-Composite", sub: "2 Sections" },
    { id: "NON_MED", label: "Non-Med", sub: "1 Section" },
  ];

  const getSectionTitle = (type: string) => {
    switch (type.toUpperCase()) {
      case "NON_COMPOSITE":
        return "Non-Composite Administration & Network Information";
      case "NON_MED":
        return "Non-Med";
      case "COMPOSITE":
      default:
        return "Composite Administration & Network Information";
    }
  };

  // --------------------------------------------------------------------------
  // VIEW MODE
  // --------------------------------------------------------------------------
  if (!isEditing) {
    const activeLabel = masterTypesList.find((m) => m.id === currentType)?.label || "Composite";

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%" }}>
        {/* Section Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Network size={18} style={{ color: "var(--accent-yellow, #ffc20e)" }} />
            <h3 style={{ fontSize: "1rem", fontWeight: "700", margin: 0 }}>
              {getSectionTitle(currentType)}
            </h3>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span
              style={{
                fontSize: "0.725rem",
                fontWeight: 700,
                padding: "0.2rem 0.6rem",
                borderRadius: "12px",
                background: "rgba(249, 115, 22, 0.12)",
                color: "#ea580c",
                border: "1px solid rgba(249, 115, 22, 0.25)",
              }}
            >
              {activeLabel} Setup
            </span>
            {onEdit && (
              <button
                type="button"
                onClick={onEdit}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: "0.72rem", padding: "0.2rem 0.5rem", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
                title="Edit section"
              >
                <Edit3 size={12} />
                <span>Edit</span>
              </button>
            )}
          </div>
        </div>

        {/* Section Cards */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {sections.map((sec) => (
            <div
              key={sec.id}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.6rem",
                padding: "0.85rem 1rem",
                borderRadius: "8px",
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid var(--border)",
              }}
            >
              {sections.length > 1 && (
                <div
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: "var(--text-secondary)",
                    textTransform: "uppercase",
                    letterSpacing: "0.03em",
                    borderBottom: "1px solid var(--border)",
                    paddingBottom: "0.35rem",
                  }}
                >
                  {sec.title}
                </div>
              )}

              {sec.fields.length === 0 ? (
                <div style={{ color: "var(--text-muted)", fontSize: "0.8rem", fontStyle: "italic", padding: "0.5rem 0" }}>
                  No fields configured.
                </div>
              ) : (
                sec.fields.map((field) => {
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
                        paddingBottom: "0.35rem",
                        paddingLeft: field.indented ? "1.5rem" : "0",
                        fontSize: "0.85rem",
                      }}
                    >
                      <span
                        style={{
                          color: isStandardBlack ? "var(--text-muted)" : fontColor,
                          fontWeight: isStandardBlack ? 500 : 700,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.35rem",
                        }}
                      >
                        {field.indented && (
                          <span style={{ color: fontColor, opacity: 0.75, fontWeight: "bold", fontSize: "0.9em" }}>↳</span>
                        )}
                        <span>{field.label}</span>
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
                })
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // EDIT MODE (Inline or Full Modal)
  // --------------------------------------------------------------------------
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%" }}>
      {/* Master Type Swapper */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.03em" }}>
            Plan Structure
          </label>
        </div>

        {/* 3-Way Segmented Control */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "4px",
            padding: "3px",
            background: "var(--bg-card-hover, #f1f5f9)",
            borderRadius: "8px",
            border: "1px solid var(--border, #cbd5e1)",
          }}
        >
          {masterTypesList.map((m) => {
            const isSelected = currentType === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => handleRequestSwap(m.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.35rem",
                  padding: "0.45rem 0.5rem",
                  fontSize: "0.8rem",
                  fontWeight: isSelected ? 700 : 600,
                  borderRadius: "6px",
                  border: isSelected ? "1px solid #ea580c" : "1px solid transparent",
                  background: isSelected
                    ? "linear-gradient(135deg, #f97316 0%, #ea580c 100%)"
                    : "transparent",
                  color: isSelected ? "#ffffff" : "var(--text-secondary, #475569)",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  boxShadow: isSelected ? "0 2px 6px rgba(249, 115, 22, 0.3)" : "none",
                  whiteSpace: "nowrap",
                }}
              >
                <span>{m.label}</span>
                <span style={{ fontSize: "0.7rem", opacity: isSelected ? 0.9 : 0.7 }}>
                  ({m.sub})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Sections and Fields */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
        }}
      >
        {sections.map((sec) => (
          <div
            key={sec.id}
            className="glass-card"
            style={{
              padding: "1rem 1.15rem",
              borderRadius: "8px",
              borderTop: "3px solid #f97316",
              borderLeft: "1px solid var(--border)",
              borderRight: "1px solid var(--border)",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            {/* Section Header with Add Field button */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid var(--border)",
                paddingBottom: "0.5rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Layers size={16} style={{ color: "#ea580c" }} />
                <strong style={{ fontSize: "0.9rem", color: "var(--text-primary)" }}>
                  {sec.title}
                </strong>
                <span
                  style={{
                    fontSize: "0.7rem",
                    padding: "0.1rem 0.4rem",
                    borderRadius: "10px",
                    background: "var(--bg-card-hover)",
                    color: "var(--text-muted)",
                    fontWeight: 600,
                  }}
                >
                  {sec.fields.length}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setActiveAddingSectionId(sec.id)}
                className="btn btn-secondary btn-sm"
                style={{
                  padding: "0.25rem 0.55rem",
                  fontSize: "0.72rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  color: "#ea580c",
                }}
              >
                <Plus size={12} />
                <span>Add Field</span>
              </button>
            </div>

            {/* Add Field Prompt */}
            {activeAddingSectionId === sec.id && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 0.65rem",
                  borderRadius: "6px",
                  background: "#fff7ed",
                  border: "1px dashed #f97316",
                }}
              >
                <input
                  type="text"
                  className="form-input"
                  style={{
                    flex: "1 1 180px",
                    fontSize: "0.8rem",
                    padding: "0.3rem 0.5rem",
                    color: newFieldColor.toLowerCase() === "#000000" ? "inherit" : newFieldColor,
                    fontWeight: newFieldColor.toLowerCase() === "#000000" ? "normal" : "600",
                  }}
                  placeholder="Field label (e.g. Vision Admin Fee)..."
                  value={newFieldLabel}
                  onChange={(e) => setNewFieldLabel(e.target.value)}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddField(sec.id);
                    if (e.key === "Escape") {
                      setActiveAddingSectionId(null);
                      setNewFieldLabel("");
                      setNewFieldColor("#000000");
                      setNewFieldIndented(false);
                    }
                  }}
                />

                <IndentToggleButton
                  indented={newFieldIndented}
                  onToggle={() => setNewFieldIndented(!newFieldIndented)}
                  size="sm"
                />

                <CustomFieldColorPicker
                  selectedColor={newFieldColor}
                  onChange={(c) => setNewFieldColor(c)}
                  size="sm"
                />

                <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <button
                    type="button"
                    onClick={() => handleAddField(sec.id)}
                    disabled={!newFieldLabel.trim()}
                    className="btn btn-primary btn-sm"
                    style={{ background: "#ea580c", borderColor: "#ea580c", padding: "0.3rem 0.6rem" }}
                  >
                    <Check size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveAddingSectionId(null);
                      setNewFieldLabel("");
                      setNewFieldColor("#000000");
                      setNewFieldIndented(false);
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: "0.3rem 0.5rem" }}
                  >
                    <X size={13} />
                  </button>
                </div>
              </div>
            )}

            {/* Field Rows */}
            {sec.fields.length === 0 ? (
              <div style={{ padding: "1rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.8rem" }}>
                No fields in this section. Click "+ Add Field" above.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {sec.fields.map((field, idx) => {
                  const isDragging = draggedIndex === idx && draggedSectionId === sec.id;
                  const isOver = dragOverIndex === idx && draggedSectionId === sec.id && draggedIndex !== idx;
                  const fieldColor = normalizeFieldColor(field.color);
                  const isStandardBlack = fieldColor.toLowerCase() === "#000000";

                  return (
                    <div
                      key={field.id}
                      draggable={editingFieldId !== field.id}
                      onDragStart={(e) => {
                        setDraggedIndex(idx);
                        setDraggedSectionId(sec.id);
                        e.dataTransfer.effectAllowed = "move";
                        e.dataTransfer.setData("text/plain", `${idx}`);
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = "move";
                        if (dragOverIndex !== idx || draggedSectionId !== sec.id) {
                          setDragOverIndex(idx);
                          setDraggedSectionId(sec.id);
                        }
                      }}
                      onDragLeave={() => {
                        if (dragOverIndex === idx && draggedSectionId === sec.id) {
                          setDragOverIndex(null);
                        }
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (draggedIndex !== null && draggedSectionId === sec.id) {
                          handleReorder(sec.id, draggedIndex, idx);
                        }
                        setDraggedIndex(null);
                        setDragOverIndex(null);
                        setDraggedSectionId(null);
                      }}
                      onDragEnd={() => {
                        setDraggedIndex(null);
                        setDragOverIndex(null);
                        setDraggedSectionId(null);
                      }}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "24px minmax(130px, 190px) 1fr auto auto auto",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.45rem 0.65rem",
                        borderRadius: "6px",
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
                        transition: "all 0.15s ease",
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
                          color: "var(--text-muted, #94a3b8)",
                        }}
                      >
                        <GripVertical size={14} />
                      </div>

                      {/* Field Label (editable inline) */}
                      <div style={{ paddingLeft: field.indented ? "0.75rem" : "0", display: "flex", alignItems: "center", gap: "0.25rem", minWidth: 0 }}>
                        {field.indented && (
                          <span style={{ color: fieldColor, fontSize: "0.8rem", opacity: 0.8, flexShrink: 0, fontWeight: "bold" }}>
                            ↳
                          </span>
                        )}

                        {editingFieldId === field.id ? (
                          <div style={{ display: "flex", alignItems: "center", gap: "0.2rem", width: "100%" }}>
                            <input
                              type="text"
                              className="form-input"
                              style={{
                                fontSize: "0.75rem",
                                padding: "0.2rem 0.35rem",
                                width: "100%",
                                color: isStandardBlack ? "inherit" : fieldColor,
                                fontWeight: isStandardBlack ? "normal" : "600",
                              }}
                              value={editingFieldLabel}
                              onChange={(e) => setEditingFieldLabel(e.target.value)}
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  if (editingFieldLabel.trim()) {
                                    const newSections = sections.map((s) =>
                                      s.id === sec.id
                                        ? {
                                            ...s,
                                            fields: s.fields.map((f) =>
                                              f.id === field.id ? { ...f, label: editingFieldLabel.trim() } : f
                                            ),
                                          }
                                        : s
                                    );
                                    emitSectionsChange(newSections);
                                  }
                                  setEditingFieldId(null);
                                }
                                if (e.key === "Escape") setEditingFieldId(null);
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (editingFieldLabel.trim()) {
                                  const newSections = sections.map((s) =>
                                    s.id === sec.id
                                      ? {
                                          ...s,
                                          fields: s.fields.map((f) =>
                                            f.id === field.id ? { ...f, label: editingFieldLabel.trim() } : f
                                          ),
                                        }
                                      : s
                                  );
                                  emitSectionsChange(newSections);
                                }
                                setEditingFieldId(null);
                              }}
                              style={{ background: "none", border: "none", color: "#10b981", cursor: "pointer", padding: "1px" }}
                            >
                              <Check size={13} />
                            </button>
                          </div>
                        ) : (
                          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", minWidth: 0 }}>
                            <span
                              style={{
                                fontSize: "0.78rem",
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
                              onClick={() => {
                                setEditingFieldId(field.id);
                                setEditingFieldLabel(field.label);
                              }}
                              title="Edit label"
                              style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "2px" }}
                            >
                              <Edit2 size={11} />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Textbox / Currency Input */}
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
                          onChange={(e) => handleFieldValueChange(sec.id, field.id, e.target.value)}
                        />
                      </div>

                      {/* Indent Button */}
                      <div>
                        <IndentRowButton
                          indented={field.indented}
                          onToggle={() => handleFieldIndentToggle(sec.id, field.id)}
                        />
                      </div>

                      {/* Color Dropdown Swatch */}
                      <div>
                        <CustomFieldColorDropdown
                          color={fieldColor}
                          onChange={(color) => handleFieldColorChange(sec.id, field.id, color)}
                        />
                      </div>

                      {/* Actions (Move & Delete) */}
                      <div style={{ display: "flex", alignItems: "center", gap: "0.15rem" }}>
                        <button
                          type="button"
                          onClick={() => handleMoveField(sec.id, idx, "up")}
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
                          onClick={() => handleMoveField(sec.id, idx, "down")}
                          disabled={idx === sec.fields.length - 1}
                          title="Move down"
                          style={{
                            background: "none",
                            border: "none",
                            color: idx === sec.fields.length - 1 ? "var(--border)" : "var(--text-muted)",
                            cursor: idx === sec.fields.length - 1 ? "default" : "pointer",
                            padding: "2px",
                          }}
                        >
                          <ArrowDown size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveField(sec.id, field.id)}
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
          </div>
        ))}
      </div>

      {/* Plan Template Change Confirmation Modal - Portaled to document.body to avoid parent transforms */}
      {pendingSwapType && mounted && typeof document !== "undefined" && createPortal(
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            background: "rgba(15, 23, 42, 0.45)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
          }}
          onClick={() => setPendingSwapType(null)}
        >
          <div
            className="modal-content"
            style={{
              maxWidth: "500px",
              background: "var(--bg-card, #ffffff)",
              border: "1px solid rgba(249, 115, 22, 0.4)",
              borderRadius: "12px",
              boxShadow: "0 20px 45px rgba(0, 0, 0, 0.2)",
              padding: "1.5rem",
              position: "relative",
              zIndex: 100000,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="modal-header"
              style={{
                borderBottom: "1px solid rgba(249, 115, 22, 0.2)",
                paddingBottom: "0.75rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    background: "rgba(249, 115, 22, 0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ea580c",
                    flexShrink: 0,
                  }}
                >
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h3 className="modal-title" style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700 }}>
                    Change Plan Template?
                  </h3>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
                    Switching template structure will reset customized fields
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPendingSwapType(null)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  padding: "4px",
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body" style={{ padding: "1.25rem 0", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--text-primary)", lineHeight: "1.5" }}>
                Customized fields or entered values in this <strong>{masterTypesList.find((m) => m.id === currentType)?.label || currentType}</strong> setup differ from the master template.
              </p>
              <div
                style={{
                  padding: "0.75rem 1rem",
                  borderRadius: "8px",
                  background: "rgba(239, 68, 68, 0.08)",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                  color: "#b91c1c",
                  fontSize: "0.825rem",
                  lineHeight: "1.4",
                }}
              >
                <strong>Warning:</strong> If you switch to <strong>{masterTypesList.find((m) => m.id === pendingSwapType)?.label || pendingSwapType}</strong>, your current changes will be lost and replaced with the default master template.
              </div>
            </div>

            <div
              className="modal-footer"
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "0.75rem",
                borderTop: "1px solid var(--border)",
                paddingTop: "0.85rem",
              }}
            >
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setPendingSwapType(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                style={{
                  background: "#ea580c",
                  borderColor: "#ea580c",
                  color: "#ffffff",
                  fontWeight: 600,
                }}
                onClick={() => executeSwapMasterType(pendingSwapType)}
              >
                Change to {masterTypesList.find((m) => m.id === pendingSwapType)?.label || pendingSwapType}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export default GroupAdministrationSection;
