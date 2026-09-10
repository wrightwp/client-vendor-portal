"use client";

import React, { useState } from "react";
import { AlertTriangle, Trash2, X, Loader2 } from "lucide-react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => any;
  title?: string;
  itemType?: "vendor" | "client" | "contact" | "association" | string;
  itemName?: string;
  parentName?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  itemType = "association",
  itemName,
  parentName,
  description,
  confirmText = "Remove Association",
  cancelText = "Cancel",
}: ConfirmDeleteModalProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
      onClose();
    }
  };

  const defaultTitle =
    title ||
    (itemType === "vendor"
      ? "Remove Vendor Association"
      : itemType === "client"
      ? "Remove Client Association"
      : itemType === "contact"
      ? "Delete Contact"
      : "Remove Association");

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
        zIndex: 99999,
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
          maxWidth: "460px",
          padding: "1.75rem",
          background: "var(--bg-elevated)",
          border: "1px solid rgba(239, 68, 68, 0.35)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "0 20px 50px rgba(239, 68, 68, 0.15), 0 10px 30px rgba(0, 0, 0, 0.5)",
          animation: "fadeIn 0.2s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.1) 100%)",
                border: "1px solid rgba(239, 68, 68, 0.4)",
                color: "#ef4444",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 15px rgba(239, 68, 68, 0.2)",
              }}
            >
              <AlertTriangle size={22} />
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "#ef4444", textTransform: "uppercase", fontWeight: "800", letterSpacing: "0.05em" }}>
                Confirm Removal
              </div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: "800", color: "var(--text-primary)", marginTop: "0.1rem" }}>
                {defaultTitle}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              padding: "0.2rem",
              borderRadius: "4px",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ marginBottom: "1.5rem" }}>
          {description ? (
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.5" }}>
              {description}
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.925rem", lineHeight: "1.55" }}>
                Are you sure you want to remove{" "}
                <strong style={{ color: "var(--text-primary)", fontWeight: "700" }}>
                  {itemName || "this item"}
                </strong>
                {parentName ? (
                  <>
                    {" "}from{" "}
                    <strong style={{ color: "var(--text-primary)", fontWeight: "700" }}>
                      {parentName}
                    </strong>
                  </>
                ) : null}
                ?
              </p>

              <div
                style={{
                  fontSize: "0.8rem",
                  color: "var(--text-muted)",
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  padding: "0.65rem 0.85rem",
                  lineHeight: "1.45",
                }}
              >
                ℹ️ This will un-link the association and remove any client-specific notes for this pairing. You can re-associate them at any time.
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="btn btn-secondary"
            style={{ padding: "0.55rem 1.1rem" }}
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            style={{
              padding: "0.55rem 1.25rem",
              borderRadius: "var(--radius-md)",
              background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
              color: "#ffffff",
              border: "1px solid rgba(239, 68, 68, 0.6)",
              fontWeight: "700",
              fontSize: "0.875rem",
              cursor: loading ? "not-allowed" : "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              boxShadow: "0 4px 14px rgba(239, 68, 68, 0.35)",
              transition: "all 0.15s ease",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Removing...</span>
              </>
            ) : (
              <>
                <Trash2 size={16} />
                <span>{confirmText}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
