"use client";

import React, { useState } from "react";
import { X, FileText, Save, Store, Building2 } from "lucide-react";

import { MarkdownNoteEditor } from "./MarkdownNotes";

interface EditAssociationNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  vendorId: string;
  vendorName?: string;
  clientName?: string;
  currentNotes: string;
  currentFee?: string;
  onSaveSuccess: () => void;
}

export default function EditAssociationNoteModal({
  isOpen,
  onClose,
  clientId,
  vendorId,
  vendorName,
  clientName,
  currentNotes,
  currentFee = "",
  onSaveSuccess,
}: EditAssociationNoteModalProps) {
  const [notes, setNotes] = useState(currentNotes || "");
  const [fee, setFee] = useState(currentFee || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/associations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          vendorId,
          notes: notes.trim(),
          fee: fee.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        onSaveSuccess();
        onClose();
      } else {
        setError(data.error || "Failed to update vendor details.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(6px)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          width: "100%",
          maxWidth: "540px",
          padding: "1.75rem",
          background: "var(--bg-elevated)",
          border: "1px solid var(--accent-blue)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-lg)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "var(--accent-blue-light)",
                color: "var(--accent-blue)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FileText size={20} />
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "700" }}>
                Group-Specific Vendor Notes
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: "var(--text-primary)" }}>
                {vendorName && clientName ? `${vendorName} — ${clientName}` : vendorName || clientName || "Association Notes"}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div
            style={{
              padding: "0.65rem 1rem",
              borderRadius: "var(--radius-md)",
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "#ef4444",
              fontSize: "0.85rem",
              marginBottom: "1rem",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="form-group">
            <label className="form-label">
              Associated Fee for this Group (e.g. $2.50 PEPM, $500/mo, Included)
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. $2.50 PEPM, $500/mo, or Admin Included"
              value={fee}
              onChange={(e) => setFee(e.target.value)}
            />
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
              The billing/fee arrangement for this vendor with this specific group.
            </span>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Notes for {vendorName}</span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Supports Markdown Formatting</span>
            </label>
            <MarkdownNoteEditor
              value={notes}
              onChange={setNotes}
              placeholder="Enter group-specific vendor notes... (Use toolbar for bold, italic, highlights, lists, or code tags)"
              minRows={5}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn btn-blue"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
            >
              <Save size={16} />
              <span>{saving ? "Saving..." : "Save Vendor Notes"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
