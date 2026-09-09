"use client";

import { useRouter } from "next/navigation";
import { AlertTriangle, ExternalLink, Plus, X } from "lucide-react";

interface DuplicateAlertModalProps {
  type: "client" | "vendor";
  matches: any[];
  onClose: () => void;
  onConfirmCreate: () => void;
}

export default function DuplicateAlertModal({
  type,
  matches,
  onClose,
  onConfirmCreate,
}: DuplicateAlertModalProps) {
  const router = useRouter();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: "600px", border: "1px solid var(--accent-yellow)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header" style={{ borderBottom: "1px solid rgba(255, 194, 14, 0.3)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <AlertTriangle size={24} style={{ color: "var(--accent-yellow)" }} />
            <h2 className="modal-title" style={{ color: "var(--accent-yellow)" }}>
              Potential Duplicate {type === "client" ? "Healthcare Group" : "Vendor"} Found
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "1.25rem" }}>
            We detected existing record(s) matching the Tax ID, NPI, or Name you entered. Would you like to view the existing record or create a new entry anyway?
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
            {matches.map((item) => (
              <div
                key={item.id}
                className="glass-card"
                style={{ padding: "1rem", display: "flex", alignItems: "center", justifyContent: "space-between", border: "1px solid rgba(255, 194, 14, 0.3)" }}
              >
                <div>
                  <div style={{ fontWeight: "800", fontSize: "0.95rem" }}>{item.name}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    Tax ID: <span className="text-mono">{item.taxId}</span>
                    {item.npiNumber && ` • NPI: ${item.npiNumber}`}
                    {(item.specialty || item.vendorType) && ` • ${item.specialty || item.vendorType}`}
                    {item.city && ` • ${item.city}, ${item.state}`}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    router.push(`/${type === "client" ? "clients" : "vendors"}/${item.id}`);
                  }}
                  className="btn btn-yellow btn-sm"
                >
                  <span>View Existing</span>
                  <ExternalLink size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Cancel & Edit
          </button>
          <button
            type="button"
            onClick={onConfirmCreate}
            className="btn btn-primary"
          >
            <Plus size={16} />
            <span>Create New Record Anyway</span>
          </button>
        </div>
      </div>
    </div>
  );
}
