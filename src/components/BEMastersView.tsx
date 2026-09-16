"use client";

import React, { useState, useEffect } from "react";
import {
  FileSpreadsheet,
  Save,
  Check,
  RotateCcw,
  Sparkles,
  Layers,
  Info,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { BEMasterSectionCard, BEMasterSection } from "./BEMasterSectionCard";

export type MasterTemplateType = "COMPOSITE" | "NON_COMPOSITE" | "NON_MED";

interface MasterTemplateData {
  id?: string;
  type: MasterTemplateType;
  name: string;
  sections: BEMasterSection[];
}

export function BEMastersView() {
  const [activeType, setActiveType] = useState<MasterTemplateType>("COMPOSITE");
  const [templates, setTemplates] = useState<Record<MasterTemplateType, MasterTemplateData>>({
    COMPOSITE: {
      type: "COMPOSITE",
      name: "Composite",
      sections: [
        {
          id: "sec_composite_admin_net",
          title: "Administration & Network Information",
          fields: [],
        },
      ],
    },
    NON_COMPOSITE: {
      type: "NON_COMPOSITE",
      name: "Non-Composite",
      sections: [
        {
          id: "sec_non_comp_admin",
          title: "Administration",
          fields: [],
        },
        {
          id: "sec_non_comp_net",
          title: "Network Information",
          fields: [],
        },
      ],
    },
    NON_MED: {
      type: "NON_MED",
      name: "Non-Med",
      sections: [
        {
          id: "sec_non_med",
          title: "Non-Med",
          fields: [],
        },
      ],
    },
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch templates from database
  const fetchTemplates = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/be-masters/templates");
      const data = await res.json();
      if (data.success && Array.isArray(data.templates)) {
        const loaded: Partial<Record<MasterTemplateType, MasterTemplateData>> = {};
        data.templates.forEach((t: MasterTemplateData) => {
          loaded[t.type] = t;
        });
        setTemplates((prev) => ({
          ...prev,
          ...loaded,
        }));
      }
    } catch (err: any) {
      setError(err.message || "Failed to load master templates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const currentTemplate = templates[activeType];

  const handleUpdateSection = (updatedSection: BEMasterSection) => {
    setTemplates((prev) => {
      const current = prev[activeType];
      const newSections = current.sections.map((s) =>
        s.id === updatedSection.id ? updatedSection : s
      );
      return {
        ...prev,
        [activeType]: {
          ...current,
          sections: newSections,
        },
      };
    });
    setHasChanges(true);
    setSaveSuccess(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/be-masters/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: activeType,
          name: currentTemplate.name,
          sections: currentTemplate.sections,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        setHasChanges(false);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setError(data.error || "Failed to save master template");
      }
    } catch (err: any) {
      setError(err.message || "Error saving master template");
    } finally {
      setSaving(false);
    }
  };

  const masterOptions: {
    id: MasterTemplateType;
    label: string;
    sectionCount: string;
    description: string;
    sectionsSummary: string;
  }[] = [
    {
      id: "COMPOSITE",
      label: "Composite",
      sectionCount: "1 Section",
      description: "Unified master for single composite administration and network specifications.",
      sectionsSummary: "Administration & Network Information",
    },
    {
      id: "NON_COMPOSITE",
      label: "Non-Composite",
      sectionCount: "2 Sections",
      description: "Split structure separating administration from network access information.",
      sectionsSummary: "1. Administration • 2. Network Information",
    },
    {
      id: "NON_MED",
      label: "Non-Med",
      sectionCount: "1 Section",
      description: "Ancillary master for Dental, Vision, Hearing, STD, and Life/AD&D specifications.",
      sectionsSummary: "Non-Med",
    },
  ];

  if (loading) {
    return (
      <div className="glass-card" style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
        Loading B&E Master configurations...
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Top Banner & Description */}
      <div
        className="glass-card"
        style={{
          padding: "1rem 1.25rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, rgba(249, 115, 22, 0.15) 0%, rgba(234, 88, 12, 0.22) 100%)",
              color: "#ea580c",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FileSpreadsheet size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: "1.05rem", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
              B&E Master Templates
            </h2>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: "0.15rem 0 0 0" }}>
              Configure default sections and fields for Composite, Non-Composite, and Non-Med plans.
            </p>
          </div>
        </div>

        {/* Save Action */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {saveSuccess && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                color: "#059669",
                fontSize: "0.8rem",
                fontWeight: 700,
                background: "rgba(16, 185, 129, 0.12)",
                padding: "0.35rem 0.65rem",
                borderRadius: "6px",
              }}
            >
              <CheckCircle2 size={14} />
              <span>Master Saved</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="btn btn-primary"
            style={{
              padding: "0.5rem 1.1rem",
              fontSize: "0.85rem",
              fontWeight: 700,
              background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
              borderColor: "#ea580c",
              boxShadow: "0 2px 8px rgba(249, 115, 22, 0.3)",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
            }}
          >
            <Save size={15} />
            <span>{saving ? "Saving..." : `Save ${currentTemplate.name} Master`}</span>
          </button>
        </div>
      </div>

      {error && (
        <div
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#dc2626",
            fontSize: "0.85rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* 3-Way Segmented Master Selector */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "0.75rem",
        }}
      >
        {masterOptions.map((opt) => {
          const isSelected = activeType === opt.id;
          return (
            <div
              key={opt.id}
              onClick={() => {
                setActiveType(opt.id);
                setSaveSuccess(false);
              }}
              style={{
                cursor: "pointer",
                padding: "1rem 1.25rem",
                borderRadius: "10px",
                background: isSelected
                  ? "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)"
                  : "var(--bg-card, #ffffff)",
                border: isSelected ? "2px solid #f97316" : "1px solid var(--border, #e2e8f0)",
                boxShadow: isSelected
                  ? "0 4px 14px rgba(249, 115, 22, 0.15)"
                  : "0 2px 4px rgba(0, 0, 0, 0.02)",
                transition: "all 0.15s ease",
                position: "relative",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
                <div style={{ fontSize: "1rem", fontWeight: 800, color: isSelected ? "#9a3412" : "var(--text-primary)" }}>
                  {opt.label}
                </div>
                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    padding: "0.15rem 0.45rem",
                    borderRadius: "6px",
                    background: isSelected ? "#f97316" : "var(--bg-card-hover)",
                    color: isSelected ? "#ffffff" : "var(--text-muted)",
                  }}
                >
                  {opt.sectionCount}
                </span>
              </div>
              <div style={{ fontSize: "0.75rem", color: isSelected ? "#c2410c" : "var(--text-muted)", lineHeight: "1.4" }}>
                {opt.sectionsSummary}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sections Container */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {currentTemplate.sections.map((sec) => (
          <BEMasterSectionCard
            key={sec.id}
            section={sec}
            onUpdateSection={handleUpdateSection}
            accentColor="#ea580c"
          />
        ))}
      </div>
    </div>
  );
}

export default BEMastersView;
